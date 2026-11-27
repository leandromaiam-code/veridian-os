import { NextResponse } from "next/server";
import { conferir } from "@/lib/skills/download";
import { CONTENT_PLANNER_AGENT_ZIP_B64 } from "@/lib/skills/content-planner-agent-zip";
import { MVP_PLAN_AGENT_ZIP_B64 } from "@/lib/skills/mvp-plan-agent-zip";

/* GET /api/skills/download/<slug>?e=&k= — entrega o .zip da skill para o link
 * assinado que a página mostra depois do e-mail. */

const ARQUIVOS: Record<string, { b64: string; nome: string }> = {
  "content-planner-agent": { b64: CONTENT_PLANNER_AGENT_ZIP_B64, nome: "content-planner-agent.zip" },
  // Links assinados antes da troca de nome continuam baixando a skill.
  "planejamento-de-conteudo": { b64: CONTENT_PLANNER_AGENT_ZIP_B64, nome: "content-planner-agent.zip" },
  "mvp-plan-agent": { b64: MVP_PLAN_AGENT_ZIP_B64, nome: "mvp-plan-agent.zip" },
};

export async function GET(request: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const arq = ARQUIVOS[slug];
  if (!arq) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  const q = new URL(request.url).searchParams;
  if (!conferir(slug, q.get("e") || "", q.get("k") || "")) {
    return NextResponse.redirect(`https://studio.veriddan.com/skills/${slug}`, 302);
  }
  const bytes = Buffer.from(arq.b64, "base64");
  return new NextResponse(bytes, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${arq.nome}"`,
      "Content-Length": String(bytes.length),
      "Cache-Control": "private, no-store",
    },
  });
}
