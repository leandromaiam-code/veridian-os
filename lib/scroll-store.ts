"use client";

// Singleton store for normalized scroll progress (0..1)
let progress = 0;
const subs = new Set<(p: number) => void>();

export const scrollStore = {
  get: () => progress,
  set: (p: number) => {
    progress = p;
    subs.forEach((fn) => fn(p));
  },
  subscribe: (fn: (p: number) => void) => {
    subs.add(fn);
    return () => {
      subs.delete(fn);
    };
  },
};

/* ------------------------------------------------------------------ */
/* Weighted zone layout                                                */
/* ------------------------------------------------------------------ */
// Each zone is one full screen; the order mirrors the commercial deck.

const ZONE_DEFS = [
  { id: "entry",     weight: 1.0, label: "Entry",        navHidden: true  }, // intro: scroll to enter
  { id: "hero",      weight: 1.6, label: "Hero",         navHidden: true  }, // promise + who we are
  { id: "portfolio", weight: 1.3, label: "Portfolio",    navHidden: false }, // real product screens
  { id: "audience",  weight: 1.0, label: "Who it's for", navHidden: false }, // clients, partners, investors
  { id: "how",       weight: 1.0, label: "How it works", navHidden: false }, // modules + phases
  { id: "edge",      weight: 1.0, label: "Why Veridian", navHidden: false }, // differentiators
  { id: "plans",     weight: 1.0, label: "Plans",        navHidden: false }, // subscription plans
  { id: "contact",   weight: 1.4, label: "Contact",      navHidden: false }, // lead form
] as const;

const TOTAL_W = ZONE_DEFS.reduce((s, z) => s + z.weight, 0);

export const ZONES = (() => {
  let acc = 0;
  return ZONE_DEFS.map((z) => {
    const start = acc / TOTAL_W;
    acc += z.weight;
    const end = acc / TOTAL_W;
    return { id: z.id, label: z.label, start, end, navHidden: z.navHidden };
  });
})();

// 80vh per weight unit — tighter scroll so each text beat lands in ~1-2 wheel
// ticks. Backgrounds still cross-fade smoothly via Lenis interpolation.
export const SCROLL_HEIGHT_VH = Math.round(TOTAL_W * 80);

export function zoneById(id: string) {
  return ZONES.find((z) => z.id === id);
}

export function zoneProgress(p: number, start: number, end: number): number {
  if (p <= start) return 0;
  if (p >= end) return 1;
  return (p - start) / (end - start);
}

export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}
