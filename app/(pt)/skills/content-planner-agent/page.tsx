import type { Metadata } from "next";
import { SkillContentPlannerAgent } from "@/components/skills/content-planner-agent";

export const metadata: Metadata = {
  title: "content-planner-agent — planejamento de conteúdo com o Claude Code · Veriddan",
  description:
    "Guia e skill grátis para o Claude Code planejar o seu conteúdo na ordem certa: público, dor ou desejo, objetivo, estratégia, tática, tema, headline, conteúdo e pesquisa.",
  alternates: { canonical: "/skills/content-planner-agent" },
  openGraph: {
    title: "Planejamento de conteúdo com o Claude Code",
    description: "Guia e skill grátis: calendário em tabela, headlines com nota e roteiros de Reels, na ordem certa.",
    url: "https://studio.veriddan.com/skills/content-planner-agent",
    locale: "pt_BR",
    type: "website",
  },
};

export default function Page() {
  return <SkillContentPlannerAgent />;
}
