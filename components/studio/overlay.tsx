"use client";

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
import { LeadForm } from "@/components/lead-form";

type Session = { email: string } | null;

const LOGO_BASE =
  "https://heqrvpoebkmliwnslxpi.supabase.co/storage/v1/object/public/brand-assets/workspaces";
const VERIDIAN_LOGO = `${LOGO_BASE}/veridian/logo.png`;

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

  // Header arrives as the intro dissolves into the studio.
  const entryEnd = zoneById("entry")?.end ?? 0.1;
  const headerOpacity = smoothstep(entryEnd - 0.05, entryEnd - 0.005, p);

  return (
    <div className="v-root">
      {/* Header */}
      <header
        className="v-top"
        style={{ opacity: headerOpacity, pointerEvents: headerOpacity > 0.4 ? "auto" : "none" }}
      >
        <a
          href="#hero"
          className="v-brand"
          onClick={(e) => {
            e.preventDefault();
            scrollToZone("hero");
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={VERIDIAN_LOGO} alt="" width={32} height={32} />
          <span>
            <b>{t.brandName}</b>
            <small>{t.brandTag}</small>
          </span>
        </a>
        <nav className="v-nav" aria-label="Sections">
          {ZONES.filter((z) => !z.navHidden).map((z) => {
            const active = p >= z.start && p < z.end;
            return (
              <button
                key={z.id}
                type="button"
                aria-current={active ? "true" : undefined}
                onClick={() => scrollToZone(z.id)}
              >
                {t.nav[z.id] ?? z.label}
              </button>
            );
          })}
        </nav>
        <div className="v-right">
          <LocaleSwitch />
          {session ? (
            <>
              <span className="v-user">{session.email.split("@")[0]}</span>
              <button type="button" onClick={onLogout} className="v-pill ghost">
                {t.logout}
              </button>
            </>
          ) : (
            <Link href={t.login} className="v-pill">
              {t.enter} <span aria-hidden>↗</span>
            </Link>
          )}
        </div>
      </header>

      <div className="v-progress" aria-hidden>
        <div style={{ width: `${p * 100}%` }} />
      </div>

      <HeroCopy p={p} zone={g("hero")} />
      <PortfolioCopy p={p} zone={g("portfolio")} />
      <AudienceCopy p={p} zone={g("audience")} />
      <HowCopy p={p} zone={g("how")} loggedIn={!!session} />
      <EdgeCopy p={p} zone={g("edge")} />
      <PlansCopy p={p} zone={g("plans")} />
      <ContactCopy p={p} zone={g("contact")} />

      {/* Entry scroll cue — only visible while in the very first frame */}
      <div
        className="fixed left-1/2 -translate-x-1/2 bottom-14 z-30 flex flex-col items-center gap-3 transition-opacity duration-1000"
        style={{ opacity: p > 0.02 ? 0 : 1, pointerEvents: "none" }}
      >
        <span
          className="font-mono uppercase tracking-[0.42em] text-[11.5px] text-parchment/90"
          style={{
            textShadow:
              "0 1px 2px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.8), 0 5px 24px rgba(0,0,0,0.65)",
          }}
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
    </div>
  );
}

type Z = { start: number; end: number };

// Text fades tighter than backgrounds so adjacent zones never overlap.
function useZoneOpacity(p: number, z: Z, pad = 0.015): number {
  // Asymmetric: text fades OUT faster than IN — leaves clean space for next zone
  const fadeIn = smoothstep(z.start - pad * 0.3, z.start + pad * 1.2, p);
  const fadeOut = 1 - smoothstep(z.end - pad * 1.2, z.end + pad * 0.3, p);
  return Math.max(0, Math.min(1, Math.min(fadeIn, fadeOut)));
}

// Same resting point the section snap uses (lenis-provider REST_FRACTION), so
// a click lands where the section is fully revealed.
const REST_FRACTION = 0.65;

function scrollToZone(zoneId: string) {
  const z = ZONES.find((zone) => zone.id === zoneId);
  if (!z) return;
  const lenis = typeof window !== "undefined" ? window.__lenis : null;
  const total = document.body.scrollHeight - window.innerHeight;
  const target = total * (z.start + (z.end - z.start) * REST_FRACTION);
  if (lenis) {
    lenis.scrollTo(target, { duration: 2.5, force: true });
  } else {
    window.scrollTo({ top: target, behavior: "smooth" });
  }
}

function Frame({
  id,
  opacity,
  children,
}: {
  id: string;
  opacity: number;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`v-frame${opacity > 0.5 ? " v-in" : ""}`}
      style={{
        opacity,
        pointerEvents: opacity > 0.5 ? "auto" : "none",
        visibility: opacity < 0.01 ? "hidden" : "visible",
      }}
      aria-hidden={opacity < 0.5}
    >
      {children}
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="v-eyebrow">
      <span className="dot" aria-hidden />
      {children}
    </span>
  );
}

// Shared hero / closing headline — same highlight styling in every locale.
function Headline() {
  const { headline: h } = useT();
  return (
    <>
      {h.a}
      <em>{h.idea}</em>
      {h.b}{" "}
      <br className="max-md:hidden" />
      {h.c}
      <em className="gold">{h.product}</em>
      {h.d}
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
    <span className="v-lang">
      {items.map((it, i) => (
        <span key={it.code} className="inline-flex items-center gap-1.5">
          {i > 0 && <span aria-hidden>·</span>}
          {it.code === locale ? (
            <span aria-current="true">{it.label}</span>
          ) : (
            <a
              href={it.href}
              hrefLang={it.hrefLang}
              onClick={() => {
                // Remember the explicit choice so proxy.ts stops auto-detecting.
                document.cookie = `veridian-locale=${it.code}; path=/; max-age=31536000; samesite=lax`;
              }}
            >
              {it.label}
            </a>
          )}
        </span>
      ))}
    </span>
  );
}

/* ---------------------- HERO — what the Studio does --------------------- */
const SHOTS = [
  "conciera",
  "knexo",
  "sofiaai",
  "lovedopa",
  "boostdesign",
  "zettapay",
  "knexo-jobs",
  "tsign",
  "fivsense",
  "superrdo",
];

function HeroCopy({ p, zone }: { p: number; zone: Z }) {
  const o = useZoneOpacity(p, zone, 0.04);
  const t = useT();
  const zp = Math.max(0, Math.min(1, (p - zone.start) / (zone.end - zone.start)));

  // Everything is fully revealed by zp≈0.6, before the section snap parks
  // the page at REST_FRACTION.
  const headOp = smoothstep(0.0, 0.28, zp);
  const leadOp = smoothstep(0.16, 0.42, zp);
  // The wall waits for every screen to be decoded, so the tilted frames
  // never paint as empty white cards on a first visit.
  const [shotsReady, setShotsReady] = useState(false);
  useEffect(() => {
    let alive = true;
    Promise.all(
      SHOTS.map((s) => {
        const img = new Image();
        img.src = `/assets/shots/${s}.webp`;
        return img.decode().catch(() => undefined);
      }),
    ).then(() => alive && setShotsReady(true));
    return () => {
      alive = false;
    };
  }, []);
  const wallOp = shotsReady ? smoothstep(0.26, 0.58, zp) : 0;
  const drift = (op: number) => (1 - op) * 16;

  const rowA = SHOTS.slice(0, 5);
  const rowB = SHOTS.slice(5);

  return (
    <Frame id="hero" opacity={o}>
      <div className="v-page" style={{ justifyContent: "flex-start" }}>
        <div className="v-wrap">
          <div style={{ opacity: headOp, transform: `translateY(${drift(headOp)}px)` }}>
            <Eyebrow>{t.hero.eyebrow}</Eyebrow>
            <h1 className="v-display">
              <Headline />
            </h1>
          </div>
          <div style={{ opacity: leadOp, transform: `translateY(${drift(leadOp)}px)` }}>
            <p className="v-lead">{t.hero.lead}</p>
            <div className="v-ctas">
              <a
                href="#contact"
                className="v-btn"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToZone("contact");
                }}
              >
                {t.cta} <span className="arr" aria-hidden>→</span>
              </a>
              <a
                href="#portfolio"
                className="v-btn ghost"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToZone("portfolio");
                }}
              >
                {t.ctaPortfolio}
              </a>
              <span className="v-fact">{t.hero.fact}</span>
            </div>
          </div>
        </div>
        {/* Real product screens, tilted in perspective */}
        <div
          className="v-wall"
          aria-hidden
          style={{
            opacity: wallOp,
            transform: `translateY(${drift(wallOp) * 2}px)`,
            transition: "opacity .6s ease",
          }}
        >
          <div
            className="v-wall-tilt"
            style={{ marginLeft: `${-zp * 6}%` }}
          >
            {[rowA, rowB].map((row, r) => (
              <div key={r} className={`v-wall-row${r === 1 ? " rev" : ""}`}>
                {[...row, ...row, ...row, ...row].map((s, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={`${s}-${i}`}
                    src={`/assets/shots/${s}.webp`}
                    alt=""
                    width={1200}
                    height={750}
                    decoding="async"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ---------------------- PORTFOLIO — the 12 startups ---------------------- */
// Portfolio by segment, as in the commercial deck. Logos are the canonical
// ones from the venture registry (veridian_ventures.logo_canonica); each card
// links to the venture's site_url (no link when it has none yet) and shows
// the real product screen when there is one.
const VENTURES = [
  { id: "conciera", name: "Conciera", segment: "saude", logo: `${LOGO_BASE}/conciera/logo.png`, url: "https://conciera.com.br", shot: "conciera" },
  { id: "lovedopa", name: "LoveDopa", segment: "saude", logo: `${LOGO_BASE}/lovedopa/logo.png`, url: "https://lovedopa.org", shot: "lovedopa" },
  { id: "boostdesign", name: "BoostDesign", segment: "saude", logo: `${LOGO_BASE}/boostdesign/logo.png?v=1791142954`, url: "https://boostdesign.4profitai.com", shot: "boostdesign" },
  { id: "knexo", name: "kNexo", segment: "financas", logo: `${LOGO_BASE}/knexo/logo.png`, url: "https://knexo.io/us", shot: "knexo" },
  { id: "zettapay", name: "ZettaPay", segment: "financas", logo: `${LOGO_BASE}/zettapay/logo.png?v=1791212046`, url: "https://zettapay.4profitai.com", shot: "zettapay" },
  { id: "sofiaai", name: "SofiaAI", segment: "vendas", logo: `${LOGO_BASE}/sofiaai/logo.png?v=1791212045`, url: "https://virtualsofia.com.br", shot: "sofiaai" },
  { id: "fivsense", name: "FivSense", segment: "vendas", logo: `${LOGO_BASE}/fivsense/logo.png?v=1791142952`, url: "https://fivsense.4profitai.com", shot: "fivsense" },
  { id: "veridian-helm", name: "Helm", segment: "gestao", logo: `${LOGO_BASE}/veridian-helm/logo.png`, url: "#", shot: null },
  { id: "veridian-kesh", name: "Kesh", segment: "gestao", logo: `${LOGO_BASE}/veridian-kesh/logo.png`, url: "#", shot: null },
  { id: "tsign", name: "Tsign", segment: "juridico", logo: `${LOGO_BASE}/tsign/logo.png?v=1791136478`, url: "https://tsign.4profitai.com", shot: "tsign" },
  { id: "knexo-jobs", name: "kNexo Jobs", segment: "carreira", logo: `${LOGO_BASE}/knexo-jobs/logo.png?v=1791215781`, url: "https://knexo-jobs.4profitai.com", shot: "knexo-jobs" },
  { id: "superrdo", name: "SuperRDO", segment: "construcao", logo: `${LOGO_BASE}/superrdo/logo.png?v=1791135407`, url: "https://superrdo.4profitai.com", shot: "superrdo" },
];

type Venture = (typeof VENTURES)[number];

// Copies of the list in the marquee row; two always fill the viewport after
// the wrap point.
const VENTURE_COPIES = 2;

function PortfolioCopy({ p, zone }: { p: number; zone: Z }) {
  const o = useZoneOpacity(p, zone);
  const t = useT();
  const zp = zoneProgress(p, zone.start, zone.end);

  // Scroll-driven horizontal motion plus a continuous slow drift. One copy is
  // exactly 100/VENTURE_COPIES % of the row (spacing is padding on each item),
  // so wrapping the offset at that period is seamless.
  const period = 100 / VENTURE_COPIES;
  const [autoOffset, setAutoOffset] = useState(0);

  useEffect(() => {
    if (o < 0.05) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setAutoOffset((prev) => (prev + (dt * period) / 160) % period); // one copy in ~160s
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [o, period]);

  const translateX = -((zp * period * 0.2 + autoOffset) % period);

  return (
    <Frame id="portfolio" opacity={o}>
      <div className="v-page">
        <div className="v-wrap">
          <div className="v-head">
            <div className="v-rise">
              <Eyebrow>01 · {t.nav.portfolio}</Eyebrow>
              <h2 className="v-h2">{t.portfolio.title}</h2>
              <p className="v-sub">{t.portfolio.sub}</p>
            </div>
            <div className="v-links v-rise" style={{ ["--i" as string]: 2 }}>
              <ExternalLink href={CASES_URL}>{t.portfolio.cases}</ExternalLink>
              <ExternalLink href={VENTURES_URL}>{t.portfolio.invest}</ExternalLink>
            </div>
          </div>
        </div>
        <div className="v-marquee">
          <div
            className="flex items-start will-change-transform"
            style={{ transform: `translate3d(${translateX}%, 0, 0)`, width: "max-content" }}
          >
            {Array.from({ length: VENTURE_COPIES }, () => VENTURES)
              .flat()
              .map((v, i) => (
                <div key={`${v.id}-${i}`} className="shrink-0 pr-4 sm:pr-6 lg:pr-8">
                  <CaseCard
                    v={v}
                    tag={t.portfolio.tags[v.segment]}
                    line={t.portfolio.lines[v.id]}
                    hidden={i >= VENTURES.length}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}

function CaseCard({
  v,
  tag,
  line,
  hidden,
}: {
  v: Venture;
  tag: string;
  line: string;
  hidden: boolean;
}) {
  const external = v.url.startsWith("http");
  const host = external ? new URL(v.url).host : "";
  return (
    <a
      href={external ? v.url : undefined}
      target={external ? "_blank" : undefined}
      rel="noreferrer"
      className="v-case"
      tabIndex={hidden || !external ? -1 : undefined}
      aria-hidden={hidden || undefined}
    >
      <span className="v-browser">
        <span className="v-browser-bar">
          <i />
          <i />
          <i />
          {host && <span>{host}</span>}
        </span>
        {v.shot ? (
          <span className="v-shot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="full"
              src={`/assets/shots/${v.shot}.webp`}
              alt={v.name}
              width={1200}
              height={750}
              decoding="async"
            />
          </span>
        ) : (
          <span className="v-shot logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={v.logo} alt={v.name} loading="lazy" />
          </span>
        )}
      </span>
      <span className="v-case-meta">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="v-case-logo" src={v.logo} alt="" loading="lazy" />
        <b>{v.name}</b>
        <span className="v-tag">{tag}</span>
      </span>
      <span className="v-case-line">{line}</span>
    </a>
  );
}

/* ---------------------- AUDIENCE — who it's for + model ------------------ */
function AudienceCopy({ p, zone }: { p: number; zone: Z }) {
  const o = useZoneOpacity(p, zone);
  const t = useT();
  return (
    <Frame id="audience" opacity={o}>
      <div className="v-page">
        <div className="v-wrap">
          <div className="v-head v-rise">
            <div>
              <Eyebrow>02 · {t.nav.audience}</Eyebrow>
              <h2 className="v-h2">{t.audience.title}</h2>
            </div>
          </div>
          <ul className="v-grid3">
            {t.audience.items.map((it, i) => (
              <li key={it.n} className="v-card v-rise" style={{ ["--i" as string]: i + 1 }}>
                <div className="v-card-top">
                  <span className="v-idx">{it.n}</span>
                  <h3>{it.title}</h3>
                </div>
                <p>{it.text}</p>
                <div className="v-meta">
                  <span className="who">
                    <small>{t.audience.forLabel}</small>
                    {it.who}
                  </span>
                  <span className="model">
                    <small>{t.audience.modelLabel}</small>
                    {it.model}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Frame>
  );
}

/* ---------------------- HOW — modules + maturity phases ------------------ */
// Signed-in operators get launch links on the modules that have a console.
const MODULE_URLS: Record<string, string | null> = {
  fabric: "https://fabric.4profitai.com",
  vortex: "https://vortex.4profitai.com",
  pulse: null,
  jarvis: "https://jarvis.4profitai.com",
  helm: null,
  kesh: null,
};

const PHASE_COLORS = [
  ["#0f6b4f", "#0f6b4f", "#0f6b4f", "#0f6b4f"],
  ["#2f8a68", "#6ca386", "#a59a68", "#b8925a"],
];

function HowCopy({
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
    <Frame id="how" opacity={o}>
      <div className="v-page">
        <div className="v-wrap v-how">
          <div className="v-rise">
            <Eyebrow>03 · {t.nav.how}</Eyebrow>
            <h2 className="v-h2">{t.how.title}</h2>
            <p className="v-sub">{t.how.sub}</p>
            <div className="v-mods">
              {t.how.modules.map((m, i) => {
                const url = MODULE_URLS[m.id];
                return (
                  <div key={m.id} className={`v-mod${i === 0 ? " core" : ""}`}>
                    <b>
                      {loggedIn && url ? (
                        <a href={url} target="_blank" rel="noreferrer">
                          {m.name} ↗
                        </a>
                      ) : (
                        m.name
                      )}
                    </b>
                    <span>
                      {m.role}
                      {loggedIn && !url ? ` · ${t.soon}` : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            {t.how.phases.map((ph, pi) => (
              <article key={ph.label} className="v-phase v-rise" style={{ ["--i" as string]: pi + 2 }}>
                <small>{ph.label}</small>
                <ol className="v-steps">
                  {ph.steps.map((s, si) => (
                    <li
                      key={s.title}
                      style={{
                        ["--c" as string]: PHASE_COLORS[pi][si],
                        ["--i" as string]: pi * 4 + si,
                      }}
                    >
                      <b>{s.title}</b>
                      <p>{s.text}</p>
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ---------------------- EDGE — why Veridian ------------------------------ */
function EdgeCopy({ p, zone }: { p: number; zone: Z }) {
  const o = useZoneOpacity(p, zone);
  const t = useT();
  return (
    <Frame id="edge" opacity={o}>
      <div className="v-page">
        <div className="v-wrap">
          <div className="v-head v-rise">
            <div>
              <Eyebrow>04 · {t.nav.edge}</Eyebrow>
              <h2 className="v-h2">{t.edge.title}</h2>
            </div>
          </div>
          <ul className="v-grid4">
            {t.edge.items.map((it, i) => (
              <li key={it.title} className="v-card v-rise" style={{ ["--i" as string]: i + 1 }}>
                <span className="v-num">{i + 1}</span>
                <h3>{it.title}</h3>
                <p>{it.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Frame>
  );
}

/* ---------------------- PLANS — subscription plans ----------------------- */
function PlansCopy({ p, zone }: { p: number; zone: Z }) {
  const o = useZoneOpacity(p, zone);
  const t = useT();
  return (
    <Frame id="plans" opacity={o}>
      <div className="v-page">
        <div className="v-wrap">
          <div className="v-head v-rise">
            <div>
              <Eyebrow>05 · {t.nav.plans}</Eyebrow>
              <h2 className="v-h2">{t.plans.title}</h2>
            </div>
          </div>
          <ul className="v-grid4">
            {t.plans.items.map((pl, i) => (
              <li
                key={pl.name}
                className={`v-card v-plan v-rise${pl.highlight ? " hi" : ""}`}
                style={{ ["--i" as string]: i + 1 }}
              >
                <span className="name">{pl.name}</span>
                <div className="price">
                  <b>{pl.price}</b>
                  {pl.monthly && <span>{t.plans.perMonth}</span>}
                </div>
                <span className="stage">{pl.stage}</span>
                <ul>
                  {pl.features.map((f) => (
                    <li key={f.text} className={f.no ? "no" : undefined}>
                      {f.text}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <p className="v-note v-rise" style={{ ["--i" as string]: 5 }}>
            {t.plans.note}
          </p>
        </div>
      </div>
    </Frame>
  );
}

/* ---------------------- CONTACT — lead form ------------------------------ */
function ContactCopy({ p, zone }: { p: number; zone: Z }) {
  const o = useZoneOpacity(p, zone);
  const t = useT();
  return (
    <Frame id="contact" opacity={o}>
      <div className="v-page">
        <div className="v-wrap v-contact">
          <div className="v-rise">
            <Eyebrow>06 · {t.nav.contact}</Eyebrow>
            <h2 className="v-display">
              <Headline />
            </h2>
            <p className="v-sub">{t.contact.sub}</p>
            <div className="v-contact-list">
              <div>
                <small>{t.contact.emailLabel}</small>
                <a href={`mailto:${t.contact.email}`}>{t.contact.email}</a>
              </div>
              <div>
                <small>{t.contact.siteLabel}</small>
                <span>veridian.4profitai.com</span>
              </div>
              <div>
                <small>{t.contact.groupLabel}</small>
                <a href="https://4profitai.com" target="_blank" rel="noreferrer">
                  4profitai.com
                </a>
              </div>
            </div>
          </div>
          <div className="v-formcard v-rise" style={{ ["--i" as string]: 2 }}>
            <p>{t.cta}</p>
            <LeadForm active={o > 0.5} />
          </div>
        </div>
        <div className="v-foot">
          <a className="v-link v-foot-mail" href={`mailto:${t.contact.email}`}>
            {t.contact.email}
          </a>
          <span className="v-foot-group">{t.contact.group}</span>
          <span>{t.contact.footer}</span>
          <span className="inline-flex gap-3">
            <ExternalLink href={CASES_URL}>{t.portfolio.cases}</ExternalLink>
            <ExternalLink href={VENTURES_URL}>{t.portfolio.invest}</ExternalLink>
          </span>
        </div>
      </div>
    </Frame>
  );
}

const CASES_URL = "https://cases.4profitai.com";
const VENTURES_URL = "https://ventures.4profitai.com";

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="v-link">
      {children}
      <span aria-hidden> ↗</span>
    </a>
  );
}
