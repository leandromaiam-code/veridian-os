"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BrassDivider, Eyebrow, RomanNumeral } from "@/components/ui";

gsap.registerPlugin(ScrollTrigger);

type ModuleSpec = {
  number: string;
  name: string;
  role: string;
  body: string;
  imageSrc?: string;
  gradient?: string;
  accent: string;
  metrics: { label: string; value: string }[];
};

const modules: ModuleSpec[] = [
  {
    number: "01",
    name: "Jarvis",
    role: "The Orchestrator",
    body: "Personal AI agent that runs the operating layer. Decisions, comms, calendar, intel, automation. Always on. Always learning.",
    gradient:
      "radial-gradient(ellipse at 30% 20%, rgba(40,160,200,0.35) 0%, rgba(10,14,26,0) 55%), radial-gradient(ellipse at 70% 80%, rgba(80,200,255,0.25) 0%, rgba(10,14,26,0) 50%), linear-gradient(135deg, #0a0e1a 0%, #0e1a2c 100%)",
    accent: "#00d4ff",
    metrics: [
      { label: "Accuracy", value: "97.3%" },
      { label: "Latency", value: "real-time" },
      { label: "Uptime", value: "24/7" },
    ],
  },
  {
    number: "02",
    name: "Fabric",
    role: "The Foundry",
    body: "Autonomous AI solutions platform. Builds, trains, deploys agents at scale. Every Veridian venture inherits Fabric on day one.",
    imageSrc: "/assets/modules/fabric.png",
    accent: "#3fb48f",
    metrics: [
      { label: "Agents", value: "247" },
      { label: "Uptime", value: "99.4%" },
      { label: "Humans on call", value: "0" },
    ],
  },
  {
    number: "03",
    name: "Vortex",
    role: "The Engine",
    body: "Sales operating system. Lead-to-cash autopilot, 24/7 revenue motion, multi-language outreach. Already in production across Veridian ventures.",
    imageSrc: "/assets/modules/vortex.png",
    accent: "#0ea5e9",
    metrics: [
      { label: "Revenue moved", value: "$2.8M" },
      { label: "Languages", value: "12" },
      { label: "Ventures live", value: "5" },
    ],
  },
];

export function Modules() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".module-card");
      cards.forEach((card) => {
        gsap.from(card.querySelectorAll(".module-anim"), {
          opacity: 0,
          y: 40,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 65%",
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="modules"
      ref={sectionRef}
      className="relative py-32 lg:py-40 bg-parchment"
    >
      {/* Header */}
      <div className="px-10 lg:px-16 mb-20">
        <div className="flex items-center gap-4 mb-8">
          <Eyebrow>Ecosystem · 003</Eyebrow>
          <BrassDivider width="w-16" />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <h2 className="font-cormorant font-light text-ink text-[clamp(2.5rem,5vw,5rem)] leading-[1.02] max-w-3xl">
            <RomanNumeral className="text-[0.85em] mr-4">III.</RomanNumeral>
            Three forces.
            <br />
            <span className="italic text-emerald">One organism.</span>
          </h2>
          <p className="font-sans text-stone text-lg max-w-md leading-relaxed">
            Each module operates autonomously. Together they compound. Every
            venture born inside Veridian is powered by all three from day zero.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-8 px-6 lg:px-16">
        {modules.map((m) => (
          <ModuleCard key={m.number} module={m} />
        ))}
      </div>
    </section>
  );
}

function ModuleCard({ module: m }: { module: ModuleSpec }) {
  return (
    <article className="module-card relative overflow-hidden rounded-3xl bg-forest text-parchment">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Visual */}
        <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto lg:min-h-[560px] overflow-hidden">
          {m.imageSrc ? (
            <Image
              src={m.imageSrc}
              alt={m.name}
              fill
              className="module-anim object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          ) : (
            <div
              className="module-anim absolute inset-0"
              style={{ background: m.gradient }}
            >
              {/* HUD grid for Jarvis */}
              <svg className="absolute inset-0 w-full h-full opacity-25" aria-hidden>
                <defs>
                  <pattern id="hud-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke={m.accent} strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hud-grid)" />
              </svg>
              {/* HUD reticles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-72 h-72 rounded-full border opacity-50"
                  style={{ borderColor: m.accent }}
                />
                <div
                  className="absolute w-96 h-96 rounded-full border opacity-25"
                  style={{ borderColor: m.accent }}
                />
                <div
                  className="absolute w-[28rem] h-[28rem] rounded-full border opacity-10"
                  style={{ borderColor: m.accent }}
                />
              </div>
              {/* Center jewel */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-32 h-32 rounded-full blur-2xl opacity-70"
                  style={{ background: m.accent }}
                />
                <div
                  className="absolute w-16 h-16 rounded-full"
                  style={{ background: m.accent, boxShadow: `0 0 60px ${m.accent}` }}
                />
              </div>
              {/* Datapoints */}
              <div className="absolute top-8 right-8 font-mono text-[10px] uppercase tracking-widest" style={{ color: m.accent }}>
                ◇ system online
                <br />
                ◇ latency 12ms
                <br />
                ◇ tasks 7 queued
              </div>
            </div>
          )}
          {/* Overlay forest tint */}
          <div className="absolute inset-0 bg-gradient-to-r from-forest/40 via-transparent to-forest/40 pointer-events-none" />
        </div>

        {/* Content */}
        <div className="lg:col-span-5 p-10 lg:p-14 flex flex-col justify-between gap-10">
          <div>
            <div className="module-anim flex items-center gap-3 mb-8">
              <span className="font-mono uppercase tracking-[0.28em] text-[11px] text-celadon">
                Module · {m.number}
              </span>
              <BrassDivider width="w-10" className="bg-brass" />
            </div>

            <h3 className="module-anim font-cormorant font-light text-parchment text-[clamp(2.5rem,4.5vw,4.5rem)] leading-none mb-3">
              {m.name}
              <span className="text-brass">.</span>
            </h3>
            <p className="module-anim font-cormorant italic font-light text-seafoam text-2xl mb-8">
              {m.role}.
            </p>

            <p className="module-anim font-sans text-celadon text-base leading-relaxed max-w-md">
              {m.body}
            </p>
          </div>

          <div className="module-anim space-y-4">
            <div className="h-px w-full bg-brass/30" />
            <div className="grid grid-cols-3 gap-4">
              {m.metrics.map((kpi) => (
                <div key={kpi.label}>
                  <div className="font-mono uppercase tracking-[0.2em] text-[9px] text-celadon/70 mb-1">
                    {kpi.label}
                  </div>
                  <div className="font-cormorant text-2xl text-brass-light">
                    {kpi.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
