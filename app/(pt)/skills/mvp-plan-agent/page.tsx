import type { Metadata } from "next";
import { SkillMvpPlanAgent } from "@/components/skills/mvp-plan-agent";

export const metadata: Metadata = {
  title: "mvp-plan-agent — da ideia à especificação com o Claude Code · Veriddan",
  description:
    "Skill grátis para o Claude Code: transforma a sua ideia de app, site ou SaaS numa especificação completa, com MVP, regras, telas, dados e roadmap em etapas.",
  alternates: { canonical: "/skills/mvp-plan-agent" },
  openGraph: {
    title: "Da ideia à especificação que o Claude Code constrói",
    description: "Perguntas curtas, sem jargão, e no fim um documento com MVP, regras, telas e roadmap em etapas.",
    url: "https://studio.veriddan.com/skills/mvp-plan-agent",
    locale: "pt_BR",
    type: "website",
  },
};

export default function Page() {
  return <SkillMvpPlanAgent />;
}
