"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AGENDA_URL, BLOCOS, DADOS, DADOS_AREA, DEGRAUS_FATURAMENTO, ETAPAS, MODULOS, PORTFOLIO, SOLUCOES,
  destino, etapasVisiveis, meta, reais, textoDe, type Dado, type Etapa, type Respostas,
} from "@/lib/empreenda";
import { whatsappUrl } from "@/lib/i18n";

/* Funil "Empreenda com IA". Uma pergunta por tela, telas com dados de fonte real
 * entre elas, contato no meio (o lead já entra no Vortex) e fechamento conforme o
 * investimento: WhatsApp, agenda ou avaliação. Cada etapa vista é contada no Vortex. */

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

/* ---------------------------------- peças ---------------------------------- */

const btn = "w-full rounded-2xl bg-green px-5 py-4 text-[15px] font-semibold text-white shadow-[0_10px_30px_-12px_rgba(15,93,69,.7)] transition-all hover:bg-green-2 active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none";
const card = "rounded-2xl border border-line bg-surface";
const campoCls = "block w-full rounded-2xl border border-line bg-surface px-4 py-3.5 text-[15px] text-graphite outline-none transition-shadow placeholder:text-muted/70 focus:border-green focus:shadow-[0_0_0_4px_rgba(15,93,69,.1)]";

function Check({ size = 12 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>;
}

function Titulo({ children, eyebrow }: { children: React.ReactNode; eyebrow?: string }) {
  return (
    <div className="text-center">
      {eyebrow && <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-gold">{eyebrow}</p>}
      <h1 className="font-cormorant text-[30px] leading-[1.12] text-graphite sm:text-[36px]">{children}</h1>
    </div>
  );
}

function Revela({ children, i = 0, className = "" }: { children: React.ReactNode; i?: number; className?: string }) {
  return <div className={`animate-[emp-up_.55s_var(--ease-organic)_both] ${className}`} style={{ animationDelay: `${120 + i * 90}ms` }}>{children}</div>;
}

function Progresso({ etapas, idx, onVoltar }: { etapas: Etapa[]; idx: number; onVoltar?: () => void }) {
  const atual = etapas[idx];
  return (
    <div className="mx-auto w-full max-w-xl px-4">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onVoltar} disabled={!onVoltar} aria-label="Voltar"
          className="rounded-full p-2 text-muted transition-colors hover:bg-mint hover:text-green disabled:invisible">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <div className="flex flex-1 gap-1.5">
          {BLOCOS.map((nome, b) => {
            const doBloco = etapas.filter((e) => e.bloco === b);
            const feitas = doBloco.filter((e) => etapas.indexOf(e) < idx).length;
            const pct = b < atual.bloco ? 100 : b > atual.bloco ? 0 : Math.round((feitas / Math.max(1, doBloco.length)) * 100);
            return <div key={nome} className="h-1.5 flex-1 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-gradient-to-r from-green to-green-2 transition-all duration-700" style={{ width: `${pct}%` }} /></div>;
          })}
        </div>
        <span className="w-9" />
      </div>
      <p className="mt-2.5 text-center font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted">{BLOCOS[atual.bloco]}</p>
    </div>
  );
}

function Dados({ lista }: { lista: Dado[] }) {
  return (
    <div className="space-y-3">
      {lista.map((d, i) => (
        <Revela key={d.texto} i={i}>
          <div className={`${card} p-5`}>
            <div className="font-cormorant text-[34px] leading-none text-green">{d.destaque}</div>
            <p className="mt-2 text-[14.5px] leading-snug text-graphite">{d.texto}</p>
            <a href={d.url} target="_blank" rel="noopener" className="mt-2 inline-block font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted underline-offset-2 hover:underline">Fonte: {d.fonte}</a>
          </div>
        </Revela>
      ))}
    </div>
  );
}

function Portfolio() {
  return (
    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
      {PORTFOLIO.map((p, i) => (
        <Revela key={p.id} i={i}>
          <div className={`${card} flex h-full flex-col items-center gap-2 px-2 py-3.5 text-center`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.logo} alt="" className="h-9 w-9 rounded-lg object-contain" loading="lazy" />
            <span className="text-[12.5px] font-semibold text-graphite">{p.nome}</span>
          </div>
        </Revela>
      ))}
      <p className="col-span-full mt-2 text-center text-sm text-muted">{PORTFOLIO.length} startups no portfólio · {MODULOS.length} módulos de IA</p>
    </div>
  );
}

function Modulos() {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {MODULOS.map((m, i) => (
        <Revela key={m.nome} i={i}>
          <div className={`${card} h-full p-3.5`}>
            <div className="flex items-baseline justify-between gap-2"><span className="font-cormorant text-xl text-graphite">{m.nome}</span><span className="font-mono text-[10px] uppercase tracking-[0.14em] text-gold">{m.papel}</span></div>
            <p className="mt-1 text-[12.5px] leading-snug text-muted">{m.texto}</p>
          </div>
        </Revela>
      ))}
    </div>
  );
}

function Fases() {
  const f = [
    { n: "Launch", t: "Da ideia ao primeiro cliente pagante" },
    { n: "Traction", t: "Produto rodando e receita recorrente crescendo" },
    { n: "Scale", t: "Estruturação do negócio e preparação para escala" },
    { n: "Maturity", t: "Operação em escala" },
  ];
  return (
    <ol className="relative space-y-3 pl-7">
      <span className="absolute bottom-3 left-[11px] top-3 w-px bg-gradient-to-b from-green via-sage to-line" />
      {f.map((x, i) => (
        <Revela key={x.n} i={i}>
          <li className={`${card} relative p-4`}>
            <span className="absolute -left-[26px] top-4 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-green font-mono text-[10px] text-white">{i + 1}</span>
            <div className="font-cormorant text-xl text-graphite">{x.n}</div>
            <div className="text-sm text-muted">{x.t}</div>
          </li>
        </Revela>
      ))}
    </ol>
  );
}

function Validacao() {
  const p = ["Pesquisa de mercado e da dor, com fontes", "Público, posicionamento e proposta de valor", "Página da oferta no ar", "Só então o produto"];
  return (
    <div className="space-y-2.5">
      {p.map((t, i) => (
        <Revela key={t} i={i}>
          <div className={`${card} flex items-center gap-3 p-4`}>
            <span className={`flex h-8 w-8 flex-none items-center justify-center rounded-full ${i < 3 ? "bg-mint text-green" : "bg-gold-soft text-gold"}`}>{i < 3 ? <Check /> : <span className="font-mono text-xs">→</span>}</span>
            <span className="text-[15px] text-graphite">{t}</span>
          </div>
        </Revela>
      ))}
    </div>
  );
}

function Parceiros({ r }: { r: Respostas }) {
  const itens = [
    "Você lidera o negócio e o relacionamento com o mercado",
    "A Veridian entra com produto, marketing, operação e gestão",
    `O objetivo é chegar aos ${reais(meta(r))} por mês que você definiu`,
  ];
  return (
    <div className={`${card} overflow-hidden`}>
      <div className="bg-gradient-to-br from-green-3 to-green px-5 py-4 text-white">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-soft">Seleção aberta</p>
        <p className="mt-1 font-cormorant text-2xl">Parceiros estratégicos Veridian</p>
      </div>
      <ul className="divide-y divide-line">
        {itens.map((t, i) => (
          <Revela key={t} i={i}><li className="flex gap-3 px-5 py-3.5 text-[14.5px] text-graphite"><span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-mint text-green"><Check size={10} /></span>{t}</li></Revela>
        ))}
      </ul>
    </div>
  );
}

function Opcao({ on, multi, onClick, t, d }: { on: boolean; multi?: boolean; onClick: () => void; t: string; d?: string }) {
  return (
    <button type="button" onClick={onClick}
      className={`group flex w-full items-center gap-3.5 rounded-2xl border px-4 py-3.5 text-left transition-all duration-200 ${on ? "border-green bg-mint/60 shadow-[0_6px_20px_-12px_rgba(15,93,69,.6)]" : "border-line bg-surface hover:-translate-y-px hover:border-sage hover:shadow-[0_8px_24px_-16px_rgba(20,24,26,.35)]"}`}>
      <span className={`flex h-5 w-5 flex-none items-center justify-center border-2 transition-colors ${multi ? "rounded-md" : "rounded-full"} ${on ? "border-green bg-green text-white" : "border-line-2 group-hover:border-sage"}`}>{on && <Check size={11} />}</span>
      <span><span className="block text-[15px] font-medium text-graphite">{t}</span>{d && <span className="block text-[13px] text-muted">{d}</span>}</span>
    </button>
  );
}

function Faturamento({ valor, onChange }: { valor: number; onChange: (n: number) => void }) {
  const [anual, setAnual] = useState(false);
  const idx = Math.max(0, DEGRAUS_FATURAMENTO.findIndex((d) => d >= valor));
  const exibido = anual ? valor * 12 : valor;
  return (
    <div className="space-y-7">
      <div className="mx-auto flex w-fit rounded-full border border-line bg-surface p-1 text-sm font-medium">
        {(["Por mês", "Por ano"] as const).map((t, i) => (
          <button key={t} type="button" onClick={() => setAnual(i === 1)} className={`rounded-full px-5 py-2 transition-colors ${anual === (i === 1) ? "bg-green text-white" : "text-muted hover:text-graphite"}`}>{t}</button>
        ))}
      </div>
      <div className="text-center">
        <div className="font-cormorant text-[52px] leading-none text-graphite">{reais(exibido)}{valor === DEGRAUS_FATURAMENTO[DEGRAUS_FATURAMENTO.length - 1] && !anual ? "+" : ""}</div>
        <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{anual ? "de faturamento por ano" : "de faturamento por mês"}</div>
      </div>
      <input type="range" min={0} max={DEGRAUS_FATURAMENTO.length - 1} step={1} value={idx} onChange={(ev) => onChange(DEGRAUS_FATURAMENTO[Number(ev.target.value)])}
        className="w-full accent-[var(--color-green)]" aria-label="Faturamento por mês daqui a 12 meses" />
      <div className="flex justify-between font-mono text-[11px] text-muted"><span>R$ 5 mil</span><span>R$ 1 milhão+</span></div>
      <p className="text-center text-[13px] text-muted">Arraste para ajustar.</p>
    </div>
  );
}

function Moldura({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-[100svh] flex-col bg-studio">
      <div aria-hidden className="pointer-events-none fixed inset-0 bg-[radial-gradient(900px_420px_at_85%_-10%,rgba(15,93,69,.09),transparent),radial-gradient(700px_380px_at_0%_110%,rgba(184,146,90,.10),transparent)]" />
      <header className="relative z-10 mx-auto flex w-full max-w-xl items-center justify-between px-4 pb-3 pt-4">
        <a href="/pt" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO} alt="Veridian" className="h-7 w-7 rounded-md object-contain" />
          <span className="font-cormorant text-lg text-graphite">Veridian</span>
        </a>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-green">Empreenda com IA</span>
      </header>
      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
      <style>{`
        @keyframes emp-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        @keyframes emp-up{from{opacity:0;transform:translateY(12px) scale(.985)}to{opacity:1;transform:none}}
        @media (prefers-reduced-motion: reduce){*{animation-duration:.01ms!important;animation-delay:0ms!important;transition-duration:.01ms!important}}
      `}</style>
    </div>
  );
}

function Rodape({ children }: { children: React.ReactNode }) {
  return <div className="sticky bottom-0 mt-auto w-full border-t border-line bg-studio/90 px-4 py-3.5 backdrop-blur"><div className="mx-auto max-w-xl">{children}</div></div>;
}

/* --------------------------------- principal -------------------------------- */

export function FunilEmpreenda() {
  const [e, setE] = useState<Estado | null>(null);
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
    setE(s); salvar(s);
    const d = destino(r);
    registrar("fim:" + d, s.utm);
    void enviarLead(s, { etapa: "final", destino: d });
    window.scrollTo({ top: 0 });
  }
  const avancar = (r: Respostas = est.r) => {
    const lista = etapasVisiveis(r);
    const pos = lista.findIndex((x) => x.id === etapa.id);
    if (pos >= lista.length - 1) { finalizar(r); return; }
    mudar({ r, passo: pos + 1 });
    window.scrollTo({ top: 0 });
  };
  const voltar = idx > 0 ? () => mudar({ passo: idx - 1 }) : undefined;
  const escolher = (campo: string, v: string) => { const r = { ...est.r, [campo]: v }; setE({ ...est, r }); setTimeout(() => avancar(r), 240); };

  if (est.fim) return <Fechamento e={est} onRefazer={() => { const s = { ...novoEstado(), passo: 0 }; setE(s); salvar(s); }} />;

  let corpo: React.ReactNode = null;
  let rodape: React.ReactNode = null;

  if (etapa.tipo === "faturamento") {
    const valor = Number(est.r[etapa.campo]) || 50000;
    corpo = <><Titulo>{etapa.pergunta}</Titulo><div className="mt-8"><Faturamento valor={valor} onChange={(n) => mudar({ r: { ...est.r, [etapa.campo]: String(n) } })} /></div></>;
    rodape = <button type="button" className={btn} onClick={() => avancar({ ...est.r, [etapa.campo]: String(valor) })}>Continuar</button>;
  } else if (etapa.tipo === "unica") {
    corpo = (
      <>
        <Titulo>{etapa.pergunta}</Titulo>
        {etapa.ajuda && <p className="mt-3 text-center text-sm text-muted">{etapa.ajuda}</p>}
        <div className="mt-7 space-y-2.5">{etapa.opcoes.map((o, i) => <Revela key={o.v} i={i}><Opcao on={est.r[etapa.campo] === o.v} onClick={() => escolher(etapa.campo, o.v)} t={o.t} d={o.d} /></Revela>)}</div>
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
        <Titulo>{etapa.pergunta}</Titulo>
        {etapa.ajuda && <p className="mt-3 text-center text-sm text-muted">{etapa.ajuda}</p>}
        <div className="mt-7 space-y-2.5">
          {opcoes.map((o, i) => {
            const on = marcados.includes(o.v);
            return <Revela key={o.v} i={i}><Opcao multi on={on} t={o.t} onClick={() => mudar({ r: { ...est.r, [etapa.campo]: on ? marcados.filter((x) => x !== o.v) : [...marcados, o.v] } })} /></Revela>;
          })}
          {outroCampo && (
            <Revela i={opcoes.length}>
              <Opcao multi on={outroOn} t="Outro (especifique)" onClick={() => mudar({ r: { ...est.r, [outroCampo + "_on"]: outroOn ? "nao" : "sim" } })} />
              {outroOn && <input autoFocus className={`${campoCls} mt-2.5`} placeholder="Qual?" value={outroTxt} onChange={(x) => mudar({ r: { ...est.r, [outroCampo]: x.target.value.slice(0, 200) } })} />}
            </Revela>
          )}
        </div>
      </>
    );
    rodape = <button type="button" className={btn} disabled={!marcados.length && !(outroOn && outroTxt.trim())} onClick={() => avancar()}>Continuar</button>;
  } else if (etapa.tipo === "texto") {
    const v = (est.r[etapa.campo] as string) || "";
    corpo = (
      <>
        <Titulo>{etapa.pergunta}</Titulo>
        {etapa.ajuda && <p className="mt-3 text-center text-sm text-muted">{etapa.ajuda}</p>}
        <textarea value={v} onChange={(ev) => mudar({ r: { ...est.r, [etapa.campo]: ev.target.value.slice(0, 500) } })} rows={4} placeholder={etapa.placeholder} autoFocus className={`${campoCls} mt-7 resize-none`} />
        <p className="mt-1.5 text-right font-mono text-[10.5px] text-muted">{v.length}/500</p>
      </>
    );
    rodape = <button type="button" className={btn} disabled={v.trim().length < 5} onClick={() => avancar()}>Continuar</button>;
  } else if (etapa.tipo === "frase") {
    corpo = (
      <>
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.2em] text-gold">Você se identifica?</p>
        <Revela><blockquote className="relative mt-6 rounded-3xl border border-line bg-surface px-7 py-9 text-center font-cormorant text-[27px] leading-snug text-graphite shadow-[0_20px_50px_-30px_rgba(20,24,26,.45)]">
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-cormorant text-6xl leading-none text-gold">“</span>{etapa.frase}
        </blockquote></Revela>
        <div className="mt-7 grid grid-cols-2 gap-3">
          {[["nao", "Não é o meu caso"], ["sim", "Sim, sou eu"]].map(([v, t]) => (
            <button key={v} type="button" onClick={() => escolher(etapa.campo, v)} className={`rounded-2xl border px-4 py-4 text-[15px] font-semibold transition-all ${est.r[etapa.campo] === v ? "border-green bg-green text-white" : "border-line bg-surface text-graphite hover:border-sage"}`}>{t}</button>
          ))}
        </div>
      </>
    );
  } else if (etapa.tipo === "info") {
    const area = String(est.r.area || "outra");
    corpo = (
      <>
        <Titulo eyebrow="Veridian AI Studio">{textoDe(etapa.titulo, est.r)}</Titulo>
        {etapa.texto && <p className="mx-auto mt-4 max-w-md text-center text-[15px] leading-relaxed text-text">{textoDe(etapa.texto, est.r)}</p>}
        <div className="mt-7">
          {etapa.visual === "milionarios" && <Dados lista={DADOS.milionarios} />}
          {etapa.visual === "demanda" && <Dados lista={DADOS.demanda} />}
          {etapa.visual === "area" && <Dados lista={DADOS_AREA[area] ?? DADOS.demanda.slice(0, 2)} />}
          {(etapa.visual === "portfolio" || etapa.visual === "projetos") && <Portfolio />}
          {etapa.visual === "modulos" && <Modulos />}
          {etapa.visual === "fases" && <Fases />}
          {etapa.visual === "validacao" && <Validacao />}
          {etapa.visual === "parceiros" && <Parceiros r={est.r} />}
        </div>
      </>
    );
    rodape = <button type="button" className={btn} onClick={() => avancar()}>Continuar</button>;
  } else if (etapa.tipo === "contato") {
    return (
      <Moldura>
        <Progresso etapas={etapas} idx={idx} onVoltar={voltar} />
        <Contato e={est} onSalvo={(nome) => {
          registrar("contato", est.utm);
          const lista = etapasVisiveis(est.r);
          const pos = lista.findIndex((x) => x.id === "contato");
          mudar({ nome, contato: true, passo: pos + 1 });
          window.scrollTo({ top: 0 });
        }} />
      </Moldura>
    );
  }

  return (
    <Moldura>
      <Progresso etapas={etapas} idx={idx} onVoltar={voltar} />
      <main key={etapa.id} className="mx-auto w-full max-w-xl flex-1 animate-[emp-in_.4s_var(--ease-organic)] px-4 pb-8 pt-8">{corpo}</main>
      {rodape && <Rodape>{rodape}</Rodape>}
    </Moldura>
  );
}

function Contato({ e, onSalvo }: { e: Estado; onSalvo: (nome: string) => void }) {
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
    if (!res.ok) { setErro("Não conseguimos salvar agora. Tente de novo em instantes."); return; }
    onSalvo(nome.trim());
  }

  return (
    <>
      <main className="mx-auto w-full max-w-xl flex-1 animate-[emp-in_.4s_var(--ease-organic)] px-4 pb-8 pt-8">
        <Titulo eyebrow="Salve o seu progresso">Para quem preparamos o seu plano?</Titulo>
        <p className="mx-auto mt-4 max-w-md text-center text-[15px] text-text">Faltam poucas perguntas. Com o seu contato, a equipe da Veridian recebe o seu plano e fala com você pelo WhatsApp.</p>
        <form id="emp-contato" onSubmit={enviar} className="mt-7 space-y-3">
          <input className={campoCls} placeholder="Seu nome" autoComplete="name" value={nome} onChange={(x) => setNome(x.target.value)} />
          <input className={campoCls} placeholder="WhatsApp com DDD" inputMode="tel" autoComplete="tel" value={whats} onChange={(x) => setWhats(x.target.value)} />
          <input className={campoCls} placeholder="Seu melhor e-mail" type="email" autoComplete="email" value={email} onChange={(x) => setEmail(x.target.value)} />
          <input tabIndex={-1} aria-hidden className="hidden" value={site} onChange={(x) => setSite(x.target.value)} name="website" />
          <p className="flex items-center justify-center gap-2 pt-1 text-[12px] text-muted">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
            Seus dados ficam só com a Veridian e são usados apenas para este contato.
          </p>
          {erro && <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}
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
    `Meta: ${reais(meta(e.r))} por mês em 12 meses`,
    e.r.ideia === "definida" ? "Com uma ideia definida" : e.r.ideia === "algumas" ? "Com algumas possibilidades de ideia" : "Pronto para um novo projeto",
  ];
  return (
    <Moldura>
      <main className="mx-auto w-full max-w-xl flex-1 px-4 pb-14 pt-6">
        <Revela><p className="text-center font-mono text-[11px] uppercase tracking-[0.22em] text-gold">{primeiro ? `${primeiro}, obrigado` : "Obrigado"}</p></Revela>

        {d === "whatsapp" && (
          <>
            <Revela i={1}><div className="mt-5 rounded-3xl bg-gradient-to-br from-green-3 via-green to-green-2 p-7 text-white shadow-[0_30px_60px_-30px_rgba(11,74,55,.8)]">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-gold-soft">Perfil de parceiro estratégico</p>
              <h1 className="mt-2 font-cormorant text-[38px] leading-[1.05]">Você foi pré-selecionado</h1>
              <p className="mt-3 text-[15px] leading-relaxed text-white/85">O seu perfil combina com o que a Veridian procura. O Leandro, fundador da Veridian, vai falar com você pessoalmente.</p>
            </div></Revela>
            <Revela i={2}><a href={whatsappUrl(msg)} target="_blank" rel="noopener" onClick={() => registrar("whatsapp", e.utm)} className={`${btn} mt-6 flex items-center justify-center gap-2`}>Falar agora com o Leandro no WhatsApp</a></Revela>
          </>
        )}

        {d === "agenda" && (
          <>
            <Revela i={1}><div className="mt-4"><Titulo>Vamos conversar sobre o seu plano</Titulo></div></Revela>
            <Revela i={2}><p className="mx-auto mt-4 max-w-md text-center text-[15px] text-text">Escolha um horário. A conversa é por vídeo, leva 30 minutos e o link chega no seu e-mail.</p></Revela>
            <Revela i={3}><div className={`${card} mt-6 overflow-hidden`}>
              <iframe src={`${AGENDA_URL}?gv=true`} title="Agendar conversa com a Veridian" className="h-[640px] w-full border-0" />
            </div></Revela>
            <Revela i={4}><a href={AGENDA_URL} target="_blank" rel="noopener" onClick={() => registrar("agenda-aberta", e.utm)} className="mt-3 block text-center text-[13px] text-green underline-offset-4 hover:underline">Abrir a agenda em outra aba</a></Revela>
          </>
        )}

        {d === "avaliar" && (
          <Revela i={1}><div className={`${card} mt-5 p-7 text-center`}>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mint text-green"><Check size={24} /></div>
            <h1 className="mt-4 font-cormorant text-[32px] leading-tight text-graphite">Recebemos o seu perfil</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-text">Vamos avaliar o seu perfil e retornamos pelo WhatsApp.</p>
          </div></Revela>
        )}

        <Revela i={5}><section className={`${card} mt-4 p-6`}>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-gold">O seu ponto de partida</p>
          <ul className="mt-3 space-y-2">{resumo.map((t) => <li key={t} className="flex gap-2.5 text-[14.5px] text-graphite"><span className="mt-1 text-green"><Check size={12} /></span>{t}</li>)}</ul>
        </section></Revela>

        <Revela i={6}><div className="mt-5 flex items-center justify-center gap-5 text-[13px]">
          <a href="/pt" className="text-green underline-offset-4 hover:underline">Conhecer a Veridian</a>
          <button type="button" onClick={onRefazer} className="text-muted underline-offset-4 hover:underline">Refazer</button>
        </div></Revela>
      </main>
    </Moldura>
  );
}
