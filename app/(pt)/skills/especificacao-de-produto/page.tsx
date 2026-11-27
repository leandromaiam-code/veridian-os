import type { Metadata } from "next";
import { SkillEspecificacao } from "@/components/skills/especificacao-de-produto";

export const metadata: Metadata = {
  title: "Especificação de produto com o Claude Code — skill grátis · Veriddan",
  description:
    "Skill grátis para o Claude Code: transforma a sua ideia de app, site ou SaaS numa especificação completa, com MVP, regras, telas, dados e roadmap em etapas.",
  alternates: { canonical: "/skills/especificacao-de-produto" },
  openGraph: {
    title: "Da ideia à especificação que o Claude Code constrói",
    description: "Perguntas curtas, sem jargão, e no fim um documento com MVP, regras, telas e roadmap em etapas.",
    url: "https://studio.veriddan.com/skills/especificacao-de-produto",
    locale: "pt_BR",
    type: "website",
  },
};

export default function Page() {
  return <SkillEspecificacao />;
}
