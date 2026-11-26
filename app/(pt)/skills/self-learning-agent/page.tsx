import type { Metadata } from "next";
import { SkillSelfLearning } from "@/components/skills/self-learning-agent";

export const metadata: Metadata = {
  title: "self-learning-agent — skill para o Claude Code · Veriddan",
  description:
    "Uma skill para o Claude Code que lê as suas sessões e transforma o trabalho que se repete em skills testadas e memória que continua certa. Roda local, na sua assinatura, sem chave de API.",
  alternates: { canonical: "/skills/self-learning-agent" },
  openGraph: {
    title: "self-learning-agent — skill para o Claude Code",
    description: "O seu agente aprendendo com as próprias sessões. Local, sem chave de API, código aberto.",
    url: "https://studio.veriddan.com/skills/self-learning-agent",
    locale: "pt_BR",
    type: "website",
  },
};

export default function Page() {
  return <SkillSelfLearning />;
}
