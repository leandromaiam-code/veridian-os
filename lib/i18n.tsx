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
  brand: "Veridian · AI Studio & Ventures",
  nav: {
    entry: "Entry",
    deliver: "What you get",
    method: "What we do",
    ventures: "Portfolio",
    engine: "How it works",
    faq: "FAQ",
    sanctum: "Contact",
  } as Record<string, string>,
  logout: "Logout",
  enter: "Enter",
  scrollCue: "Scroll to enter the studio",
  cta: "Send your idea",
  whatsappText: "I would like to talk to Veridian about an idea",
  hero: {
    wordmarkTag: "AI Studio & Ventures",
    eyebrow: "For founders and companies",
  },
  headline: {
    a: "We turn ",
    idea: "ideas",
    b: " into products,",
    c: "and products into ",
    product: "scalable businesses",
    d: ".",
    e: "",
  },
  deliver: {
    eyebrow: "What you get",
    title1: "A working product,",
    title2a: "published and ",
    title2hl: "yours",
    title2b: ".",
    items: [
      "A working product, published and open to your customers",
      "Source code and IP are yours",
      "Scope and price fixed before we start",
      "You test and approve each milestone before paying",
      "Sign-up, payments and real usage, when the product needs them",
      "We stay after launch and iterate from real data",
    ],
    price: "",
  },
  method: {
    eyebrow: "What we do",
    title1: "Validate, build and grow.",
    title2a: "",
    title2hl: "",
    title2b: "",
    milestones: [
      { wk: "01", title: "Validate", detail: "Market, audience and positioning research, proven before building." },
      { wk: "02", title: "Build", detail: "A real product live, with sign-up, payments and real usage." },
      { wk: "03", title: "Grow", detail: "Brand, landing page, blog and acquisition, with usage measured continuously." },
    ],
    safetyTitle: "How we protect you",
    safety: [
      "NDA signed before discovery",
      "Fixed scope, clear milestones",
      "Milestone payments via Stripe",
      "IP belongs to you",
    ],
  },
  ventures: {
    eyebrow: "Portfolio",
    title: "Our portfolio",
    titleHl: "",
    sub: "Startups created and run on the Veridian platform.",
    cases: "Cases",
    invest: "Investments",
    tags: {
      saude: "Health",
      financas: "Finance",
      vendas: "Sales",
      gestao: "Management",
      juridico: "Legal",
      carreira: "Career",
      construcao: "Construction",
    } as Record<string, string>,
  },
  engine: {
    eyebrow: "How it works",
    title: "Veridian ",
    titleHl: "OS",
    sub: "Our own platform, with autonomous modules that do the product, marketing, operations and management work.",
    modules: [
      { id: "fabric", name: "Fabric", verb: "builds", line: "Builds, fixes and evolves the product in autonomous missions." },
      { id: "vortex", name: "Vortex", verb: "grows", line: "Positioning, brand, landing page and acquisition." },
      { id: "pulse", name: "Pulse", verb: "operates", line: "Usage, health, stability and evidence." },
      { id: "jarvis", name: "Veris", verb: "orchestrates", line: "Orchestrates the modules and talks to the founder." },
    ],
    footnote: "The human team decides; the modules execute.",
    soon: "soon",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Frequently asked questions",
    titleHl: "",
    items: [
      { q: "Who is it for?", a: "Founders and companies that want to turn an idea into a product, and the product into a business. Partners and investors too." },
      { q: "Do I need to understand technology?", a: "No. You bring the idea and the knowledge of your market; the engineering is on us." },
      { q: "Is the code mine?", a: "Yes. Source code and intellectual property are yours, and an NDA is signed before we start." },
      { q: "What if I do not like the result?", a: "You see and test each milestone before paying for it. Scope and price are fixed up front." },
      { q: "How is it paid?", a: "We build product and company with founders and partners, for a fee, equity or both. The price is fixed before any payment." },
      { q: "What happens after launch?", a: "We keep going with you: the product evolves from real usage data." },
    ],
  },
  sanctum: {
    eyebrow: "Contact",
    sub: "Tell us the idea. We review it personally.",
    footer: "© 2026 · Veridian AI Studio & Ventures",
    email: "contact@4profitai.com",
  },
  form: {
    name: "Your name",
    contact: "E-mail or WhatsApp",
    idea: "Your idea, in a sentence or two",
    submit: "Send my idea",
    sending: "Sending…",
    or: "or talk on WhatsApp",
    sentTitle: "Got it.",
    sent: "Your idea is with us. We will get back to you soon.",
    fallback: "We could not save it here, so we opened WhatsApp with your message ready to send.",
    whatsappLead: "Hi! I'm {name} ({contact}). My idea: {idea}",
  },
  audio: {
    mute: "Mute background track",
    play: "Play background track",
  },
  veris: {
    welcome:
      "I'm Veris, the Veridian intelligence. Tell me about your idea — I'll show you what we would build.",
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
  brand: "Veridian · AI Studio & Ventures",
  nav: {
    entry: "Entrada",
    deliver: "O que você recebe",
    method: "O que fazemos",
    ventures: "Portfólio",
    engine: "Como funciona",
    faq: "Dúvidas",
    sanctum: "Contato",
  },
  logout: "Sair",
  enter: "Entrar",
  scrollCue: "Role para entrar no estúdio",
  cta: "Envie sua ideia",
  whatsappText: "Quero falar com a Veridian sobre uma ideia",
  hero: {
    wordmarkTag: "AI Studio & Ventures",
    eyebrow: "Para fundadores e empresas",
  },
  headline: {
    a: "Transformamos ",
    idea: "ideias",
    b: " em produtos,",
    c: "e produtos em ",
    product: "negócios escaláveis",
    d: ".",
    e: "",
  },
  deliver: {
    eyebrow: "O que você recebe",
    title1: "Um produto funcionando,",
    title2a: "publicado e ",
    title2hl: "seu",
    title2b: ".",
    items: [
      "Produto funcionando, publicado e aberto aos seus clientes",
      "Código-fonte e propriedade intelectual seus",
      "Escopo e preço fechados antes de começar",
      "Você testa e aprova cada marco antes de pagar",
      "Cadastro, pagamento e uso de verdade, quando o produto pede",
      "Seguimos depois do lançamento, evoluindo com dados reais",
    ],
    price: "",
  },
  method: {
    eyebrow: "O que fazemos",
    title1: "Validar, construir e crescer.",
    title2a: "",
    title2hl: "",
    title2b: "",
    milestones: [
      { wk: "01", title: "Validar", detail: "Pesquisa de mercado, público e posicionamento, provados antes de construir." },
      { wk: "02", title: "Construir", detail: "Produto real no ar, com cadastro, pagamento e uso de verdade." },
      { wk: "03", title: "Crescer", detail: "Marca, landing, blog e aquisição, com o uso medido continuamente." },
    ],
    safetyTitle: "Como protegemos você",
    safety: [
      "NDA assinado antes da descoberta",
      "Escopo fixo, marcos claros",
      "Pagamento por marco via Stripe",
      "A propriedade intelectual é sua",
    ],
  },
  ventures: {
    eyebrow: "Portfólio",
    title: "Nosso portfólio",
    titleHl: "",
    sub: "Startups criadas e operadas na plataforma Veridian.",
    cases: "Cases",
    invest: "Investimentos",
    tags: {
      saude: "Saúde",
      financas: "Finanças",
      vendas: "Vendas",
      gestao: "Gestão",
      juridico: "Jurídico",
      carreira: "Carreira",
      construcao: "Construção",
    },
  },
  engine: {
    eyebrow: "Como funciona",
    title: "Veridian ",
    titleHl: "OS",
    sub: "Plataforma própria, com módulos autônomos que fazem o trabalho de produto, marketing, operação e gestão.",
    modules: [
      { id: "fabric", name: "Fabric", verb: "constrói", line: "Constrói, corrige e evolui o produto em missões autônomas." },
      { id: "vortex", name: "Vortex", verb: "faz crescer", line: "Posicionamento, marca, landing e aquisição." },
      { id: "pulse", name: "Pulse", verb: "opera", line: "Uso, saúde, estabilidade e evidência." },
      { id: "jarvis", name: "Veris", verb: "orquestra", line: "Orquestra os módulos e conversa com o fundador." },
    ],
    footnote: "A equipe humana decide; os módulos executam.",
    soon: "em breve",
  },
  faq: {
    eyebrow: "Dúvidas",
    title: "Perguntas frequentes",
    titleHl: "",
    items: [
      { q: "Para quem é?", a: "Fundadores e empresas que querem transformar uma ideia em produto, e o produto em negócio. Também parceiros e investidores." },
      { q: "Preciso entender de tecnologia?", a: "Não. Você traz a ideia e o conhecimento do seu mercado; a engenharia é conosco." },
      { q: "O código é meu?", a: "Sim. Código-fonte e propriedade intelectual são seus, e há NDA assinado antes de começarmos." },
      { q: "E se eu não gostar do resultado?", a: "Você vê e testa cada marco antes de pagar por ele. Escopo e preço são fechados no início." },
      { q: "Como é a remuneração?", a: "Criamos produto e empresa com fundadores e parceiros, em troca de taxa, participação ou ambos. O preço é fechado antes de qualquer pagamento." },
      { q: "E depois que o produto está no ar?", a: "Seguimos com você: o produto evolui a partir dos dados reais de uso." },
    ],
  },
  sanctum: {
    eyebrow: "Contato",
    sub: "Conte a ideia. Analisamos pessoalmente.",
    footer: "© 2026 · Veridian AI Studio & Ventures",
    email: "contact@4profitai.com",
  },
  form: {
    name: "Seu nome",
    contact: "E-mail ou WhatsApp",
    idea: "Sua ideia, em uma ou duas frases",
    submit: "Enviar minha ideia",
    sending: "Enviando…",
    or: "ou fale no WhatsApp",
    sentTitle: "Recebido.",
    sent: "Sua ideia está conosco. Respondemos em breve.",
    fallback: "Não conseguimos gravar por aqui, então abrimos o WhatsApp com a sua mensagem pronta para enviar.",
    whatsappLead: "Olá! Sou {name} ({contact}). Minha ideia: {idea}",
  },
  audio: {
    mute: "Silenciar trilha de fundo",
    play: "Tocar trilha de fundo",
  },
  veris: {
    welcome:
      "Sou Veris, a inteligência da Veridian. Me conte sua ideia — eu mostro o que construiríamos.",
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
