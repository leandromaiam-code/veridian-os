"use client";

import { useEffect, useRef, useState } from "react";

/* English version of the self-learning-agent skill page (/en/skills/self-learning-agent).
 * Same gate as the Portuguese page: POST /api/skills stores the lead in the Vortex and returns the commands.
 * The Instagram Direct link brings ?ig=<user>, sent along with the lead. */

const SLUG = "self-learning-agent";
const CHAVE = "veriddan-skill-" + SLUG;
const LOGO = "https://heqrvpoebkmliwnslxpi.supabase.co/storage/v1/object/public/brand-assets/workspaces/veridian/logo.png";

type Liberado = { comandos: string[]; repo: string };

function registrar(evento: string, utm: Record<string, string>) {
  try {
    fetch("https://vortex.4profitai.com/api/capture/page-event", {
      method: "POST", keepalive: true, headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ event: ("skill:" + SLUG + ":" + evento).slice(0, 60), company: "veridian-ai-studio", page_path: "/en/skills/" + SLUG, referrer: document.referrer || undefined, ...utm }),
    }).catch(() => {});
  } catch {}
}

function Copiar({ texto }: { texto: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      onClick={() => { navigator.clipboard?.writeText(texto).then(() => { setOk(true); setTimeout(() => setOk(false), 1600); }).catch(() => {}); }}
      className="shrink-0 rounded-full border border-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-white/80 transition-colors hover:border-white/40 hover:text-white"
    >
      {ok ? "Copied" : "Copy"}
    </button>
  );
}

function Codigo({ texto }: { texto: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl bg-[#0f1714] px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,.06)]">
      <span className="select-none font-mono text-[13px] text-sage">$</span>
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-[13px] leading-6 text-white/95">{texto}</code>
      <Copiar texto={texto} />
    </div>
  );
}

const Check = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
);

function Portao() {
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [liberado, setLiberado] = useState<Liberado | null>(null);
  const ig = useRef("");
  const utm = useRef<Record<string, string>>({});

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    ig.current = (q.get("ig") || "").slice(0, 40);
    for (const k of ["utm_source", "utm_medium", "utm_campaign"]) { const v = q.get(k); if (v) utm.current[k] = v.slice(0, 120); }
    if (!utm.current.utm_source && ig.current) { utm.current.utm_source = "instagram"; utm.current.utm_medium = "direct"; utm.current.utm_campaign = "skill-" + SLUG + "-en"; }
    try { const s = JSON.parse(localStorage.getItem(CHAVE) || "null"); if (s?.comandos?.length) setLiberado(s); } catch {}
    registrar("view", utm.current);
  }, []);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) { setErro("Please check the email."); return; }
    setEnviando(true);
    const r = await fetch("/api/skills", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skill: SLUG, email: email.trim(), ig: ig.current, utm: utm.current, website: hp, lang: "en" }),
    }).then((x) => x.json()).catch(() => ({ ok: false }));
    setEnviando(false);
    if (!r?.ok || !r.comandos) { setErro("Could not unlock it right now. Please try again in a moment."); return; }
    const l = { comandos: r.comandos as string[], repo: r.repo as string };
    setLiberado(l);
    try { localStorage.setItem(CHAVE, JSON.stringify(l)); } catch {}
    registrar("liberou", utm.current);
  }

  if (liberado) {
    return (
      <div className="rounded-[28px] border border-line bg-surface p-6 shadow-[0_30px_80px_-40px_rgba(11,74,55,.45)] sm:p-8">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-green">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-mint text-green"><Check /></span>
          Installation unlocked
        </div>
        <ol className="mt-6 space-y-6">
          <li>
            <p className="text-[15px] font-medium text-graphite">1. Install the skill</p>
            <p className="mt-1 text-[14px] leading-relaxed text-text">In the terminal, with Claude Code already logged in:</p>
            <div className="mt-3"><Codigo texto={liberado.comandos[0]} /></div>
          </li>
          <li>
            <p className="text-[15px] font-medium text-graphite">2. See what it would do</p>
            <p className="mt-1 text-[14px] leading-relaxed text-text">A preview read only from the files. It does not call the model and does not write anything.</p>
            <div className="mt-3"><Codigo texto={liberado.comandos[1]} /></div>
          </li>
          <li>
            <p className="text-[15px] font-medium text-graphite">3. Ask Claude Code</p>
            <p className="mt-1 text-[14px] leading-relaxed text-text">
              Type <span className="rounded-md bg-soft px-1.5 py-0.5 font-mono text-[13px] text-graphite">learn from our sessions</span>. The skill kicks in on its own.
            </p>
          </li>
        </ol>
        <a href={liberado.repo} target="_blank" rel="noopener noreferrer"
          className="mt-7 inline-flex items-center gap-2 text-[14px] font-medium text-green underline decoration-green/30 underline-offset-4 transition-colors hover:decoration-green">
          Full code and documentation on GitHub
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="rounded-[28px] border border-line bg-surface p-6 shadow-[0_30px_80px_-40px_rgba(11,74,55,.45)] sm:p-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold">Installation</p>
      <h2 className="mt-3 font-cormorant text-[30px] leading-[1.08] text-graphite">Get the install command</h2>
      <p className="mt-3 text-[14.5px] leading-relaxed text-text">Leave your email and the step-by-step shows up right here.</p>
      <label className="mt-6 block">
        <span className="sr-only">Email</span>
        <input type="email" inputMode="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com"
          className="block w-full rounded-2xl border border-line bg-white px-5 py-4 text-[16px] text-graphite outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-muted/60 focus:border-green focus:shadow-[0_0_0_5px_rgba(15,93,69,.08)]" />
      </label>
      <input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} name="website" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      {erro && <p className="mt-3 text-[13.5px] text-[#a33a2b]">{erro}</p>}
      <button type="submit" disabled={enviando}
        className="mt-4 w-full rounded-full bg-green-3 px-6 py-[17px] text-[15px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_18px_40px_-18px_rgba(11,74,55,.85)] transition-[transform,background-color,opacity] duration-300 hover:bg-green active:scale-[.985] disabled:opacity-50">
        {enviando ? "Unlocking…" : "Unlock installation"}
      </button>
      <p className="mt-4 text-center text-[12.5px] leading-relaxed text-muted">Free and open source. We use your email to send you the next Veriddan skills.</p>
    </form>
  );
}

const DIFERENCAS: [string, string, string][] = [
  ["Who decides what becomes a skill", "You", "It does, from work that actually repeats"],
  ["Bar to create a skill", "Someone asked", "3 or more sessions across at least 2 different weeks"],
  ["Tested against", "Made-up examples", "Your real sessions, including one the draft never saw"],
  ["After it ships", "Nothing", "Usage and failures tracked, minimal fixes, merging and retirement"],
  ["Memory", "Out of scope", "Corrections propagated, facts checked, duplicates merged"],
];

const ETAPAS: { cmd: string; titulo: string; texto: string }[] = [
  { cmd: "observe", titulo: "Observes", texto: "Reads every finished session and only takes notes: tasks that repeat, traps that led to the right path, corrections you made. A fact you correct is updated right away in every note and skill." },
  { cmd: "audit", titulo: "Checks", texto: "Compares the notes with the source of truth you define (git log, list of services) and fixes what went stale, keeping the previous version as history." },
  { cmd: "weekly", titulo: "Organizes", texto: "Merges duplicate notes, lists contradictions for you to decide and rebuilds the memory index." },
  { cmd: "curate", titulo: "Curates", texto: "The only step that touches skills: creates, improves, merges and retires them, always testing against real sessions before publishing." },
];

const PERGUNTAS: [string, string][] = [
  ["Do I need an API key?", "No. Every call goes through claude -p, on your Claude Code subscription. There is no server and no npm dependency."],
  ["Will it touch my hand-made skills?", "It never merges or retires a skill it did not create. In that case the proposal shows up for you to decide. Minimal fixes may go in, always with a copy of the previous version."],
  ["Does it work with Codex?", "Yes. It reads both Claude Code and Codex sessions."],
  ["What do I need?", "Claude Code installed and logged in, and Node.js 18 or newer."],
];

export function SkillSelfLearningEn() {
  return (
    <main className="min-h-screen bg-studio text-graphite">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <a href="/" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO} alt="Veriddan" width={28} height={28} className="h-7 w-7 rounded-md" />
          <span className="font-cormorant text-[21px] tracking-[-0.01em] text-graphite">Veriddan</span>
        </a>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Skills</span>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-6 sm:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)] lg:gap-14 lg:pb-24 lg:pt-14">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-green">Claude Code skill · open source</p>
          <h1 className="mt-5 font-cormorant text-[44px] leading-[1.02] tracking-[-0.015em] text-graphite sm:text-[60px]">
            Your agent learning from its own sessions.
          </h1>
          <p className="mt-6 max-w-[54ch] text-[17px] leading-[1.65] text-text">
            Every finished Claude Code session holds what your agent needs to get better: the tasks that come back, the traps it fell into and the times you corrected it. <span className="font-mono text-[15px] text-graphite">self-learning-agent</span> reads those sessions and turns them into tested skills and a memory that stays correct.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {["Runs on your computer", "No API key", "Zero dependencies", "Reads Claude Code and Codex"].map((t) => (
              <li key={t} className="flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 text-[13px] text-text">
                <span className="text-green"><Check /></span>{t}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[13.5px] text-muted">In use at Veriddan AI Studio since October 2026, looking after the skills and memory of the agents that run our startups.</p>
        </div>
        <div id="instalar" className="min-w-0 lg:sticky lg:top-8 lg:self-start">
          <Portao />
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">The difference</p>
          <h2 className="mt-4 max-w-[22ch] font-cormorant text-[36px] leading-[1.06] text-graphite sm:text-[44px]">It starts from evidence, not from a request.</h2>
          <div className="mt-10 overflow-hidden rounded-3xl border border-line">
            <div className="hidden grid-cols-[1fr_1fr_1.3fr] bg-soft px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted sm:grid">
              <span />
              <span>Typical skill creator</span>
              <span className="text-green">self-learning-agent</span>
            </div>
            {DIFERENCAS.map(([linha, comum, nosso]) => (
              <div key={linha} className="grid gap-1.5 border-t border-line px-6 py-5 first:border-t-0 sm:grid-cols-[1fr_1fr_1.3fr] sm:gap-4 sm:first:border-t">
                <span className="text-[14.5px] font-medium text-graphite">{linha}</span>
                <span className="text-[14.5px] text-muted"><span className="font-mono text-[10.5px] uppercase tracking-[0.12em] sm:hidden">Typical: </span>{comum}</span>
                <span className="text-[14.5px] text-text"><span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-green sm:hidden">It: </span>{nosso}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">How it works</p>
        <h2 className="mt-4 font-cormorant text-[36px] leading-[1.06] text-graphite sm:text-[44px]">Four steps, each with its own job.</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {ETAPAS.map((e, i) => (
            <div key={e.cmd} className="rounded-3xl border border-line bg-surface p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] text-muted">0{i + 1}</span>
                <span className="rounded-full bg-mint px-3 py-1 font-mono text-[11.5px] text-green">learn.js {e.cmd}</span>
              </div>
              <h3 className="mt-5 font-cormorant text-[27px] leading-tight text-graphite">{e.titulo}</h3>
              <p className="mt-2.5 text-[14.5px] leading-[1.65] text-text">{e.texto}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-3xl bg-green-3 p-7 text-white sm:p-9">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sage">The bar for a new skill</p>
          <p className="mt-4 max-w-[62ch] text-[16px] leading-[1.7] text-white/90">
            The draft is written only from the oldest cases. Then another model reads 2 to 3 real sessions where the task happened, including the most recent one the draft never saw, and answers: following only this skill, would the work have come out right? The skill is published only if it passes every case.
          </p>
        </div>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:py-20">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">Questions</p>
            <h2 className="mt-4 font-cormorant text-[36px] leading-[1.06] text-graphite sm:text-[44px]">Before installing</h2>
            <a href="#instalar" className="mt-8 inline-flex rounded-full bg-green-3 px-6 py-3.5 text-[14.5px] font-medium text-white transition-colors hover:bg-green">Get the command</a>
          </div>
          <div className="divide-y divide-line">
            {PERGUNTAS.map(([p, r]) => (
              <details key={p} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-medium text-graphite">
                  {p}
                  <span className="text-muted transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[14.5px] leading-[1.65] text-text">{r}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-10 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <span>Veriddan AI Studio</span>
        <span>MIT license · open source on GitHub</span>
      </footer>
    </main>
  );
}
