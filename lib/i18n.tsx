"use client";

import { createContext, useContext } from "react";

export type Locale = "en" | "pt";

/* -----------------------------------------------------------------------------
 * Site copy, per locale. English lives at "/", Portuguese at "/pt".
 * Headlines are split into parts so each locale keeps the same highlight
 * styling around its own words.
 *
 * Content and order follow the commercial deck (Veridian - Comercial):
 * who we are (hero) → portfolio → who it's for (+ business model) → how it
 * works (stages) → the platform (modules) → why Veridian → contact.
 * --------------------------------------------------------------------------- */

const en = {
  htmlLang: "en",
  home: "/",
  login: "/login",
  brand: "Veridian · AI Studio & Ventures",
  brandName: "VERIDIAN",
  brandTag: "AI Studio & Ventures",
  nav: {
    portfolio: "Portfolio",
    audience: "Who it's for",
    how: "How it works",
    edge: "Why Veridian",
    platform: "Platform",
    contact: "Contact",
  } as Record<string, string>,
  logout: "Logout",
  enter: "Enter",
  scrollCue: "Scroll to enter the studio",
  cta: "Send your idea",
  ctaPortfolio: "See the portfolio",
  whatsappText: "I would like to talk to Veridian about an idea",
  hero: {
    eyebrow: "Veridian AI Studio & Ventures",
    lead: "We create and develop startups on our own platform, with autonomous modules that do the product, marketing, operations and management work.",
    fact: "12 startups in the portfolio",
  },
  headline: {
    a: "We turn ",
    idea: "ideas",
    b: " into products,",
    c: "and products into ",
    product: "scalable businesses",
    d: ".",
  },
  portfolio: {
    title: "Our portfolio",
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
    lines: {
      conciera: "AI customer service for clinics.",
      lovedopa: "Follow-up for people with Parkinson's.",
      boostdesign: "Supplement protocols for compounding pharmacies.",
      knexo: "Personal finance over WhatsApp.",
      zettapay: "Crypto payments straight to your wallet.",
      sofiaai: "AI sales agent and CRM.",
      fivsense: "Predicts customer behaviour in conversations.",
      "veridian-helm": "Autonomous CEO: goals, OKRs and action plans.",
      "veridian-kesh": "Autonomous CFO: cash, P&L and margin with no manual entries.",
      tsign: "E-signature with no monthly fee.",
      "knexo-jobs": "Remote jobs with a tailored résumé and cover letter for each application.",
      superrdo: "Daily construction report integrated with MS Project.",
    } as Record<string, string>,
  },
  audience: {
    title: "Who it's for",
    forLabel: "For",
    modelLabel: "Model",
    items: [
      {
        n: "01",
        title: "Clients",
        text: "Your idea becomes a live product and a business that earns, without building a team from scratch.",
        who: "Founders and companies with an idea to get off the ground or a product to accelerate.",
        model: "Monthly subscription + equity",
      },
      {
        n: "02",
        title: "Partners",
        text: "Solutions built and run on the Veridian platform, taken to your clients.",
        who: "Companies that want to develop solutions together or distribute the platform.",
        model: "Enterprise plan + equity",
      },
      {
        n: "03",
        title: "Investors",
        text: "A portfolio of startups created with the same method and the same platform, with maturity measured by evidence.",
        who: "Those who want a stake in the portfolio startups.",
        model: "Equity in the startups",
      },
    ],
  },
  how: {
    title: "How it works",
    sub: "Eight stages, from idea to business. Each one only moves forward with real evidence.",
    phases: [
      {
        label: "Phase 1 · Idea → Product",
        steps: [
          { title: "Discovery", text: "Problem, proposition and founders." },
          { title: "Build", text: "Product live." },
          { title: "Working product", text: "Adoption, marketing and pricing." },
          { title: "Early traction", text: "Channel tested, stable product and activation." },
        ],
      },
      {
        label: "Phase 2 · Product → Business",
        steps: [
          { title: "Validation", text: "First paying customers, recurrence and a growing base." },
          { title: "Traction", text: "Validated channel, a larger base and pre-scale." },
          { title: "Scale", text: "Operational and financial structure to grow." },
          { title: "Maturity", text: "Governance and efficiency to create value." },
        ],
      },
    ],
  },
  platform: {
    title: "The platform",
    sub: "The human team decides; the modules execute.",
    modules: [
      { id: "jarvis", name: "Veris", role: "Orchestrator", text: "Coordinates the modules and brings you only what needs a decision." },
      { id: "helm", name: "Helm", role: "CEO", text: "Goals, OKRs and action plans." },
      { id: "vortex", name: "Vortex", role: "CMO", text: "Market research, brand, website, content and campaigns." },
      { id: "fabric", name: "Fabric", role: "CTO", text: "Builds and evolves the product, from code to release." },
      { id: "pulse", name: "Pulse", role: "COO", text: "Monitors operations, usage and the maturity of each stage." },
      { id: "kesh", name: "Kesh", role: "CFO", text: "Cash, P&L and margin with no manual entries." },
    ],
  },
  edge: {
    title: "Why Veridian",
    sub: "What changes for you.",
    items: [
      { title: "Development speed", text: "The development modules write, test and ship code every night, from 10 pm to 6 am. The product evolves in daily cycles." },
      { title: "Full support, from tech to marketing", text: "Development, monitored operations, support, content, campaigns and prospecting in the same contract." },
      { title: "Visibility and Client Portal", text: "In the portal, the client follows the company's stage, how its maturity evolves, the deliveries and the next step." },
      { title: "Competitive investment", text: "The monthly fee follows the company's stage and only goes up after the first paying customer. An app with a management dashboard costs R$ 70k to R$ 150k at a software house (Comunidade Sebrae, 2025)." },
    ],
  },
  contact: {
    title: "Contact",
    sub: "Tell us the idea. We review it personally.",
    emailLabel: "E-mail",
    siteLabel: "Site",
    groupLabel: "Group",
    group: "Veridian AI Studio & Ventures is a 4Profit AI group company.",
    footer: "© 2026 · Veridian AI Studio & Ventures",
    email: "contact@4profitai.com",
  },
  soon: "soon",
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
  brandName: "VERIDIAN",
  brandTag: "AI Studio & Ventures",
  nav: {
    portfolio: "Portfólio",
    audience: "Para quem é",
    how: "Como funciona",
    edge: "Diferenciais",
    platform: "Plataforma",
    contact: "Contato",
  },
  logout: "Sair",
  enter: "Entrar",
  scrollCue: "Role para entrar no estúdio",
  cta: "Envie sua ideia",
  ctaPortfolio: "Ver o portfólio",
  whatsappText: "Quero falar com a Veridian sobre uma ideia",
  hero: {
    eyebrow: "Veridian AI Studio & Ventures",
    lead: "Criamos e desenvolvemos startups com uma plataforma própria, com módulos autônomos que fazem o trabalho de produto, marketing, operação e gestão.",
    fact: "12 startups no portfólio",
  },
  headline: {
    a: "Transformamos ",
    idea: "ideias",
    b: " em produtos,",
    c: "e produtos em ",
    product: "negócios escaláveis",
    d: ".",
  },
  portfolio: {
    title: "Nosso portfólio",
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
    lines: {
      conciera: "Atendimento com IA para clínicas.",
      lovedopa: "Acompanhamento de pacientes com Parkinson.",
      boostdesign: "Protocolos de suplementação para farmácias de manipulação.",
      knexo: "Finanças pessoais pelo WhatsApp.",
      zettapay: "Pagamentos em cripto direto na carteira.",
      sofiaai: "Agente de vendas com IA e CRM.",
      fivsense: "Prevê o comportamento do cliente em conversas.",
      "veridian-helm": "CEO autônomo: metas, OKRs e planos de ação.",
      "veridian-kesh": "CFO autônomo: caixa, DRE e margem sem lançamento manual.",
      tsign: "Assinatura eletrônica sem mensalidade.",
      "knexo-jobs": "Vagas remotas com currículo e carta sob medida para cada candidatura.",
      superrdo: "Relatório diário de obra integrado ao MS Project.",
    },
  },
  audience: {
    title: "Para quem é",
    forLabel: "Para",
    modelLabel: "Modelo",
    items: [
      {
        n: "01",
        title: "Clientes",
        text: "Sua ideia vira produto no ar e negócio que fatura, sem montar um time do zero.",
        who: "Fundadores e empresas com uma ideia para tirar do papel ou um produto para acelerar.",
        model: "Assinatura mensal + equity",
      },
      {
        n: "02",
        title: "Parceiros",
        text: "Soluções construídas e operadas pela plataforma da Veridian, levadas aos seus clientes.",
        who: "Empresas que querem desenvolver soluções em conjunto ou distribuir a plataforma.",
        model: "Plano Enterprise + equity",
      },
      {
        n: "03",
        title: "Investidores",
        text: "Um portfólio de startups criadas com o mesmo método e a mesma plataforma, com maturidade medida por evidência.",
        who: "Quem quer participar das startups do portfólio.",
        model: "Participação nas startups",
      },
    ],
  },
  how: {
    title: "Como funciona",
    sub: "Oito etapas, da ideia ao negócio. Cada uma só avança com evidência real.",
    phases: [
      {
        label: "Fase 1 · Ideia → Produto",
        steps: [
          { title: "Descoberta", text: "Problema, proposta e fundadores." },
          { title: "Construção", text: "Produto no ar." },
          { title: "Produto funcional", text: "Adoção, marketing e preço." },
          { title: "Tração inicial", text: "Canal testado, produto estável e ativação." },
        ],
      },
      {
        label: "Fase 2 · Produto → Negócio",
        steps: [
          { title: "Validação", text: "Primeiros pagantes, recorrência e base crescendo." },
          { title: "Tração", text: "Canal validado, aumento da base e pré-escala." },
          { title: "Escala", text: "Estrutura operacional e financeira para crescer." },
          { title: "Maturidade", text: "Governança e eficiência para gerar valor." },
        ],
      },
    ],
  },
  platform: {
    title: "A plataforma",
    sub: "A equipe humana decide; os módulos executam.",
    modules: [
      { id: "jarvis", name: "Veris", role: "Orquestrador", text: "Coordena os módulos e traz para você só o que pede decisão." },
      { id: "helm", name: "Helm", role: "CEO", text: "Metas, OKRs e planos de ação." },
      { id: "vortex", name: "Vortex", role: "CMO", text: "Pesquisa de mercado, marca, site, conteúdo e campanhas." },
      { id: "fabric", name: "Fabric", role: "CTO", text: "Constrói e evolui o produto, do código à publicação." },
      { id: "pulse", name: "Pulse", role: "COO", text: "Monitora operação, uso e a maturidade de cada etapa." },
      { id: "kesh", name: "Kesh", role: "CFO", text: "Caixa, DRE e margem sem lançamento manual." },
    ],
  },
  edge: {
    title: "Diferenciais",
    sub: "O que muda para você.",
    items: [
      { title: "Velocidade de desenvolvimento", text: "Os módulos de desenvolvimento escrevem, testam e publicam código todas as noites, das 22h às 6h. O produto evolui em ciclos diários." },
      { title: "Suporte completo, do tech ao marketing", text: "Desenvolvimento, operação monitorada, suporte, conteúdo, campanhas e prospecção no mesmo contrato." },
      { title: "Visibilidade e Portal do Cliente", text: "O cliente acompanha no portal a fase da empresa, a evolução da maturidade, as entregas e o próximo passo." },
      { title: "Investimento competitivo", text: "A mensalidade acompanha a fase da empresa e só aumenta depois do primeiro cliente pagante. Um aplicativo com painel de gestão custa de R$ 70 mil a R$ 150 mil numa software house (Comunidade Sebrae, 2025)." },
    ],
  },
  contact: {
    title: "Contato",
    sub: "Conte a ideia. Analisamos pessoalmente.",
    emailLabel: "E-mail",
    siteLabel: "Site",
    groupLabel: "Grupo",
    group: "A Veridian AI Studio & Ventures é uma empresa do grupo 4Profit AI.",
    footer: "© 2026 · Veridian AI Studio & Ventures",
    email: "contact@4profitai.com",
  },
  soon: "em breve",
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
