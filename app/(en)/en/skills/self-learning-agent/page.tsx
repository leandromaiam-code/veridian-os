import type { Metadata } from "next";
import { SkillSelfLearningEn } from "@/components/skills/self-learning-agent-en";

export const metadata: Metadata = {
  title: "self-learning-agent — a Claude Code skill · Veriddan",
  description:
    "A Claude Code skill that reads your sessions and turns the work that repeats into tested skills and a memory that stays correct. Runs locally, on your subscription, no API key.",
  alternates: {
    canonical: "/en/skills/self-learning-agent",
    languages: { en: "/en/skills/self-learning-agent", "pt-BR": "/skills/self-learning-agent" },
  },
  openGraph: {
    title: "self-learning-agent — a Claude Code skill",
    description: "Your agent learning from its own sessions. Local, no API key, open source.",
    url: "https://studio.veriddan.com/en/skills/self-learning-agent",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return <SkillSelfLearningEn />;
}
