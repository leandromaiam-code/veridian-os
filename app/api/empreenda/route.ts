import { NextResponse } from "next/server";
import { AREAS, ETAPAS, PERFIS, destino as calcularDestino, meta, perfil, perguntaDe, reais, rotuloDe, type Respostas } from "@/lib/empreenda";

/* -----------------------------------------------------------------------------
 * POST /api/empreenda — funil "Empreenda com IA".
 *
 * etapa "contato": cria (ou atualiza) o lead do Growth Project "Veridian AI
 * Studio" no Vortex (`vortex_leads`) com nome, WhatsApp, e-mail e as respostas
 * até ali. etapa "final": acha o mesmo lead (pelo visitante, e-mail ou WhatsApp)
 * e grava as respostas completas e o destino (whatsapp, agenda ou avaliar).
 * Destino "whatsapp" (investe acima de R$ 10 mil/mês) avisa o Leandro no
 * WhatsApp. Chaves só no servidor: LEADS_SUPABASE_URL, LEADS_SUPABASE_SERVICE_KEY
 * e, para o aviso, LEADS_EVOLUTION_* e LEADS_NOTIFY_NUMBER.
 * --------------------------------------------------------------------------- */

const COMPANY_ID = process.env.EMPREENDA_VORTEX_COMPANY_ID || "b4d016b3-3747-4259-8a5c-27522a865381";
const TENANT_ID = process.env.EMPREENDA_VORTEX_TENANT_ID || "e3155f9e-989c-4705-87f7-19a00d8fae10";

const limpa = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function telefone(v: string): string | null {
  const d = v.replace(/\D/g, "");
  if (d.length === 10 || d.length === 11) return `+55${d}`;
  if (d.length >= 12 && d.length <= 13) return `+${d}`;
  return null;
}

const EXTRAS = ["solucao_outro", "solucao_outro_on", "rede_outro", "rede_outro_on"];
function respostasValidas(bruto: unknown): Respostas {
  const out: Respostas = {};
  if (!bruto || typeof bruto !== "object") return out;
  const campos = new Set([...ETAPAS.flatMap((e) => ("campo" in e ? [e.campo] : [])), ...EXTRAS]);
  for (const [k, v] of Object.entries(bruto as Record<string, unknown>)) {
    if (!campos.has(k)) continue;
    if (typeof v === "string") out[k] = v.slice(0, 600);
    else if (Array.isArray(v)) out[k] = v.filter((x) => typeof x === "string").slice(0, 15).map((x) => (x as string).slice(0, 60));
  }
  return out;
}

// Prioridade para o atendimento (0–100), só no CRM.
function nota(r: Respostas): number {
  let n = 20;
  if (r.investimento === "10k+") n += 35; else if (r.investimento === "3-10k") n += 22;
  if (r.horas === "40+") n += 15; else if (r.horas === "20-40") n += 10; else if (r.horas === "10-20") n += 5;
  if (r.quando === "agora") n += 12; else if (r.quando === "30d") n += 8;
  if (r.ideia === "definida") n += 6;
  if (r.rede === "grande") n += 6;
  if (r.vendas_mes1 === "10+" || r.vendas_mes1 === "6-10") n += 6;
  if (r.vendas_3m === "16-30" || r.vendas_3m === "30+") n += 4;
  return Math.max(0, Math.min(100, n));
}

function resumo(r: Respostas): string {
  const linhas: string[] = [];
  for (const e of ETAPAS) {
    if (!("campo" in e) || e.tipo === "frase") continue;
    const v = r[e.campo];
    if (v === undefined || v === "" || (Array.isArray(v) && !v.length)) continue;
    const texto = Array.isArray(v) ? v.map((x) => rotuloDe(e.campo, x)).join(", ") : e.tipo === "texto" ? v : rotuloDe(e.campo, v);
    linhas.push(`${perguntaDe(e)} ${texto}`);
  }
  if (r.solucao_outro) linhas.push(`Outra solução: ${r.solucao_outro}`);
  if (r.rede_outro) linhas.push(`Outra área de contatos: ${r.rede_outro}`);
  const frases = ETAPAS.filter((e) => e.tipo === "frase" && r[(e as { campo: string }).campo] === "sim").map((e) => `“${(e as { frase: string }).frase}”`);
  if (frases.length) linhas.push(`Se identificou com: ${frases.join(" ")}`);
  return linhas.join("\n");
}

const DESTINO_TXT = { whatsapp: "WhatsApp com o Leandro (investe acima de R$ 10 mil/mês)", agenda: "Agenda de reunião", avaliar: "Avaliar o perfil e retornar" } as const;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 }); }
  if (limpa(body.website, 200)) return NextResponse.json({ ok: true }); // honeypot

  const url = process.env.LEADS_SUPABASE_URL;
  const key = process.env.LEADS_SUPABASE_SERVICE_KEY;
  if (!url || !key) return NextResponse.json({ ok: false, error: "storage_unavailable" }, { status: 503 });
  const h = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };

  const etapa = body.etapa === "final" ? "final" : "contato";
  const r = respostasValidas(body.respostas);
  const visitante = limpa(body.visitante, 60);
  const nome = limpa(body.nome, 120);
  const email = limpa(body.email, 160).toLowerCase();
  const phone = telefone(limpa(body.whatsapp, 40));
  if (etapa === "contato" && (!nome || !phone || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  // Acha o lead deste visitante (ou da mesma pessoa) no projeto.
  const conds = [visitante && `metadata->empreenda->>visitante.eq.${encodeURIComponent(visitante)}`, email && `email.eq.${encodeURIComponent(email)}`, phone && `phone.eq.${encodeURIComponent(phone)}`].filter(Boolean);
  let existente: { id: string; metadata: Record<string, unknown> | null; tags: string[] | null; name: string; phone: string | null; email: string | null } | null = null;
  if (conds.length) {
    const achou = await fetch(`${url}/rest/v1/vortex_leads?select=id,metadata,tags,name,phone,email&company_id=eq.${COMPANY_ID}&or=(${conds.join(",")})&order=created_at.desc&limit=1`, { headers: h })
      .then((x) => (x.ok ? x.json() : [])).catch(() => []);
    existente = Array.isArray(achou) && achou[0] ? achou[0] : null;
  }
  if (etapa === "final" && !existente) return NextResponse.json({ ok: false, error: "lead_not_found" }, { status: 404 });

  const dest = etapa === "final" ? calcularDestino(r) : null;
  const nomeLead = nome || existente?.name || "Lead Empreenda com IA";
  const teste = /\[teste\]/i.test(nomeLead) || /\.invalid$/.test(email || existente?.email || "");
  const area = AREAS.find((a) => a.v === r.area)?.t ?? null;
  const empreenda = {
    visitante: visitante || null,
    etapa,
    destino: dest,
    perfil: dest ? perfil(r) : null,
    meta_mensal: meta(r) || null,
    respostas: r,
    atualizado_em: new Date().toISOString(),
  };
  const tags = ["empreenda-com-ia", r.ideia === "nao" ? "sem-ideia" : r.ideia ? "com-ideia" : null, dest ? "destino-" + dest : null, dest ? "perfil-" + perfil(r) : null, teste ? "teste" : null].filter(Boolean) as string[];
  const notes = `Empreenda com IA · ${dest ? DESTINO_TXT[dest] + " · " + PERFIS[perfil(r)].nome : "parou depois do contato"}\nMeta: ${meta(r) ? reais(meta(r)) + " por mês em 12 meses" : "—"}\n\n${resumo(r)}`;

  let ok = false;
  if (existente) {
    const metadata = { ...(existente.metadata || {}), empreenda };
    const patch: Record<string, unknown> = { notes, metadata, tags: Array.from(new Set([...(existente.tags || []).filter((t) => !t.startsWith("destino-") && !t.startsWith("perfil-") && t !== "sem-ideia" && t !== "com-ideia"), ...tags])), score: nota(r), segment: area };
    if (nome) patch.name = nome;
    if (email) patch.email = email;
    if (phone) patch.phone = phone;
    const res = await fetch(`${url}/rest/v1/vortex_leads?id=eq.${existente.id}`, { method: "PATCH", headers: { ...h, Prefer: "return=minimal" }, body: JSON.stringify(patch) }).catch(() => null);
    ok = !!res && res.ok;
  } else {
    const utm = (body.utm && typeof body.utm === "object" ? body.utm : {}) as Record<string, unknown>;
    const res = await fetch(`${url}/rest/v1/vortex_leads`, {
      method: "POST", headers: { ...h, Prefer: "return=minimal" },
      body: JSON.stringify({
        company_id: COMPANY_ID, tenant_id: TENANT_ID, name: nomeLead, email, phone, segment: area,
        source: "website", bucket: "captacao", score: nota(r), tags, notes,
        metadata: {
          origem: "empreenda-com-ia",
          landing_page: "https://veridian.4profitai.com/pt/empreenda",
          utm_source: limpa(utm.utm_source, 120) || null,
          utm_medium: limpa(utm.utm_medium, 120) || null,
          utm_campaign: limpa(utm.utm_campaign, 120) || null,
          empreenda,
        },
      }),
    }).catch(() => null);
    ok = !!res && res.ok;
  }
  if (!ok) return NextResponse.json({ ok: false, error: "storage_failed" }, { status: 503 });

  // Investe acima de R$ 10 mil/mês: avisa o Leandro no WhatsApp.
  if (dest === "whatsapp" && !teste) {
    const evoUrl = process.env.LEADS_EVOLUTION_URL, evoKey = process.env.LEADS_EVOLUTION_APIKEY, inst = process.env.LEADS_EVOLUTION_INSTANCE, numero = process.env.LEADS_NOTIFY_NUMBER;
    if (evoUrl && evoKey && inst && numero) {
      const fone = phone || existente?.phone || "";
      const text = `Empreenda com IA: lead pré-selecionado (investe acima de R$ 10 mil/mês)\n\n${nomeLead}\nWhatsApp: ${fone}\nE-mail: ${email || existente?.email || ""}\n\n${notes.split("\n\n")[1] || ""}`.slice(0, 3500);
      await fetch(`${evoUrl.replace(/\/$/, "")}/message/sendText/${inst}`, {
        method: "POST", headers: { apikey: evoKey, "Content-Type": "application/json" },
        body: JSON.stringify({ number: numero, text }), signal: AbortSignal.timeout(8000),
      }).catch(() => null);
    }
  }
  return NextResponse.json({ ok: true, destino: dest });
}
