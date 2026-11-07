import type { Metadata } from "next";
import { FunilEmpreenda } from "@/components/empreenda/funil";

export const metadata: Metadata = {
  title: "Empreenda com IA — Veridian",
  description: "Com a sua ideia ou com um projeto da Veridian. Descubra o seu perfil de founder e o caminho para começar.",
  alternates: { canonical: "/pt/empreenda" },
  openGraph: {
    title: "Empreenda com IA — Veridian",
    description: "Descubra o seu perfil de founder e o caminho para começar a sua startup com a Veridian.",
    url: "https://veridian.4profitai.com/pt/empreenda",
    locale: "pt_BR",
  },
};

export default function EmpreendaPage() {
  return <FunilEmpreenda />;
}
