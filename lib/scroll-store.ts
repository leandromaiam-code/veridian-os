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
// All zones are now equal-weight image scenes (no more scroll-scrub video).
// Each zone is "a room" in the same Veridian cathedral.

const ZONE_DEFS = [
  { id: "entry",       weight: 1.4, label: "Entry",       navHidden: false },
  { id: "manifesto",   weight: 1.0, label: "Manifesto",   navHidden: false },
  { id: "resources",   weight: 0.9, label: "Veridian OS", navHidden: false }, // OS intro
  { id: "jarvis",      weight: 1.3, label: "Jarvis",      navHidden: true  }, // under Veridian OS
  { id: "fabric",      weight: 1.3, label: "Fabric",      navHidden: true  },
  { id: "vortex",      weight: 1.3, label: "Vortex",      navHidden: true  },
  { id: "pulse",       weight: 1.3, label: "Pulse",       navHidden: true  },
  { id: "method",      weight: 1.0, label: "Method",      navHidden: false },
  { id: "ventures",    weight: 1.2, label: "Ventures",    navHidden: false },
  { id: "sanctum",     weight: 1.4, label: "Apply",       navHidden: false },
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

// 110vh per weight unit — generous scroll for smooth Lenis-driven transitions
export const SCROLL_HEIGHT_VH = Math.round(TOTAL_W * 110);

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
