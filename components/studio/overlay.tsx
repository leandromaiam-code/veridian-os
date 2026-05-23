"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  scrollStore,
  ZONES,
  smoothstep,
  zoneById,
  zoneProgress,
} from "@/lib/scroll-store";

export function Overlay() {
  const [p, setP] = useState(0);

  useEffect(() => {
    setP(scrollStore.get());
    return scrollStore.subscribe(setP);
  }, []);

  const g = (id: string) => zoneById(id)!;

  // Header fades in once user begins scrolling out of the entry frame
  const headerOpacity = Math.min(1, Math.max(0, (p - 0.005) / 0.04));

  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-30 flex items-center justify-between px-8 lg:px-14 py-7 transition-opacity duration-700"
        style={{ opacity: headerOpacity, pointerEvents: headerOpacity > 0.4 ? "auto" : "none" }}
      >
        <span
          className="font-mono uppercase tracking-[0.28em] text-[10px] text-parchment/85"
          style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}
        >
          Veridian · AI Studio
        </span>
        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          {ZONES.filter((z) => !z.navHidden).map((z, i) => {
            const active = p >= z.start && p < z.end;
            return (
              <span
                key={z.id}
                className={`font-mono uppercase tracking-[0.2em] text-[9px] transition-colors ${
                  active ? "text-brass-light" : "text-parchment/45"
                }`}
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}
              >
                <span className="mr-1.5 opacity-50">0{i + 1}</span>
                {z.label}
              </span>
            );
          })}
        </nav>
      </header>

      <div className="fixed left-0 right-0 bottom-0 z-30 h-px bg-brass-deep/20">
        <div
          className="h-full bg-brass transition-[width] duration-150"
          style={{ width: `${p * 100}%` }}
        />
      </div>

      <EntryCopy p={p} zone={g("entry")} />
      <HeroBeat p={p} zone={g("hero-idea")} variant="idea" />
      <HeroBeat p={p} zone={g("hero-system")} variant="system" />
      <HeroBeat p={p} zone={g("hero-time")} variant="time" />
      <HeroBeat p={p} zone={g("hero-truth")} variant="truth" />
      <ManifestoCopy p={p} zone={g("manifesto")} />
      <ResourcesIntroCopy p={p} zone={g("resources")} />
      <ResourceCopy p={p} zone={g("jarvis")} idx={1} name="JARVIS"
        tag="The Command Channel"
        promise="One channel. Total command."
        line1="Your single point of command and operation."
        line2="Talk to Jarvis · he orchestrates Fabric, Vortex, Pulse for you."
      />
      <ResourceCopy p={p} zone={g("fabric")} idx={2} name="FABRIC"
        tag="The Foundry"
        promise="Builds while you sleep."
        line1="The product team, automated."
        line2="Designs · codes · deploys — no backlog, no standup."
      />
      <ResourceCopy p={p} zone={g("vortex")} idx={3} name="VORTEX"
        tag="The Engine"
        promise="Sells while you sleep."
        line1="The sales floor, automated."
        line2="Finds · pitches · closes — across 12 languages, 24/7."
      />
      <ResourceCopy p={p} zone={g("pulse")} idx={4} name="PULSE"
        tag="The Nervous System"
        promise="Watches while you sleep."
        line1="The operations desk, automated."
        line2="Users · infrastructure · agents — heals before you notice."
      />
      <MethodCopy p={p} zone={g("method")} />
      <VenturesCopy p={p} zone={g("ventures")} />
      <SanctumCopy p={p} zone={g("sanctum")} />

      {/* Entry scroll cue — only visible while in the very first frame */}
      <div
        className="fixed left-1/2 -translate-x-1/2 bottom-14 z-30 flex flex-col items-center gap-3 transition-opacity duration-1000"
        style={{ opacity: p > 0.02 ? 0 : 1, pointerEvents: "none" }}
      >
        <span
          className="font-mono uppercase tracking-[0.42em] text-[10px] text-parchment/85"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.75)" }}
        >
          Scroll to enter the studio
        </span>
        <div className="relative h-10 w-px overflow-hidden">
          <span
            className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-brass-light/80 via-brass-light/40 to-transparent"
            style={{
              animation: "scroll-cue-pulse 2.4s ease-in-out infinite",
            }}
          />
        </div>
        <style jsx>{`
          @keyframes scroll-cue-pulse {
            0%, 100% { transform: translateY(-60%); opacity: 0; }
            45% { transform: translateY(0%); opacity: 1; }
            55% { transform: translateY(0%); opacity: 1; }
            100% { transform: translateY(60%); opacity: 0; }
          }
        `}</style>
      </div>
    </>
  );
}

type Z = { start: number; end: number };

function useZoneOpacity(p: number, z: Z, pad = 0.025): number {
  const fadeIn = smoothstep(z.start - pad * 0.5, z.start + pad, p);
  const fadeOut = 1 - smoothstep(z.end - pad, z.end + pad * 0.5, p);
  return Math.max(0, Math.min(1, Math.min(fadeIn, fadeOut)));
}

function FixedFrame({
  opacity,
  pointer,
  children,
}: {
  opacity: number;
  pointer: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center transition-opacity duration-500"
      style={{ opacity, pointerEvents: pointer ? "auto" : "none" }}
    >
      {children}
    </div>
  );
}

const SHADOW_HEAVY = { textShadow: "0 4px 28px rgba(0,0,0,0.85)" };
const SHADOW_MED = { textShadow: "0 2px 14px rgba(0,0,0,0.75)" };
const SHADOW_SOFT = { textShadow: "0 2px 10px rgba(0,0,0,0.65)" };

/* ---------------------- ENTRY — pure symbol + scroll cue --------------- */
// The entry frame is intentionally text-free.
// The cathedral background carries the Veridian shield as the sole focal element.
// The scroll cue lives outside this component (in the global Overlay scope).
function EntryCopy(_props: { p: number; zone: Z }) {
  return null;
}

/* ---------------------- HERO BEATS — revealed progressively ----------- */
function HeroBeat({
  p,
  zone,
  variant,
}: {
  p: number;
  zone: Z;
  variant: "idea" | "system" | "time" | "truth";
}) {
  const o = useZoneOpacity(p, zone, 0.022);
  // intra-zone progress for subtle text drift
  const zp = Math.max(0, Math.min(1, (p - zone.start) / (zone.end - zone.start)));
  const ty = (1 - zp) * 18; // text drifts up as zone progresses

  const content = (() => {
    switch (variant) {
      case "idea":
        return (
          <h2
            className="font-cormorant font-light text-parchment leading-[0.95] text-[clamp(3rem,8vw,8.5rem)]"
            style={{ ...SHADOW_HEAVY, transform: `translateY(${ty}px)` }}
          >
            Your idea<span className="text-brass-light">.</span>
          </h2>
        );
      case "system":
        return (
          <h2
            className="font-cormorant font-light italic text-seafoam leading-[0.95] text-[clamp(3rem,8vw,8.5rem)]"
            style={{ ...SHADOW_HEAVY, transform: `translateY(${ty}px)` }}
          >
            Our operating system<span className="text-brass-light not-italic">.</span>
          </h2>
        );
      case "time":
        return (
          <h2
            className="font-cormorant font-light text-parchment leading-[0.95] text-[clamp(2.5rem,7vw,7rem)]"
            style={{ ...SHADOW_HEAVY, transform: `translateY(${ty}px)` }}
          >
            <span className="italic text-brass-light">~12 weeks</span> to revenue<span className="text-brass-light">.</span>
          </h2>
        );
      case "truth":
        return (
          <div
            className="max-w-2xl text-center"
            style={{ transform: `translateY(${ty}px)` }}
          >
            <p
              className="font-cormorant italic font-light text-parchment/90 leading-snug text-[clamp(1.6rem,3.4vw,3rem)]"
              style={SHADOW_HEAVY}
            >
              We don&apos;t coach.
              <br />
              We don&apos;t advise.
            </p>
            <p
              className="mt-4 font-cormorant font-light text-parchment text-[clamp(1.5rem,3vw,2.6rem)]"
              style={SHADOW_HEAVY}
            >
              We build the company while you{" "}
              <span className="italic text-seafoam">steer</span>.
            </p>
          </div>
        );
    }
  })();

  return (
    <FixedFrame opacity={o} pointer={false}>
      <div className="absolute inset-0 flex items-center justify-center text-center px-8 pointer-events-none">
        {content}
      </div>
    </FixedFrame>
  );
}

/* ---------------------- MANIFESTO — contrast + claim ---------------------- */
function ManifestoCopy({ p, zone }: { p: number; zone: Z }) {
  const o = useZoneOpacity(p, zone);
  return (
    <FixedFrame opacity={o} pointer={o > 0.5}>
      <div className="absolute inset-0 flex items-end justify-start px-10 lg:px-16 py-32 pointer-events-none">
        <div className="max-w-2xl">
          <span
            className="font-mono uppercase tracking-[0.32em] text-[11px] text-brass-light"
            style={SHADOW_MED}
          >
            Manifesto · 002
          </span>
          <h2
            className="mt-6 font-cormorant font-light text-parchment text-[clamp(2rem,4.5vw,4rem)] leading-[1.02]"
            style={SHADOW_HEAVY}
          >
            Most founders burn{" "}
            <span className="italic text-brass-light">18 months</span> and{" "}
            <span className="italic text-brass-light">$2M</span>
            <br />
            looking for product-market fit.
          </h2>
          <p
            className="mt-6 border-l-2 border-brass-light pl-4 font-cormorant italic text-seafoam text-2xl lg:text-3xl font-light"
            style={SHADOW_HEAVY}
          >
            We give you{" "}
            <span className="not-italic text-parchment font-normal">
              an operating system
            </span>{" "}
            and a 12-week shortcut.
          </p>
          <p
            className="mt-5 font-mono uppercase tracking-[0.28em] text-[11px] text-parchment/65"
            style={SHADOW_MED}
          >
            Veridian OS · Jarvis · Fabric · Vortex · Pulse
          </p>
        </div>
      </div>
    </FixedFrame>
  );
}

/* ---------------------- VERIDIAN OS INTRO — preamble to the 4 modules --- */
function ResourcesIntroCopy({ p, zone }: { p: number; zone: Z }) {
  const o = useZoneOpacity(p, zone);
  return (
    <FixedFrame opacity={o} pointer={o > 0.5}>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 pointer-events-none">
        <span
          className="font-mono uppercase tracking-[0.32em] text-[11px] text-brass-light"
          style={SHADOW_MED}
        >
          The Studio · 003
        </span>
        <h2
          className="mt-5 font-cormorant font-light text-parchment text-[clamp(3rem,7.5vw,7.5rem)] leading-[0.95]"
          style={SHADOW_HEAVY}
        >
          Veridian <span className="italic text-seafoam">OS</span>.
        </h2>
        <p
          className="mt-4 font-cormorant italic text-parchment/90 text-xl lg:text-2xl font-light max-w-xl"
          style={SHADOW_MED}
        >
          One operating system. Four modules. None of them sleep.
        </p>

        <div
          className="mt-10 flex flex-wrap justify-center items-center gap-x-5 lg:gap-x-8 gap-y-2 font-cormorant text-parchment/95 text-xl lg:text-2xl font-light"
          style={SHADOW_MED}
        >
          <span><span className="text-brass-light not-italic">Jarvis</span> <span className="italic">commands</span>.</span>
          <span className="text-parchment/30">·</span>
          <span><span className="text-brass-light not-italic">Fabric</span> <span className="italic">builds</span>.</span>
          <span className="text-parchment/30">·</span>
          <span><span className="text-brass-light not-italic">Vortex</span> <span className="italic">sells</span>.</span>
          <span className="text-parchment/30">·</span>
          <span><span className="text-brass-light not-italic">Pulse</span> <span className="italic">watches</span>.</span>
        </div>

        <p
          className="mt-10 font-cormorant italic text-parchment/80 text-base lg:text-lg font-light max-w-lg"
          style={SHADOW_MED}
        >
          Built once. Inherited by every venture, from day zero.
        </p>
      </div>
    </FixedFrame>
  );
}

/* ---------------------- RESOURCE COPY — promise + 2 lines proof ---------- */
function ResourceCopy({
  p,
  zone,
  idx,
  name,
  tag,
  promise,
  line1,
  line2,
}: {
  p: number;
  zone: Z;
  idx: number;
  name: string;
  tag: string;
  promise: string;
  line1: string;
  line2: string;
}) {
  const o = useZoneOpacity(p, zone);
  return (
    <FixedFrame opacity={o} pointer={o > 0.5}>
      <div className="absolute inset-0 flex items-end justify-between px-10 lg:px-16 py-32 pointer-events-none gap-6">
        <div className="max-w-md">
          <span
            className="font-mono uppercase tracking-[0.32em] text-[11px] text-brass-light"
            style={SHADOW_MED}
          >
            Module · 0{idx} of Veridian OS
          </span>
          <h3
            className="mt-4 font-cormorant font-light text-parchment text-[clamp(3rem,7vw,7rem)] leading-[0.9]"
            style={SHADOW_HEAVY}
          >
            {name}
            <span className="text-brass-light">.</span>
          </h3>
          <p
            className="mt-2 font-cormorant italic font-light text-seafoam text-2xl lg:text-3xl"
            style={SHADOW_HEAVY}
          >
            {tag}.
          </p>
        </div>
        <div className="max-w-sm text-right self-end flex flex-col gap-2.5">
          <p
            className="font-cormorant text-parchment text-2xl lg:text-3xl font-light leading-tight italic"
            style={SHADOW_HEAVY}
          >
            {promise}
          </p>
          <p
            className="font-cormorant text-brass-light/95 text-lg lg:text-xl font-light leading-tight"
            style={SHADOW_MED}
          >
            {line1}
          </p>
          <p
            className="font-sans text-parchment/80 text-sm lg:text-base leading-relaxed"
            style={SHADOW_MED}
          >
            {line2}
          </p>
        </div>
      </div>
    </FixedFrame>
  );
}

/* ---------------------- METHOD — proof + urgency ---------------------- */
function MethodCopy({ p, zone }: { p: number; zone: Z }) {
  const o = useZoneOpacity(p, zone);
  return (
    <FixedFrame opacity={o} pointer={o > 0.5}>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 pointer-events-none">
        <span
          className="font-mono uppercase tracking-[0.32em] text-[11px] text-brass-light"
          style={SHADOW_MED}
        >
          The shortcut · 007
        </span>
        <h2
          className="mt-6 font-cormorant font-light text-parchment text-[clamp(2.5rem,6vw,6rem)] leading-[0.95] max-w-3xl"
          style={SHADOW_HEAVY}
        >
          Idea to <span className="italic text-seafoam">revenue</span>
          <br />
          in <span className="italic text-brass-light">~12 weeks</span>.
        </h2>
        <p
          className="mt-8 font-cormorant text-parchment/85 text-xl italic font-light max-w-lg"
          style={SHADOW_MED}
        >
          You bring the conviction. Veridian OS does the work.
        </p>
        <div
          className="mt-6 flex items-center gap-2 lg:gap-3 font-mono uppercase tracking-[0.22em] text-[10px] lg:text-[11px] text-brass-light/85"
          style={SHADOW_MED}
        >
          <span>Submit</span>
          <span className="text-brass-light/40">→</span>
          <span>Research</span>
          <span className="text-brass-light/40">→</span>
          <span>Build</span>
          <span className="text-brass-light/40">→</span>
          <span>Launch</span>
          <span className="text-brass-light/40">→</span>
          <span>Scale</span>
        </div>
      </div>
    </FixedFrame>
  );
}

/* ---------------------- VENTURES — horizontal marquee gallery ----------- */
const VENTURES = [
  { id: "conciera", name: "Conciera",  tag: "hospitality intelligence",   url: "https://conciera.ai" },
  { id: "knexo",    name: "kNexo",     tag: "connection layer",           url: "https://knexo.io" },
  { id: "tegplus",  name: "TEG+",      tag: "operations OS",              url: "#" },
  { id: "lovedopa", name: "LoveDopa",  tag: "Parkinson's platform",       url: "#" },
  { id: "zettapay", name: "ZettaPay",  tag: "payments infrastructure",    url: "#" },
];

function VenturesCopy({ p, zone }: { p: number; zone: Z }) {
  const o = useZoneOpacity(p, zone);
  const zp = zoneProgress(p, zone.start, zone.end);

  // Scroll-driven horizontal motion: row translates as user scrolls through zone.
  // Plus a continuous slow drift (auto-marquee) so it feels alive even when idle.
  // We render the venture list TWICE in the row → seamless loop when translated by -50%.
  // Scroll consumes ~70% of the loop; the remaining 30% comes from auto-drift.
  const [autoOffset, setAutoOffset] = useState(0);

  useEffect(() => {
    if (o < 0.05) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setAutoOffset((prev) => (prev + dt * 1.2) % 50); // 50% over ~42s
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [o]);

  // Combined translate: zp*35% (scroll) + autoOffset (continuous drift)
  const translateX = -(zp * 35 + autoOffset);

  return (
    <FixedFrame opacity={o} pointer={o > 0.5}>
      {/* Title — top */}
      <div className="absolute inset-x-0 top-[10%] flex flex-col items-center text-center pointer-events-none px-8">
        <span
          className="font-mono uppercase tracking-[0.32em] text-[11px] text-brass-light"
          style={SHADOW_MED}
        >
          Portfolio · 008
        </span>
        <h2
          className="mt-3 font-cormorant font-light text-parchment text-[clamp(2rem,4.2vw,3.8rem)] leading-[1] max-w-3xl"
          style={SHADOW_HEAVY}
        >
          Ventures <span className="italic text-seafoam">in motion.</span>
        </h2>
        <p
          className="mt-3 font-cormorant italic text-parchment/80 text-base lg:text-lg font-light"
          style={SHADOW_MED}
        >
          Real customers. Real revenue. Growing weekly.
        </p>
      </div>

      {/* Marquee row — centered vertically */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden pointer-events-none">
        <div
          className="flex items-center gap-8 lg:gap-14 will-change-transform"
          style={{
            transform: `translate3d(${translateX}%, 0, 0)`,
            width: "max-content",
          }}
        >
          {/* Double the list for seamless infinite loop */}
          {[...VENTURES, ...VENTURES, ...VENTURES].map((v, i) => (
            <PaintingCard key={`${v.id}-${i}`} v={v} />
          ))}
        </div>
      </div>

      {/* Edge fade masks for elegance */}
      <div
        className="absolute left-0 top-0 bottom-0 w-32 lg:w-48 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(20,35,29,0.85) 0%, rgba(20,35,29,0) 100%)",
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-32 lg:w-48 pointer-events-none"
        style={{
          background:
            "linear-gradient(270deg, rgba(20,35,29,0.85) 0%, rgba(20,35,29,0) 100%)",
        }}
      />

      {/* Footnote */}
      <div className="absolute inset-x-0 bottom-[8%] text-center pointer-events-none px-8">
        <p
          className="font-sans text-parchment/85 text-sm max-w-md mx-auto"
          style={SHADOW_MED}
        >
          Each running on Jarvis · Fabric · Vortex · Pulse.
        </p>
      </div>
    </FixedFrame>
  );
}

function PaintingCard({
  v,
}: {
  v: { id: string; name: string; tag: string; url: string };
}) {
  return (
    <a
      href={v.url}
      target={v.url.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className="pointer-events-auto group flex flex-col items-center gap-4 transition-all duration-500 hover:-translate-y-1.5 shrink-0"
      style={{ width: "clamp(150px, 17vw, 230px)" }}
    >
      {/* Frame outer container — aspect 3:4 (slightly taller for the gold border) */}
      <div
        className="relative w-full"
        style={{ aspectRatio: "3 / 4" }}
      >
        {/* Gold frame background (full area) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #f0d49a 0%, #c9a56b 35%, #9b7f4e 60%, #c9a56b 85%, #f0d49a 100%)",
            boxShadow:
              "0 30px 60px -20px rgba(0,0,0,0.75), 0 8px 20px -5px rgba(0,0,0,0.5), inset 0 0 1px rgba(232,200,138,1)",
            borderRadius: "2px",
          }}
        />
        {/* Inner canvas — painting */}
        <div
          className="absolute overflow-hidden"
          style={{
            top: 8,
            left: 8,
            right: 8,
            bottom: 8,
            borderRadius: "1px",
            boxShadow:
              "inset 0 0 0 1px rgba(20,35,29,0.45), 0 0 0 1px rgba(20,35,29,0.4)",
          }}
        >
          <Image
            src={`/assets/ventures/painting-${v.id}.jpg`}
            alt={v.name}
            fill
            sizes="230px"
            className="object-cover transition-all duration-500 group-hover:brightness-110"
          />
          {/* Canvas inner depth */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: "inset 0 0 22px rgba(0,0,0,0.55)" }}
          />
        </div>
      </div>

      {/* Plaque */}
      <div className="text-center">
        <div
          className="font-cormorant text-parchment text-lg lg:text-xl leading-none"
          style={SHADOW_HEAVY}
        >
          {v.name}
        </div>
        <div
          className="mt-1.5 font-mono uppercase tracking-[0.18em] text-[9px] text-brass-light/85 leading-tight"
          style={SHADOW_MED}
        >
          {v.tag}
        </div>
      </div>
    </a>
  );
}

/* ---------------------- SANCTUM — close ---------------------- */
function SanctumCopy({ p, zone }: { p: number; zone: Z }) {
  const o = useZoneOpacity(p, zone);
  return (
    <FixedFrame opacity={o} pointer={o > 0.5}>
      <div className="absolute inset-0 flex flex-col items-center justify-end text-center px-8 pb-32 pointer-events-none">
        <span
          className="font-mono uppercase tracking-[0.32em] text-[11px] text-brass-light"
          style={SHADOW_MED}
        >
          Apply · 009
        </span>
        <h2
          className="mt-4 font-cormorant font-light text-parchment text-[clamp(2rem,5vw,4.5rem)] leading-[0.95] max-w-3xl"
          style={SHADOW_HEAVY}
        >
          Your idea deserves more than{" "}
          <span className="italic text-seafoam">advice</span>.
        </h2>
        <p
          className="mt-4 font-cormorant italic text-parchment/90 text-lg lg:text-xl font-light max-w-md"
          style={SHADOW_MED}
        >
          Two founders per quarter. Reviewed personally within 7 days.
        </p>

        <a
          href="mailto:contato@veridian.ai?subject=Veridian%20application"
          className="pointer-events-auto mt-8 inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-brass-deep/85 backdrop-blur-sm text-parchment font-mono uppercase tracking-[0.22em] text-[12px] transition-all duration-500 hover:bg-brass hover:gap-4 hover:shadow-[0_30px_60px_-20px_rgba(232,200,138,0.6)] border border-brass-light/40"
        >
          Apply for Q3 2026
          <span aria-hidden>↗</span>
        </a>

        <div
          className="mt-6 font-mono uppercase tracking-[0.26em] text-[10px] text-brass-light/80"
          style={SHADOW_SOFT}
        >
          Q3 2026 · 1 slot remaining · Closes when filled
        </div>

        <div
          className="mt-12 font-mono uppercase tracking-[0.26em] text-[10px] text-parchment/55"
          style={SHADOW_SOFT}
        >
          © 2026 · Veridian AI Studio · Built by 4Profit.AI
        </div>
      </div>
    </FixedFrame>
  );
}
