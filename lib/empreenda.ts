// Funil "Empreenda com IA" (veridian.4profitai.com/pt/empreenda).
// Ordem (Leandro, 07/11/2026): meta de faturamento → dados (milionários ou demanda)
// → área → dados da área → contato (salva o lead) → tem ideia? → dores e desejos
// (caminho próprio para cada resposta) → ecossistema Veridian e parceiros
// estratégicos → (sem ideia: micro soluções da área) → horas, início e investimento
// → fechamento: WhatsApp (> R$ 10 mil/mês), agenda (R$ 3–10 mil, ou muitas vendas
// esperadas no 1º mês) ou avaliação. Todo número nas telas tem fonte.

export type Respostas = Record<string, string | string[] | undefined>;
export type Opcao = { v: string; t: string; d?: string };

type Base = { id: string; bloco: number; se?: (r: Respostas) => boolean };
export type Etapa = Base &
  (
    | { tipo: "faturamento"; campo: string; pergunta: string }
    | { tipo: "unica"; campo: string; pergunta: string; ajuda?: string; opcoes: Opcao[] }
    | { tipo: "multipla"; campo: string; pergunta: string; ajuda?: string; opcoes: Opcao[]; outro?: string }
    | { tipo: "solucoes"; campo: string; pergunta: string; ajuda?: string; outro: string }
    | { tipo: "texto"; campo: string; pergunta: string; ajuda?: string; placeholder: string }
    | { tipo: "frase"; campo: string; frase: string }
    | { tipo: "info"; titulo: string | ((r: Respostas) => string); texto?: string | ((r: Respostas) => string); visual?: Visual }
    | { tipo: "contato" }
  );
export type Visual = "milionarios" | "demanda" | "area" | "portfolio" | "modulos" | "fases" | "validacao" | "parceiros" | "projetos";

export const BLOCOS = ["Sua meta", "Sua área", "Seu ponto de partida", "Ecossistema Veridian", "Seu plano"];

// Página de agendamento do Google Agenda do Leandro (criada em 07/11/2026).
export const AGENDA_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2AqdjfG3qCve6LtvaTVjL4LLiTi4zEPaImpYA3O_ETU9nweSIzhZSoZImgJEmFtaxyIben35Ll";
export const META_GRANDE = 20000; // a partir daqui: dados de quem ficou milionário

const LOGO_BASE = "https://heqrvpoebkmliwnslxpi.supabase.co/storage/v1/object/public/brand-assets/workspaces";

export const PORTFOLIO = [
  { id: "conciera", nome: "Conciera", setor: "saude", linha: "Atendimento com IA para clínicas.", logo: `${LOGO_BASE}/conciera/logo.png` },
  { id: "lovedopa", nome: "LoveDopa", setor: "saude", linha: "Acompanhamento de pacientes com Parkinson.", logo: `${LOGO_BASE}/lovedopa/logo.png` },
  { id: "boostdesign", nome: "BoostDesign", setor: "saude", linha: "Protocolos de suplementação para farmácias de manipulação.", logo: `${LOGO_BASE}/boostdesign/logo.png?v=1791142954` },
  { id: "knexo", nome: "kNexo", setor: "financas", linha: "Finanças pessoais pelo WhatsApp.", logo: `${LOGO_BASE}/knexo/logo.png` },
  { id: "zettapay", nome: "ZettaPay", setor: "financas", linha: "Pagamentos em cripto direto na carteira.", logo: `${LOGO_BASE}/zettapay/logo.png?v=1791212046` },
  { id: "sofiaai", nome: "SofiaAI", setor: "vendas", linha: "Agente de vendas com IA e CRM.", logo: `${LOGO_BASE}/sofiaai/logo.png?v=1791212045` },
  { id: "fivsense", nome: "FivSense", setor: "vendas", linha: "Prevê o comportamento do cliente em conversas.", logo: `${LOGO_BASE}/fivsense/logo.png?v=1791142952` },
  { id: "veridian-helm", nome: "Helm", setor: "gestao", linha: "CEO autônomo: metas, OKRs e planos de ação.", logo: `${LOGO_BASE}/veridian-helm/logo.png` },
  { id: "veridian-kesh", nome: "Kesh", setor: "gestao", linha: "CFO autônomo: caixa, DRE e margem.", logo: `${LOGO_BASE}/veridian-kesh/logo.png` },
  { id: "tsign", nome: "Tsign", setor: "juridico", linha: "Assinatura eletrônica sem mensalidade.", logo: `${LOGO_BASE}/tsign/logo.png?v=1791136478` },
  { id: "knexo-jobs", nome: "kNexo Jobs", setor: "carreira", linha: "Vagas com currículo sob medida para cada candidatura.", logo: `${LOGO_BASE}/knexo-jobs/logo.png?v=1791215781` },
  { id: "superrdo", nome: "SuperRDO", setor: "construcao", linha: "Relatório diário de obra integrado ao MS Project.", logo: `${LOGO_BASE}/superrdo/logo.png?v=1791135407` },
] as const;

export const MODULOS = [
  { nome: "Veris", papel: "Orquestrador", texto: "Coordena os módulos e traz para você só o que pede decisão." },
  { nome: "Vortex", papel: "CMO", texto: "Pesquisa de mercado, marca, site, conteúdo e campanhas." },
  { nome: "Fabric", papel: "CTO", texto: "Constrói e evolui o produto, do código à publicação." },
  { nome: "Pulse", papel: "COO", texto: "Monitora operação, uso e a maturidade de cada etapa." },
  { nome: "Helm", papel: "CEO", texto: "Metas, OKRs e planos de ação." },
  { nome: "Kesh", papel: "CFO", texto: "Caixa, DRE e margem sem lançamento manual." },
];

// ---------------- dados com fonte (pesquisa de 07/11/2026) ----------------
export type Dado = { destaque: string; texto: string; fonte: string; url: string };

export const DADOS: Record<"milionarios" | "demanda", Dado[]> = {
  milionarios: [
    { destaque: "9.215", texto: "novos milionários em dólar no Brasil em 2025. O país chegou a 386 mil, o maior número da América Latina.", fonte: "UBS Global Wealth Report 2026, via InfoMoney · jun/2026", url: "https://www.infomoney.com.br/?p=3393301" },
    { destaque: "2.600 por dia", texto: "Quase 1 milhão de pessoas viraram milionárias no mundo em 2025.", fonte: "UBS Global Wealth Report 2026 · jun/2026", url: "https://www.ubs.com/jp/ja/about/newsdisplay-ndp/en-20260630-gwr-2026.html" },
    { destaque: "45", texto: "novos bilionários da IA entraram na lista da Forbes em 12 meses. São pelo menos 86 no total.", fonte: "Forbes · mar/2026", url: "https://www.forbes.com/sites/phoebeliu/2026/03/10/meet-the-45-ai-newcomers-to-forbes-2026-billionaires-list/" },
    { destaque: "2×", texto: "mais startups chegaram a US$ 10 milhões de receita anual em só 3 meses em 2025.", fonte: "Carta anual da Stripe, via TechCrunch · fev/2026", url: "https://techcrunch.com/2026/02/24/more-startups-are-hitting-10m-arr-in-3-months-than-ever-before" },
  ],
  demanda: [
    { destaque: "98%", texto: "das empresas brasileiras pretendem aumentar o orçamento de IA no próximo ciclo. 95% já usam IA.", fonte: "Bain & Company Brasil · 2026", url: "https://www.bain.com/pt-br/insights/uso-de-ia-chega-a-95-das-empresas-no-brasil/" },
    { destaque: "60%", texto: "dos pequenos negócios do Brasil pretendem adotar ou ampliar o uso de IA nos próximos 6 meses. Nos EUA, 24%.", fonte: "Sebrae · ago/2026", url: "https://agenciasebrae.com.br/dados/pequenos-negocios-do-brasil-usam-mais-ia-que-os-norte-americanos-aponta-sebrae/" },
    { destaque: "84%", texto: "dos executivos brasileiros dizem que a IA já gera valor relevante. 87% a mantêm como prioridade.", fonte: "KPMG Global AI Pulse · set/2026", url: "https://kpmg.com/br/pt/insights/2026/09/global-ai-pulse-q2-2026.html" },
    { destaque: "US$ 100 bi", texto: "é o mercado de automação com agentes de IA só nos EUA, e mais de 90% ainda não foi capturado.", fonte: "Bain & Company · mai/2026", url: "https://www.bain.com/pt-br/about/media-center/press-releases/2026/saas-next-$100-billion-opportunity-could-come-from-agentic-ai--bain--co-research/" },
  ],
};

export const AREAS: Opcao[] = [
  { v: "marketing", t: "Marketing" },
  { v: "comercial", t: "Comercial e vendas" },
  { v: "supply", t: "Supply chain" },
  { v: "projetos", t: "Projetos" },
  { v: "rh", t: "RH" },
  { v: "juridico", t: "Jurídico" },
  { v: "ti", t: "TI" },
  { v: "financeiro", t: "Financeiro" },
  { v: "operacao", t: "Operação" },
  { v: "outra", t: "Outra área" },
];

export const DADOS_AREA: Record<string, Dado[]> = {
  marketing: [
    { destaque: "75%", texto: "dos profissionais de marketing já usam IA no dia a dia.", fonte: "Salesforce State of Marketing, via Propmark · abr/2026", url: "https://propmark.com.br/digital/75-dos-profissionais-de-marketing-usam-ia-na-rotina-aponta-salesforce/" },
    { destaque: "74%", texto: "dos MEIs que usam IA a usam em marketing e divulgação, a finalidade mais comum.", fonte: "Sebrae/FGV/Google · nov/2025", url: "https://datasebrae.com.br/wp-content/uploads/2026/01/Uso-de-IA-nos-negocios-2025.pdf" },
  ],
  comercial: [
    { destaque: "54%", texto: "dos vendedores já usaram agentes de IA, e quase 9 em cada 10 pretendem usar até 2027.", fonte: "Salesforce State of Sales · fev/2026", url: "https://www.salesforce.com/news/stories/state-of-sales-report-announcement-2026/" },
    { destaque: "89%", texto: "dos projetos de IA na área comercial são aprovados no Brasil, em média.", fonte: "Bain & Company Brasil · 2026", url: "https://www.bain.com/pt-br/insights/uso-de-ia-chega-a-95-das-empresas-no-brasil/" },
  ],
  supply: [
    { destaque: "55%", texto: "dos líderes de supply chain esperam que agentes de IA reduzam a necessidade de contratar para cargos de entrada.", fonte: "Gartner · fev/2026", url: "https://www.gartner.com/en/newsroom/press-releases/2026-02-25-gartner-survey-shows-55-percent-of-supply-chain-leaders-expect-agentic-ai-to-reduce-entry-level-hiring-needs" },
  ],
  projetos: [
    { destaque: "97%", texto: "dos profissionais de gestão de projetos e portfólio já usam IA no trabalho.", fonte: "Smartsheet PPM Priorities Report · 2026", url: "https://www.smartsheet.com/ppm-priorities-report-2026-mobile" },
    { destaque: "36% → 70%", texto: "das organizações passaram a usar IA em projetos em dois anos.", fonte: "APM · set/2025", url: "https://www.apm.org.uk/news/ai-use-in-project-management-nearly-doubles-in-just-two-years-apm-survey-finds/" },
  ],
  rh: [
    { destaque: "39%", texto: "das organizações já implantaram IA no RH. A maior parte ainda não: há espaço para crescer.", fonte: "SHRM State of AI in HR · abr/2026", url: "https://www.shrm.org/in/executive-network/insights/state-of-ai-hr-2026-5-critical-insights-chros" },
  ],
  juridico: [
    { destaque: "22% → 40%", texto: "foi o salto do uso de IA em toda a organização em serviços profissionais, incluindo o jurídico, em um ano.", fonte: "Thomson Reuters Institute · fev/2026", url: "https://www.thomsonreuters.com/en/institute/articles/ai-in-professional-services-report-2026" },
    { destaque: "Mais da metade", texto: "dos departamentos jurídicos de empresas quer que os escritórios externos usem IA nos casos.", fonte: "Thomson Reuters Institute · fev/2026", url: "https://www.thomsonreuters.com/en/institute/articles/ai-in-professional-services-report-2026" },
  ],
  ti: [
    { destaque: "+25 p.p.", texto: "foi o avanço do uso de IA em TI no Brasil em um ano, a área que mais acelerou.", fonte: "Bain & Company Brasil · 2026", url: "https://www.bain.com/pt-br/insights/uso-de-ia-chega-a-95-das-empresas-no-brasil/" },
    { destaque: "+80,8%", texto: "deve crescer o gasto mundial com modelos de IA generativa em 2026.", fonte: "Gartner, via DIGIT · fev/2026", url: "https://www.digit.fyi/worldwide-it-spending-to-grow-10-8-in-2026-gartner-says/" },
  ],
  financeiro: [
    { destaque: "37% → 59%", texto: "dos líderes de finanças passaram a usar IA na área financeira desde 2023.", fonte: "Gartner, via CPA Practice Advisor · nov/2025", url: "https://www.cpapracticeadvisor.com/2025/11/18/gartner-survey-shows-finance-ai-adoption-remains-steady-in-2025/" },
    { destaque: "66%", texto: "das áreas financeiras que adotaram IA citam eficiência e produtividade como grande benefício.", fonte: "Gartner, via CPA Practice Advisor · mai/2026", url: "https://cpapracticeadvisor.com/2026/05/28/gartner-says-cfos-must-stop-mistaking-finance-ai-deployment-for-value-creation/184094" },
  ],
  operacao: [
    { destaque: "+23 p.p.", texto: "foi o avanço do uso de IA em Operações no Brasil em um ano, o 2º maior entre as áreas.", fonte: "Bain & Company Brasil · 2026", url: "https://www.bain.com/pt-br/insights/uso-de-ia-chega-a-95-das-empresas-no-brasil/" },
  ],
};

// 3 a 5 micro soluções por área, para quem ainda não tem ideia.
export const SOLUCOES: Record<string, Opcao[]> = {
  marketing: [
    { v: "mkt-conteudo", t: "Conteúdo e calendário de posts gerados com IA" },
    { v: "mkt-leads", t: "Agente que atende e qualifica leads no Instagram e WhatsApp" },
    { v: "mkt-relatorio", t: "Relatório automático de campanhas" },
    { v: "mkt-landing", t: "Landing page pronta para cada campanha" },
  ],
  comercial: [
    { v: "com-sdr", t: "SDR com IA no WhatsApp que qualifica e agenda reuniões" },
    { v: "com-crm", t: "CRM que registra as conversas e sugere o próximo passo" },
    { v: "com-proposta", t: "Gerador de propostas comerciais" },
    { v: "com-followup", t: "Follow-up automático de leads parados" },
  ],
  supply: [
    { v: "sup-demanda", t: "Previsão de demanda e reposição de estoque" },
    { v: "sup-cotacao", t: "Cotação automática com fornecedores" },
    { v: "sup-pedidos", t: "Acompanhamento de pedidos e entregas com alertas" },
    { v: "sup-notas", t: "Leitura e conferência automática de notas fiscais" },
  ],
  projetos: [
    { v: "prj-rdo", t: "Relatório diário de obra ou projeto por voz" },
    { v: "prj-status", t: "Status report automático a partir das tarefas" },
    { v: "prj-mudancas", t: "Controle de mudanças e aditivos" },
    { v: "prj-cronograma", t: "Cronograma e planejamento assistidos por IA" },
  ],
  rh: [
    { v: "rh-triagem", t: "Triagem de currículos e entrevista inicial com IA" },
    { v: "rh-onboarding", t: "Onboarding de novos funcionários por chat" },
    { v: "rh-duvidas", t: "Atendimento de dúvidas de RH (férias, benefícios)" },
    { v: "rh-clima", t: "Pesquisa de clima com análise automática" },
  ],
  juridico: [
    { v: "jur-contratos", t: "Revisão de contratos com os pontos de risco" },
    { v: "jur-minutas", t: "Gerador de minutas e documentos" },
    { v: "jur-prazos", t: "Acompanhamento de prazos e processos" },
    { v: "jur-triagem", t: "Atendimento inicial e triagem de casos" },
  ],
  ti: [
    { v: "ti-helpdesk", t: "Agente de suporte (help desk) com IA" },
    { v: "ti-integracao", t: "Integração entre sistemas (ERP, CRM, planilhas)" },
    { v: "ti-docs", t: "Documentação automática de sistemas" },
    { v: "ti-monitor", t: "Monitoramento com alertas inteligentes" },
  ],
  financeiro: [
    { v: "fin-conciliacao", t: "Conciliação bancária automática" },
    { v: "fin-cobranca", t: "Contas a pagar e a receber com cobrança automática" },
    { v: "fin-dre", t: "DRE e fluxo de caixa sem planilha" },
    { v: "fin-notas", t: "Leitura e lançamento de notas e boletos" },
  ],
  operacao: [
    { v: "op-checklist", t: "Checklists e inspeções por foto e voz" },
    { v: "op-os", t: "Ordens de serviço automáticas" },
    { v: "op-painel", t: "Painel de indicadores em tempo real" },
    { v: "op-atendimento", t: "Atendimento ao cliente 24h com IA" },
  ],
  outra: [
    { v: "out-whats", t: "Atendimento com IA no WhatsApp" },
    { v: "out-automacao", t: "Automação de tarefas repetitivas" },
    { v: "out-painel", t: "Painel de gestão com indicadores" },
    { v: "out-app", t: "App sob medida para um setor" },
  ],
};

// Régua de faturamento mensal (R$), em degraus.
export const DEGRAUS_FATURAMENTO = [5000, 10000, 20000, 30000, 50000, 75000, 100000, 150000, 200000, 300000, 500000, 1000000];
export const reais = (n: number) =>
  n >= 1000000 ? `R$ ${(n / 1000000).toLocaleString("pt-BR")} milhão` : `R$ ${(n / 1000).toLocaleString("pt-BR")} mil`;
export const meta = (r: Respostas) => Number(r.faturamento_12m) || 0;

const temIdeia = (r: Respostas) => r.ideia === "definida";
const temAlgumas = (r: Respostas) => r.ideia === "algumas";
const semIdeia = (r: Respostas) => r.ideia === "nao";
const sim = (campo: string) => (r: Respostas) => r[campo] === "sim";
const nomeArea = (r: Respostas) => AREAS.find((a) => a.v === r.area)?.t ?? "sua área";

export const ETAPAS: Etapa[] = [
  // 1 — Meta
  { id: "faturamento", bloco: 0, tipo: "faturamento", campo: "faturamento_12m", pergunta: "Quanto você quer estar faturando daqui a 12 meses?" },
  {
    id: "i-milionarios", bloco: 0, tipo: "info", visual: "milionarios", se: (r) => meta(r) >= META_GRANDE,
    titulo: "A IA está criando uma nova geração de milionários",
    texto: (r) => `Sua meta de ${reais(meta(r))} por mês é ambiciosa e possível. Veja o que está acontecendo.`,
  },
  {
    id: "i-demanda", bloco: 0, tipo: "info", visual: "demanda", se: (r) => meta(r) < META_GRANDE,
    titulo: "Nunca houve tanta empresa querendo comprar soluções com IA",
    texto: (r) => `Para chegar a ${reais(meta(r))} por mês, você precisa de clientes. E eles estão procurando.`,
  },

  // 2 — Área
  { id: "area", bloco: 1, tipo: "unica", campo: "area", pergunta: "Qual é a sua área de atuação?", opcoes: AREAS },
  {
    id: "i-area", bloco: 1, tipo: "info", visual: "area",
    titulo: (r) => (r.area === "outra" ? "A IA está mudando todas as áreas" : `O que está acontecendo em ${nomeArea(r)}`),
    texto: "Quem conhece a área por dentro sabe quais problemas valem uma solução. É aí que nascem os melhores negócios com IA.",
  },
  { id: "contato", bloco: 1, tipo: "contato" },

  // 3 — Ponto de partida
  {
    id: "ideia", bloco: 2, tipo: "unica", campo: "ideia", pergunta: "Você já tem uma ideia de negócio?",
    opcoes: [
      { v: "definida", t: "Sim, tenho uma ideia definida", d: "Sei o problema que quero resolver." },
      { v: "algumas", t: "Tenho algumas possibilidades", d: "Ainda não escolhi qual seguir." },
      { v: "nao", t: "Ainda não tenho", d: "Quero empreender com o projeto certo." },
    ],
  },
  // com ideia
  { id: "ideia-frase", bloco: 2, tipo: "texto", campo: "ideia_frase", se: temIdeia, pergunta: "Conte a sua ideia em uma frase", ajuda: "Só a equipe da Veridian vai ler.", placeholder: "Ex.: um app que confirma consultas de clínicas pelo WhatsApp" },
  {
    id: "ideia-estagio", bloco: 2, tipo: "unica", campo: "ideia_estagio", se: temIdeia, pergunta: "Em que ponto ela está?",
    opcoes: [{ v: "papel", t: "Só no papel" }, { v: "conversas", t: "Já conversei com possíveis clientes" }, { v: "prototipo", t: "Tenho um protótipo" }, { v: "vendendo", t: "Já vendo, mas preciso crescer" }],
  },
  { id: "f-validar", bloco: 2, tipo: "frase", campo: "frase_validar", se: (r) => temIdeia(r) || temAlgumas(r), frase: "Tenho medo de investir e ninguém comprar." },
  { id: "i-validar", bloco: 2, tipo: "info", visual: "validacao", se: (r) => (temIdeia(r) || temAlgumas(r)) && r.frase_validar === "sim", titulo: "Primeiro validar, depois construir", texto: "Antes de qualquer código, a Veridian pesquisa o mercado, define público e proposta de valor e coloca a oferta no ar." },
  // algumas possibilidades
  { id: "ideias-texto", bloco: 2, tipo: "texto", campo: "ideia_frase", se: temAlgumas, pergunta: "Quais ideias você está considerando?", ajuda: "Uma por linha, do jeito que vier.", placeholder: "Ex.: sistema de cobrança para clínicas\nagente de vendas para imobiliárias" },
  { id: "f-qual", bloco: 2, tipo: "frase", campo: "frase_qual", se: temAlgumas, frase: "Tenho ideias, mas não sei qual tem mais chance de dar certo." },
  { id: "i-qual", bloco: 2, tipo: "info", visual: "validacao", se: (r) => temAlgumas(r) && r.frase_qual === "sim", titulo: "A pesquisa escolhe a mais promissora", texto: "A Veridian pesquisa o mercado de cada ideia, com dados e fontes, e mostra qual tem dor real e cliente disposto a pagar." },
  // sem ideia
  {
    id: "rede", bloco: 2, tipo: "unica", campo: "rede", se: semIdeia, pergunta: "Você tem uma boa rede de contatos profissionais?",
    opcoes: [{ v: "grande", t: "Sim, conheço muita gente que decide compras" }, { v: "media", t: "Tenho uma rede razoável" }, { v: "pequena", t: "Ainda é pequena" }],
  },
  {
    id: "rede-areas", bloco: 2, tipo: "multipla", campo: "rede_areas", se: (r) => semIdeia(r) && r.rede !== "pequena",
    pergunta: "Em que áreas estão os seus contatos?", ajuda: "Marque quantas quiser.", opcoes: AREAS.filter((a) => a.v !== "outra"), outro: "rede_outro",
  },
  { id: "f-ideia", bloco: 2, tipo: "frase", campo: "frase_ideia", se: semIdeia, frase: "Quero empreender, mas falta a ideia certa." },
  { id: "i-ideia", bloco: 2, tipo: "info", visual: "projetos", se: (r) => semIdeia(r) && r.frase_ideia === "sim", titulo: "Você não precisa começar do zero", texto: "A Veridian seleciona parceiros para liderar projetos que já passaram pela pesquisa de mercado. Você leva o negócio ao mercado; a Veridian entra com o produto e a estrutura." },
  // dores comuns
  { id: "f-programar", bloco: 2, tipo: "frase", campo: "frase_programar", frase: "Não sei programar, e isso me trava." },
  { id: "i-programar", bloco: 2, tipo: "info", visual: "modulos", se: sim("frase_programar"), titulo: "Você não precisa programar", texto: "Os módulos da Veridian constroem e operam o produto. Você decide o que ele precisa fazer e aprova o que é entregue." },
  { id: "f-sozinho", bloco: 2, tipo: "frase", campo: "frase_sozinho", frase: "Não quero empreender sozinho." },
  { id: "i-sozinho", bloco: 2, tipo: "info", visual: "fases", se: sim("frase_sozinho"), titulo: "Um time completo desde o primeiro dia", texto: "Produto, marketing, operação e finanças no mesmo lugar, em cada fase, da ideia ao primeiro cliente pagante e além." },

  // 4 — Ecossistema
  {
    id: "i-ecossistema", bloco: 3, tipo: "info", visual: "portfolio",
    titulo: "O ecossistema Veridian",
    texto: (r) => `Startups criadas e operadas na mesma plataforma, com o mesmo método. É a estrutura para você chegar aos ${reais(meta(r))} por mês.`,
  },
  {
    id: "i-parceiros", bloco: 3, tipo: "info", visual: "parceiros",
    titulo: "Estamos selecionando parceiros estratégicos",
    texto: "A Veridian está escolhendo poucas pessoas para construir novos negócios junto com ela. As próximas perguntas mostram se o seu perfil combina.",
  },
  {
    id: "solucoes", bloco: 3, tipo: "solucoes", campo: "solucoes", se: semIdeia, outro: "solucao_outro",
    pergunta: "Que tipo de solução você acredita que tem mais chance de vender?", ajuda: "Pode marcar mais de uma.",
  },

  // 5 — Plano
  {
    id: "horas", bloco: 4, tipo: "unica", campo: "horas", pergunta: "Quantas horas por semana você pode dedicar a um novo projeto?",
    opcoes: [{ v: "ate-5", t: "Até 5 horas" }, { v: "5-10", t: "5 a 10 horas" }, { v: "10-20", t: "10 a 20 horas" }, { v: "20-40", t: "20 a 40 horas" }, { v: "40+", t: "Dedicação integral" }],
  },
  {
    id: "quando", bloco: 4, tipo: "unica", campo: "quando", pergunta: "Para quando você quer iniciar?",
    opcoes: [{ v: "agora", t: "Agora" }, { v: "30d", t: "Nos próximos 30 dias" }, { v: "3m", t: "Nos próximos 3 meses" }, { v: "6m", t: "Em até 6 meses" }],
  },
  {
    id: "investimento", bloco: 4, tipo: "unica", campo: "investimento", pergunta: "Quanto você pode investir por mês no novo negócio?",
    opcoes: [{ v: "ate-3k", t: "Até R$ 3 mil por mês" }, { v: "3-10k", t: "De R$ 3 mil a R$ 10 mil por mês" }, { v: "10k+", t: "Acima de R$ 10 mil por mês" }],
  },
  {
    id: "vendas", bloco: 4, tipo: "unica", campo: "vendas_mes1", se: (r) => r.investimento === "ate-3k",
    pergunta: "Quantas vendas você acredita que faria na sua rede de contatos já no primeiro mês?",
    opcoes: [{ v: "0", t: "Nenhuma, ainda" }, { v: "1-2", t: "1 ou 2" }, { v: "3-5", t: "3 a 5" }, { v: "6-10", t: "6 a 10" }, { v: "10+", t: "Mais de 10" }],
  },
];

export const etapasVisiveis = (r: Respostas) => ETAPAS.filter((e) => !e.se || e.se(r));

export type Destino = "whatsapp" | "agenda" | "avaliar";
export function destino(r: Respostas): Destino {
  if (r.investimento === "10k+") return "whatsapp";
  if (r.investimento === "3-10k") return "agenda";
  if (r.vendas_mes1 === "6-10" || r.vendas_mes1 === "10+") return "agenda";
  return "avaliar";
}

const rotulo = (lista: Opcao[], v: string) => lista.find((o) => o.v === v)?.t ?? v;
const todasSolucoes = Object.values(SOLUCOES).flat();
export function rotuloDe(campo: string, v: string): string {
  if (campo === "faturamento_12m") return Number(v) ? reais(Number(v)) + " por mês" : v;
  if (campo === "solucoes") return rotulo(todasSolucoes, v);
  const e = ETAPAS.find((x) => "campo" in x && x.campo === campo);
  return e && "opcoes" in e ? rotulo(e.opcoes, v) : v;
}
export const perguntaDe = (e: Etapa) => ("pergunta" in e ? e.pergunta : "frase" in e ? e.frase : "");
export const textoDe = (v: string | ((r: Respostas) => string) | undefined, r: Respostas) => (typeof v === "function" ? v(r) : v ?? "");
