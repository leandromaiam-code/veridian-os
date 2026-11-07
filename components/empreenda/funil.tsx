"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AGENDA_URL, BLOCOS, DADOS, DADOS_AREA, DEGRAUS_FATURAMENTO, ENTREGAS, ETAPAS, MANDALA, SOLUCOES,
  destino, etapasVisiveis, meta, reais, textoDe, type Dado, type Etapa, type Respostas,
} from "@/lib/empreenda";
import { whatsappUrl } from "@/lib/i18n";

/* Funil "Empreenda com IA". Uma pergunta por tela, dados com fonte real entre elas,
 * contato no meio (o lead já entra no Vortex) e fechamento conforme o investimento:
 * WhatsApp, agenda ou avaliação. Cada etapa vista é contada no Vortex. */

const CHAVE = "veridian-empreenda-v2";
const LOGO = "https://heqrvpoebkmliwnslxpi.supabase.co/storage/v1/object/public/brand-assets/workspaces/veridian/logo.png";

type Estado = { visitante: string; passo: number; r: Respostas; utm: Record<string, string>; nome?: string; contato?: boolean; fim?: boolean };

function novoEstado(): Estado {
  const q = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const k of ["utm_source", "utm_medium", "utm_campaign"]) { const v = q.get(k); if (v) utm[k] = v.slice(0, 120); }
  return { visitante: Math.random().toString(36).slice(2, 12), passo: 0, r: {}, utm };
}
function lerEstado(): Estado {
  try { const s = JSON.parse(localStorage.getItem(CHAVE) || "null"); if (s && typeof s === "object" && s.r) return s; } catch {}
  return novoEstado();
}
function salvar(s: Estado) { try { localStorage.setItem(CHAVE, JSON.stringify(s)); } catch {} }

function registrar(evento: string, utm: Record<string, string>) {
  try {
    fetch("https://vortex.4profitai.com/api/capture/page-event", {
      method: "POST", keepalive: true, headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ event: ("empreenda:" + evento).slice(0, 60), company: "veridian-ai-studio", page_path: "/pt/empreenda", referrer: document.referrer || undefined, ...utm }),
    }).catch(() => {});
  } catch {}
}

async function enviarLead(e: Estado, extra: Record<string, unknown>) {
  return fetch("/api/empreenda", {
    method: "POST", headers: { "Content-Type": "application/json" }, keepalive: true,
    body: JSON.stringify({ respostas: e.r, utm: e.utm, visitante: e.visitante, ...extra }),
  }).then((x) => x.json().catch(() => ({ ok: false }))).catch(() => ({ ok: false }));
}

/* --------------------------------- estilo base -------------------------------- */

const btn =
  "relative w-full overflow-hidden rounded-full bg-green-3 px-6 py-[17px] text-[15px] font-medium tracking-[0.01em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_18px_40px_-18px_rgba(11,74,55,.85)] transition-[transform,background-color,opacity] duration-300 hover:bg-green active:scale-[.985] disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none";
const campoCls =
  "block w-full rounded-2xl border border-line bg-white/80 px-5 py-4 text-[16px] text-graphite outline-none backdrop-blur transition-[border-color,box-shadow] duration-300 placeholder:text-muted/60 focus:border-green focus:shadow-[0_0_0_5px_rgba(15,93,69,.08)]";

function Check({ size = 12 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>;
}

function Titulo({ children, sub }: { children: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="text-center">
      <h1 className="emp-titulo font-cormorant text-[33px] leading-[1.08] tracking-[-0.012em] text-graphite sm:text-[42px]">{children}</h1>
      {sub && <p className="mx-auto mt-4 max-w-[34ch] text-[15.5px] leading-[1.6] text-text">{sub}</p>}
    </div>
  );
}

// Entrada em sequência, só dentro da tela que acabou de chegar.
function Em({ children, i = 0, className = "" }: { children: React.ReactNode; i?: number; className?: string }) {
  return <div className={`emp-em ${className}`} style={{ animationDelay: `${160 + i * 70}ms` }}>{children}</div>;
}

function Progresso({ etapas, idx, onVoltar }: { etapas: Etapa[]; idx: number; onVoltar?: () => void }) {
  const atual = etapas[idx];
  const pct = Math.round((idx / Math.max(1, etapas.length - 1)) * 100);
  return (
    <div className="mx-auto w-full max-w-xl px-5">
      <div className="flex items-center gap-4">
        <button type="button" onClick={onVoltar} disabled={!onVoltar} aria-label="Voltar"
          className="-ml-2 rounded-full p-2 text-muted transition-colors hover:text-green disabled:invisible">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <div className="relative h-[2px] flex-1 rounded-full bg-line">
          {BLOCOS.slice(1).map((_, i) => <span key={i} className="absolute top-1/2 h-[6px] w-px -translate-y-1/2 bg-line-2" style={{ left: `${((i + 1) / BLOCOS.length) * 100}%` }} />)}
          <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-green-3 to-green transition-[width] duration-700 ease-[cubic-bezier(.22,1,.36,1)]" style={{ width: `${pct}%` }} />
          <span className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_0_4px_rgba(184,146,90,.18),0_0_14px_rgba(184,146,90,.7)] transition-[left] duration-700 ease-[cubic-bezier(.22,1,.36,1)]" style={{ left: `${pct}%` }} />
        </div>
        <span className="w-6" />
      </div>
      <p className="mt-3 text-center text-[12.5px] tracking-[0.02em] text-muted">{BLOCOS[atual.bloco]}</p>
    </div>
  );
}

/* ----------------------------------- visuais ---------------------------------- */

function useContagem(alvo: number, ms = 1100, atraso = 0) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0; const t0 = performance.now() + atraso;
    const passo = (t: number) => { const p = Math.min(1, Math.max(0, (t - t0) / ms)); setV(alvo * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(passo); };
    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, [alvo, ms, atraso]);
  return v;
}

// Número em destaque que conta até o valor (quando é um número simples).
function Destaque({ texto, atraso }: { texto: string; atraso: number }) {
  const m = texto.match(/^([^\d]*)([\d.,]+)(.*)$/);
  const alvo = m ? Number(m[2].replace(/\./g, "").replace(",", ".")) : NaN;
  const casas = m && m[2].includes(",") ? m[2].split(",")[1].length : 0;
  const v = useContagem(Number.isFinite(alvo) ? alvo : 0, 1200, atraso);
  if (!m || !Number.isFinite(alvo) || /→/.test(texto)) return <>{texto}</>;
  return <>{m[1]}{v.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas })}{m[3]}</>;
}

function Dados({ lista }: { lista: Dado[] }) {
  return (
    <ul className="divide-y divide-line/80 border-y border-line/80">
      {lista.map((d, i) => (
        <li key={d.texto} className="emp-em grid grid-cols-[minmax(0,7.2rem)_1fr] gap-4 py-5 sm:grid-cols-[9rem_1fr]" style={{ animationDelay: `${220 + i * 140}ms` }}>
          <div className="font-cormorant text-[34px] leading-[0.95] tracking-[-0.02em] text-green sm:text-[40px]"><Destaque texto={d.destaque} atraso={260 + i * 140} /></div>
          <div>
            <p className="text-[14.5px] leading-[1.5] text-graphite">{d.texto}</p>
            <a href={d.url} target="_blank" rel="noopener" className="mt-1.5 inline-block text-[11.5px] text-muted underline decoration-line-2 underline-offset-[3px] transition-colors hover:text-green">{d.fonte}</a>
          </div>
        </li>
      ))}
    </ul>
  );
}

// Mandala: a Veridian no centro, as áreas de uma empresa em volta; pontos dourados
// discretos marcam áreas com parceria aberta.
function Mandala() {
  const N = MANDALA.length, C = 180, R = 118, RL = 152;
  return (
    <figure className="mx-auto w-full max-w-[460px]">
      <svg viewBox="-56 0 472 360" className="w-full" role="img" aria-label="Soluções com IA em todas as áreas de uma empresa">
        <defs>
          <radialGradient id="emp-mg" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#dcebe3" stopOpacity=".9" /><stop offset="100%" stopColor="#dcebe3" stopOpacity="0" /></radialGradient>
        </defs>
        <circle cx={C} cy={C} r="150" fill="url(#emp-mg)" />
        <g className="emp-giro" style={{ transformOrigin: `${C}px ${C}px` }}>
          <circle cx={C} cy={C} r={R + 22} fill="none" stroke="#b8925a" strokeOpacity=".35" strokeWidth=".6" strokeDasharray="1.5 6" />
        </g>
        <circle cx={C} cy={C} r={R} fill="none" stroke="#d5dad5" strokeWidth=".8" className="emp-traco" style={{ ["--len" as string]: `${2 * Math.PI * R}` }} />
        <circle cx={C} cy={C} r="58" fill="none" stroke="#d5dad5" strokeWidth=".6" />
        {MANDALA.map((a, i) => {
          const ang = (i / N) * Math.PI * 2 - Math.PI / 2;
          const x = C + Math.cos(ang) * R, y = C + Math.sin(ang) * R;
          const lx = C + Math.cos(ang) * RL, ly = C + Math.sin(ang) * RL;
          const anchor = Math.abs(Math.cos(ang)) < 0.2 ? "middle" : Math.cos(ang) > 0 ? "start" : "end";
          return (
            <g key={a.t}>
              <line x1={C + Math.cos(ang) * 58} y1={C + Math.sin(ang) * 58} x2={x} y2={y} stroke="#0f5d45" strokeOpacity=".22" strokeWidth=".8"
                className="emp-traco" style={{ ["--len" as string]: "60", animationDelay: `${300 + i * 60}ms` }} />
              <circle cx={x} cy={y} r="5" fill="#fff" stroke="#0f5d45" strokeWidth="1.2" className="emp-no" style={{ animationDelay: `${420 + i * 60}ms`, transformOrigin: `${x}px ${y}px` }} />
              <circle cx={x} cy={y} r="2" fill="#0f5d45" className="emp-no" style={{ animationDelay: `${420 + i * 60}ms`, transformOrigin: `${x}px ${y}px` }} />
              {a.aberta && (
                <circle cx={x + 7} cy={y - 7} r="2.4" fill="#b8925a" className="emp-pulso" style={{ animationDelay: `${1400 + i * 120}ms`, transformOrigin: `${x + 7}px ${y - 7}px` }} />
              )}
              <text x={lx} y={ly + 4} textAnchor={anchor} className="emp-no fill-[#3d4541]" style={{ fontSize: 11.5, fontFamily: "var(--font-inter)", animationDelay: `${520 + i * 60}ms` }}>{a.t}</text>
            </g>
          );
        })}
        <circle cx={C} cy={C} r="40" fill="#0b4a37" />
        <circle cx={C} cy={C} r="40" fill="none" stroke="#b8925a" strokeOpacity=".55" strokeWidth=".8" />
        <image href={LOGO} x={C - 17} y={C - 17} width="34" height="34" />
      </svg>
      <figcaption className="emp-em mt-1 flex items-center justify-center gap-2 text-[12px] text-muted" style={{ animationDelay: "1500ms" }}>
        <span className="h-[5px] w-[5px] rounded-full bg-gold" />Parcerias abertas em algumas áreas
      </figcaption>
    </figure>
  );
}

const ICONES: Record<string, React.ReactNode> = {
  pesquisa: <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>,
  marca: <><path d="M4 20h16" /><path d="M7 16 12 4l5 12" /><path d="M9 11h6" /></>,
  produto: <><rect x="4" y="4" width="16" height="12" rx="2" /><path d="M9 20h6M12 16v4" /></>,
  vendas: <><path d="M4 18 9 12l4 3 7-9" /><path d="M15 6h5v5" /></>,
  operacao: <><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></>,
  gestao: <><path d="M5 20V10M12 20V4M19 20v-7" /></>,
};

function Entregas() {
  return (
    <ul className="divide-y divide-line/80 border-y border-line/80">
      {ENTREGAS.map((x, i) => (
        <li key={x.titulo} className="emp-em flex gap-4 py-4" style={{ animationDelay: `${200 + i * 90}ms` }}>
          <span className="mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-full bg-mint/70 text-green">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{ICONES[x.icone]}</svg>
          </span>
          <div><div className="font-cormorant text-[21px] leading-tight text-graphite">{x.titulo}</div><p className="mt-0.5 text-[13.5px] leading-snug text-muted">{x.texto}</p></div>
        </li>
      ))}
    </ul>
  );
}

function Trilha({ passos, destaqueUltimo }: { passos: { t: string; d?: string }[]; destaqueUltimo?: boolean }) {
  return (
    <ol className="relative pl-9">
      <span className="absolute bottom-4 left-[13px] top-4 w-px bg-gradient-to-b from-green via-sage to-gold/60" />
      {passos.map((p, i) => {
        const ultimo = destaqueUltimo && i === passos.length - 1;
        return (
          <li key={p.t} className="emp-em relative py-3" style={{ animationDelay: `${200 + i * 110}ms` }}>
            <span className={`absolute -left-9 top-[14px] flex h-[27px] w-[27px] items-center justify-center rounded-full text-[11px] ${ultimo ? "bg-gold text-white shadow-[0_0_0_5px_rgba(184,146,90,.15)]" : "border border-green/40 bg-white text-green"}`}>{ultimo ? <Check size={11} /> : i + 1}</span>
            <div className={`font-cormorant text-[21px] leading-tight ${ultimo ? "text-gold" : "text-graphite"}`}>{p.t}</div>
            {p.d && <div className="text-[13.5px] text-muted">{p.d}</div>}
          </li>
        );
      })}
    </ol>
  );
}

function Comparar() {
  const crit = ["Dor real", "Cliente que paga", "Espaço no mercado"];
  const ideias = [{ n: "Ideia A", v: [1, 1, 0] }, { n: "Ideia B", v: [1, 1, 1] }, { n: "Ideia C", v: [1, 0, 0] }];
  return (
    <div className="emp-em rounded-[22px] border border-line bg-white/70 p-5 backdrop-blur" style={{ animationDelay: "200ms" }}>
      <div className="grid grid-cols-[1fr_repeat(3,3.6rem)] items-end gap-y-3 text-center">
        <span />
        {crit.map((c) => <span key={c} className="text-[11px] leading-tight text-muted">{c}</span>)}
        {ideias.map((x, i) => (
          <div key={x.n} className="contents">
            <span className={`text-left text-[15px] ${x.v.every(Boolean) ? "font-medium text-green" : "text-graphite"}`}>{x.n}{x.v.every(Boolean) && <span className="ml-2 rounded-full bg-gold-soft px-2 py-0.5 text-[10.5px] text-gold">mais promissora</span>}</span>
            {x.v.map((ok, j) => (
              <span key={j} className="flex justify-center">
                <span className={`emp-no flex h-6 w-6 items-center justify-center rounded-full ${ok ? "bg-green text-white" : "border border-line-2"}`} style={{ animationDelay: `${450 + (i * 3 + j) * 90}ms` }}>{ok ? <Check size={10} /> : null}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-[11.5px] text-muted">Exemplo ilustrativo</p>
    </div>
  );
}

function Parceiros({ r }: { r: Respostas }) {
  const itens = [
    "Você lidera o negócio e a relação com o mercado",
    "A Veridian entra com produto, marketing, operação e gestão",
    `Juntos, rumo aos ${reais(meta(r))} por mês que você definiu`,
  ];
  return (
    <div className="emp-em relative overflow-hidden rounded-[26px] bg-green-3 p-7 text-white shadow-[0_40px_80px_-40px_rgba(11,74,55,.9)]" style={{ animationDelay: "160ms" }}>
      <div aria-hidden className="absolute inset-[10px] rounded-[18px] border border-gold/35" />
      <div aria-hidden className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(184,146,90,.35),transparent_65%)]" />
      <p className="relative font-cormorant text-[15px] italic text-gold-soft">Seleção aberta</p>
      <p className="relative mt-1 font-cormorant text-[30px] leading-[1.05]">Parceiros estratégicos Veridian</p>
      <ul className="relative mt-5 space-y-3">
        {itens.map((t, i) => (
          <li key={t} className="emp-em flex gap-3 text-[14.5px] leading-snug text-white/90" style={{ animationDelay: `${420 + i * 120}ms` }}>
            <span className="mt-[3px] flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full border border-gold/60 text-gold-soft"><Check size={9} /></span>{t}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Opcao({ on, multi, saindo, onClick, t, d }: { on: boolean; multi?: boolean; saindo?: boolean; onClick: () => void; t: string; d?: string }) {
  return (
    <button type="button" onClick={onClick}
      className={`group flex w-full items-center gap-4 rounded-[18px] border px-5 py-[15px] text-left transition-[transform,background-color,border-color,opacity,box-shadow] duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${
        on ? "border-green-3 bg-green-3 text-white shadow-[0_14px_30px_-16px_rgba(11,74,55,.8)]" : "border-line bg-white/75 text-graphite backdrop-blur hover:-translate-y-[2px] hover:border-sage hover:bg-white hover:shadow-[0_14px_30px_-22px_rgba(20,24,26,.4)]"
      } ${saindo && !on ? "opacity-30" : ""}`}>
      <span className={`flex h-[22px] w-[22px] flex-none items-center justify-center border transition-colors duration-300 ${multi ? "rounded-[7px]" : "rounded-full"} ${on ? "border-white/70 bg-white text-green-3" : "border-line-2 group-hover:border-green/50"}`}>{on && <Check size={11} />}</span>
      <span className="min-w-0">
        <span className="block text-[15.5px] leading-snug">{t}</span>
        {d && <span className={`block text-[13px] ${on ? "text-white/75" : "text-muted"}`}>{d}</span>}
      </span>
    </button>
  );
}

function Faturamento({ valor, onChange }: { valor: number; onChange: (n: number) => void }) {
  const [anual, setAnual] = useState(false);
  const idx = Math.max(0, DEGRAUS_FATURAMENTO.findIndex((d) => d >= valor));
  const pct = (idx / (DEGRAUS_FATURAMENTO.length - 1)) * 100;
  const exibido = anual ? valor * 12 : valor;
  return (
    <div className="space-y-9">
      <div className="emp-em mx-auto flex w-fit rounded-full border border-line bg-white/70 p-1 text-[13.5px] backdrop-blur" style={{ animationDelay: "160ms" }}>
        {(["Por mês", "Por ano"] as const).map((t, i) => (
          <button key={t} type="button" onClick={() => setAnual(i === 1)} className={`rounded-full px-5 py-2 transition-colors duration-300 ${anual === (i === 1) ? "bg-green-3 text-white" : "text-muted hover:text-graphite"}`}>{t}</button>
        ))}
      </div>
      <div className="emp-em text-center" style={{ animationDelay: "240ms" }}>
        <div key={exibido} className="emp-num font-cormorant text-[58px] leading-none tracking-[-0.02em] text-graphite sm:text-[68px]">{reais(exibido)}{valor === DEGRAUS_FATURAMENTO[DEGRAUS_FATURAMENTO.length - 1] && !anual ? "+" : ""}</div>
        <div className="mt-3 text-[13px] text-muted">{anual ? "de faturamento por ano" : "de faturamento por mês"}</div>
      </div>
      <div className="emp-em" style={{ animationDelay: "320ms" }}>
        <input type="range" min={0} max={DEGRAUS_FATURAMENTO.length - 1} step={1} value={idx} onChange={(ev) => onChange(DEGRAUS_FATURAMENTO[Number(ev.target.value)])}
          className="emp-range w-full" style={{ ["--p" as string]: `${pct}%` }} aria-label="Faturamento por mês daqui a 12 meses" />
        <div className="mt-3 flex justify-between text-[12px] text-muted"><span>R$ 5 mil</span><span>R$ 1 milhão ou mais</span></div>
      </div>
    </div>
  );
}

function Moldura({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-[100svh] flex-col bg-studio">
      <div aria-hidden className="pointer-events-none fixed inset-0 bg-[radial-gradient(1100px_520px_at_88%_-12%,rgba(15,93,69,.10),transparent_60%),radial-gradient(820px_460px_at_-6%_108%,rgba(184,146,90,.13),transparent_60%)]" />
      <div aria-hidden className="emp-grao pointer-events-none fixed inset-0 opacity-[.055] mix-blend-multiply" />
      <header className="relative z-10 mx-auto flex w-full max-w-xl items-center justify-between px-5 pb-4 pt-5">
        <a href="/pt" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO} alt="Veridian" className="h-7 w-7 rounded-md object-contain" />
          <span className="font-cormorant text-[19px] text-graphite">Veridian</span>
        </a>
        <span className="font-cormorant text-[16px] italic text-green">Empreenda com IA</span>
      </header>
      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
      <style>{`
        .emp-titulo{text-wrap:balance}
        .emp-grao{background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
        .emp-tela-fwd{animation:emp-fwd .62s cubic-bezier(.22,1,.36,1) both}
        .emp-tela-back{animation:emp-back .62s cubic-bezier(.22,1,.36,1) both}
        .emp-em{animation:emp-em .7s cubic-bezier(.22,1,.36,1) both}
        .emp-no{animation:emp-no .55s cubic-bezier(.34,1.56,.64,1) both}
        .emp-traco{stroke-dasharray:var(--len);stroke-dashoffset:var(--len);animation:emp-traco 1.2s cubic-bezier(.22,1,.36,1) .2s forwards}
        .emp-giro{animation:emp-giro 90s linear infinite}
        .emp-pulso{animation:emp-no .5s ease both, emp-pulso 2.8s ease-in-out 2s infinite}
        .emp-num{animation:emp-num .35s cubic-bezier(.22,1,.36,1)}
        @keyframes emp-fwd{from{opacity:0;transform:translateX(28px);filter:blur(8px)}to{opacity:1;transform:none;filter:none}}
        @keyframes emp-back{from{opacity:0;transform:translateX(-28px);filter:blur(8px)}to{opacity:1;transform:none;filter:none}}
        @keyframes emp-em{from{opacity:0;transform:translateY(14px);filter:blur(4px)}to{opacity:1;transform:none;filter:none}}
        @keyframes emp-no{from{opacity:0;transform:scale(.4)}to{opacity:1;transform:none}}
        @keyframes emp-traco{to{stroke-dashoffset:0}}
        @keyframes emp-giro{to{transform:rotate(360deg)}}
        @keyframes emp-pulso{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.45;transform:scale(1.6)}}
        @keyframes emp-num{from{opacity:.4;transform:translateY(6px)}to{opacity:1;transform:none}}
        .emp-range{-webkit-appearance:none;appearance:none;height:3px;border-radius:9px;background:linear-gradient(90deg,#0b4a37 0,#0f5d45 var(--p),#e3e6e2 var(--p));outline:none}
        .emp-range::-webkit-slider-thumb{-webkit-appearance:none;width:30px;height:30px;border-radius:50%;background:#fff;border:1.5px solid #0f5d45;box-shadow:0 0 0 6px rgba(15,93,69,.08),0 10px 24px -8px rgba(11,74,55,.6);cursor:grab;transition:transform .2s}
        .emp-range::-webkit-slider-thumb:active{transform:scale(1.12);cursor:grabbing}
        .emp-range::-moz-range-thumb{width:28px;height:28px;border-radius:50%;background:#fff;border:1.5px solid #0f5d45;box-shadow:0 0 0 6px rgba(15,93,69,.08)}
        .emp-range:focus-visible::-webkit-slider-thumb{box-shadow:0 0 0 6px rgba(15,93,69,.25)}
        button:focus-visible,a:focus-visible{outline:2px solid #b8925a;outline-offset:3px}
        @media (prefers-reduced-motion: reduce){*{animation-duration:.01ms!important;animation-delay:0ms!important;transition-duration:.01ms!important}}
      `}</style>
    </div>
  );
}

function Rodape({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 mt-auto w-full px-5 pb-5 pt-6 [background:linear-gradient(to_top,var(--color-studio)_55%,transparent)]">
      <div className="mx-auto max-w-xl">{children}</div>
    </div>
  );
}

/* --------------------------------- principal -------------------------------- */

export function FunilEmpreenda() {
  const [e, setE] = useState<Estado | null>(null);
  const [dir, setDir] = useState<"fwd" | "back">("fwd");
  const [saindo, setSaindo] = useState(false);
  const visto = useRef("");

  useEffect(() => {
    // localStorage só existe no navegador: o estado salvo entra depois da hidratação.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setE(lerEstado());
  }, []);

  const etapas = useMemo(() => (e ? etapasVisiveis(e.r) : ETAPAS), [e]);
  const idx = e ? Math.min(e.passo, etapas.length - 1) : 0;
  const etapa = etapas[idx];

  useEffect(() => {
    if (!e || e.fim || visto.current === etapa.id) return;
    visto.current = etapa.id;
    registrar("q:" + etapa.id, e.utm);
  }, [e, etapa]);

  if (!e) return <div className="min-h-[100svh] bg-studio" />;
  const est = e;

  const mudar = (patch: Partial<Estado>) => { const s = { ...est, ...patch }; setE(s); salvar(s); };
  function finalizar(r: Respostas) {
    const s = { ...est, r, fim: true };
    setDir("fwd"); setE(s); salvar(s);
    const d = destino(r);
    registrar("fim:" + d, s.utm);
    void enviarLead(s, { etapa: "final", destino: d });
    window.scrollTo({ top: 0 });
  }
  const avancar = (r: Respostas = est.r) => {
    setSaindo(false);
    const lista = etapasVisiveis(r);
    const pos = lista.findIndex((x) => x.id === etapa.id);
    if (pos >= lista.length - 1) { finalizar(r); return; }
    setDir("fwd");
    mudar({ r, passo: pos + 1 });
    window.scrollTo({ top: 0 });
  };
  const voltar = idx > 0 ? () => { setDir("back"); mudar({ passo: idx - 1 }); } : undefined;
  const escolher = (campo: string, v: string) => { const r = { ...est.r, [campo]: v }; setE({ ...est, r }); setSaindo(true); setTimeout(() => avancar(r), 380); };

  if (est.fim) return <Fechamento e={est} onRefazer={() => { const s = { ...novoEstado(), passo: 0 }; setE(s); salvar(s); }} />;

  let corpo: React.ReactNode = null;
  let rodape: React.ReactNode = null;

  if (etapa.tipo === "faturamento") {
    const valor = Number(est.r[etapa.campo]) || 50000;
    corpo = <><Titulo>{etapa.pergunta}</Titulo><div className="mt-10"><Faturamento valor={valor} onChange={(n) => mudar({ r: { ...est.r, [etapa.campo]: String(n) } })} /></div></>;
    rodape = <button type="button" className={btn} onClick={() => avancar({ ...est.r, [etapa.campo]: String(valor) })}>Continuar</button>;
  } else if (etapa.tipo === "unica") {
    corpo = (
      <>
        <Titulo sub={etapa.ajuda}>{etapa.pergunta}</Titulo>
        <div className="mt-8 space-y-2.5">{etapa.opcoes.map((o, i) => <Em key={o.v} i={i}><Opcao saindo={saindo} on={est.r[etapa.campo] === o.v} onClick={() => !saindo && escolher(etapa.campo, o.v)} t={o.t} d={o.d} /></Em>)}</div>
      </>
    );
  } else if (etapa.tipo === "multipla" || etapa.tipo === "solucoes") {
    const opcoes = etapa.tipo === "solucoes" ? SOLUCOES[String(est.r.area || "outra")] ?? SOLUCOES.outra : etapa.opcoes;
    const marcados = (est.r[etapa.campo] as string[] | undefined) ?? [];
    const outroCampo = etapa.outro;
    const outroTxt = outroCampo ? String(est.r[outroCampo] || "") : "";
    const outroOn = !!outroCampo && est.r[outroCampo + "_on"] === "sim";
    corpo = (
      <>
        <Titulo sub={etapa.ajuda}>{etapa.pergunta}</Titulo>
        <div className="mt-8 space-y-2.5">
          {opcoes.map((o, i) => {
            const on = marcados.includes(o.v);
            return <Em key={o.v} i={i}><Opcao multi on={on} t={o.t} onClick={() => mudar({ r: { ...est.r, [etapa.campo]: on ? marcados.filter((x) => x !== o.v) : [...marcados, o.v] } })} /></Em>;
          })}
          {outroCampo && (
            <Em i={opcoes.length}>
              <Opcao multi on={outroOn} t="Outro (especifique)" onClick={() => mudar({ r: { ...est.r, [outroCampo + "_on"]: outroOn ? "nao" : "sim" } })} />
              {outroOn && <input autoFocus className={`${campoCls} emp-em mt-2.5`} placeholder="Qual?" value={outroTxt} onChange={(x) => mudar({ r: { ...est.r, [outroCampo]: x.target.value.slice(0, 200) } })} />}
            </Em>
          )}
        </div>
      </>
    );
    rodape = <button type="button" className={btn} disabled={!marcados.length && !(outroOn && outroTxt.trim())} onClick={() => avancar()}>Continuar</button>;
  } else if (etapa.tipo === "texto") {
    const v = (est.r[etapa.campo] as string) || "";
    corpo = (
      <>
        <Titulo sub={etapa.ajuda}>{etapa.pergunta}</Titulo>
        <Em i={1}><textarea value={v} onChange={(ev) => mudar({ r: { ...est.r, [etapa.campo]: ev.target.value.slice(0, 500) } })} rows={4} placeholder={etapa.placeholder} autoFocus className={`${campoCls} mt-8 resize-none leading-relaxed`} /></Em>
        <p className="mt-2 text-right text-[11.5px] tabular-nums text-muted">{v.length}/500</p>
      </>
    );
    rodape = <button type="button" className={btn} disabled={v.trim().length < 5} onClick={() => avancar()}>Continuar</button>;
  } else if (etapa.tipo === "frase") {
    const atual = est.r[etapa.campo];
    corpo = (
      <div className="flex min-h-[52svh] flex-col justify-center">
        <p className="text-center font-cormorant text-[17px] italic text-muted">Você se identifica?</p>
        <Em i={0}><blockquote className="relative mx-auto mt-5 max-w-[22ch] text-center font-cormorant text-[34px] leading-[1.15] tracking-[-0.01em] text-graphite sm:text-[40px]">
          <span aria-hidden className="absolute -left-3 -top-7 font-cormorant text-[90px] leading-none text-gold/35 sm:-left-8">“</span>{etapa.frase}
        </blockquote></Em>
        <Em i={2} className="mt-10 grid grid-cols-2 gap-3">
          {[["nao", "Não é o meu caso"], ["sim", "Sim, sou eu"]].map(([v, t]) => (
            <button key={v} type="button" onClick={() => !saindo && escolher(etapa.campo, v)}
              className={`rounded-full border px-4 py-4 text-[15px] transition-all duration-300 ${atual === v ? "border-green-3 bg-green-3 text-white" : saindo ? "border-line bg-white/60 text-muted opacity-40" : "border-line bg-white/75 text-graphite hover:-translate-y-[2px] hover:border-sage"}`}>{t}</button>
          ))}
        </Em>
      </div>
    );
  } else if (etapa.tipo === "info") {
    const area = String(est.r.area || "outra");
    corpo = (
      <>
        <Titulo sub={etapa.texto ? textoDe(etapa.texto, est.r) : undefined}>{textoDe(etapa.titulo, est.r)}</Titulo>
        <div className="mt-9">
          {etapa.visual === "milionarios" && <Dados lista={DADOS.milionarios} />}
          {etapa.visual === "demanda" && <Dados lista={DADOS.demanda} />}
          {etapa.visual === "area" && <Dados lista={DADOS_AREA[area] ?? DADOS.demanda.slice(0, 2)} />}
          {etapa.visual === "mandala" && <Mandala />}
          {etapa.visual === "entregas" && <Entregas />}
          {etapa.visual === "fases" && <Trilha passos={[
            { t: "Launch", d: "Da ideia ao primeiro cliente pagante" },
            { t: "Traction", d: "Produto rodando e receita recorrente crescendo" },
            { t: "Scale", d: "Estruturação do negócio para escalar" },
            { t: "Maturity", d: "Operação em escala" },
          ]} />}
          {etapa.visual === "validacao" && <Trilha destaqueUltimo passos={[
            { t: "Pesquisa de mercado", d: "A dor e a concorrência, com dados e fontes" },
            { t: "Público e proposta de valor", d: "Para quem é e por que vão comprar" },
            { t: "Oferta no ar", d: "Uma página para testar o interesse" },
            { t: "Só então o produto" },
          ]} />}
          {etapa.visual === "comparar" && <Comparar />}
          {etapa.visual === "parceiros" && <Parceiros r={est.r} />}
        </div>
      </>
    );
    rodape = <button type="button" className={btn} onClick={() => avancar()}>Continuar</button>;
  } else if (etapa.tipo === "contato") {
    return (
      <Moldura>
        <Progresso etapas={etapas} idx={idx} onVoltar={voltar} />
        <Contato e={est} dir={dir} onSalvo={(nome) => {
          registrar("contato", est.utm);
          const lista = etapasVisiveis(est.r);
          const pos = lista.findIndex((x) => x.id === "contato");
          setDir("fwd");
          mudar({ nome, contato: true, passo: pos + 1 });
          window.scrollTo({ top: 0 });
        }} />
      </Moldura>
    );
  }

  return (
    <Moldura>
      <Progresso etapas={etapas} idx={idx} onVoltar={voltar} />
      <main key={etapa.id} className={`mx-auto w-full max-w-xl flex-1 px-5 pb-10 pt-9 emp-tela-${dir}`}>{corpo}</main>
      {rodape && <Rodape>{rodape}</Rodape>}
    </Moldura>
  );
}

function Contato({ e, dir, onSalvo }: { e: Estado; dir: "fwd" | "back"; onSalvo: (nome: string) => void }) {
  const [nome, setNome] = useState(e.nome || "");
  const [whats, setWhats] = useState("");
  const [email, setEmail] = useState("");
  const [site, setSite] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const valido = nome.trim().length > 1 && whats.replace(/\D/g, "").length >= 10 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  async function enviar(ev: React.FormEvent) {
    ev.preventDefault();
    if (!valido || enviando) return;
    setErro(""); setEnviando(true);
    const res = await enviarLead(e, { etapa: "contato", nome: nome.trim(), whatsapp: whats, email: email.trim(), website: site });
    setEnviando(false);
    if (!res.ok) { setErro("Não foi possível salvar agora. Confira a conexão e tente de novo."); return; }
    onSalvo(nome.trim());
  }

  return (
    <>
      <main className={`mx-auto w-full max-w-xl flex-1 px-5 pb-10 pt-9 emp-tela-${dir}`}>
        <Titulo sub="Faltam poucas perguntas. Com o seu contato, a equipe da Veridian recebe o seu plano e fala com você pelo WhatsApp.">Para quem preparamos o seu plano?</Titulo>
        <form id="emp-contato" onSubmit={enviar} className="mt-9 space-y-3">
          <Em i={0}><input className={campoCls} placeholder="Seu nome" autoComplete="name" value={nome} onChange={(x) => setNome(x.target.value)} /></Em>
          <Em i={1}><input className={campoCls} placeholder="WhatsApp com DDD" inputMode="tel" autoComplete="tel" value={whats} onChange={(x) => setWhats(x.target.value)} /></Em>
          <Em i={2}><input className={campoCls} placeholder="Seu melhor e-mail" type="email" autoComplete="email" value={email} onChange={(x) => setEmail(x.target.value)} /></Em>
          <input tabIndex={-1} aria-hidden className="hidden" value={site} onChange={(x) => setSite(x.target.value)} name="website" />
          <Em i={3}><p className="flex items-center justify-center gap-2 pt-2 text-[12.5px] text-muted">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
            Seus dados ficam só com a Veridian e são usados apenas para este contato.
          </p></Em>
          {erro && <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>}
        </form>
      </main>
      <Rodape><button type="submit" form="emp-contato" className={btn} disabled={!valido || enviando}>{enviando ? "Salvando…" : "Continuar"}</button></Rodape>
    </>
  );
}

function Fechamento({ e, onRefazer }: { e: Estado; onRefazer: () => void }) {
  const d = destino(e.r);
  const primeiro = (e.nome || "").split(" ")[0];
  const msg = `Olá, Leandro! Sou ${e.nome || ""} e acabei de fazer o Empreenda com IA. Minha meta é ${reais(meta(e.r))} por mês daqui a 12 meses.`;
  const resumo = [
    `Meta de ${reais(meta(e.r))} por mês em 12 meses`,
    e.r.ideia === "definida" ? "Com uma ideia definida" : e.r.ideia === "algumas" ? "Com algumas possibilidades de ideia" : "Pronto para um novo projeto",
  ];
  return (
    <Moldura>
      <main className="emp-tela-fwd mx-auto w-full max-w-xl flex-1 px-5 pb-16 pt-8">
        {d === "whatsapp" && (
          <>
            <Em i={0}><div className="relative overflow-hidden rounded-[28px] bg-green-3 p-8 text-white shadow-[0_50px_90px_-45px_rgba(11,74,55,.95)]">
              <div aria-hidden className="absolute inset-[10px] rounded-[20px] border border-gold/35" />
              <div aria-hidden className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(184,146,90,.4),transparent_65%)]" />
              <p className="relative font-cormorant text-[16px] italic text-gold-soft">{primeiro ? `${primeiro}, parabéns` : "Parabéns"}</p>
              <h1 className="relative mt-2 font-cormorant text-[44px] leading-[1.02] tracking-[-0.015em]">Você foi pré-selecionado</h1>
              <p className="relative mt-4 text-[15.5px] leading-relaxed text-white/85">O seu perfil combina com o que a Veridian procura em um parceiro estratégico. O Leandro, fundador da Veridian, vai falar com você pessoalmente.</p>
            </div></Em>
            <Em i={2}><a href={whatsappUrl(msg)} target="_blank" rel="noopener" onClick={() => registrar("whatsapp", e.utm)} className={`${btn} mt-6 flex items-center justify-center gap-2.5`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Z" /></svg>
              Falar com o Leandro no WhatsApp
            </a></Em>
          </>
        )}

        {d === "agenda" && (
          <>
            <Titulo sub="Escolha um horário. A conversa é por vídeo, leva 30 minutos e o link chega no seu e-mail.">{primeiro ? `${primeiro}, vamos conversar sobre o seu plano` : "Vamos conversar sobre o seu plano"}</Titulo>
            <Em i={2}><div className="mt-8 overflow-hidden rounded-[22px] border border-line bg-white shadow-[0_30px_60px_-40px_rgba(20,24,26,.45)]">
              <iframe src={`${AGENDA_URL}?gv=true`} title="Agendar conversa com a Veridian" className="h-[680px] w-full border-0" />
            </div></Em>
            <a href={AGENDA_URL} target="_blank" rel="noopener" onClick={() => registrar("agenda-aberta", e.utm)} className="mt-4 block text-center text-[13px] text-green underline decoration-line-2 underline-offset-4">Abrir a agenda em outra aba</a>
          </>
        )}

        {d === "avaliar" && (
          <div className="pt-10 text-center">
            <Em i={0}><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-3 text-white shadow-[0_0_0_10px_rgba(15,93,69,.08)]"><Check size={26} /></div></Em>
            <Em i={1}><h1 className="mt-6 font-cormorant text-[40px] leading-[1.05] tracking-[-0.012em] text-graphite">Recebemos o seu perfil</h1></Em>
            <Em i={2}><p className="mx-auto mt-4 max-w-[34ch] text-[15.5px] leading-relaxed text-text">Vamos avaliar as suas respostas e retornamos pelo WhatsApp.</p></Em>
          </div>
        )}

        <Em i={4}><ul className="mt-10 divide-y divide-line/80 border-y border-line/80">
          {resumo.map((t) => <li key={t} className="flex items-center gap-3 py-3.5 text-[14.5px] text-graphite"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-mint text-green"><Check size={10} /></span>{t}</li>)}
        </ul></Em>

        <Em i={5}><div className="mt-6 flex items-center justify-center gap-6 text-[13px]">
          <a href="/pt" className="text-green underline decoration-line-2 underline-offset-4">Conhecer a Veridian</a>
          <button type="button" onClick={onRefazer} className="text-muted underline decoration-line-2 underline-offset-4">Refazer</button>
        </div></Em>
      </main>
    </Moldura>
  );
}
