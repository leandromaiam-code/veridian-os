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
import { useLocale, useT, whatsappUrl } from "@/lib/i18n";
import { LeadForm } from "@/components/lead-form";

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
      <DeliverCopy p={p} zone={g("deliver")} />
      <MethodCopy p={p} zone={g("method")} />
      <VenturesCopy p={p} zone={g("ventures")} />
      <EngineCopy p={p} zone={g("engine")} loggedIn={!!session} />
      <FaqCopy p={p} zone={g("faq")} />
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

/* ---------------------- DELIVER — what the visitor gets ---------------- */
function DeliverCopy({ p, zone }: { p: number; zone: Z }) {
  const o = useZoneOpacity(p, zone);
  const t = useT();
  return (
    <FixedFrame opacity={o} pointer={o > 0.5}>
      <Scrim background={SCRIM.left} />
      <div className="absolute inset-0 flex items-end justify-start px-6 lg:px-16 py-20 lg:py-28 pointer-events-none">
        <div className="max-w-3xl">
          <span
            className="font-mono uppercase tracking-[0.32em] text-[11.5px] lg:text-[12.5px] text-brass-light"
            style={SHADOW_LABEL}
          >
            {t.deliver.eyebrow}
          </span>
          <h2
            className="mt-4 lg:mt-5 font-cormorant text-parchment text-[clamp(1.6rem,3.4vw,3.4rem)] leading-[1.1]"
            style={SHADOW_HEAVY}
          >
            {t.deliver.title1}
            <br />
            {t.deliver.title2a}
            <span className="italic text-brass-light">{t.deliver.title2hl}</span>
            {t.deliver.title2b}
          </h2>
          <ul
            className="mt-6 lg:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2.5 lg:gap-y-3"
            style={SHADOW_MED}
          >
            {t.deliver.items.map((item) => (
              <SafetyItem key={item} title={item} />
            ))}
          </ul>
          {t.deliver.price && (
            <p
              className="mt-5 lg:mt-6 font-cormorant italic text-brass-light text-lg lg:text-2xl"
              style={SHADOW_MED}
            >
              {t.deliver.price}
            </p>
          )}
          <a
            href="#sanctum"
            onClick={(e) => {
              e.preventDefault();
              scrollToZone("sanctum");
            }}
            className="mt-7 lg:mt-9 inline-flex items-center gap-3 px-6 lg:px-7 py-3 rounded-full bg-brass-deep/80 backdrop-blur-sm text-parchment font-mono uppercase whitespace-nowrap tracking-[0.14em] sm:tracking-[0.22em] text-[11.5px] lg:text-[12.5px] transition-all duration-500 hover:bg-brass hover:gap-4 hover:shadow-[0_30px_60px_-20px_rgba(232,200,138,0.55)] border border-brass-light/40"
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
// Every system in the studio, shown by a real screen of it. Public products
// link to their site; internal tools and client systems have no link.
const VENTURES = [
  { id: "conciera",   name: "Conciera",   img: "/assets/portfolio/conciera.jpg",    url: "https://conciera.com.br" },
  { id: "knexo",      name: "kNexo",      img: "/assets/portfolio/knexo.jpg",       url: "https://knexo.io" },
  { id: "vortex",     name: "Vortex",     img: "/assets/modules/vortex-01.jpg",     url: "#" },
  { id: "tsign",      name: "Tsign",      img: "/assets/portfolio/tsign.jpg",       url: "https://tsign.4profitai.com" },
  { id: "zettapay",   name: "ZettaPay",   img: "/assets/portfolio/zettapay.jpg",    url: "https://zettapay.4profitai.com" },
  { id: "fabric",     name: "Fabric",     img: "/assets/modules/fabric-01.jpg",     url: "#" },
  { id: "lovedopa",   name: "LoveDopa",   img: "/assets/portfolio/lovedopa.jpg",    url: "https://lovedopa.org" },
  { id: "sofiaai",    name: "SofiaAI",    img: "/assets/portfolio/sofiaai.jpg",     url: "#" },
  { id: "pulse",      name: "Pulse",      img: "/assets/modules/pulse-03.jpg",      url: "#" },
  { id: "knexo-jobs", name: "kNexo Jobs", img: "/assets/portfolio/knexo-jobs.jpg",  url: "https://knexo-jobs.vercel.app" },
  { id: "fivsense",   name: "FivSense",   img: "/assets/portfolio/fivsense.jpg",    url: "https://fivsense.vercel.app" },
  { id: "jarvis",     name: "Jarvis",     img: "/assets/modules/jarvis-02.jpg",     url: "#" },
  { id: "tegplus",    name: "TEG+",       img: "/assets/ventures/painting-tegplus.jpg", url: "#" },
];

// Copies of the list in the marquee row. One copy is ~13 cards (~5900px on
// desktop), so two always fill the viewport after the wrap point.
const VENTURE_COPIES = 2;

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
      setAutoOffset((prev) => (prev + (dt * period) / 150) % period); // one copy in ~150s
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [o, period]);

  // Combined translate: scroll progress + continuous drift, wrapped to one copy
  const translateX = -((zp * period * 0.2 + autoOffset) % period);

  return (
    <FixedFrame opacity={o} pointer={o > 0.5}>
      <Scrim background={SCRIM.topBottom} />
      {/* Title, marquee and footnote are stacked in one column (not absolutely
          positioned) so they can never overlap; the cards shrink with the
          viewport height instead — see PaintingCard width. */}
      <div className="absolute inset-0 flex flex-col justify-center gap-[clamp(10px,3vh,36px)] pt-[clamp(64px,10vh,96px)] pb-[clamp(20px,5vh,56px)] pointer-events-none">
      {/* Title — top */}
      <div className="flex flex-col items-center text-center pointer-events-none px-6 lg:px-8">
        <span
          className="font-mono uppercase tracking-[0.32em] text-[11.5px] lg:text-[12.5px] text-brass-light"
          style={SHADOW_LABEL}
        >
          {t.ventures.eyebrow}
        </span>
        <h2
          className="mt-2 lg:mt-3 font-cormorant font-light text-parchment text-[clamp(1.5rem,min(3.6vw,7vh),3.4rem)] leading-[1.05] max-w-6xl"
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

      {/* Marquee row */}
      <div className="overflow-hidden pointer-events-none py-2">
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
                <SystemCard v={{ ...v, tag: t.ventures.tags[v.id] }} active={o > 0.5} />
              </div>
            ))}
        </div>
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

    </FixedFrame>
  );
}

function SystemCard({
  v,
  active,
}: {
  v: { id: string; name: string; tag: string; url: string; img: string };
  active: boolean;
}) {
  const external = v.url.startsWith("http");
  return (
    <a
      href={external ? v.url : undefined}
      target={external ? "_blank" : undefined}
      rel="noreferrer"
      className="group flex flex-col items-center gap-3 lg:gap-4 transition-all duration-500 hover:-translate-y-1.5 shrink-0"
      style={{
        // Width follows the viewport HEIGHT too: ~390px are taken by the title,
        // plaque and paddings; the frame (16:10) gets what is left.
        width: "clamp(190px, min(72vw, calc((100svh - 390px) * 1.6)), 400px)",
        pointerEvents: active && external ? "auto" : "none",
      }}
    >
      {/* Gold frame around a real screen of the system */}
      <div className="relative w-full" style={{ aspectRatio: "16 / 10" }}>
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
        <div
          className="absolute overflow-hidden bg-[#0a1610]"
          style={{
            top: 6,
            left: 6,
            right: 6,
            bottom: 6,
            borderRadius: "1px",
            boxShadow:
              "inset 0 0 0 1px rgba(20,35,29,0.45), 0 0 0 1px rgba(20,35,29,0.4)",
          }}
        >
          <Image
            src={v.img}
            alt={v.name}
            fill
            sizes="400px"
            className="object-cover object-top transition-all duration-500 group-hover:brightness-110"
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

/* ---------------------- ENGINE — Veridian OS, in one screen -------------- */
// The four modules used to take five full screens. For the visitor they are
// only the reason delivery is fast, so they get one screen and one line each.
// Signed-in operators still get their launch links here.
const MODULE_URLS: Record<string, string | null> = {
  fabric: "https://fabric.4profitai.com",
  vortex: "https://vortex.4profitai.com",
  pulse: null,
  jarvis: "https://jarvis.4profitai.com",
};

function EngineCopy({
  p,
  zone,
  loggedIn,
}: {
  p: number;
  zone: Z;
  loggedIn: boolean;
}) {
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
          {t.engine.eyebrow}
        </span>
        <h2
          className="mt-3 lg:mt-4 font-cormorant text-parchment text-[clamp(2.2rem,min(6vw,11vh),6rem)] leading-[0.95]"
          style={SHADOW_HEAVY}
        >
          {t.engine.title}
          <span className="italic text-seafoam">{t.engine.titleHl}</span>.
        </h2>
        <p
          className="mt-3 lg:mt-4 font-cormorant italic text-parchment text-base lg:text-xl max-w-2xl"
          style={SHADOW_MED}
        >
          {t.engine.sub}
        </p>

        <div className="mt-7 lg:mt-10 grid grid-cols-2 lg:grid-cols-4 gap-x-6 lg:gap-x-10 gap-y-5 max-w-5xl">
          {t.engine.modules.map((m) => {
            const url = MODULE_URLS[m.id];
            return (
              <div key={m.id} className="flex flex-col items-center gap-1" style={SHADOW_MED}>
                <span className="font-cormorant text-xl lg:text-2xl text-parchment">
                  {loggedIn && url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brass-light underline underline-offset-4 decoration-brass-light/40 hover:decoration-brass-light"
                      style={{ pointerEvents: o > 0.5 ? "auto" : "none" }}
                    >
                      {m.name} ↗
                    </a>
                  ) : (
                    <span className="text-brass-light">{m.name}</span>
                  )}{" "}
                  <span className="italic">{m.verb}</span>
                  {loggedIn && !url && (
                    <span className="ml-2 font-mono uppercase tracking-[0.18em] text-[10px] text-parchment/70">
                      {t.engine.soon}
                    </span>
                  )}
                </span>
                <span className="font-sans text-parchment/90 text-[13px] lg:text-sm leading-snug max-w-[24ch]">
                  {m.line}
                </span>
              </div>
            );
          })}
        </div>

        <p
          className="mt-7 lg:mt-10 font-cormorant italic text-parchment/90 text-sm lg:text-lg max-w-xl"
          style={SHADOW_MED}
        >
          {t.engine.footnote}
        </p>
      </div>
    </FixedFrame>
  );
}

/* ---------------------- FAQ — objections, answered ---------------------- */
function FaqCopy({ p, zone }: { p: number; zone: Z }) {
  const o = useZoneOpacity(p, zone);
  const t = useT();
  return (
    <FixedFrame opacity={o} pointer={o > 0.5}>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-5 lg:px-8 py-[clamp(56px,9vh,96px)] pointer-events-none">
        <div
          className="flex flex-col items-center max-w-5xl w-full px-6 lg:px-12 py-[clamp(18px,4vh,44px)] rounded-[3px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(10,22,16,0.84) 0%, rgba(10,22,16,0.66) 70%, rgba(10,22,16,0.42) 100%)",
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
            {t.faq.eyebrow}
          </span>
          <h2
            className="mt-2 lg:mt-3 font-cormorant text-parchment text-[clamp(1.4rem,min(3.2vw,5.5vh),2.8rem)] leading-[1.1] text-center"
            style={SHADOW_HEAVY}
          >
            {t.faq.title}
            <span className="italic text-seafoam">{t.faq.titleHl}</span>
          </h2>

          <dl className="mt-[clamp(12px,3vh,32px)] grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-[clamp(8px,2vh,20px)] w-full">
            {t.faq.items.map((item) => (
              <div key={item.q} style={SHADOW_MED}>
                <dt className="font-cormorant text-brass-light text-[17px] lg:text-xl leading-snug">
                  {item.q}
                </dt>
                <dd className="mt-0.5 lg:mt-1 font-sans text-parchment text-[13px] lg:text-[14.5px] leading-snug">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </FixedFrame>
  );
}

/* ---------------------- SANCTUM — close ---------------------- */
function SanctumCopy({ p, zone }: { p: number; zone: Z }) {
  const o = useZoneOpacity(p, zone);
  const t = useT();
  return (
    <FixedFrame opacity={o} pointer={o > 0.5}>
      <div id="sanctum" className="absolute inset-0 flex flex-col items-center justify-center text-center px-5 lg:px-8 py-[clamp(56px,9vh,96px)] pointer-events-none">
        {/* Contrast card behind text — semi-opaque so the cathedral
            still shows through but the copy reads strongly. */}
        <div
          className="flex flex-col items-center w-full max-w-3xl px-6 lg:px-14 py-[clamp(18px,4vh,48px)] rounded-[3px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(10,22,16,0.86) 0%, rgba(10,22,16,0.7) 70%, rgba(10,22,16,0.45) 100%)",
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
            className="mt-3 lg:mt-4 font-cormorant font-light text-parchment text-[clamp(1.4rem,min(3vw,5.5vh),2.7rem)] leading-[1.12] max-w-2xl"
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

          <LeadForm active={o > 0.5} />
        </div>

        <div
          className="mt-[clamp(12px,3vh,44px)] font-mono uppercase tracking-[0.2em] lg:tracking-[0.26em] text-[11px] lg:text-[11.5px] text-parchment/95"
          style={SHADOW_SOFT}
        >
          {t.sanctum.footer}
        </div>
      </div>
    </FixedFrame>
  );
}
