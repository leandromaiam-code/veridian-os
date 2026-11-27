import type { Metadata } from "next";
import { SkillPlanejamento } from "@/components/skills/planejamento-de-conteudo";

export const metadata: Metadata = {
  title: "Planejamento de conteúdo com o Claude Code — guia e skill · Veriddan",
  description:
    "Guia e skill grátis para o Claude Code planejar o seu conteúdo na ordem certa: público, dor ou desejo, objetivo, estratégia, tática, tema, headline, conteúdo e pesquisa.",
  alternates: { canonical: "/skills/planejamento-de-conteudo" },
  openGraph: {
    title: "Planejamento de conteúdo com o Claude Code",
    description: "Guia e skill grátis: calendário em tabela, headlines com nota e roteiros de Reels, na ordem certa.",
    url: "https://studio.veriddan.com/skills/planejamento-de-conteudo",
    locale: "pt_BR",
    type: "website",
  },
};

export default function Page() {
  return <SkillPlanejamento />;
}
