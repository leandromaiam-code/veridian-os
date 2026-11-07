import { NextResponse } from "next/server";
import { ETAPAS, montarPerfil, rotuloDe, type Respostas } from "@/lib/empreenda";

/* -----------------------------------------------------------------------------
 * POST /api/empreenda — fim do funil "Empreenda com IA".
 *
 * Grava o cadastro como lead do Growth Project "Veridian AI Studio" no Vortex
 * (`vortex_leads`, banco Veridian), com as respostas, o perfil montado e a
 * origem. Se a pessoa já estava lá (mesmo e-mail ou WhatsApp no projeto),
 * atualiza o lead em vez de duplicar. A chave de serviço fica só no servidor
 * (LEADS_SUPABASE_URL, LEADS_SUPABASE_SERVICE_KEY, as mesmas do formulário).
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

// Só as respostas que existem no quiz, com tamanho limitado.
function respostasValidas(bruto: unknown): Respostas {
  const out: Respostas = {};
  if (!bruto || typeof bruto !== "object") return out;
  const campos = new Set(ETAPAS.flatMap((e) => ("campo" in e ? [e.campo] : [])));
  for (const [k, v] of Object.entries(bruto as Record<string, unknown>)) {
    if (!campos.has(k)) continue;
    if (typeof v === "string") out[k] = v.slice(0, 600);
    else if (Array.isArray(v)) out[k] = v.filter((x) => typeof x === "string").slice(0, 12).map((x) => (x as string).slice(0, 60));
  }
  return out;
}

// Nota de prioridade para o atendimento (0–100), só no CRM.
function nota(r: Respostas): number {
  let n = 30;
  if (r.dedicacao === "integral") n += 20; else if (r.dedicacao === "20-40") n += 12; else if (r.dedicacao === "10-20") n += 5;
  if (r.quando === "agora") n += 15; else if (r.quando === "3m") n += 8;
  if (r.ja_empreendeu === "tenho" || r.ja_empreendeu === "varias") n += 10;
  if (r.sociedade === "sim") n += 10; else if (r.sociedade === "depende") n += 4;
  if (r.rede === "muitos") n += 8; else if (r.rede === "alguns") n += 4;
  if (r.investimento === "60k+") n += 7; else if (r.investimento === "20-60k") n += 4;
  return Math.max(0, Math.min(100, n));
}

function resumo(r: Respostas): string {
  const linhas: string[] = [];
  for (const e of ETAPAS) {
    if (!("campo" in e) || e.tipo === "frase") continue;
    const v = r[e.campo];
    if (v === undefined || v === "" || (Array.isArray(v) && !v.length)) continue;
    const texto = Array.isArray(v) ? v.map((x) => rotuloDe(e.campo, x)).join(", ") : e.tipo === "texto" ? v : rotuloDe(e.campo, v);
    linhas.push(`${e.pergunta}: ${texto}`);
  }
  const frases = ETAPAS.filter((e) => e.tipo === "frase" && r[(e as { campo: string }).campo] === "sim").map((e) => `“${(e as { frase: string }).frase}”`);
  if (frases.length) linhas.push(`Se identificou com: ${frases.join(" ")}`);
  return linhas.join("\n");
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  if (limpa(body.website, 200)) return NextResponse.json({ ok: true }); // honeypot

  const nome = limpa(body.nome, 120);
  const email = limpa(body.email, 160).toLowerCase();
  const phone = telefone(limpa(body.whatsapp, 40));
  if (!nome || !phone || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const url = process.env.LEADS_SUPABASE_URL;
  const key = process.env.LEADS_SUPABASE_SERVICE_KEY;
  if (!url || !key) return NextResponse.json({ ok: false, error: "storage_unavailable" }, { status: 503 });
  const h = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };

  const r = respostasValidas(body.respostas);
  const perfil = montarPerfil(r);
  const utm = (body.utm && typeof body.utm === "object" ? body.utm : {}) as Record<string, unknown>;
  const teste = /\[teste\]/i.test(nome) || /\.invalid$/.test(email);
  const empreenda = {
    caminho: perfil.caminho,
    arquetipo: perfil.arquetipo,
    respostas: r,
    enviado_em: new Date().toISOString(),
    visitante: limpa(body.visitante, 60) || null,
  };
  const tags = ["empreenda-com-ia", perfil.caminho === "liderar" ? "sem-ideia" : "com-ideia", ...(teste ? ["teste"] : [])];
  const notes = `Empreenda com IA · ${perfil.caminhoTitulo} · ${perfil.arquetipo}\n\n${resumo(r)}`;

  // Já está no projeto? Atualiza em vez de duplicar.
  const filtro = `company_id=eq.${COMPANY_ID}&or=(email.eq.${encodeURIComponent(email)},phone.eq.${encodeURIComponent(phone)})`;
  const achou = await fetch(`${url}/rest/v1/vortex_leads?select=id,metadata,tags&${filtro}&limit=1`, { headers: h }).then((x) => (x.ok ? x.json() : [])).catch(() => []);
  const existente = Array.isArray(achou) ? achou[0] : null;

  let ok = false;
  if (existente) {
    const metadata = { ...(existente.metadata || {}), empreenda };
    const res = await fetch(`${url}/rest/v1/vortex_leads?id=eq.${existente.id}`, {
      method: "PATCH",
      headers: { ...h, Prefer: "return=minimal" },
      body: JSON.stringify({ name: nome, notes, metadata, tags: Array.from(new Set([...(existente.tags || []), ...tags])), score: nota(r) }),
    }).catch(() => null);
    ok = !!res && res.ok;
  } else {
    const res = await fetch(`${url}/rest/v1/vortex_leads`, {
      method: "POST",
      headers: { ...h, Prefer: "return=minimal" },
      body: JSON.stringify({
        company_id: COMPANY_ID,
        tenant_id: TENANT_ID,
        name: nome,
        email,
        phone,
        segment: perfil.setores[0] || null,
        source: "website",
        bucket: "captacao",
        score: nota(r),
        tags,
        notes,
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
  return NextResponse.json({ ok: true });
}
