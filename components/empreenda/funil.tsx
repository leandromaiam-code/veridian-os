"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BLOCOS, DEGRAUS_FATURAMENTO, ETAPAS, MODULOS, PORTFOLIO, etapasVisiveis, montarPerfil, reais, type Etapa, type Respostas } from "@/lib/empreenda";
import { whatsappUrl } from "@/lib/i18n";

/* Funil "Empreenda com IA": uma pergunta por tela, telas de reforço com o que a
 * Veridian faz de verdade, cadastro no fim e o perfil de founder montado com as
 * respostas. Cada etapa vista é contada no Vortex (Growth Project Veridian). */

const CHAVE = "veridian-empreenda-v1";
const LOGO = "https://heqrvpoebkmliwnslxpi.supabase.co/storage/v1/object/public/brand-assets/workspaces/veridian/logo.png";

type Estado = { visitante: string; passo: number; r: Respostas; utm: Record<string, string>; enviado?: boolean; nome?: string };

function lerEstado(): Estado {
  try {
    const s = JSON.parse(localStorage.getItem(CHAVE) || "null");
    if (s && typeof s === "object" && s.r) return s;
  } catch {}
  const q = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const utm: Record<string, string> = {};
  for (const k of ["utm_source", "utm_medium", "utm_campaign"]) { const v = q.get(k); if (v) utm[k] = v.slice(0, 120); }
  return { visitante: Math.random().toString(36).slice(2, 12), passo: 0, r: {}, utm };
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

/* ---------------------------------- peças ---------------------------------- */

const btn = "w-full rounded-2xl bg-green px-5 py-4 text-[15px] font-semibold text-white shadow-[0_10px_30px_-12px_rgba(15,93,69,.7)] transition-all hover:bg-green-2 active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none";
const card = "rounded-2xl border border-line bg-surface";

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
            return (
              <div key={nome} className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                <div className="h-full rounded-full bg-gradient-to-r from-green to-green-2 transition-all duration-700" style={{ width: `${pct}%` }} />
              </div>
            );
          })}
        </div>
        <span className="w-9" />
      </div>
      <p className="mt-2.5 text-center font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted">{BLOCOS[atual.bloco]}</p>
    </div>
  );
}

function Revela({ children, i = 0, className = "" }: { children: React.ReactNode; i?: number; className?: string }) {
  return <div className={`animate-[emp-up_.55s_var(--ease-organic)_both] ${className}`} style={{ animationDelay: `${120 + i * 90}ms` }}>{children}</div>;
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
      <p className="col-span-full mt-2 text-center text-sm text-muted">{PORTFOLIO.length} startups no portfólio da Veridian</p>
    </div>
  );
}

function Modulos() {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {MODULOS.map((m, i) => (
        <Revela key={m.nome} i={i}>
          <div className={`${card} h-full p-3.5`}>
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-cormorant text-xl text-graphite">{m.nome}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-gold">{m.papel}</span>
            </div>
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

function Caminhos() {
  const c = [
    { t: "Construir a sua ideia", d: "Você traz a ideia. A Veridian valida o mercado, constrói o produto e cuida de marketing e operação.", tag: "Tenho uma ideia" },
    { t: "Liderar um projeto da Veridian", d: "A Veridian seleciona founders para projetos que já passaram pela pesquisa. Você assume o negócio.", tag: "Não tenho ideia" },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {c.map((x, i) => (
        <Revela key={x.t} i={i}>
          <div className={`${card} h-full p-5`}>
            <span className="rounded-full bg-mint px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-green">{x.tag}</span>
            <div className="mt-3 font-cormorant text-[22px] leading-tight text-graphite">{x.t}</div>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{x.d}</p>
          </div>
        </Revela>
      ))}
    </div>
  );
}

function PerfilParcial({ r }: { r: Respostas }) {
  const p = montarPerfil(r);
  const linhas = [
    ["Caminho", p.caminhoTitulo],
    ["Perfil", p.arquetipo],
    ["Pontos fortes", p.fortes.join(" · ") || "—"],
    ["Setores", p.setores.join(" · ") || "—"],
  ];
  return (
    <div className={`${card} overflow-hidden`}>
      <div className="bg-gradient-to-br from-green-3 to-green px-5 py-4 text-white">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-soft">Perfil de founder · prévia</p>
        <p className="mt-1 font-cormorant text-2xl">{p.arquetipo}</p>
      </div>
      <div className="divide-y divide-line">
        {linhas.map(([k, v], i) => (
          <Revela key={k} i={i}>
            <div className="flex gap-4 px-5 py-3 text-sm"><span className="w-28 flex-none text-muted">{k}</span><span className="text-graphite">{v}</span></div>
          </Revela>
        ))}
      </div>
    </div>
  );
}

function Opcao({ on, multi, onClick, t, d }: { on: boolean; multi?: boolean; onClick: () => void; t: string; d?: string }) {
  return (
    <button type="button" onClick={onClick}
      className={`group flex w-full items-center gap-3.5 rounded-2xl border px-4 py-3.5 text-left transition-all duration-200 ${on ? "border-green bg-mint/60 shadow-[0_6px_20px_-12px_rgba(15,93,69,.6)]" : "border-line bg-surface hover:-translate-y-px hover:border-sage hover:shadow-[0_8px_24px_-16px_rgba(20,24,26,.35)]"}`}>
      <span className={`flex h-5 w-5 flex-none items-center justify-center border-2 transition-colors ${multi ? "rounded-md" : "rounded-full"} ${on ? "border-green bg-green text-white" : "border-line-2 group-hover:border-sage"}`}>{on && <Check size={11} />}</span>
      <span>
        <span className="block text-[15px] font-medium text-graphite">{t}</span>
        {d && <span className="block text-[13px] text-muted">{d}</span>}
      </span>
    </button>
  );
}

/* --------------------------------- principal -------------------------------- */

export function FunilEmpreenda() {
  const [e, setE] = useState<Estado | null>(null);
  const [fase, setFase] = useState<"quiz" | "analise" | "resultado">("quiz");
  const visto = useRef("");

  useEffect(() => {
    const s = lerEstado();
    // localStorage só existe no navegador: o estado salvo entra depois da hidratação.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setE(s);
    if (s.enviado) setFase("resultado");
  }, []);

  const etapas = useMemo(() => (e ? etapasVisiveis(e.r) : ETAPAS), [e]);
  const idx = e ? Math.min(e.passo, etapas.length - 1) : 0;
  const etapa = etapas[idx];

  useEffect(() => {
    if (!e || fase !== "quiz" || visto.current === etapa.id) return;
    visto.current = etapa.id;
    registrar("q:" + etapa.id, e.utm);
  }, [e, etapa, fase]);

  if (!e) return <div className="min-h-[100svh] bg-studio" />;

  const mudar = (patch: Partial<Estado>) => { const s = { ...e, ...patch }; setE(s); salvar(s); };
  const avancar = (r: Respostas = e.r) => {
    const lista = etapasVisiveis(r);
    const pos = lista.findIndex((x) => x.id === etapa.id);
    mudar({ r, passo: Math.min(pos + 1, lista.length - 1) });
    window.scrollTo({ top: 0 });
  };
  const voltar = idx > 0 ? () => mudar({ passo: idx - 1 }) : undefined;
  const escolher = (campo: string, v: string) => { const r = { ...e.r, [campo]: v }; setE({ ...e, r }); setTimeout(() => avancar(r), 240); };

  if (fase === "analise") return <Analise r={e.r} onPronto={() => setFase("resultado")} />;
  if (fase === "resultado") return <Resultado e={e} onRefazer={() => { const s = { ...lerEstadoNovo(e), passo: 0 }; setE(s); salvar(s); setFase("quiz"); }} />;

  let corpo: React.ReactNode = null;
  let rodape: React.ReactNode = null;

  if (etapa.tipo === "faturamento") {
    const valor = Number(e.r[etapa.campo]) || 50000;
    corpo = (
      <>
        <Titulo>{etapa.pergunta}</Titulo>
        <div className="mt-8"><Faturamento valor={valor} onChange={(n) => mudar({ r: { ...e.r, [etapa.campo]: String(n) } })} /></div>
      </>
    );
    rodape = <button type="button" className={btn} onClick={() => avancar({ ...e.r, [etapa.campo]: String(valor) })}>Continuar</button>;
  } else if (etapa.tipo === "unica") {
    corpo = (
      <>
        <Titulo>{etapa.pergunta}</Titulo>
        {etapa.ajuda && <p className="mt-3 text-center text-sm text-muted">{etapa.ajuda}</p>}
        <div className="mt-7 space-y-2.5">
          {etapa.opcoes.map((o, i) => <Revela key={o.v} i={i}><Opcao on={e.r[etapa.campo] === o.v} onClick={() => escolher(etapa.campo, o.v)} t={o.t} d={o.d} /></Revela>)}
        </div>
      </>
    );
  } else if (etapa.tipo === "multipla") {
    const marcados = (e.r[etapa.campo] as string[] | undefined) ?? [];
    const cheio = !!etapa.max && marcados.length >= etapa.max;
    corpo = (
      <>
        <Titulo>{etapa.pergunta}</Titulo>
        {etapa.ajuda && <p className="mt-3 text-center text-sm text-muted">{etapa.ajuda}</p>}
        <div className="mt-7 space-y-2.5">
          {etapa.opcoes.map((o, i) => {
            const on = marcados.includes(o.v);
            return <Revela key={o.v} i={i}><Opcao multi on={on} t={o.t} onClick={() => {
              if (!on && cheio) return;
              mudar({ r: { ...e.r, [etapa.campo]: on ? marcados.filter((x) => x !== o.v) : [...marcados, o.v] } });
            }} /></Revela>;
          })}
        </div>
      </>
    );
    rodape = <button type="button" className={btn} disabled={!marcados.length} onClick={() => avancar()}>Continuar</button>;
  } else if (etapa.tipo === "texto") {
    const v = (e.r[etapa.campo] as string) || "";
    corpo = (
      <>
        <Titulo>{etapa.pergunta}</Titulo>
        {etapa.ajuda && <p className="mt-3 text-center text-sm text-muted">{etapa.ajuda}</p>}
        <textarea value={v} onChange={(ev) => mudar({ r: { ...e.r, [etapa.campo]: ev.target.value.slice(0, 400) } })} rows={4} placeholder={etapa.placeholder} autoFocus
          className="mt-7 block w-full resize-none rounded-2xl border border-line bg-surface px-4 py-3.5 text-[15px] text-graphite outline-none transition-shadow placeholder:text-muted/70 focus:border-green focus:shadow-[0_0_0_4px_rgba(15,93,69,.1)]" />
        <p className="mt-1.5 text-right font-mono text-[10.5px] text-muted">{v.length}/400</p>
      </>
    );
    rodape = <button type="button" className={btn} disabled={v.trim().length < 5} onClick={() => avancar()}>Continuar</button>;
  } else if (etapa.tipo === "frase") {
    corpo = (
      <>
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.2em] text-gold">Você se identifica?</p>
        <Revela><blockquote className="relative mt-6 rounded-3xl border border-line bg-surface px-7 py-9 text-center font-cormorant text-[27px] leading-snug text-graphite shadow-[0_20px_50px_-30px_rgba(20,24,26,.45)]">
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-cormorant text-6xl leading-none text-gold">“</span>
          {etapa.frase}
        </blockquote></Revela>
        <div className="mt-7 grid grid-cols-2 gap-3">
          {[["nao", "Não é o meu caso"], ["sim", "Sim, sou eu"]].map(([v, t]) => (
            <button key={v} type="button" onClick={() => escolher(etapa.campo, v)}
              className={`rounded-2xl border px-4 py-4 text-[15px] font-semibold transition-all ${e.r[etapa.campo] === v ? "border-green bg-green text-white" : "border-line bg-surface text-graphite hover:border-sage"}`}>{t}</button>
          ))}
        </div>
      </>
    );
  } else if (etapa.tipo === "info") {
    corpo = (
      <>
        <Titulo eyebrow="Veridian AI Studio">{etapa.titulo}</Titulo>
        {etapa.texto && <p className="mx-auto mt-4 max-w-md text-center text-[15px] leading-relaxed text-text">{etapa.texto}</p>}
        <div className="mt-7">
          {etapa.visual === "portfolio" && <Portfolio />}
          {etapa.visual === "modulos" && <Modulos />}
          {etapa.visual === "fases" && <Fases />}
          {etapa.visual === "validacao" && <Validacao />}
          {etapa.visual === "caminhos" && <Caminhos />}
          {etapa.visual === "perfil" && <PerfilParcial r={e.r} />}
        </div>
      </>
    );
    rodape = <button type="button" className={btn} onClick={() => avancar()}>Continuar</button>;
  } else if (etapa.tipo === "contato") {
    return <Contato e={e} voltar={voltar} etapas={etapas} idx={idx} onEnviado={(nome) => { mudar({ enviado: true, nome }); registrar("cadastro", e.utm); setFase("analise"); }} />;
  }

  return (
    <Moldura>
      <Progresso etapas={etapas} idx={idx} onVoltar={voltar} />
      <main key={etapa.id} className="mx-auto w-full max-w-xl flex-1 animate-[emp-in_.4s_var(--ease-organic)] px-4 pb-8 pt-8">{corpo}</main>
      {rodape && (
        <div className="sticky bottom-0 mt-auto w-full border-t border-line bg-studio/90 px-4 py-3.5 backdrop-blur">
          <div className="mx-auto max-w-xl">{rodape}</div>
        </div>
      )}
    </Moldura>
  );
}

function lerEstadoNovo(e: Estado): Estado { return { visitante: e.visitante, passo: 0, r: {}, utm: e.utm }; }

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
        @keyframes emp-spin{to{transform:rotate(360deg)}}
        @media (prefers-reduced-motion: reduce){*{animation-duration:.01ms!important;animation-delay:0ms!important;transition-duration:.01ms!important}}
      `}</style>
    </div>
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
          <button key={t} type="button" onClick={() => setAnual(i === 1)}
            className={`rounded-full px-5 py-2 transition-colors ${anual === (i === 1) ? "bg-green text-white" : "text-muted hover:text-graphite"}`}>{t}</button>
        ))}
      </div>
      <div className="text-center">
        <div className="font-cormorant text-[52px] leading-none text-graphite">{reais(exibido)}{valor === DEGRAUS_FATURAMENTO[DEGRAUS_FATURAMENTO.length - 1] && !anual ? "+" : ""}</div>
        <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{anual ? "de faturamento por ano" : "de faturamento por mês"}</div>
      </div>
      <input type="range" min={0} max={DEGRAUS_FATURAMENTO.length - 1} step={1} value={idx}
        onChange={(ev) => onChange(DEGRAUS_FATURAMENTO[Number(ev.target.value)])}
        className="w-full accent-[var(--color-green)]" aria-label="Faturamento por mês daqui a 12 meses" />
      <div className="flex justify-between font-mono text-[11px] text-muted"><span>R$ 5 mil</span><span>R$ 1 milhão+</span></div>
      <p className="text-center text-[13px] text-muted">Por mês, daqui a 12 meses. Arraste para ajustar.</p>
    </div>
  );
}

function Contato({ e, voltar, etapas, idx, onEnviado }: { e: Estado; voltar?: () => void; etapas: Etapa[]; idx: number; onEnviado: (nome: string) => void }) {
  const [nome, setNome] = useState(e.nome || "");
  const [whats, setWhats] = useState("");
  const [email, setEmail] = useState("");
  const [site, setSite] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const digitos = whats.replace(/\D/g, "");
  const valido = nome.trim().length > 1 && digitos.length >= 10 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  async function enviar(ev: React.FormEvent) {
    ev.preventDefault();
    if (!valido || enviando) return;
    setErro(""); setEnviando(true);
    const res = await fetch("/api/empreenda", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: nome.trim(), whatsapp: whats, email: email.trim(), respostas: e.r, utm: e.utm, visitante: e.visitante, website: site }),
    }).then((x) => x.json().catch(() => ({ ok: false }))).catch(() => ({ ok: false }));
    setEnviando(false);
    if (!res.ok) { setErro("Não conseguimos registrar agora. Tente de novo em instantes."); return; }
    onEnviado(nome.trim());
  }

  const campo = "block w-full rounded-2xl border border-line bg-surface px-4 py-3.5 text-[15px] text-graphite outline-none transition-shadow placeholder:text-muted/70 focus:border-green focus:shadow-[0_0_0_4px_rgba(15,93,69,.1)]";
  return (
    <Moldura>
      <Progresso etapas={etapas} idx={idx} onVoltar={voltar} />
      <main className="mx-auto w-full max-w-xl flex-1 animate-[emp-in_.4s_var(--ease-organic)] px-4 pb-8 pt-8">
        <Titulo eyebrow="Último passo">Para onde enviamos o seu resultado?</Titulo>
        <p className="mx-auto mt-4 max-w-md text-center text-[15px] text-text">Você vê o seu perfil de founder na próxima tela, e a equipe da Veridian fala com você pelo WhatsApp.</p>
        <form id="emp-contato" onSubmit={enviar} className="mt-7 space-y-3">
          <input className={campo} placeholder="Seu nome" autoComplete="name" value={nome} onChange={(x) => setNome(x.target.value)} />
          <input className={campo} placeholder="WhatsApp com DDD" inputMode="tel" autoComplete="tel" value={whats} onChange={(x) => setWhats(x.target.value)} />
          <input className={campo} placeholder="Seu melhor e-mail" type="email" autoComplete="email" value={email} onChange={(x) => setEmail(x.target.value)} />
          <input tabIndex={-1} aria-hidden className="hidden" value={site} onChange={(x) => setSite(x.target.value)} name="website" />
          <p className="flex items-center justify-center gap-2 pt-1 text-[12px] text-muted">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
            Seus dados ficam só com a Veridian e são usados apenas para este contato.
          </p>
          {erro && <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}
        </form>
      </main>
      <div className="sticky bottom-0 mt-auto w-full border-t border-line bg-studio/90 px-4 py-3.5 backdrop-blur">
        <div className="mx-auto max-w-xl"><button type="submit" form="emp-contato" className={btn} disabled={!valido || enviando}>{enviando ? "Enviando…" : "Ver meu perfil de founder"}</button></div>
      </div>
    </Moldura>
  );
}

function Analise({ r, onPronto }: { r: Respostas; onPronto: () => void }) {
  const p = montarPerfil(r);
  const linhas = [
    "Lendo as suas respostas",
    "Identificando os seus pontos fortes",
    p.setores.length ? `Cruzando com os setores: ${p.setores.slice(0, 3).join(", ")}` : "Cruzando com os setores do portfólio",
    "Escolhendo o melhor caminho para você",
    "Montando o seu perfil de founder",
  ];
  const [pct, setPct] = useState(0);
  useEffect(() => {
    if (pct >= 100) { const t = setTimeout(onPronto, 650); return () => clearTimeout(t); }
    const t = setTimeout(() => setPct((x) => Math.min(100, x + 1)), 55);
    return () => clearTimeout(t);
  }, [pct, onPronto]);
  const linha = Math.min(linhas.length - 1, Math.floor(pct / (100 / linhas.length)));
  return (
    <Moldura>
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center px-5 pt-10">
        <Titulo eyebrow="Analisando">Montando o seu perfil de founder</Titulo>
        <div className="relative mt-10 flex h-44 w-44 items-center justify-center rounded-full" style={{ background: `conic-gradient(var(--color-green) ${pct * 3.6}deg, var(--color-line) 0deg)` }}>
          <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-studio">
            <span className="font-cormorant text-5xl text-graphite">{pct}%</span>
          </div>
        </div>
        <ul className="mt-10 w-full space-y-3">
          {linhas.map((t, i) => (
            <li key={t} className={`flex items-center gap-3 text-[14.5px] transition-colors ${i < linha ? "text-text" : i === linha ? "font-semibold text-graphite" : "text-muted/60"}`}>
              <span className={`flex h-6 w-6 flex-none items-center justify-center rounded-full ${i < linha ? "bg-green text-white" : i === linha ? "border-2 border-green border-t-transparent animate-[emp-spin_.8s_linear_infinite]" : "border border-line-2"}`}>{i < linha && <Check size={11} />}</span>
              {t}
            </li>
          ))}
        </ul>
      </main>
    </Moldura>
  );
}

function Resultado({ e, onRefazer }: { e: Estado; onRefazer: () => void }) {
  const p = montarPerfil(e.r);
  const primeiro = (e.nome || "").split(" ")[0];
  const mensagem = `Olá! Sou ${e.nome || ""} e acabei de fazer o Empreenda com IA. Meu perfil: ${p.arquetipo}. Caminho: ${p.caminhoTitulo}.`;
  useEffect(() => { registrar("resultado", e.utm); }, [e.utm]);
  return (
    <Moldura>
      <main className="mx-auto w-full max-w-xl flex-1 px-4 pb-14 pt-6">
        <Revela><p className="text-center font-mono text-[11px] uppercase tracking-[0.22em] text-gold">{primeiro ? `${primeiro}, este é o seu resultado` : "Seu resultado"}</p></Revela>

        <Revela i={1}><div className="mt-5 overflow-hidden rounded-3xl bg-gradient-to-br from-green-3 via-green to-green-2 p-7 text-white shadow-[0_30px_60px_-30px_rgba(11,74,55,.8)]">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-gold-soft">Seu perfil de founder</p>
          <h1 className="mt-2 font-cormorant text-[40px] leading-none">{p.arquetipo}</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-white/85">{p.arquetipoTexto}</p>
          {!!p.fortes.length && <div className="mt-5 flex flex-wrap gap-2">{p.fortes.map((f) => <span key={f} className="rounded-full bg-white/12 px-3 py-1 text-[12.5px] ring-1 ring-white/20">{f}</span>)}</div>}
        </div></Revela>

        <Revela i={2}><section className={`${card} mt-4 p-6`}>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-gold">Caminho indicado</p>
          <h2 className="mt-1.5 font-cormorant text-[26px] leading-tight text-graphite">{p.caminhoTitulo}</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-text">{p.caminhoTexto}</p>
          {Number(e.r.faturamento_12m) > 0 && (
            <p className="mt-4 rounded-xl bg-mint/60 px-4 py-3 text-[14px] text-green-3">Sua meta: <strong>{reais(Number(e.r.faturamento_12m))} por mês</strong> daqui a 12 meses.</p>
          )}
          {typeof e.r.ideia_frase === "string" && e.r.ideia_frase && (
            <blockquote className="mt-4 rounded-xl bg-soft px-4 py-3 text-[14px] italic text-text">“{e.r.ideia_frase}”</blockquote>
          )}
        </section></Revela>

        <Revela i={3}><section className={`${card} mt-4 p-6`}>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-gold">{p.combinam.length ? "No portfólio, nos setores que você escolheu" : "O portfólio da Veridian"}</p>
          <div className="mt-4 grid gap-2.5">
            {(p.combinam.length ? p.combinam : PORTFOLIO.slice(0, 4)).map((x) => (
              <div key={x.id} className="flex items-center gap-3 rounded-xl border border-line px-3 py-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={x.logo} alt="" className="h-9 w-9 rounded-lg object-contain" loading="lazy" />
                <div><div className="text-[14.5px] font-semibold text-graphite">{x.nome}</div><div className="text-[12.5px] text-muted">{x.linha}</div></div>
              </div>
            ))}
          </div>
        </section></Revela>

        <Revela i={4}><section className={`${card} mt-4 p-6`}>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-gold">Próximos passos</p>
          <ol className="mt-4 space-y-3">
            {p.proximos.map((t, i) => (
              <li key={t} className="flex gap-3">
                <span className={`flex h-7 w-7 flex-none items-center justify-center rounded-full font-mono text-[11px] ${i === 0 ? "bg-green text-white" : "bg-mint text-green"}`}>{i === 0 ? <Check size={11} /> : i + 1}</span>
                <span className="pt-0.5 text-[15px] text-graphite">{t}</span>
              </li>
            ))}
          </ol>
        </section></Revela>

        <Revela i={5}>
          <a href={whatsappUrl(mensagem)} target="_blank" rel="noopener" onClick={() => registrar("whatsapp", e.utm)}
            className={`${btn} mt-6 flex items-center justify-center gap-2`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" /></svg>
            Falar agora com a Veridian
          </a>
        </Revela>
        <Revela i={6}><div className="mt-4 flex items-center justify-center gap-5 text-[13px]">
          <a href="/pt" className="text-green underline-offset-4 hover:underline">Conhecer a Veridian</a>
          <button type="button" onClick={onRefazer} className="text-muted underline-offset-4 hover:underline">Refazer o teste</button>
        </div></Revela>
      </main>
    </Moldura>
  );
}

