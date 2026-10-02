import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Language auto-detection for the home page.
//
// Runs only on "/". A visitor who has not chosen a language yet is sent to
// "/pt" when their browser prefers Portuguese, or — if the browser states no
// preference at all — when the request comes from a Portuguese-speaking
// country. Everyone else stays on the English page.
//
// The EN · PT switch stores the choice in the `veridian-locale` cookie, which
// always wins, so a Portuguese-speaking visitor can still read the English
// site. Crawlers send no Accept-Language and no cookie from outside those
// countries, so "/" keeps being indexed as the English page.

const COOKIE = "veridian-locale";
const PT_COUNTRIES = new Set(["BR", "PT", "AO", "MZ", "CV", "GW", "ST", "TL"]);

// First language of an Accept-Language header, by q-value.
function preferredLanguage(header: string | null): string | null {
  if (!header) return null;
  let best: string | null = null;
  let bestQ = -1;
  for (const part of header.split(",")) {
    const [tag, ...params] = part.trim().split(";");
    if (!tag || tag === "*") continue;
    const qParam = params.find((x) => x.trim().startsWith("q="));
    const q = qParam ? Number(qParam.trim().slice(2)) : 1;
    if (Number.isFinite(q) && q > bestQ) {
      best = tag.toLowerCase();
      bestQ = q;
    }
  }
  return best;
}

export function proxy(request: NextRequest) {
  const choice = request.cookies.get(COOKIE)?.value;
  if (choice === "en") return NextResponse.next();

  let wantsPt = choice === "pt";
  if (!choice) {
    const lang = preferredLanguage(request.headers.get("accept-language"));
    if (lang) {
      wantsPt = lang === "pt" || lang.startsWith("pt-");
    } else {
      const country = request.headers.get("x-vercel-ip-country") ?? "";
      wantsPt = PT_COUNTRIES.has(country.toUpperCase());
    }
  }
  if (!wantsPt) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/pt";
  // 307: the answer depends on the visitor, so it must not be cached as permanent.
  const response = NextResponse.redirect(url, 307);
  response.headers.set("Vary", "Accept-Language, Cookie");
  return response;
}

export const config = {
  matcher: "/",
};
