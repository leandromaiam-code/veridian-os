import type { Metadata } from "next";
import "../globals.css";
import { LenisProvider } from "@/components/lenis-provider";
import { fontVariables } from "@/lib/fonts";

export const metadata: Metadata = {
  metadataBase: new URL("https://veridian.4profitai.com"),
  title: "Veridian — AI Studio & Venture",
  description:
    "We grow autonomous startups. From idea to real-world impact. Built and scaled by AI.",
  alternates: {
    canonical: "/",
    languages: { en: "/", "pt-BR": "/pt" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="bg-parchment text-ink">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
