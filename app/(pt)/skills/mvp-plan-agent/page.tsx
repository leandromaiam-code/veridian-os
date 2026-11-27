import type { Metadata } from "next";
import { SkillMvpPlanAgent } from "@/components/skills/mvp-plan-agent";

export const metadata: Metadata = {
  title: "mvp-plan-agent — skill do Claude Code · Veriddan",
  description:
    "A skill do Claude Code que transforma sua ideia em um plano pronto para construir, etapa por etapa.",
  alternates: { canonical: "/skills/mvp-plan-agent" },
  openGraph: {
    title: "mvp-plan-agent",
    description: "A skill do Claude Code que transforma sua ideia em um plano pronto para construir, etapa por etapa.",
    url: "https://studio.veriddan.com/skills/mvp-plan-agent",
    locale: "pt_BR",
    type: "website",
  },
};

export default function Page() {
  return <SkillMvpPlanAgent />;
}
