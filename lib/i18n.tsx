"use client";

import { createContext, useContext } from "react";

export type Locale = "en" | "pt";

/* -----------------------------------------------------------------------------
 * Site copy, per locale. English lives at "/", Portuguese at "/pt".
 * Headlines are split into parts so each locale keeps the same highlight
 * styling (italic seafoam / brass) around its own words.
 *
 * The page is written for the visitor — what they get, how it works, what it
 * looks like, why trust it — not for the internal tooling. Veridian OS and its
 * modules appear once, as the reason delivery is fast (`engine`).
 * --------------------------------------------------------------------------- */
const en = {
  htmlLang: "en",
  home: "/",
  login: "/login",
  brand: "Veridian · AI Studio",
  nav: {
    entry: "Entry",
    deliver: "What you get",
    method: "Process",
    ventures: "Portfolio",
    engine: "How",
    faq: "FAQ",
    sanctum: "Start",
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
  deliver: {
    eyebrow: "What you get",
    title1: "In 4 weeks, a product live.",
    title2a: "And it is ",
    title2hl: "yours",
    title2b: ".",
    items: [
      "A working product, published and open to your customers",
      "Source code and IP are 100% yours",
      "Scope and price fixed before we start",
      "You test and approve each milestone before paying",
      "Sign-in, database and payments, when the product needs them",
      "We stay after launch and iterate from real data",
    ],
    // Shown under the list when filled in (e.g. "Product Sprints from US$ …").
    price: "",
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
    title: "Systems we ",
    titleHl: "built and run.",
    sub: "Real screens from products in our studio.",
    tags: {
      conciera: "AI concierge for clinics",
      knexo: "personal finance on WhatsApp",
      "knexo-jobs": "job search on autopilot",
      zettapay: "non-custodial crypto payments",
      tsign: "electronic signatures",
      lovedopa: "Parkinson's care diary",
      sofiaai: "AI sales agent",
      fivsense: "behaviour prediction API",
      tegplus: "operations ERP",
      vortex: "autonomous CRM and growth",
      fabric: "autonomous development",
      pulse: "operations monitoring",
      jarvis: "command channel",
    } as Record<string, string>,
  },
  engine: {
    eyebrow: "How we deliver this fast",
    title: "Veridian ",
    titleHl: "OS",
    sub: "Our own operating system does the heavy lifting. You never have to learn it.",
    modules: [
      { id: "fabric", name: "Fabric", verb: "builds", line: "Designs, codes and deploys your product." },
      { id: "vortex", name: "Vortex", verb: "sells", line: "Finds, pitches and follows up with customers." },
      { id: "pulse", name: "Pulse", verb: "watches", line: "Monitors users, infrastructure and agents." },
      { id: "jarvis", name: "Jarvis", verb: "commands", line: "One channel to orchestrate everything." },
    ],
    footnote: "Built once. Inherited by every product we ship, from day zero.",
    soon: "soon",
  },
  faq: {
    eyebrow: "Before you ask",
    title: "Straight ",
    titleHl: "answers.",
    items: [
      {
        q: "Do I need to understand technology?",
        a: "No. You bring the idea and the knowledge of your market; the engineering is on us.",
      },
      {
        q: "Is the code mine?",
        a: "Yes. Source code and intellectual property are yours, and an NDA is signed before we start.",
      },
      {
        q: "What if I don't like the result?",
        a: "You see and test each milestone before paying for it. Scope and price are fixed up front.",
      },
      {
        q: "How much does it cost?",
        a: "It depends on the scope. The price is fixed in week one, before any payment.",
      },
      {
        q: "What happens after launch?",
        a: "We keep going with you: the product evolves from real usage data.",
      },
    ],
  },
  sanctum: {
    eyebrow: "Get started",
    sub: "Tell us the idea. Reviewed personally within 7 days.",
    footer: "© 2026 · Veridian AI Studio · Built by 4Profit.AI",
  },
  form: {
    name: "Your name",
    contact: "E-mail or WhatsApp",
    idea: "Your idea, in a sentence or two",
    submit: "Send my idea",
    sending: "Sending…",
    or: "or talk on WhatsApp",
    sentTitle: "Got it.",
    sent: "Your idea is with us. We will get back to you within 7 days.",
    fallback: "We could not save it here, so we opened WhatsApp with your message ready to send.",
    whatsappLead: "Hi! I'm {name} ({contact}). My idea: {idea}",
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
    deliver: "O que você recebe",
    method: "Processo",
    ventures: "Portfólio",
    engine: "Como",
    faq: "Dúvidas",
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
  deliver: {
    eyebrow: "O que você recebe",
    title1: "Em 4 semanas, um produto no ar.",
    title2a: "E ele é ",
    title2hl: "seu",
    title2b: ".",
    items: [
      "Produto funcionando, publicado e aberto aos seus clientes",
      "Código-fonte e propriedade intelectual 100% seus",
      "Escopo e preço fechados antes de começar",
      "Você testa e aprova cada marco antes de pagar",
      "Login, banco de dados e pagamentos, quando o produto pede",
      "Seguimos depois do lançamento, evoluindo com dados reais",
    ],
    price: "",
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
    title: "Sistemas que ",
    titleHl: "construímos e operamos.",
    sub: "Telas reais de produtos do nosso estúdio.",
    tags: {
      conciera: "concierge de IA para clínicas",
      knexo: "finanças pessoais pelo WhatsApp",
      "knexo-jobs": "busca de vagas no automático",
      zettapay: "pagamentos cripto não-custodiais",
      tsign: "assinatura eletrônica",
      lovedopa: "diário de cuidado em Parkinson",
      sofiaai: "agente de vendas com IA",
      fivsense: "API de predição de comportamento",
      tegplus: "ERP de operações",
      vortex: "CRM e growth autônomos",
      fabric: "desenvolvimento autônomo",
      pulse: "monitoramento de operações",
      jarvis: "canal de comando",
    },
  },
  engine: {
    eyebrow: "Como entregamos tão rápido",
    title: "Veridian ",
    titleHl: "OS",
    sub: "Nosso próprio sistema operacional faz o trabalho pesado. Você não precisa aprender nada disso.",
    modules: [
      { id: "fabric", name: "Fabric", verb: "constrói", line: "Desenha, programa e publica o seu produto." },
      { id: "vortex", name: "Vortex", verb: "vende", line: "Encontra, apresenta e acompanha clientes." },
      { id: "pulse", name: "Pulse", verb: "vigia", line: "Monitora usuários, infraestrutura e agentes." },
      { id: "jarvis", name: "Jarvis", verb: "comanda", line: "Um canal para orquestrar tudo." },
    ],
    footnote: "Construído uma vez. Herdado por cada produto que entregamos, desde o dia zero.",
    soon: "em breve",
  },
  faq: {
    eyebrow: "Antes de você perguntar",
    title: "Respostas ",
    titleHl: "diretas.",
    items: [
      {
        q: "Preciso entender de tecnologia?",
        a: "Não. Você traz a ideia e o conhecimento do seu mercado; a engenharia é conosco.",
      },
      {
        q: "O código é meu?",
        a: "Sim. Código-fonte e propriedade intelectual são seus, e há NDA assinado antes de começarmos.",
      },
      {
        q: "E se eu não gostar do resultado?",
        a: "Você vê e testa cada marco antes de pagar por ele. Escopo e preço são fechados no início.",
      },
      {
        q: "Quanto custa?",
        a: "Depende do escopo. O preço é fixo e fechado na primeira semana, antes de qualquer pagamento.",
      },
      {
        q: "E depois que o produto está no ar?",
        a: "Seguimos com você: o produto evolui a partir dos dados reais de uso.",
      },
    ],
  },
  sanctum: {
    eyebrow: "Comece agora",
    sub: "Conte a ideia. Analisamos pessoalmente em até 7 dias.",
    footer: "© 2026 · Veridian AI Studio · Feito pela 4Profit.AI",
  },
  form: {
    name: "Seu nome",
    contact: "E-mail ou WhatsApp",
    idea: "Sua ideia, em uma ou duas frases",
    submit: "Enviar minha ideia",
    sending: "Enviando…",
    or: "ou fale no WhatsApp",
    sentTitle: "Recebido.",
    sent: "Sua ideia está conosco. Respondemos em até 7 dias.",
    fallback: "Não conseguimos gravar por aqui, então abrimos o WhatsApp com a sua mensagem pronta para enviar.",
    whatsappLead: "Olá! Sou {name} ({contact}). Minha ideia: {idea}",
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

export const WHATSAPP_NUMBER = "5531971701177";

export function whatsappUrl(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

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
