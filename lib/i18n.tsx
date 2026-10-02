"use client";

import { createContext, useContext } from "react";

export type Locale = "en" | "pt";

/* -----------------------------------------------------------------------------
 * Site copy, per locale. English lives at "/", Portuguese at "/pt".
 * Headlines are split into parts so each locale keeps the same highlight
 * styling (italic seafoam / brass) around its own words.
 * --------------------------------------------------------------------------- */
const en = {
  htmlLang: "en",
  home: "/",
  login: "/login",
  brand: "Veridian · AI Studio",
  nav: {
    entry: "Entry",
    manifesto: "Manifesto",
    ventures: "Ventures",
    method: "Method",
    resources: "Veridian OS",
    sanctum: "Apply",
  } as Record<string, string>,
  logout: "Logout",
  enter: "Enter",
  scrollCue: "Scroll to enter the studio",
  cta: "Start with a Product Sprint",
  whatsappText: "I'd like to start a Product Sprint with Veridian",
  hero: {
    wordmarkTag: "AI Studio · Venture Builder",
    eyebrow: "Founder",
  },
  headline: {
    a: "Turn your ",
    idea: "idea",
    b: " into",
    c: "a ",
    product: "working product",
    d: " in weeks.",
    e: "Without hiring a full team.",
  },
  manifesto: {
    eyebrow: "Why we exist",
    a: "Veridian helps founders and companies ",
    hl1: "build, test and launch",
    b: " new products faster, with ",
    hl2: "senior execution",
    c: " and ",
    hl3: "AI-powered development",
    d: ".",
  },
  os: {
    eyebrow: "How we operate",
    tagline: "One operating system. Four modules. None of them sleep.",
    verbs: {
      jarvis: "commands",
      fabric: "builds",
      vortex: "sells",
      pulse: "watches",
    },
    footnote: "Built once. Inherited by every venture, from day zero.",
  },
  module: {
    eyebrow: "Module of Veridian OS",
    launch: "Launch",
    soon: "Coming soon",
  },
  modules: {
    fabric: {
      tag: "The Foundry",
      promise: "Builds while you sleep.",
      line1: "The product team, automated.",
      line2: "Designs · codes · deploys — no backlog, no standup.",
    },
    vortex: {
      tag: "The Engine",
      promise: "Sells while you sleep.",
      line1: "The sales floor, automated.",
      line2: "Finds · pitches · closes — across 12 languages, 24/7.",
    },
    pulse: {
      tag: "The Heart Beat",
      promise: "Watches while you sleep.",
      line1: "The operations desk, automated.",
      line2: "Users · infrastructure · agents — heals before you notice.",
    },
    jarvis: {
      tag: "The Command Channel",
      promise: "One channel. Total command.",
      line1: "Your single point of command and operation.",
      line2: "Talk to Jarvis · he orchestrates Fabric, Vortex, Pulse for you.",
    },
  },
  method: {
    eyebrow: "The Process",
    title1: "A clear process. A fair contract.",
    title2a: "A ",
    title2hl: "working product",
    title2b: ".",
    milestones: [
      { wk: "Week 1", title: "Discovery", detail: "NDA signed. Brief, scope and milestones defined." },
      { wk: "Week 1", title: "Scope locked", detail: "Fixed price, fixed deliverables. You approve." },
      { wk: "Weeks 2–3", title: "Build", detail: "Senior engineers + AI execute against the spec." },
      { wk: "Week 3–4", title: "Review", detail: "You see and test each milestone before payment." },
      { wk: "Week 4+", title: "Ship", detail: "Live product. Revenue. Iterate from real data." },
    ],
    safetyTitle: "How we protect you",
    safety: [
      "U.S. registered company (4Profit AI LLC)",
      "NDA signed before discovery",
      "Fixed scope, clear milestones",
      "Milestone payments via Stripe",
      "Senior engineers + AI tools",
      "IP belongs to you",
    ],
  },
  ventures: {
    eyebrow: "Portfolio",
    title: "Ventures ",
    titleHl: "in motion.",
    sub: "Real customers. Real revenue. Growing weekly.",
    footnote: "Each running on Jarvis · Fabric · Vortex · Pulse.",
    tags: {
      conciera: "hospitality intelligence",
      knexo: "connection layer",
      tegplus: "operations OS",
      lovedopa: "Parkinson's platform",
      zettapay: "payments infrastructure",
    } as Record<string, string>,
  },
  sanctum: {
    eyebrow: "Get started",
    sub: "Reviewed personally within 7 days.",
    footer: "© 2026 · Veridian AI Studio · Built by 4Profit.AI",
  },
  audio: {
    mute: "Mute background track",
    play: "Play background track",
  },
  veris: {
    welcome:
      "I'm Veris, the Veridian intelligence. Tell me about your idea — I'll show you what we'd build in 2 weeks.",
    bootError: "Connection failed. Try again.",
    sendError: "Connection slipped. Try once more — I'm still here.",
    orbLabel: "Talk to Veris, the Veridian intelligence",
    balloon: "Need help? I'm here.",
    minimize: "Minimize",
    loading: "Materializing…",
    placeholder: "Tell me about your idea…",
    send: "Send",
    you: "You",
  },
  loginPage: {
    back: "Back to studio",
    enterStudio: "Enter the studio",
    email: "Email",
    password: "Password",
    submit: "Enter",
    submitting: "Entering…",
    failed: "Sign-in failed.",
    newHere: "New here?",
    request: "Request access ↗",
  },
};

export type Dict = typeof en;

const pt: Dict = {
  htmlLang: "pt-BR",
  home: "/pt",
  login: "/pt/login",
  brand: "Veridian · AI Studio",
  nav: {
    entry: "Entrada",
    manifesto: "Manifesto",
    ventures: "Ventures",
    method: "Método",
    resources: "Veridian OS",
    sanctum: "Começar",
  },
  logout: "Sair",
  enter: "Entrar",
  scrollCue: "Role para entrar no estúdio",
  cta: "Comece com um Product Sprint",
  whatsappText: "Quero começar um Product Sprint com a Veridian",
  hero: {
    wordmarkTag: "AI Studio · Venture Builder",
    eyebrow: "Empreendedor",
  },
  headline: {
    a: "Transforme sua ",
    idea: "ideia",
    b: " em",
    c: "um ",
    product: "produto funcionando",
    d: " em semanas.",
    e: "Sem contratar um time inteiro.",
  },
  manifesto: {
    eyebrow: "Por que existimos",
    a: "A Veridian ajuda empreendedores e empresas a ",
    hl1: "construir, testar e lançar",
    b: " novos produtos mais rápido, com ",
    hl2: "execução sênior",
    c: " e ",
    hl3: "desenvolvimento movido a IA",
    d: ".",
  },
  os: {
    eyebrow: "Como operamos",
    tagline: "Um sistema operacional. Quatro módulos. Nenhum deles dorme.",
    verbs: {
      jarvis: "comanda",
      fabric: "constrói",
      vortex: "vende",
      pulse: "vigia",
    },
    footnote: "Construído uma vez. Herdado por cada venture, desde o dia zero.",
  },
  module: {
    eyebrow: "Módulo do Veridian OS",
    launch: "Abrir",
    soon: "Em breve",
  },
  modules: {
    fabric: {
      tag: "A Forja",
      promise: "Constrói enquanto você dorme.",
      line1: "O time de produto, automatizado.",
      line2: "Desenha · programa · publica — sem backlog, sem daily.",
    },
    vortex: {
      tag: "O Motor",
      promise: "Vende enquanto você dorme.",
      line1: "O time comercial, automatizado.",
      line2: "Encontra · apresenta · fecha — em 12 idiomas, 24/7.",
    },
    pulse: {
      tag: "O Batimento",
      promise: "Vigia enquanto você dorme.",
      line1: "A mesa de operações, automatizada.",
      line2: "Usuários · infraestrutura · agentes — corrige antes de você notar.",
    },
    jarvis: {
      tag: "O Canal de Comando",
      promise: "Um canal. Comando total.",
      line1: "Seu ponto único de comando e operação.",
      line2: "Fale com o Jarvis · ele orquestra Fabric, Vortex e Pulse por você.",
    },
  },
  method: {
    eyebrow: "O Processo",
    title1: "Um processo claro. Um contrato justo.",
    title2a: "Um ",
    title2hl: "produto funcionando",
    title2b: ".",
    milestones: [
      { wk: "Semana 1", title: "Descoberta", detail: "NDA assinado. Briefing, escopo e marcos definidos." },
      { wk: "Semana 1", title: "Escopo fechado", detail: "Preço fixo, entregas fixas. Você aprova." },
      { wk: "Semanas 2–3", title: "Construção", detail: "Engenheiros sêniores + IA executam a especificação." },
      { wk: "Semanas 3–4", title: "Revisão", detail: "Você vê e testa cada marco antes de pagar." },
      { wk: "Semana 4+", title: "Lançamento", detail: "Produto no ar. Receita. Evolução com dados reais." },
    ],
    safetyTitle: "Como protegemos você",
    safety: [
      "Empresa registrada nos EUA (4Profit AI LLC)",
      "NDA assinado antes da descoberta",
      "Escopo fixo, marcos claros",
      "Pagamento por marco via Stripe",
      "Engenheiros sêniores + ferramentas de IA",
      "A propriedade intelectual é sua",
    ],
  },
  ventures: {
    eyebrow: "Portfólio",
    title: "Ventures ",
    titleHl: "em movimento.",
    sub: "Clientes reais. Receita real. Crescendo toda semana.",
    footnote: "Todas rodando sobre Jarvis · Fabric · Vortex · Pulse.",
    tags: {
      conciera: "inteligência em hospitalidade",
      knexo: "camada de conexão",
      tegplus: "OS de operações",
      lovedopa: "plataforma para Parkinson",
      zettapay: "infraestrutura de pagamentos",
    },
  },
  sanctum: {
    eyebrow: "Comece agora",
    sub: "Analisado pessoalmente em até 7 dias.",
    footer: "© 2026 · Veridian AI Studio · Feito pela 4Profit.AI",
  },
  audio: {
    mute: "Silenciar trilha de fundo",
    play: "Tocar trilha de fundo",
  },
  veris: {
    welcome:
      "Sou Veris, a inteligência da Veridian. Me conte sua ideia — eu mostro o que construiríamos em 2 semanas.",
    bootError: "Falha na conexão. Tente de novo.",
    sendError: "A conexão caiu. Tente mais uma vez — continuo aqui.",
    orbLabel: "Fale com Veris, a inteligência da Veridian",
    balloon: "Precisa de ajuda? Estou aqui.",
    minimize: "Minimizar",
    loading: "Materializando…",
    placeholder: "Me conte sua ideia…",
    send: "Enviar",
    you: "Você",
  },
  loginPage: {
    back: "Voltar ao estúdio",
    enterStudio: "Entre no estúdio",
    email: "E-mail",
    password: "Senha",
    submit: "Entrar",
    submitting: "Entrando…",
    failed: "Falha ao entrar.",
    newHere: "Novo por aqui?",
    request: "Solicitar acesso ↗",
  },
};

export const DICT: Record<Locale, Dict> = { en, pt };

const LocaleContext = createContext<Locale>("en");

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

export function useT(): Dict {
  return DICT[useContext(LocaleContext)];
}
