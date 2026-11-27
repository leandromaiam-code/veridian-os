import { NextResponse } from "next/server";
import { linkDeDownload } from "@/lib/skills/download";

/* -----------------------------------------------------------------------------
 * POST /api/skills — libera uma skill depois do e-mail.
 *
 * Cria (ou atualiza) o lead no Growth Project "Veriddan AI Studio" do Vortex
 * (`vortex_leads`), com a tag da skill e o @ do Instagram quando vier no link
 * (?ig=). Só depois de gravar devolve o que a página mostra (comandos ou link
 * de download assinado). Chaves só no servidor: LEADS_SUPABASE_URL e
 * LEADS_SUPABASE_SERVICE_KEY.
 * --------------------------------------------------------------------------- */

const COMPANY_ID = process.env.EMPREENDA_VORTEX_COMPANY_ID || "b4d016b3-3747-4259-8a5c-27522a865381";
const TENANT_ID = process.env.EMPREENDA_VORTEX_TENANT_ID || "e3155f9e-989c-4705-87f7-19a00d8fae10";

type Liberacao = Record<string, unknown>;
const SKILLS: Record<string, { nome: string; liberar: (email: string) => Liberacao }> = {
  "self-learning-agent": {
    nome: "self-learning-agent",
    liberar: () => ({
      repo: "https://github.com/leandromaiam-code/self-learning-agent",
      comandos: [
        "npx skills add leandromaiam-code/self-learning-agent",
        "node ~/.claude/skills/self-learning-agent/scripts/learn.js plan",
      ],
    }),
  },
  "content-planner-agent": {
    nome: "content-planner-agent, skill de planejamento de conteúdo para o Claude Code",
    liberar: (email) => {
      const url = linkDeDownload("content-planner-agent", email);
      return {
        download: url,
        comandos: {
          mac: `curl -fsSL "${url}" -o /tmp/content-planner-agent.zip && mkdir -p ~/.claude/skills && unzip -o /tmp/content-planner-agent.zip -d ~/.claude/skills`,
          windows: `iwr "${url}" -OutFile "$env:TEMP\\content-planner-agent.zip"; Expand-Archive "$env:TEMP\\content-planner-agent.zip" "$HOME\\.claude\\skills" -Force`,
        },
      };
    },
  },
  "mvp-plan-agent": {
    nome: "mvp-plan-agent, skill de especificação de produto para o Claude Code",
    liberar: (email) => {
      const url = linkDeDownload("mvp-plan-agent", email);
      return {
        download: url,
        comandos: {
          mac: `curl -fsSL "${url}" -o /tmp/mvp-plan-agent.zip && mkdir -p ~/.claude/skills && unzip -o /tmp/mvp-plan-agent.zip -d ~/.claude/skills`,
          windows: `iwr "${url}" -OutFile "$env:TEMP\\mvp-plan-agent.zip"; Expand-Archive "$env:TEMP\\mvp-plan-agent.zip" "$HOME\\.claude\\skills" -Force`,
        },
      };
    },
  },
};

const limpa = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 }); }

  const slug = limpa(body.skill, 60);
  const skill = SKILLS[slug];
  if (!skill) return NextResponse.json({ ok: false, error: "skill_not_found" }, { status: 404 });

  const email = limpa(body.email, 160).toLowerCase();
  if (limpa(body.website, 200)) return NextResponse.json({ ok: true, ...skill.liberar(email || "x@x.invalid") }); // honeypot
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }
  const ig = limpa(body.ig, 40).replace(/^@/, "").replace(/[^a-z0-9._]/gi, "") || null;
  const utm = (body.utm && typeof body.utm === "object" ? body.utm : {}) as Record<string, unknown>;

  const url = process.env.LEADS_SUPABASE_URL;
  const key = process.env.LEADS_SUPABASE_SERVICE_KEY;
  if (!url || !key) return NextResponse.json({ ok: false, error: "storage_unavailable" }, { status: 503 });
  const h = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };

  const tag = `skill-${slug}`;
  const registro = {
    skill: slug,
    instagram: ig,
    liberado_em: new Date().toISOString(),
    utm_source: limpa(utm.utm_source, 120) || null,
    utm_medium: limpa(utm.utm_medium, 120) || null,
    utm_campaign: limpa(utm.utm_campaign, 120) || null,
  };

  const achou = await fetch(
    `${url}/rest/v1/vortex_leads?select=id,metadata,tags,instagram&company_id=eq.${COMPANY_ID}&email=eq.${encodeURIComponent(email)}&order=created_at.desc&limit=1`,
    { headers: h },
  ).then((x) => (x.ok ? x.json() : [])).catch(() => []);
  const existente = Array.isArray(achou) && achou[0] ? achou[0] as { id: string; metadata: Record<string, unknown> | null; tags: string[] | null; instagram: string | null } : null;

  let ok = false;
  if (existente) {
    const meta = existente.metadata || {};
    const skills = { ...((meta.skills as Record<string, unknown>) || {}), [slug]: registro };
    const patch: Record<string, unknown> = {
      metadata: { ...meta, skills },
      tags: Array.from(new Set([...(existente.tags || []), "skills", tag])),
    };
    if (ig && !existente.instagram) patch.instagram = ig;
    const res = await fetch(`${url}/rest/v1/vortex_leads?id=eq.${existente.id}`, { method: "PATCH", headers: { ...h, Prefer: "return=minimal" }, body: JSON.stringify(patch) }).catch(() => null);
    ok = !!res && res.ok;
  } else {
    const teste = /\.invalid$/.test(email) || /^teste?[+@]/.test(email);
    const res = await fetch(`${url}/rest/v1/vortex_leads`, {
      method: "POST", headers: { ...h, Prefer: "return=minimal" },
      body: JSON.stringify({
        company_id: COMPANY_ID, tenant_id: TENANT_ID,
        name: ig ? `@${ig}` : email.split("@")[0],
        email, instagram: ig, source: "website", bucket: "captacao", score: 0,
        automation_paused: true,
        tags: ["skills", tag, ig ? "instagram" : null, teste ? "teste" : null].filter(Boolean),
        notes: `Liberou ${skill.nome} em studio.veriddan.com/skills/${slug}${ig ? ` (veio do Instagram, @${ig})` : ""}.`,
        metadata: { origem: `skill:${slug}`, landing_page: `https://studio.veriddan.com/skills/${slug}`, skills: { [slug]: registro } },
      }),
    }).catch(() => null);
    ok = !!res && res.ok;
  }
  if (!ok) return NextResponse.json({ ok: false, error: "storage_failed" }, { status: 503 });

  return NextResponse.json({ ok: true, nome: skill.nome, ...skill.liberar(email) });
}
