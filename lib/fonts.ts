import { EB_Garamond, Inter, JetBrains_Mono } from "next/font/google";

// Display serif. Keeps the --font-cormorant variable name (used by the
// `font-cormorant` utility everywhere) but loads EB Garamond: its strokes are
// thick enough to stay readable over the cathedral imagery, where Cormorant
// Light dissolved. `font-light` resolves to 400, the lightest weight loaded.
const cormorant = EB_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono-jb",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Shared by both root layouts (app/(en) and app/(pt)).
export const fontVariables = `${cormorant.variable} ${inter.variable} ${jetbrains.variable}`;
