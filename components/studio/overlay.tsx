"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  scrollStore,
  ZONES,
  smoothstep,
  zoneById,
  zoneProgress,
} from "@/lib/scroll-store";
import { supabase } from "@/lib/supabase";
import { useLocale, useT } from "@/lib/i18n";

type Session = { email: string } | null;

export function Overlay() {
  const [p, setP] = useState(0);
  const [session, setSession] = useState<Session>(null);
  const t = useT();

  useEffect(() => {
    setP(scrollStore.get());
    return scrollStore.subscribe(setP);
  }, []);

  useEffect(() => {
    // initial fetch
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      if (u?.email) setSession({ email: u.email });
    });
    // live updates
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      const u = s?.user;
      setSession(u?.email ? { email: u.email } : null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const onLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const g = (id: string) => zoneById(id)!;

  // Header fades in once user begins scrolling out of the entry frame
  const headerOpacity = Math.min(1, Math.max(0, (p - 0.005) / 0.04));

  // Enter button only appears when first hero text appears, NOT in Frame 0.
  // Tied to the end of the entry zone so it never competes with the
  // minimalist symbol-only opening.
  const entryEnd = zoneById("entry")?.end ?? 0.077;
  const enterOpacity = Math.min(
    1,
    Math.max(0, (p - (entryEnd - 0.005)) / 0.04),
  );

  return (
    <>
      {/* Header — nav + brand name fade in after user scrolls */}
      <header
        className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 lg:px-14 py-5 lg:py-7 transition-opacity duration-700"
        style={{ opacity: headerOpacity, pointerEvents: headerOpacity > 0.4 ? "auto" : "none" }}
      >
        <span
          className="font-mono uppercase tracking-[0.24em] lg:tracking-[0.28em] text-[11px] lg:text-[11.5px] text-parchment/85"
          style={SHADOW_MED}
        >
          {t.brand}
        </span>
        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          {ZONES.filter((z) => !z.navHidden).map((z, i) => {
            const active = p >= z.start && p < z.end;
            return (
              <span
                key={z.id}
                className={`font-mono uppercase tracking-[0.2em] text-[11px] transition-colors ${
                  active ? "text-brass-light" : "text-parchment/90"
                }`}
                style={SHADOW_MED}
              >
                <span className="mr-1.5 opacity-50">0{i + 1}</span>
                {t.nav[z.id] ?? z.label}
              </span>
            );
          })}
        </nav>
      </header>

      {/* Enter / Session — appears only when first hero text starts to show */}
      <div
        className="fixed top-0 right-0 z-40 px-6 lg:px-14 py-5 lg:py-7 pointer-events-none transition-opacity duration-700"
        style={{
          opacity: enterOpacity,
          pointerEvents: enterOpacity > 0.5 ? "auto" : "none",
        }}
      >
        <div className="flex items-center gap-4 pointer-events-auto">
          <LocaleSwitch />
          {session ? (
            <>
              <span
                className="hidden lg:inline font-mono uppercase tracking-[0.22em] text-[11px] text-parchment/90"
                style={SHADOW_MED}
              >
                {session.email.split("@")[0]}
              </span>
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-parchment/20 hover:border-brass-light/50 font-mono uppercase tracking-[0.22em] text-[11.5px] text-parchment/90 hover:text-brass-light transition-all duration-500"
                style={{
                  ...SHADOW_MED,
                  background: "rgba(10,22,16,0.35)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                }}
              >
                {t.logout}
              </button>
            </>
          ) : (
            <Link
              href={t.login}
              className="group inline-flex items-center gap-2 px-5 py-2 rounded-full border border-brass-light/40 hover:border-brass-light font-mono uppercase tracking-[0.26em] text-[11.5px] text-brass-light hover:gap-3 transition-all duration-500"
              style={{
                ...SHADOW_MED,
                background: "rgba(10,22,16,0.4)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              {t.enter}
              <span
                aria-hidden
                className="transition-transform duration-500 group-hover:translate-x-0.5"
              >
                ↗
              </span>
            </Link>
          )}
        </div>
      </div>

      <div className="fixed left-0 right-0 bottom-0 z-30 h-px bg-brass-deep/20">
        <div
          className="h-full bg-brass transition-[width] duration-150"
          style={{ width: `${p * 100}%` }}
        />
      </div>

      <EntryCopy p={p} zone={g("entry")} />
      <HeroProgressiveCopy p={p} zone={g("hero")} />
      <ManifestoCopy p={p} zone={g("manifesto")} />
      <ResourcesIntroCopy p={p} zone={g("resources")} />
      <ResourceCopy p={p} zone={g("fabric")} idx={1} name="FABRIC"
        tag={t.modules.fabric.tag}
        promise={t.modules.fabric.promise}
        line1={t.modules.fabric.line1}
        line2={t.modules.fabric.line2}
        launchUrl={session ? "https://fabric.4profitai.com" : null}
        prints={[
          "/assets/modules/fabric-01.jpg",
          "/assets/modules/fabric-02.jpg",
          "/assets/modules/fabric-00.jpg",
        ]}
      />
      <ResourceCopy p={p} zone={g("vortex")} idx={2} name="VORTEX"
        tag={t.modules.vortex.tag}
        promise={t.modules.vortex.promise}
        line1={t.modules.vortex.line1}
        line2={t.modules.vortex.line2}
        launchUrl={session ? "https://vortex.4profitai.com" : null}
        prints={[
          "/assets/modules/vortex-01.jpg",
          "/assets/modules/vortex-02.jpg",
          "/assets/modules/vortex-03.jpg",
          "/assets/modules/vortex-00.jpg",
        ]}
      />
      <ResourceCopy p={p} zone={g("pulse")} idx={3} name="PULSE"
        tag={t.modules.pulse.tag}
        promise={t.modules.pulse.promise}
        line1={t.modules.pulse.line1}
        line2={t.modules.pulse.line2}
        launchUrl={session ? "soon" : null}
        prints={[
          "/assets/modules/pulse-03.jpg",
          "/assets/modules/pulse-04.jpg",
          "/assets/modules/pulse-02.jpg",
        ]}
      />
      <ResourceCopy p={p} zone={g("jarvis")} idx={4} name="JARVIS"
        tag={t.modules.jarvis.tag}
        promise={t.modules.jarvis.promise}
        line1={t.modules.jarvis.line1}
        line2={t.modules.jarvis.line2}
        launchUrl={session ? "https://jarvis.4profitai.com" : null}
        prints={[
          "/assets/modules/jarvis-02.jpg",
          "/assets/modules/jarvis-03.jpg",
          "/assets/modules/jarvis-04.jpg",
          "/assets/modules/jarvis-01.jpg",
        ]}
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
          className="font-mono uppercase tracking-[0.42em] text-[11.5px] text-parchment/85"
          style={SHADOW_MED}
        >
          {t.scrollCue}
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

// Overlay (text) fades tighter than backgrounds so adjacent zones with similar
// layouts (e.g. all 4 modules) don't visually overlap during cross-fade.
function useZoneOpacity(p: number, z: Z, pad = 0.015): number {
  // Asymmetric: text fades OUT faster than IN — leaves clean space for next zone
  const fadeIn = smoothstep(z.start - pad * 0.3, z.start + pad * 1.2, p);
  const fadeOut = 1 - smoothstep(z.end - pad * 1.2, z.end + pad * 0.3, p);
  return Math.max(0, Math.min(1, Math.min(fadeIn, fadeOut)));
}

function scrollToZone(zoneId: string) {
  const z = ZONES.find((zone) => zone.id === zoneId);
  if (!z) return;
  const lenis = typeof window !== "undefined" ? window.__lenis : null;
  const total = document.body.scrollHeight - window.innerHeight;
  const target = total * (z.start + 0.005);
  if (lenis) {
    lenis.scrollTo(target, { duration: 2.5 });
  } else {
    window.scrollTo({ top: target, behavior: "smooth" });
  }
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

function whatsappUrl(text: string) {
  return `https://wa.me/5531971701177?text=${encodeURIComponent(text)}`;
}

// Shared hero / closing headline — same highlight styling in every locale.
function Headline() {
  const { headline: h } = useT();
  return (
    <>
      {h.a}
      <span className="italic text-seafoam">{h.idea}</span>
      {h.b}
      <br />
      {h.c}
      <span className="italic text-brass-light">{h.product}</span>
      {h.d}
      <br />
      {h.e}
    </>
  );
}

// EN · PT switch — plain anchors: each locale has its own root layout,
// so switching is a full document navigation.
function LocaleSwitch() {
  const locale = useLocale();
  const items = [
    { code: "en", label: "EN", href: "/", hrefLang: "en" },
    { code: "pt", label: "PT", href: "/pt", hrefLang: "pt-BR" },
  ];
  return (
    <span
      className="inline-flex items-center gap-2 font-mono uppercase tracking-[0.22em] text-[11.5px]"
      style={SHADOW_MED}
    >
      {items.map((it, i) => (
        <span key={it.code} className="inline-flex items-center gap-2">
          {i > 0 && (
            <span aria-hidden className="text-parchment/30">
              ·
            </span>
          )}
          {it.code === locale ? (
            <span aria-current="true" className="text-brass-light">
              {it.label}
            </span>
          ) : (
            <a
              href={it.href}
              hrefLang={it.hrefLang}
              onClick={() => {
                // Remember the explicit choice so proxy.ts stops auto-detecting.
                document.cookie = `veridian-locale=${it.code}; path=/; max-age=31536000; samesite=lax`;
              }}
              className="text-parchment/95 hover:text-brass-light transition-colors duration-500"
            >
              {it.label}
            </a>
          )}
        </span>
      ))}
    </span>
  );
}

// Layered text shadows: a tight dark edge keeps letter shapes crisp, the wide
// soft layers lift the text off bright parts of the background image.
const SHADOW_HEAVY = {
  textShadow:
    "0 1px 2px rgba(0,0,0,0.9), 0 3px 14px rgba(0,0,0,0.8), 0 8px 40px rgba(0,0,0,0.75)",
};
const SHADOW_MED = {
  textShadow:
    "0 1px 2px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.8), 0 5px 24px rgba(0,0,0,0.65)",
};
// Small brass labels need the densest edge: they are thin, widely tracked and
// often sit on the brightest part of the image.
const SHADOW_LABEL = {
  textShadow:
    "0 0 2px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,0.95), 0 2px 12px rgba(0,0,0,0.9), 0 4px 22px rgba(0,0,0,0.7)",
};

// Scrims darken only the region behind the copy, so the cathedral stays
// bright everywhere else.
const SCRIM = {
  // copy anchored bottom-left (hero, manifesto)
  left: "linear-gradient(90deg, rgba(6,14,11,0.8) 0%, rgba(6,14,11,0.56) 28%, rgba(6,14,11,0.18) 50%, rgba(6,14,11,0) 66%), linear-gradient(0deg, rgba(6,14,11,0.55) 0%, rgba(6,14,11,0) 45%)",
  // wordmark at the top-centre of the hero
  top: "radial-gradient(ellipse 38% 17% at 50% 14%, rgba(6,14,11,0.6) 0%, rgba(6,14,11,0.32) 55%, rgba(6,14,11,0) 100%)",
  // centred copy (Veridian OS intro)
  center: "radial-gradient(ellipse 62% 58% at 50% 50%, rgba(6,14,11,0.78) 0%, rgba(6,14,11,0.5) 55%, rgba(6,14,11,0) 100%)",
  // title on top + footnote at the bottom (ventures)
  topBottom: "linear-gradient(180deg, rgba(6,14,11,0.8) 0%, rgba(6,14,11,0.45) 22%, rgba(6,14,11,0) 38%), linear-gradient(0deg, rgba(6,14,11,0.78) 0%, rgba(6,14,11,0) 26%)",
};

function Scrim({ background }: { background: string }) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{ background }}
    />
  );
}

const SHADOW_SOFT = {
  textShadow: "0 1px 2px rgba(0,0,0,0.85), 0 2px 10px rgba(0,0,0,0.75)",
};

/* ---------------------- ENTRY — pure symbol + scroll cue --------------- */
// The entry frame is intentionally text-free.
// The cathedral background carries the Veridian shield as the sole focal element.
// The scroll cue lives outside this component (in the global Overlay scope).
function EntryCopy(_props: { p: number; zone: Z }) {
  return null;
}

/* ---------------------- HERO — progressive reveal (original layout) --- */
// Restores the original entry composition (VERIDIAN top + headline bottom-left
// + tagline bottom-right) but reveals each block progressively as the user
// scrolls through the hero zone.
function HeroProgressiveCopy({ p, zone }: { p: number; zone: Z }) {
  const o = useZoneOpacity(p, zone, 0.04);
  const t = useT();
  const zp = Math.max(0, Math.min(1, (p - zone.start) / (zone.end - zone.start)));

  // Three sub-thresholds within the hero zone — compressed so EVERYTHING is
  // fully revealed by zp=0.62, which is where section-snap parks the camera.
  const wordmarkOp = smoothstep(0.0, 0.12, zp);
  const headlineOp = smoothstep(0.18, 0.40, zp);
  const taglineOp = smoothstep(0.42, 0.62, zp);

  // Subtle upward drift for each block as it enters
  const drift = (op: number) => (1 - op) * 14;

  return (
    <FixedFrame opacity={o} pointer={o > 0.4}>
      <Scrim background={`${SCRIM.top}, ${SCRIM.left}`} />
      <div className="absolute inset-0 flex flex-col justify-between px-6 lg:px-16 pt-24 lg:pt-28 pb-20 lg:pb-32 pointer-events-none">
        {/* Top — wordmark */}
        <div
          className="flex flex-col items-center text-center"
          style={{
            opacity: wordmarkOp,
            transform: `translateY(${drift(wordmarkOp)}px)`,
            transition: "transform 0.4s var(--ease-organic)",
          }}
        >
          <span
            className="font-cormorant font-light text-parchment tracking-[0.28em] lg:tracking-[0.32em] text-[clamp(1.5rem,4.5vw,4rem)] leading-none"
            style={SHADOW_HEAVY}
          >
            VERIDIAN
          </span>
          <span
            className="mt-3 font-mono uppercase tracking-[0.32em] lg:tracking-[0.42em] text-[11px] lg:text-[11.5px] text-brass-light"
            style={SHADOW_LABEL}
          >
            {t.hero.wordmarkTag}
          </span>
        </div>

        {/* Bottom — stacked on mobile, 7/5 grid on lg+ */}
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:items-end lg:gap-6">
          {/* Headline + CTA */}
          <div
            className="lg:col-span-8"
            style={{
              opacity: headlineOp,
              transform: `translateY(${drift(headlineOp)}px)`,
              transition: "transform 0.4s var(--ease-organic)",
            }}
          >
            <span
              className="font-mono uppercase tracking-[0.32em] text-[11.5px] lg:text-[12.5px] text-brass-light"
              style={SHADOW_LABEL}
            >
              {t.hero.eyebrow}
            </span>
            <h1
              className="mt-5 lg:mt-6 font-cormorant font-light text-parchment leading-[1.05] text-[clamp(1.6rem,3.3vw,3.5rem)]"
              style={SHADOW_HEAVY}
            >
              <Headline />
            </h1>
            <a
              href="#sanctum"
              onClick={(e) => {
                e.preventDefault();
                scrollToZone("sanctum");
              }}
              className="mt-8 lg:mt-10 inline-flex items-center gap-3 px-6 lg:px-7 py-3 rounded-full bg-brass-deep/80 backdrop-blur-sm text-parchment font-mono uppercase whitespace-nowrap tracking-[0.14em] sm:tracking-[0.22em] text-[11.5px] lg:text-[12.5px] transition-all duration-500 hover:bg-brass hover:gap-4 hover:shadow-[0_30px_60px_-20px_rgba(232,200,138,0.55)] border border-brass-light/40"
              style={{ ...SHADOW_MED, pointerEvents: o > 0.4 ? "auto" : "none" }}
            >
              {t.cta}
              <span aria-hidden>↘</span>
            </a>
          </div>

        </div>
      </div>
    </FixedFrame>
  );
}

/* ---------------------- MANIFESTO — contrast + claim ---------------------- */
function ManifestoCopy({ p, zone }: { p: number; zone: Z }) {
  const o = useZoneOpacity(p, zone);
  const t = useT();
  return (
    <FixedFrame opacity={o} pointer={o > 0.5}>
      <Scrim background={SCRIM.left} />
      <div className="absolute inset-0 flex items-end justify-start px-6 lg:px-16 py-20 lg:py-32 pointer-events-none">
        <div className="max-w-2xl">
          <span
            className="font-mono uppercase tracking-[0.32em] text-[11.5px] lg:text-[12.5px] text-brass-light"
            style={SHADOW_LABEL}
          >
            {t.manifesto.eyebrow}
          </span>
          <p
            className="mt-5 lg:mt-6 font-cormorant text-parchment text-[clamp(1.6rem,3.6vw,3.4rem)] font-light leading-[1.15]"
            style={SHADOW_HEAVY}
          >
            {t.manifesto.a}
            <span className="italic text-seafoam">{t.manifesto.hl1}</span>
            {t.manifesto.b}
            <span className="italic text-brass-light">{t.manifesto.hl2}</span>
            {t.manifesto.c}
            <span className="italic">{t.manifesto.hl3}</span>
            {t.manifesto.d}
          </p>
          <a
            href="#sanctum"
            onClick={(e) => {
              e.preventDefault();
              scrollToZone("sanctum");
            }}
            className="mt-8 lg:mt-10 inline-flex items-center gap-3 px-6 lg:px-7 py-3 rounded-full bg-brass-deep/80 backdrop-blur-sm text-parchment font-mono uppercase whitespace-nowrap tracking-[0.14em] sm:tracking-[0.22em] text-[11.5px] lg:text-[12.5px] transition-all duration-500 hover:bg-brass hover:gap-4 hover:shadow-[0_30px_60px_-20px_rgba(232,200,138,0.55)] border border-brass-light/40"
            style={{ ...SHADOW_MED, pointerEvents: o > 0.5 ? "auto" : "none" }}
          >
            {t.cta}
            <span aria-hidden>↘</span>
          </a>
        </div>
      </div>
    </FixedFrame>
  );
}

/* ---------------------- VERIDIAN OS INTRO — preamble to the 4 modules --- */
function ResourcesIntroCopy({ p, zone }: { p: number; zone: Z }) {
  const o = useZoneOpacity(p, zone);
  const t = useT();
  return (
    <FixedFrame opacity={o} pointer={o > 0.5}>
      <Scrim background={SCRIM.center} />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 lg:px-8 pointer-events-none">
        <span
          className="font-mono uppercase tracking-[0.32em] text-[11.5px] lg:text-[12.5px] text-brass-light"
          style={SHADOW_LABEL}
        >
          {t.os.eyebrow}
        </span>
        <h2
          className="mt-4 lg:mt-5 font-cormorant font-light text-parchment text-[clamp(2.4rem,7.5vw,7.5rem)] leading-[0.95]"
          style={SHADOW_HEAVY}
        >
          Veridian <span className="italic text-seafoam">OS</span>.
        </h2>
        <p
          className="mt-3 lg:mt-4 font-cormorant italic text-parchment/90 text-lg lg:text-2xl font-light max-w-3xl"
          style={SHADOW_MED}
        >
          {t.os.tagline}
        </p>

        <div
          className="mt-8 lg:mt-10 flex flex-wrap justify-center items-center gap-x-4 lg:gap-x-8 gap-y-2 font-cormorant text-parchment/95 text-lg lg:text-2xl font-light"
          style={SHADOW_MED}
        >
          <span><span className="text-brass-light not-italic">Jarvis</span> <span className="italic">{t.os.verbs.jarvis}</span>.</span>
          <span className="text-parchment/30 hidden sm:inline">·</span>
          <span><span className="text-brass-light not-italic">Fabric</span> <span className="italic">{t.os.verbs.fabric}</span>.</span>
          <span className="text-parchment/30 hidden sm:inline">·</span>
          <span><span className="text-brass-light not-italic">Vortex</span> <span className="italic">{t.os.verbs.vortex}</span>.</span>
          <span className="text-parchment/30 hidden sm:inline">·</span>
          <span><span className="text-brass-light not-italic">Pulse</span> <span className="italic">{t.os.verbs.pulse}</span>.</span>
        </div>

        <p
          className="mt-8 lg:mt-10 font-cormorant italic text-parchment/95 text-sm lg:text-lg font-light max-w-lg"
          style={SHADOW_MED}
        >
          {t.os.footnote}
        </p>
      </div>
    </FixedFrame>
  );
}

/* ---------------------- MODULE SHOWCASE — Minority Report scatter ---------
   Holographic UI panels materialize one at a time, scattered in 3D space:
   different sizes, different depths, different rotations — like floating
   glass screens being summoned around the user. Each panel reveals with a
   clip-path sweep + scale + depth animation so it feels assembled, not
   pasted.                                                                  */
function ModuleShowcase({
  prints,
  zp,
  accent,
}: {
  prints: string[];
  zp: number;
  accent: "seafoam" | "brass";
}) {
  const overallOp = smoothstep(0.02, 0.12, zp);
  const slots = prints.slice(0, 4);
  const count = slots.length;

  // Cards arrive sequentially — each gets its own slice of the zone progress.
  // The section-snap parks the camera at REST_FRACTION (0.65) of the zone, so
  // we MUST finish revealing all cards well before that. We aim for REVEAL_END
  // = 0.55, which leaves ~0.10 of zone progress where every card sits fully
  // visible and still — at least a beat of "stable" before the user advances.
  const REVEAL_START = 0.04;
  const REVEAL_END = 0.55;
  const slotWindow = (REVEAL_END - REVEAL_START) / count;
  const cardDuration = slotWindow * 1.0;

  // Scattered layout in 3D space: different X/Y, different depths (Z),
  // different sizes (scale), different Y-axis rotations (panels facing
  // toward the viewer at slightly different angles).
  //   x, y in % of stage (-50..50)
  //   z  in px (depth) — negative = back, positive = forward
  //   rotY in deg — Y-axis rotation (small to suggest 3D facing)
  //   scale in multiplier of base width
  const layouts: Record<number, Array<{
    x: number; y: number; z: number; rotY: number; scale: number; w: number;
  }>> = {
    1: [{ x: 0, y: 0, z: 0, rotY: 0, scale: 1, w: 70 }],
    2: [
      { x: -22, y: -8,  z:  -30, rotY:   7, scale: 0.97, w: 58 },
      { x:  22, y:  8,  z:   30, rotY:  -7, scale: 1.04, w: 58 },
    ],
    3: [
      // top-left, back
      { x: -24, y: -22, z:  -30, rotY:  10, scale: 0.94, w: 56 },
      // top-right, back
      { x:  24, y: -22, z:  -30, rotY: -10, scale: 0.94, w: 56 },
      // bottom-center, foreground (focal)
      { x:   0, y:  22, z:   40, rotY:   0, scale: 1.06, w: 62 },
    ],
    4: [
      // 2x2 layout — clean, no card hidden behind another
      // top-left
      { x: -25, y: -22, z:  -20, rotY:   8, scale: 0.96, w: 52 },
      // top-right
      { x:  25, y: -22, z:  -20, rotY:  -8, scale: 0.96, w: 52 },
      // bottom-left
      { x: -25, y:  22, z:  -10, rotY:   6, scale: 0.98, w: 52 },
      // bottom-right, foreground (focal)
      { x:  25, y:  22, z:   30, rotY:  -6, scale: 1.04, w: 54 },
    ],
  };
  const positions = layouts[count] || layouts[3];

  const borderColor =
    accent === "seafoam" ? "rgba(133,191,168,0.55)" : "rgba(232,200,138,0.55)";
  const glowColor =
    accent === "seafoam" ? "rgba(133,191,168,0.32)" : "rgba(232,200,138,0.28)";

  return (
    <div
      aria-hidden
      className="absolute inset-0 z-[5] pointer-events-none flex items-center justify-center"
      style={{ opacity: overallOp, transition: "opacity 0.4s linear" }}
    >
      {/* Backdrop gradient — frames the holographic stage */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(10,22,16,0.50) 0%, rgba(10,22,16,0.75) 60%, rgba(10,22,16,0.88) 100%)",
        }}
      />

      {/* Stage with perspective so depth offsets read as 3D */}
      <div
        className="relative"
        style={{
          width: "min(96vw, 1440px)",
          height: "min(72vh, 760px)",
          perspective: "1800px",
          transformStyle: "preserve-3d",
        }}
      >
        {slots.map((src, i) => {
          const pos = positions[i];
          const startAt = REVEAL_START + i * slotWindow;
          const endAt = Math.min(REVEAL_END, startAt + cardDuration);
          const settle = smoothstep(startAt, endAt, zp);
          // The "sweep" phase is the first 55% of the card's animation —
          // clip-path reveals from top to bottom + blur fades out
          const sweep = smoothstep(startAt, startAt + cardDuration * 0.55, zp);
          const enterOffset = 1 - settle;

          // Final pose values
          const finalX = pos.x;
          const finalY = pos.y;
          const finalZ = pos.z;
          const finalRotY = pos.rotY;
          const finalScale = pos.scale;
          // Entry: coming from deep z with reduced scale and counter-rotation
          const enterZ = -260;
          const enterRotY = pos.rotY > 0 ? pos.rotY + 18 : pos.rotY - 18;
          const enterScale = 0.55;

          const x = finalX;
          const y = finalY;
          const z = enterZ + (finalZ - enterZ) * settle;
          const rotY = enterRotY + (finalRotY - enterRotY) * settle;
          const scale = enterScale + (finalScale - enterScale) * settle;
          // Clip path: starts as inset(100% 0 0 0) (fully hidden, sweep down)
          const clip = `inset(${(1 - sweep) * 100}% 0 0 0)`;
          // Slight blur on entry, sharp on settle
          const blur = (1 - sweep) * 4;

          return (
            <div
              key={src}
              className="absolute left-1/2 top-1/2 rounded-[6px]"
              style={{
                width: `${pos.w}%`,
                aspectRatio: "16 / 7.2",
                transform: `translate3d(calc(-50% + ${x}%), calc(-50% + ${y}%), ${z}px) rotateY(${rotY}deg) scale(${scale})`,
                opacity: settle,
                zIndex: Math.round(20 + finalZ / 10),
                transformStyle: "preserve-3d",
                transition: "transform 0.6s var(--ease-organic), opacity 0.55s linear",
              }}
            >
              {/* Card body with clip-path sweep + holographic frame */}
              <div
                className="absolute inset-0 overflow-hidden rounded-[6px]"
                style={{
                  clipPath: clip,
                  WebkitClipPath: clip,
                  border: `1px solid ${borderColor}`,
                  boxShadow: `0 28px 80px -18px rgba(0,0,0,0.9), 0 0 1px rgba(0,0,0,0.5), 0 0 56px -10px ${glowColor}`,
                  background: "rgba(10,22,16,0.95)",
                  filter: `blur(${blur}px)`,
                  transition: "clip-path 0.55s linear, filter 0.45s linear, -webkit-clip-path 0.55s linear",
                }}
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="block w-full h-full object-cover"
                  style={{ filter: "saturate(1.06) contrast(1.03)" }}
                />
                {/* Top-edge holographic highlight */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(232,200,138,0.7) 50%, transparent 100%)",
                  }}
                />
                {/* Scan line during reveal — moving brass glow */}
                {sweep > 0.02 && sweep < 0.98 && (
                  <span
                    aria-hidden
                    className="absolute inset-x-0 h-[2px]"
                    style={{
                      top: `${sweep * 100}%`,
                      background:
                        accent === "seafoam"
                          ? "linear-gradient(90deg, transparent 0%, rgba(133,191,168,0.95) 50%, transparent 100%)"
                          : "linear-gradient(90deg, transparent 0%, rgba(232,200,138,0.95) 50%, transparent 100%)",
                      boxShadow:
                        accent === "seafoam"
                          ? "0 0 18px rgba(133,191,168,0.85)"
                          : "0 0 18px rgba(232,200,138,0.8)",
                    }}
                  />
                )}
                {/* Bottom vignette so text on top stays readable */}
                <span
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(10,22,16,0.5) 100%)",
                  }}
                />
              </div>
              {/* Outer glow halo that fades after settle (like a materialization aura) */}
              <span
                aria-hidden
                className="absolute -inset-2 rounded-[10px] pointer-events-none"
                style={{
                  opacity: enterOffset * 0.7,
                  boxShadow: `0 0 60px 10px ${glowColor}`,
                  transition: "opacity 0.5s linear",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------- RESOURCE COPY — promise + 2 lines proof ----------
   launchUrl: when logged in, shows a "Launch ↗" button linking to the
   module's subdomain. Use "soon" to render a disabled Coming-soon chip. */
function ResourceCopy({
  p,
  zone,
  idx,
  name,
  tag,
  promise,
  line1,
  line2,
  launchUrl,
  prints,
}: {
  p: number;
  zone: Z;
  idx: number;
  name: string;
  tag: string;
  promise: string;
  line1: string;
  line2: string;
  launchUrl?: string | null;
  prints?: string[];
}) {
  const o = useZoneOpacity(p, zone);
  const t = useT();
  const zp = zoneProgress(p, zone.start, zone.end);
  const showLaunch = !!launchUrl;
  const isSoon = launchUrl === "soon";
  const hasPrints = !!prints && prints.length > 0;
  return (
    <FixedFrame opacity={o} pointer={o > 0.5}>
      {/* Showcase mosaic — sits behind the text. Cards stack collapsed at first
          (zp < ~0.25), then fan out into a clean mosaic as the user scrolls. */}
      {hasPrints && <ModuleShowcase prints={prints!} zp={zp} accent={name === "VORTEX" ? "seafoam" : "brass"} />}

      {/* Bottom scrim — the showcase cards can be bright; this keeps the copy
          that sits over their lower half readable. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-[6] h-[62%] pointer-events-none"
        style={{
          background:
            "linear-gradient(0deg, rgba(10,22,16,0.94) 0%, rgba(10,22,16,0.8) 38%, rgba(10,22,16,0) 100%)",
        }}
      />

      <div className="absolute inset-0 z-10 flex flex-col justify-end gap-6 px-6 lg:px-16 py-20 lg:py-32 pointer-events-none lg:flex-row lg:items-end lg:justify-between lg:gap-6">
        {/* Identity block */}
        <div className="max-w-md">
          <span
            className="font-mono uppercase tracking-[0.32em] text-[11.5px] lg:text-[12.5px] text-brass-light"
            style={SHADOW_LABEL}
          >
            {t.module.eyebrow}
          </span>
          <h3
            className="mt-3 lg:mt-4 font-cormorant font-light text-parchment text-[clamp(2.5rem,7vw,7rem)] leading-[0.9]"
            style={SHADOW_HEAVY}
          >
            {name}
            <span className="text-brass-light">.</span>
          </h3>
          <p
            className="mt-1 lg:mt-2 font-cormorant italic font-light text-seafoam text-xl lg:text-3xl"
            style={SHADOW_HEAVY}
          >
            {tag}.
          </p>

          {showLaunch &&
            (isSoon ? (
              <span
                className="mt-6 lg:mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-parchment/15 text-parchment/95 font-mono uppercase tracking-[0.22em] text-[11.5px]"
                style={SHADOW_SOFT}
              >
                {t.module.soon}
              </span>
            ) : (
              <a
                href={launchUrl as string}
                target="_blank"
                rel="noreferrer"
                className="mt-6 lg:mt-8 inline-flex items-center gap-3 px-6 lg:px-7 py-3 rounded-full bg-brass-deep/85 backdrop-blur-sm text-parchment font-mono uppercase whitespace-nowrap tracking-[0.14em] sm:tracking-[0.22em] text-[11.5px] lg:text-[12.5px] transition-all duration-500 hover:bg-brass hover:gap-4 hover:shadow-[0_30px_60px_-20px_rgba(232,200,138,0.55)] border border-brass-light/40"
                style={{ ...SHADOW_MED, pointerEvents: o > 0.5 ? "auto" : "none" }}
              >
                {t.module.launch} {name.charAt(0) + name.slice(1).toLowerCase()}
                <span aria-hidden>↗</span>
              </a>
            ))}
        </div>

        {/* Pitch block */}
        <div className="max-w-md lg:max-w-sm lg:text-right lg:self-end flex flex-col gap-2 lg:gap-2.5">
          <p
            className="font-cormorant text-parchment text-xl lg:text-3xl font-light leading-snug italic"
            style={SHADOW_HEAVY}
          >
            {promise}
          </p>
          <p
            className="font-cormorant text-brass-light text-base lg:text-xl font-light leading-tight"
            style={SHADOW_MED}
          >
            {line1}
          </p>
          <p
            className="font-sans text-parchment/95 text-[14px] lg:text-base leading-relaxed"
            style={SHADOW_MED}
          >
            {line2}
          </p>
        </div>
      </div>
    </FixedFrame>
  );
}

/* ---------------------- METHOD — process + objection handling ----------- */
function MethodCopy({ p, zone }: { p: number; zone: Z }) {
  const o = useZoneOpacity(p, zone);
  const t = useT();
  return (
    <FixedFrame opacity={o} pointer={o > 0.5}>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 lg:px-8 py-12 lg:py-16 pointer-events-none">
        {/* Subtle contrast card so the dense info reads cleanly */}
        <div
          className="flex flex-col items-center max-w-5xl w-full px-6 lg:px-12 py-8 lg:py-12 rounded-[3px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(10,22,16,0.78) 0%, rgba(10,22,16,0.55) 70%, rgba(10,22,16,0.30) 100%)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            border: "1px solid rgba(232,200,138,0.18)",
            boxShadow:
              "0 40px 80px -20px rgba(0,0,0,0.55), inset 0 0 1px rgba(232,200,138,0.2)",
          }}
        >
          <span
            className="font-mono uppercase tracking-[0.32em] text-[11.5px] lg:text-[12.5px] text-brass-light"
            style={SHADOW_LABEL}
          >
            {t.method.eyebrow}
          </span>
          <h2
            className="mt-3 lg:mt-4 font-cormorant font-light text-parchment text-[clamp(1.4rem,3.2vw,2.8rem)] leading-[1.15] max-w-3xl text-center"
            style={SHADOW_HEAVY}
          >
            {t.method.title1}
            <br />
            {t.method.title2a}
            <span className="text-brass-light">{t.method.title2hl}</span>
            {t.method.title2b}
          </h2>

          {/* Milestone timeline */}
          <div className="mt-7 lg:mt-9 w-full max-w-4xl">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-y-4 gap-x-2 text-center">
              {t.method.milestones.map((m) => (
                <Milestone key={m.title} wk={m.wk} title={m.title} detail={m.detail} />
              ))}
            </div>
          </div>

          {/* Safety block — addresses scam / theft / quality / unknown-company objections */}
          <h3
            className="mt-9 lg:mt-12 font-mono uppercase tracking-[0.28em] text-[11.5px] lg:text-[12.5px] text-brass-light"
            style={SHADOW_LABEL}
          >
            {t.method.safetyTitle}
          </h3>
          <ul
            className="mt-4 lg:mt-5 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2.5 max-w-3xl w-full"
            style={SHADOW_MED}
          >
            {t.method.safety.map((item) => (
              <SafetyItem key={item} title={item} />
            ))}
          </ul>

          {/* CTA */}
          <a
            href={whatsappUrl(t.whatsappText)}
            target="_blank"
            rel="noreferrer"
            className="mt-8 lg:mt-10 inline-flex items-center gap-3 px-7 lg:px-8 py-3 lg:py-3.5 rounded-full bg-brass-deep/85 backdrop-blur-sm text-parchment font-mono uppercase whitespace-nowrap tracking-[0.14em] sm:tracking-[0.22em] text-[12.5px] lg:text-[13px] transition-all duration-500 hover:bg-brass hover:gap-4 hover:shadow-[0_30px_60px_-20px_rgba(232,200,138,0.6)] border border-brass-light/40"
            style={{ pointerEvents: o > 0.5 ? "auto" : "none" }}
          >
            {t.cta}
            <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </FixedFrame>
  );
}

function Milestone({
  wk,
  title,
  detail,
}: {
  wk: string;
  title: string;
  detail: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 px-1.5">
      <span
        className="font-mono uppercase tracking-[0.22em] text-[10px] lg:text-[11px] text-brass-light"
        style={SHADOW_LABEL}
      >
        {wk}
      </span>
      <span
        className="font-sans text-parchment text-[14px] lg:text-base font-medium tracking-tight"
        style={SHADOW_MED}
      >
        {title}
      </span>
      <span
        className="font-sans text-parchment/90 text-[12px] lg:text-[13px] leading-tight max-w-[15ch]"
        style={SHADOW_SOFT}
      >
        {detail}
      </span>
    </div>
  );
}

function SafetyItem({ title }: { title: string }) {
  return (
    <li className="flex items-center gap-3">
      <span
        aria-hidden
        className="shrink-0 inline-block w-1.5 h-1.5 rounded-full bg-brass-light"
        style={{ boxShadow: "0 0 8px rgba(232,200,138,0.7)" }}
      />
      <span className="font-sans text-parchment text-[14.5px] lg:text-[15px] font-normal leading-tight">
        {title}
      </span>
    </li>
  );
}

/* ---------------------- VENTURES — horizontal marquee gallery ----------- */
const VENTURES = [
  { id: "conciera", name: "Conciera",  url: "https://conciera.ai" },
  { id: "knexo",    name: "kNexo",     url: "https://knexo.io" },
  { id: "tegplus",  name: "TEG+",      url: "#" },
  { id: "lovedopa", name: "LoveDopa",  url: "#" },
  { id: "zettapay", name: "ZettaPay",  url: "#" },
];

// Copies of the list in the marquee row. 4 keeps 3 copies (~4300px on
// desktop) to the right of the wrap point — enough for ultrawide screens.
const VENTURE_COPIES = 4;

function VenturesCopy({ p, zone }: { p: number; zone: Z }) {
  const o = useZoneOpacity(p, zone);
  const t = useT();
  const zp = zoneProgress(p, zone.start, zone.end);

  // Scroll-driven horizontal motion: row translates as user scrolls through zone.
  // Plus a continuous slow drift (auto-marquee) so it feels alive even when idle.
  // The list is rendered VENTURE_COPIES times; one copy is exactly
  // 100/VENTURE_COPIES % of the row (spacing is padding on each item, not flex
  // gap), so wrapping the offset at that period is seamless and there are
  // always copies left to fill the viewport, however wide.
  const period = 100 / VENTURE_COPIES;
  const [autoOffset, setAutoOffset] = useState(0);

  useEffect(() => {
    if (o < 0.05) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setAutoOffset((prev) => (prev + dt * 0.6) % period); // one copy in ~42s
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [o, period]);

  // Combined translate: scroll progress + continuous drift, wrapped to one copy
  const translateX = -((zp * period * 0.7 + autoOffset) % period);

  return (
    <FixedFrame opacity={o} pointer={o > 0.5}>
      <Scrim background={SCRIM.topBottom} />
      {/* Title — top */}
      <div className="absolute inset-x-0 top-[6%] lg:top-[7%] flex flex-col items-center text-center pointer-events-none px-6 lg:px-8">
        <span
          className="font-mono uppercase tracking-[0.32em] text-[11.5px] lg:text-[12.5px] text-brass-light"
          style={SHADOW_LABEL}
        >
          {t.ventures.eyebrow}
        </span>
        <h2
          className="mt-2 lg:mt-3 font-cormorant font-light text-parchment text-[clamp(1.7rem,4.2vw,3.8rem)] leading-[1] max-w-3xl"
          style={SHADOW_HEAVY}
        >
          {t.ventures.title}<span className="italic text-seafoam">{t.ventures.titleHl}</span>
        </h2>
        <p
          className="mt-2 lg:mt-3 font-cormorant italic text-parchment/95 text-sm lg:text-lg font-light"
          style={SHADOW_MED}
        >
          {t.ventures.sub}
        </p>
      </div>

      {/* Marquee row — centered vertically */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden pointer-events-none">
        <div
          className="flex items-center will-change-transform"
          style={{
            transform: `translate3d(${translateX}%, 0, 0)`,
            width: "max-content",
          }}
        >
          {Array.from({ length: VENTURE_COPIES }, () => VENTURES)
            .flat()
            .map((v, i) => (
              <div key={`${v.id}-${i}`} className="shrink-0 pr-6 sm:pr-8 lg:pr-14">
                <PaintingCard v={{ ...v, tag: t.ventures.tags[v.id] }} active={o > 0.5} />
              </div>
            ))}
        </div>
      </div>

      {/* Edge fade masks for elegance */}
      <div
        className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 lg:w-48 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(20,35,29,0.85) 0%, rgba(20,35,29,0) 100%)",
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 lg:w-48 pointer-events-none"
        style={{
          background:
            "linear-gradient(270deg, rgba(20,35,29,0.85) 0%, rgba(20,35,29,0) 100%)",
        }}
      />

      {/* Footnote */}
      <div className="absolute inset-x-0 bottom-[6%] lg:bottom-[8%] text-center pointer-events-none px-6 lg:px-8">
        <p
          className="font-sans text-parchment/85 text-xs lg:text-sm max-w-md mx-auto"
          style={SHADOW_MED}
        >
          {t.ventures.footnote}
        </p>
      </div>
    </FixedFrame>
  );
}

function PaintingCard({
  v,
  active,
}: {
  v: { id: string; name: string; tag: string; url: string };
  active: boolean;
}) {
  return (
    <a
      href={v.url}
      target={v.url.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className="group flex flex-col items-center gap-3 lg:gap-4 transition-all duration-500 hover:-translate-y-1.5 shrink-0"
      style={{ width: "clamp(170px, 45vw, 230px)", pointerEvents: active ? "auto" : "none" }}
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
          className="mt-1.5 font-mono uppercase tracking-[0.18em] text-[11px] text-brass-light leading-tight"
          style={SHADOW_LABEL}
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
  const t = useT();
  return (
    <FixedFrame opacity={o} pointer={o > 0.5}>
      <div id="sanctum" className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 lg:px-8 py-20 lg:py-24 pointer-events-none">
        {/* Contrast card behind text — semi-opaque so the cathedral
            still shows through but the copy reads strongly. */}
        <div
          className="flex flex-col items-center max-w-3xl px-8 lg:px-14 py-10 lg:py-14 rounded-[3px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(10,22,16,0.78) 0%, rgba(10,22,16,0.55) 70%, rgba(10,22,16,0.25) 100%)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            border: "1px solid rgba(232,200,138,0.18)",
            boxShadow:
              "0 40px 80px -20px rgba(0,0,0,0.6), inset 0 0 1px rgba(232,200,138,0.2)",
          }}
        >
          <span
            className="font-mono uppercase tracking-[0.32em] text-[11.5px] lg:text-[12.5px] text-brass-light"
            style={SHADOW_LABEL}
          >
            {t.sanctum.eyebrow}
          </span>
          <h2
            className="mt-3 lg:mt-4 font-cormorant font-light text-parchment text-[clamp(1.5rem,3vw,2.7rem)] leading-[1.12] max-w-2xl"
            style={SHADOW_HEAVY}
          >
            <Headline />
          </h2>
          <p
            className="mt-4 lg:mt-5 font-cormorant italic text-parchment/90 text-base lg:text-xl font-light max-w-md"
            style={SHADOW_MED}
          >
            {t.sanctum.sub}
          </p>

          <a
            href={whatsappUrl(t.whatsappText)}
            target="_blank"
            rel="noreferrer"
            className="mt-8 lg:mt-10 inline-flex items-center gap-3 px-7 lg:px-8 py-3 lg:py-3.5 rounded-full bg-brass-deep/85 backdrop-blur-sm text-parchment font-mono uppercase whitespace-nowrap tracking-[0.14em] sm:tracking-[0.22em] text-[12.5px] lg:text-[13px] transition-all duration-500 hover:bg-brass hover:gap-4 hover:shadow-[0_30px_60px_-20px_rgba(232,200,138,0.6)] border border-brass-light/40"
            style={{ pointerEvents: o > 0.5 ? "auto" : "none" }}
          >
            {t.cta}
            <span aria-hidden>↗</span>
          </a>
        </div>

        <div
          className="mt-10 lg:mt-12 font-mono uppercase tracking-[0.2em] lg:tracking-[0.26em] text-[11px] lg:text-[11.5px] text-parchment/95"
          style={SHADOW_SOFT}
        >
          {t.sanctum.footer}
        </div>
      </div>
    </FixedFrame>
  );
}
