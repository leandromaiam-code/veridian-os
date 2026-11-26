"use client";

import { useEffect, useRef, useState } from "react";

/* Página pública da skill self-learning-agent. O comando de instalação só aparece
 * depois do e-mail: POST /api/skills grava o lead no Vortex e devolve os comandos.
 * O link do Direct do Instagram traz ?ig=<usuario>, que vai junto com o lead. */

const SLUG = "self-learning-agent";
const CHAVE = "veriddan-skill-" + SLUG;
const LOGO = "https://heqrvpoebkmliwnslxpi.supabase.co/storage/v1/object/public/brand-assets/workspaces/veridian/logo.png";

type Liberado = { comandos: string[]; repo: string };

function registrar(evento: string, utm: Record<string, string>) {
  try {
    fetch("https://vortex.4profitai.com/api/capture/page-event", {
      method: "POST", keepalive: true, headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ event: ("skill:" + SLUG + ":" + evento).slice(0, 60), company: "veridian-ai-studio", page_path: "/skills/" + SLUG, referrer: document.referrer || undefined, ...utm }),
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
      {ok ? "Copiado" : "Copiar"}
    </button>
  );
}

function Codigo({ texto }: { texto: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-[#0f1714] px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,.06)]">
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
    if (!utm.current.utm_source && ig.current) { utm.current.utm_source = "instagram"; utm.current.utm_medium = "direct"; utm.current.utm_campaign = "skill-" + SLUG; }
    try { const s = JSON.parse(localStorage.getItem(CHAVE) || "null"); if (s?.comandos?.length) setLiberado(s); } catch {}
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
    if (!r?.ok || !r.comandos) { setErro("Não consegui liberar agora. Tente de novo em instantes."); return; }
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
          Instalação liberada
        </div>
        <ol className="mt-6 space-y-6">
          <li>
            <p className="text-[15px] font-medium text-graphite">1. Instale a skill</p>
            <p className="mt-1 text-[14px] leading-relaxed text-text">No terminal, com o Claude Code já logado:</p>
            <div className="mt-3"><Codigo texto={liberado.comandos[0]} /></div>
          </li>
          <li>
            <p className="text-[15px] font-medium text-graphite">2. Veja o que ele faria</p>
            <p className="mt-1 text-[14px] leading-relaxed text-text">Uma previsão lida só dos arquivos. Não chama o modelo e não grava nada.</p>
            <div className="mt-3"><Codigo texto={liberado.comandos[1]} /></div>
          </li>
          <li>
            <p className="text-[15px] font-medium text-graphite">3. Peça ao Claude Code</p>
            <p className="mt-1 text-[14px] leading-relaxed text-text">
              Escreva <span className="rounded-md bg-soft px-1.5 py-0.5 font-mono text-[13px] text-graphite">learn from our sessions</span>. A skill entra sozinha.
            </p>
          </li>
        </ol>
        <a href={liberado.repo} target="_blank" rel="noopener noreferrer"
          className="mt-7 inline-flex items-center gap-2 text-[14px] font-medium text-green underline decoration-green/30 underline-offset-4 transition-colors hover:decoration-green">
          Código completo e documentação no GitHub
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="rounded-[28px] border border-line bg-surface p-6 shadow-[0_30px_80px_-40px_rgba(11,74,55,.45)] sm:p-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold">Instalação</p>
      <h2 className="mt-3 font-cormorant text-[30px] leading-[1.08] text-graphite">Receba o comando de instalação</h2>
      <p className="mt-3 text-[14.5px] leading-relaxed text-text">Deixe o seu e-mail e o passo a passo aparece aqui, na hora.</p>
      <label className="mt-6 block">
        <span className="sr-only">E-mail</span>
        <input type="email" inputMode="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com"
          className="block w-full rounded-2xl border border-line bg-white px-5 py-4 text-[16px] text-graphite outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-muted/60 focus:border-green focus:shadow-[0_0_0_5px_rgba(15,93,69,.08)]" />
      </label>
      <input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} name="website" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      {erro && <p className="mt-3 text-[13.5px] text-[#a33a2b]">{erro}</p>}
      <button type="submit" disabled={enviando}
        className="mt-4 w-full rounded-full bg-green-3 px-6 py-[17px] text-[15px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_18px_40px_-18px_rgba(11,74,55,.85)] transition-[transform,background-color,opacity] duration-300 hover:bg-green active:scale-[.985] disabled:opacity-50">
        {enviando ? "Liberando…" : "Liberar instalação"}
      </button>
      <p className="mt-4 text-center text-[12.5px] leading-relaxed text-muted">Grátis e de código aberto. O e-mail serve para mandarmos as próximas skills da Veriddan.</p>
    </form>
  );
}

const DIFERENCAS: [string, string, string][] = [
  ["Quem decide o que vira skill", "Você", "Ele, a partir do trabalho que se repete de verdade"],
  ["Régua para criar uma skill", "Alguém pediu", "3 ou mais sessões em pelo menos 2 semanas diferentes"],
  ["Testada contra", "Exemplos inventados", "Sessões reais suas, inclusive uma que o rascunho nunca viu"],
  ["Depois de pronta", "Nada", "Uso e falhas acompanhados, ajustes mínimos, junção e aposentadoria"],
  ["Memória", "Fora do escopo", "Correções propagadas, fatos conferidos, duplicadas unidas"],
];

const ETAPAS: { cmd: string; titulo: string; texto: string }[] = [
  { cmd: "observe", titulo: "Observa", texto: "Lê cada sessão encerrada e só anota: tarefa que se repete, armadilha que levou ao caminho certo, correção que você fez. Fato corrigido por você é atualizado na hora em toda nota e skill." },
  { cmd: "audit", titulo: "Confere", texto: "Compara as notas com a fonte de verdade que você definir (git log, lista de serviços) e corrige o que ficou velho, guardando a versão anterior como histórico." },
  { cmd: "weekly", titulo: "Organiza", texto: "Junta notas duplicadas, lista contradições para você decidir e refaz o índice da memória." },
  { cmd: "curate", titulo: "Cura", texto: "A única etapa que mexe em skills: cria, melhora, junta e aposenta, sempre testando contra sessões reais antes de publicar." },
];

const PERGUNTAS: [string, string][] = [
  ["Precisa de chave de API?", "Não. Toda chamada passa pelo claude -p, na sua assinatura do Claude Code. Não há servidor nem dependência de npm."],
  ["Ele mexe nas minhas skills feitas à mão?", "Nunca junta nem aposenta uma skill que ele não criou. Nesse caso a proposta aparece para você decidir. Ajustes mínimos podem entrar, sempre com cópia da versão anterior."],
  ["Funciona com o Codex?", "Sim. Ele lê as sessões do Claude Code e as do Codex."],
  ["O que eu preciso ter?", "Claude Code instalado e logado, e Node.js 18 ou mais novo."],
];

export function SkillSelfLearning() {
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

      <section className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-6 sm:px-8 lg:grid-cols-[1.15fr_.85fr] lg:gap-14 lg:pb-24 lg:pt-14">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-green">Skill para o Claude Code · código aberto</p>
          <h1 className="mt-5 font-cormorant text-[44px] leading-[1.02] tracking-[-0.015em] text-graphite sm:text-[60px]">
            O seu agente aprendendo com as próprias sessões.
          </h1>
          <p className="mt-6 max-w-[54ch] text-[17px] leading-[1.65] text-text">
            Toda sessão encerrada do Claude Code guarda o que o seu agente precisa para melhorar: as tarefas que voltam, as armadilhas em que ele caiu e as vezes em que você o corrigiu. O <span className="font-mono text-[15px] text-graphite">self-learning-agent</span> lê essas sessões e transforma isso em skills testadas e numa memória que continua certa.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {["Roda no seu computador", "Sem chave de API", "Zero dependências", "Lê Claude Code e Codex"].map((t) => (
              <li key={t} className="flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 text-[13px] text-text">
                <span className="text-green"><Check /></span>{t}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[13.5px] text-muted">Em uso na Veriddan AI Studio desde outubro de 2026, cuidando das skills e da memória dos agentes que operam as nossas startups.</p>
        </div>
        <div id="instalar" className="lg:sticky lg:top-8 lg:self-start">
          <Portao />
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">A diferença</p>
          <h2 className="mt-4 max-w-[22ch] font-cormorant text-[36px] leading-[1.06] text-graphite sm:text-[44px]">Começa pela evidência, não pelo pedido.</h2>
          <div className="mt-10 overflow-hidden rounded-3xl border border-line">
            <div className="hidden grid-cols-[1fr_1fr_1.3fr] bg-soft px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted sm:grid">
              <span />
              <span>Criador de skill comum</span>
              <span className="text-green">self-learning-agent</span>
            </div>
            {DIFERENCAS.map(([linha, comum, nosso]) => (
              <div key={linha} className="grid gap-1.5 border-t border-line px-6 py-5 first:border-t-0 sm:grid-cols-[1fr_1fr_1.3fr] sm:gap-4 sm:first:border-t">
                <span className="text-[14.5px] font-medium text-graphite">{linha}</span>
                <span className="text-[14.5px] text-muted"><span className="font-mono text-[10.5px] uppercase tracking-[0.12em] sm:hidden">Comum: </span>{comum}</span>
                <span className="text-[14.5px] text-text"><span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-green sm:hidden">Ele: </span>{nosso}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">Como funciona</p>
        <h2 className="mt-4 font-cormorant text-[36px] leading-[1.06] text-graphite sm:text-[44px]">Quatro etapas, cada uma com um papel.</h2>
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
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sage">A régua de uma skill nova</p>
          <p className="mt-4 max-w-[62ch] text-[16px] leading-[1.7] text-white/90">
            O rascunho é escrito só com os casos mais antigos. Depois, outro modelo lê de 2 a 3 sessões reais em que a tarefa aconteceu, incluindo a mais recente, que o rascunho nunca viu, e responde: seguindo só esta skill, o trabalho teria saído certo? A skill só é publicada se passar em todos os casos.
          </p>
        </div>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:py-20">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">Dúvidas</p>
            <h2 className="mt-4 font-cormorant text-[36px] leading-[1.06] text-graphite sm:text-[44px]">Antes de instalar</h2>
            <a href="#instalar" className="mt-8 inline-flex rounded-full bg-green-3 px-6 py-3.5 text-[14.5px] font-medium text-white transition-colors hover:bg-green">Receber o comando</a>
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
        <span>Licença MIT · código aberto no GitHub</span>
      </footer>
    </main>
  );
}
