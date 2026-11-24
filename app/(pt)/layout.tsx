import { VortexVisitas } from "@/components/vortex-visitas";
import type { Metadata } from "next";
import "../globals.css";
import { LenisProvider } from "@/components/lenis-provider";
import { fontVariables } from "@/lib/fonts";

export const metadata: Metadata = {
  metadataBase: new URL("https://studio.veriddan.com"),
  title: "Veriddan — AI Studio & Venture",
  description:
    "Criamos startups autônomas. Da ideia ao impacto real. Construídas e escaladas por IA.",
  alternates: {
    canonical: "/pt",
    languages: { en: "/", "pt-BR": "/pt" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={fontVariables}>
      <body className="bg-parchment text-ink">
        <LenisProvider>{children}</LenisProvider>
        <VortexVisitas />
      </body>
    </html>
  );
}
