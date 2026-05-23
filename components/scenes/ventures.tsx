"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BrassDivider, Eyebrow, RomanNumeral } from "@/components/ui";

gsap.registerPlugin(ScrollTrigger);

type Venture = {
  num: string;
  name: string;
  tag: string;
  body: string;
  url: string;
  modules: ("J" | "F" | "V")[];
  palette: { from: string; to: string; accent: string };
  motif: "circles" | "grid" | "diagonal" | "waves" | "spiral";
};

const ventures: Venture[] = [
  {
    num: "001",
    name: "Conciera",
    tag: "Hospitality intelligence",
    body: "Front-desk AI that answers guests in any language, books, upsells, learns from every conversation. Live in 200+ properties.",
    url: "https://conciera.ai",
    modules: ["J", "F", "V"],
    palette: { from: "#1e3b33", to: "#2d5d4e", accent: "#e8c88a" },
    motif: "circles",
  },
  {
    num: "002",
    name: "kNexo",
    tag: "Connection layer",
    body: "B2B introduction engine. Finds the warmest path between any two companies on Earth, instantly. Founders' favorite.",
    url: "https://knexo.io",
    modules: ["J", "V"],
    palette: { from: "#1b3a4b", to: "#0a1620", accent: "#a8c4b8" },
    motif: "grid",
  },
  {
    num: "003",
    name: "TEG+",
    tag: "Corporate operations OS",
    body: "Procurement, contracts, fiscal, payroll, governance — running on autonomous agents. Deployed at TEG União enterprise.",
    url: "#",
    modules: ["J", "F"],
    palette: { from: "#2d5d4e", to: "#1e3b33", accent: "#c9a56b" },
    motif: "diagonal",
  },
  {
    num: "004",
    name: "LoveDopa",
    tag: "Relationship intelligence",
    body: "Personal coach for couples and singles. Reads context, suggests action, builds emotional muscle. Consumer-grade AI affection.",
    url: "#",
    modules: ["J", "F", "V"],
    palette: { from: "#4a2438", to: "#2d1521", accent: "#e8c88a" },
    motif: "waves",
  },
  {
    num: "005",
    name: "ZettaPay",
    tag: "Autonomous payments infra",
    body: "Payment orchestration with embedded AI risk and routing. Settles faster, fails less, learns every transaction.",
    url: "#",
    modules: ["F", "V"],
    palette: { from: "#0a1f2a", to: "#0a1620", accent: "#a8c4b8" },
    motif: "spiral",
  },
];

export function Ventures() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".venture-card", {
        opacity: 0,
        y: 60,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="ventures"
      ref={sectionRef}
      className="relative py-32 lg:py-40 bg-parchment"
    >
      <div className="px-10 lg:px-16">
        <div className="flex items-center gap-4 mb-8">
          <Eyebrow>Ventures in motion · 005</Eyebrow>
          <BrassDivider width="w-16" />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
          <h2 className="font-cormorant font-light text-ink text-[clamp(2.5rem,5vw,5rem)] leading-[1.02] max-w-3xl">
            <RomanNumeral className="text-[0.85em] mr-4">V.</RomanNumeral>
            Five companies.
            <br />
            <span className="italic text-emerald">One ecosystem.</span>
          </h2>
          <p className="font-sans text-stone text-lg max-w-md leading-relaxed">
            Each one running on Jarvis, Fabric, Vortex — or a subset. Powered
            by the same operating layer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {ventures.map((v) => (
            <VentureCard key={v.num} venture={v} />
          ))}
        </div>
      </div>
    </section>
  );
}

function VentureCard({ venture: v }: { venture: Venture }) {
  return (
    <a
      href={v.url}
      className="venture-card group relative overflow-hidden rounded-3xl bg-linen transition-all duration-700 ease-[var(--ease-organic)] hover:-translate-y-1 hover:shadow-[0_30px_60px_-20px_rgba(20,35,29,0.25)]"
    >
      {/* Hero */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-1000 ease-[var(--ease-organic)] group-hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${v.palette.from} 0%, ${v.palette.to} 100%)`,
          }}
        />
        <VentureMotif motif={v.motif} accent={v.palette.accent} />
        {/* Venture wordmark */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-cormorant font-light italic tracking-tight"
            style={{
              color: v.palette.accent,
              fontSize: "clamp(3rem, 6vw, 5rem)",
              textShadow: `0 4px 30px rgba(0,0,0,0.3)`,
            }}
          >
            {v.name}
          </span>
        </div>
        <div className="absolute top-4 left-4 font-mono uppercase tracking-[0.22em] text-[10px]" style={{ color: v.palette.accent }}>
          ◇ {v.num}
        </div>
      </div>

      {/* Body */}
      <div className="p-8 lg:p-10">
        <div className="flex items-baseline justify-between mb-2">
          <h3 className="font-cormorant font-light text-ink text-4xl">
            {v.name}
          </h3>
          <span className="font-mono uppercase tracking-[0.22em] text-[10px] text-brass-deep">
            visit ↗
          </span>
        </div>
        <p className="font-mono uppercase tracking-[0.22em] text-[10px] text-stone mb-6">
          {v.tag}
        </p>

        <p className="font-sans text-base text-stone leading-relaxed mb-8">
          {v.body}
        </p>

        <div className="flex items-center justify-between border-t border-brass-deep/15 pt-5">
          <span className="font-mono uppercase tracking-[0.22em] text-[9px] text-stone">
            Powered by
          </span>
          <div className="flex items-center gap-2">
            {(["J", "F", "V"] as const).map((m) => {
              const active = v.modules.includes(m);
              const labels = { J: "Jarvis", F: "Fabric", V: "Vortex" } as const;
              return (
                <span
                  key={m}
                  title={labels[m]}
                  className={
                    active
                      ? "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-medium bg-forest text-brass-light"
                      : "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-medium bg-linen text-stone/30 border border-stone/15"
                  }
                >
                  {m}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </a>
  );
}

function VentureMotif({
  motif,
  accent,
}: {
  motif: Venture["motif"];
  accent: string;
}) {
  if (motif === "circles") {
    return (
      <svg className="absolute inset-0 w-full h-full opacity-30" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <circle
            key={i}
            cx="50%"
            cy="50%"
            r={60 + i * 50}
            fill="none"
            stroke={accent}
            strokeWidth="0.5"
            opacity={0.6 - i * 0.1}
          />
        ))}
      </svg>
    );
  }
  if (motif === "grid") {
    return (
      <svg className="absolute inset-0 w-full h-full opacity-20" aria-hidden>
        <defs>
          <pattern id={`grid-${accent}`} width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke={accent} strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${accent})`} />
      </svg>
    );
  }
  if (motif === "diagonal") {
    return (
      <svg className="absolute inset-0 w-full h-full opacity-25" aria-hidden>
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1={i * 80 - 100}
            y1="0"
            x2={i * 80 + 100}
            y2="100%"
            stroke={accent}
            strokeWidth="0.5"
            opacity="0.5"
          />
        ))}
      </svg>
    );
  }
  if (motif === "waves") {
    return (
      <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 250" aria-hidden>
        {Array.from({ length: 6 }).map((_, i) => (
          <path
            key={i}
            d={`M 0 ${50 + i * 30} Q 100 ${30 + i * 30}, 200 ${50 + i * 30} T 400 ${50 + i * 30}`}
            stroke={accent}
            strokeWidth="0.6"
            fill="none"
            opacity={0.7 - i * 0.1}
          />
        ))}
      </svg>
    );
  }
  // spiral
  return (
    <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 200 200" aria-hidden>
      <path
        d="M 100 100 m -2 0 a 2 2 0 1 0 4 0 a 4 4 0 1 1 -8 0 a 8 8 0 1 0 16 0 a 16 16 0 1 1 -32 0 a 32 32 0 1 0 64 0 a 64 64 0 1 1 -128 0"
        stroke={accent}
        strokeWidth="0.6"
        fill="none"
      />
    </svg>
  );
}
