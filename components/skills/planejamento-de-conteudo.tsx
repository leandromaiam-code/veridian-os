"use client";

import { useEffect, useRef, useState } from "react";

/* Página pública do guia de planejamento de conteúdo com o Claude Code. O download
 * (link assinado) e os comandos só aparecem depois do e-mail: POST /api/skills grava
 * o lead no Vortex. O link do Direct do Instagram traz ?ig=<usuario>. */

const SLUG = "planejamento-de-conteudo";
const CHAVE = "veriddan-skill-" + SLUG;
const LOGO = "https://heqrvpoebkmliwnslxpi.supabase.co/storage/v1/object/public/brand-assets/workspaces/veridian/logo.png";
const PEDIDO =
  "Use a skill planejamento-de-conteudo e monte um plano de 2 semanas para o Instagram da minha clínica de fisioterapia. Público: mulheres de 35 a 55 anos com dor nas costas. Objetivo: crescer. Quatro posts por semana, com pelo menos dois Reels.";

type Liberado = { download: string; comandos: { mac: string; windows: string } };

function registrar(evento: string, utm: Record<string, string>) {
  try {
    fetch("https://vortex.4profitai.com/api/capture/page-event", {
      method: "POST", keepalive: true, headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ event: ("skill:" + SLUG + ":" + evento).slice(0, 60), company: "veridian-ai-studio", page_path: "/skills/" + SLUG, referrer: document.referrer || undefined, ...utm }),
    }).catch(() => {});
  } catch {}
}

function Copiar({ texto, claro = false }: { texto: string; claro?: boolean }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      onClick={() => { navigator.clipboard?.writeText(texto).then(() => { setOk(true); setTimeout(() => setOk(false), 1600); }).catch(() => {}); }}
      className={`shrink-0 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${claro ? "border-line text-muted hover:border-green hover:text-green" : "border-white/15 text-white/80 hover:border-white/40 hover:text-white"}`}
    >
      {ok ? "Copiado" : "Copiar"}
    </button>
  );
}

function Codigo({ texto }: { texto: string }) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-2xl bg-[#0f1714] px-4 py-3.5">
      <code className="min-w-0 flex-1 break-all font-mono text-[12.5px] leading-6 text-white/95">{texto}</code>
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
  const [so, setSo] = useState<"mac" | "windows">("mac");
  const ig = useRef("");
  const utm = useRef<Record<string, string>>({});

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    ig.current = (q.get("ig") || "").slice(0, 40);
    for (const k of ["utm_source", "utm_medium", "utm_campaign"]) { const v = q.get(k); if (v) utm.current[k] = v.slice(0, 120); }
    if (!utm.current.utm_source && ig.current) { utm.current.utm_source = "instagram"; utm.current.utm_medium = "direct"; utm.current.utm_campaign = "skill-" + SLUG; }
    if (/windows/i.test(navigator.userAgent)) setSo("windows");
    try { const s = JSON.parse(localStorage.getItem(CHAVE) || "null"); if (s?.download) setLiberado(s); } catch {}
    registrar("view", utm.current);
  }, []);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) { setErro("Confira o e-mail."); return; }
    setEnviando(true);
    const r = await fetch("/api/skills", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skill: SLUG, email: email.trim(), ig: ig.current, utm: utm.current, website: hp }),
    }).then((x) => x.json()).catch(() => ({ ok: false }));
    setEnviando(false);
    if (!r?.ok || !r.download) { setErro("Não consegui liberar agora. Tente de novo em instantes."); return; }
    const l = { download: r.download as string, comandos: r.comandos as Liberado["comandos"] };
    setLiberado(l);
    try { localStorage.setItem(CHAVE, JSON.stringify(l)); } catch {}
    registrar("liberou", utm.current);
  }

  if (liberado) {
    return (
      <div className="rounded-[28px] border border-line bg-surface p-6 shadow-[0_30px_80px_-40px_rgba(11,74,55,.45)] sm:p-8">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-green">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-mint text-green"><Check /></span>
          Guia liberado
        </div>
        <a href={liberado.download} onClick={() => registrar("baixou", utm.current)}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-green-3 px-6 py-[17px] text-[15px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_18px_40px_-18px_rgba(11,74,55,.85)] transition-colors hover:bg-green">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12m0 0-5-5m5 5 5-5M4 21h16" /></svg>
          Baixar a skill (.zip)
        </a>
        <p className="mt-6 text-[15px] font-medium text-graphite">Ou instale direto pelo terminal</p>
        <div className="mt-3 inline-flex rounded-full border border-line bg-soft p-1 text-[12.5px]">
          {(["mac", "windows"] as const).map((s) => (
            <button key={s} type="button" onClick={() => setSo(s)}
              className={`rounded-full px-3.5 py-1.5 transition-colors ${so === s ? "bg-white text-graphite shadow-sm" : "text-muted hover:text-graphite"}`}>
              {s === "mac" ? "Mac e Linux" : "Windows (PowerShell)"}
            </button>
          ))}
        </div>
        <div className="mt-3"><Codigo texto={liberado.comandos[so]} /></div>
        <p className="mt-3 text-[13px] leading-relaxed text-muted">
          Baixou o .zip? Descompacte a pasta <span className="font-mono text-graphite">planejamento-de-conteudo</span> dentro de <span className="font-mono text-graphite">{so === "mac" ? "~/.claude/skills" : "C:\\Users\\<você>\\.claude\\skills"}</span>.
        </p>
        <a href="#como-usar" className="mt-5 inline-flex text-[14px] font-medium text-green underline decoration-green/30 underline-offset-4 hover:decoration-green">Ver como usar ↓</a>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="rounded-[28px] border border-line bg-surface p-6 shadow-[0_30px_80px_-40px_rgba(11,74,55,.45)] sm:p-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold">Guia + skill</p>
      <h2 className="mt-3 font-cormorant text-[30px] leading-[1.08] text-graphite">Receba o guia completo</h2>
      <p className="mt-3 text-[14.5px] leading-relaxed text-text">Deixe o seu e-mail e o download da skill, com as instruções de uso, aparece aqui na hora.</p>
      <label className="mt-6 block">
        <span className="sr-only">E-mail</span>
        <input type="email" inputMode="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com"
          className="block w-full rounded-2xl border border-line bg-white px-5 py-4 text-[16px] text-graphite outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-muted/60 focus:border-green focus:shadow-[0_0_0_5px_rgba(15,93,69,.08)]" />
      </label>
      <input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} name="website" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      {erro && <p className="mt-3 text-[13.5px] text-[#a33a2b]">{erro}</p>}
      <button type="submit" disabled={enviando}
        className="mt-4 w-full rounded-full bg-green-3 px-6 py-[17px] text-[15px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_18px_40px_-18px_rgba(11,74,55,.85)] transition-[transform,background-color,opacity] duration-300 hover:bg-green active:scale-[.985] disabled:opacity-50">
        {enviando ? "Liberando…" : "Liberar o guia"}
      </button>
      <p className="mt-4 text-center text-[12.5px] leading-relaxed text-muted">Grátis. O e-mail serve para mandarmos as próximas skills da Veriddan.</p>
    </form>
  );
}

const ORDEM: [string, string][] = [
  ["Público", "Quem decide, em que situação está e como fala."],
  ["Dor, desejo ou necessidade", "O que a pessoa quer conquistar, entender ou evitar antes de ver o post."],
  ["Objetivo", "Crescer, engajar ou converter: um por peça, com como medir."],
  ["Estratégia", "Proporção de funções, mensagem, cadência e o papel de cada CTA."],
  ["Tática", "Formato, modelo de composição e estilo que servem ao objetivo."],
  ["Tema", "Uma pauta específica, com descoberta e recompensa."],
  ["Headline", "Quatro caminhos, nota em dez critérios, só passa com 4 ou mais."],
  ["Conteúdo", "Abertura que para o dedo, progressão, revelação e uma ação."],
  ["Pesquisa", "Só no fim, para sustentar cada afirmação com fonte."],
];

const SAI: [string, string][] = [
  ["Direção da rodada", "Público, interesses, objetivo e o mix de funções, com as quantidades somadas."],
  ["Calendário em tabela", "Data, público, interesse, objetivo, formato e modelo, tema, headline e CTA de cada post."],
  ["Headlines avaliadas", "Quatro alternativas por peça, com nota e justificativa em dez critérios."],
  ["Roteiros e legendas", "Os Reels plano a plano e as legendas das peças que você pedir."],
  ["Pendências", "O que precisa ser decidido ou verificado antes de produzir."],
];

const PERGUNTAS: [string, string][] = [
  ["Preciso pagar alguma coisa?", "Não. O guia e a skill são grátis. Você só precisa do Claude Code instalado, que funciona com a sua assinatura do Claude."],
  ["Funciona para qualquer nicho?", "Sim. A skill não traz nicho nenhum embutido: ela parte do público e da oferta que você descrever."],
  ["A skill publica alguma coisa?", "Não. Ela planeja. Não produz mídia, não agenda e não publica. Você continua decidindo o que vai ao ar."],
  ["Posso usar fora do Claude Code?", "Os arquivos são texto. Dá para colar o SKILL.md como instrução em outra IA, mas a skill foi feita para o Claude Code, que a carrega sozinho quando o pedido combina."],
];

export function SkillPlanejamento() {
  return (
    <main className="min-h-screen bg-studio text-graphite">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <a href="/pt" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO} alt="Veriddan" width={28} height={28} className="h-7 w-7 rounded-md" />
          <span className="font-cormorant text-[21px] tracking-[-0.01em] text-graphite">Veriddan</span>
        </a>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Skills</span>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-6 sm:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)] lg:gap-14 lg:pb-24 lg:pt-14">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-green">Guia + skill para o Claude Code</p>
          <h1 className="mt-5 font-cormorant text-[44px] leading-[1.02] tracking-[-0.015em] text-graphite sm:text-[58px]">
            Planejamento de conteúdo com o Claude Code.
          </h1>
          <p className="mt-6 max-w-[54ch] text-[17px] leading-[1.65] text-text">
            Pedir para a IA &quot;melhorar o texto&quot; deixa o texto bonito e o plano vazio. Esta skill faz o Claude Code planejar na ordem certa: começa por quem você quer alcançar e o que essa pessoa quer, e só no fim escreve a headline e o post.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {["Calendário pronto em tabela", "Headlines com nota", "Roteiros de Reels", "Qualquer nicho"].map((t) => (
              <li key={t} className="flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 text-[13px] text-text">
                <span className="text-green"><Check /></span>{t}
              </li>
            ))}
          </ul>
        </div>
        <div id="baixar" className="min-w-0 lg:sticky lg:top-8 lg:self-start">
          <Portao />
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">O método</p>
          <h2 className="mt-4 max-w-[24ch] font-cormorant text-[36px] leading-[1.06] text-graphite sm:text-[44px]">Nove etapas, nesta ordem. Nenhuma é pulada.</h2>
          <p className="mt-4 max-w-[60ch] text-[15.5px] leading-[1.65] text-text">O erro mais comum é o caminho inverso: achar uma notícia curiosa e inventar por que o público se importaria. Aqui a pauta nasce do interesse da pessoa.</p>
          <ol className="mt-10 grid gap-3 sm:grid-cols-3">
            {ORDEM.map(([t, d], i) => (
              <li key={t} className="rounded-3xl border border-line bg-studio/60 p-5">
                <span className="font-mono text-[12px] text-green">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-cormorant text-[24px] leading-tight text-graphite">{t}</h3>
                <p className="mt-1.5 text-[14px] leading-[1.6] text-text">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="como-usar" className="mx-auto max-w-6xl scroll-mt-6 px-5 py-16 sm:px-8 lg:py-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">Como usar</p>
        <h2 className="mt-4 font-cormorant text-[36px] leading-[1.06] text-graphite sm:text-[44px]">Do download ao plano pronto.</h2>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-line bg-surface p-6">
            <span className="font-mono text-[12px] text-muted">01</span>
            <h3 className="mt-3 font-cormorant text-[26px] leading-tight">Instale</h3>
            <p className="mt-2 text-[14.5px] leading-[1.65] text-text">Libere o guia acima e rode o comando no terminal, ou baixe o .zip e descompacte a pasta em <span className="font-mono text-[13px] text-graphite">~/.claude/skills</span>. Não precisa reiniciar nada.</p>
          </div>
          <div className="rounded-3xl border border-line bg-surface p-6">
            <span className="font-mono text-[12px] text-muted">02</span>
            <h3 className="mt-3 font-cormorant text-[26px] leading-tight">Abra o Claude Code</h3>
            <p className="mt-2 text-[14.5px] leading-[1.65] text-text">No terminal, digite <span className="font-mono text-[13px] text-graphite">claude</span> numa pasta do seu projeto. Se tiver um arquivo com o seu público, oferta ou posts antigos, deixe na pasta: a skill lê antes de planejar.</p>
          </div>
          <div className="rounded-3xl border border-line bg-surface p-6">
            <span className="font-mono text-[12px] text-muted">03</span>
            <h3 className="mt-3 font-cormorant text-[26px] leading-tight">Peça o plano</h3>
            <p className="mt-2 text-[14.5px] leading-[1.65] text-text">Diga quem é o público, o objetivo e quantos posts por semana. A skill entra sozinha quando o pedido é de plano, pauta, calendário ou headline.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-3xl bg-green-3 p-7 text-white">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sage">Exemplo de pedido</p>
              <Copiar texto={PEDIDO} />
            </div>
            <p className="mt-4 text-[16px] leading-[1.7] text-white/90">&ldquo;{PEDIDO}&rdquo;</p>
          </div>
          <div className="rounded-3xl border border-line bg-surface p-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">O que sai</p>
            <ul className="mt-4 space-y-3.5">
              {SAI.map(([t, d]) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-1 text-green"><Check /></span>
                  <span className="text-[14.5px] leading-[1.6] text-text"><span className="font-medium text-graphite">{t}.</span> {d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-line bg-surface p-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">O que vem no pacote</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["SKILL.md", "O método completo, etapa por etapa, e as regras da peça pública."],
              ["headlines-e-qualidade.md", "Os dez critérios de nota e a regra de escolha da headline."],
              ["modelos-e-reels.md", "17 modelos de composição e como dirigir um Reel."],
              ["estrategia-e-ctas.md", "Fases da marca, CTA por objetivo e o que medir."],
            ].map(([f, d]) => (
              <div key={f}>
                <p className="font-mono text-[13px] text-graphite">{f}</p>
                <p className="mt-1.5 text-[14px] leading-[1.6] text-text">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:py-20">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">Dúvidas</p>
            <h2 className="mt-4 font-cormorant text-[36px] leading-[1.06] text-graphite sm:text-[44px]">Antes de baixar</h2>
            <a href="#baixar" className="mt-8 inline-flex rounded-full bg-green-3 px-6 py-3.5 text-[14.5px] font-medium text-white transition-colors hover:bg-green">Receber o guia</a>
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
        <span>studio.veriddan.com</span>
      </footer>
    </main>
  );
}
