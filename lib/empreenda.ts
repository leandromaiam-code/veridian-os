// Funil "Empreenda com IA" (veridian.4profitai.com/pt/empreenda).
// Uma pergunta por tela, em 5 blocos, com telas de reforço entre eles. Toda
// afirmação nas telas é sobre o que a Veridian faz de verdade; números saem da
// lista do portfólio (a mesma do site), nunca digitados. No fim, o cadastro vira
// lead do Growth Project "Veridian AI Studio" no Vortex.

export type Respostas = Record<string, string | string[] | undefined>;
export type Opcao = { v: string; t: string; d?: string };

type Base = { id: string; bloco: number; se?: (r: Respostas) => boolean };
export type Etapa = Base &
  (
    | { tipo: "abertura" }
    | { tipo: "unica"; campo: string; pergunta: string; ajuda?: string; opcoes: Opcao[] }
    | { tipo: "multipla"; campo: string; pergunta: string; ajuda?: string; opcoes: Opcao[]; max?: number }
    | { tipo: "texto"; campo: string; pergunta: string; ajuda?: string; placeholder: string; opcional?: boolean }
    | { tipo: "frase"; campo: string; frase: string }
    | { tipo: "info"; titulo: string; texto?: string; itens?: string[]; visual?: "portfolio" | "modulos" | "fases" | "validacao" | "perfil" | "caminhos" }
    | { tipo: "contato" }
  );

export const BLOCOS = ["Seu ponto de partida", "Seu momento", "O que você traz", "Como você quer empreender", "Seu resultado"];

const LOGO_BASE = "https://heqrvpoebkmliwnslxpi.supabase.co/storage/v1/object/public/brand-assets/workspaces";

// Mesma lista do portfólio do site (components/studio/overlay.tsx).
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

export const SETORES: Opcao[] = [
  { v: "saude", t: "Saúde" },
  { v: "financas", t: "Finanças" },
  { v: "vendas", t: "Vendas e varejo" },
  { v: "gestao", t: "Gestão de empresas" },
  { v: "construcao", t: "Construção e engenharia" },
  { v: "juridico", t: "Jurídico" },
  { v: "carreira", t: "Carreira e RH" },
  { v: "educacao", t: "Educação" },
  { v: "agro", t: "Agronegócio" },
  { v: "industria", t: "Indústria e logística" },
  { v: "outro", t: "Outro" },
];

export const MODULOS = [
  { nome: "Veris", papel: "Orquestrador", texto: "Coordena os módulos e traz para você só o que pede decisão." },
  { nome: "Vortex", papel: "CMO", texto: "Pesquisa de mercado, marca, site, conteúdo e campanhas." },
  { nome: "Fabric", papel: "CTO", texto: "Constrói e evolui o produto, do código à publicação." },
  { nome: "Pulse", papel: "COO", texto: "Monitora operação, uso e a maturidade de cada etapa." },
  { nome: "Helm", papel: "CEO", texto: "Metas, OKRs e planos de ação." },
  { nome: "Kesh", papel: "CFO", texto: "Caixa, DRE e margem sem lançamento manual." },
];

const temIdeia = (r: Respostas) => r.ideia === "definida" || r.ideia === "algumas";
const sim = (campo: string) => (r: Respostas) => r[campo] === "sim";

export const ETAPAS: Etapa[] = [
  { id: "abertura", bloco: 0, tipo: "abertura" },

  // 1 — Ponto de partida
  {
    id: "ideia", bloco: 0, tipo: "unica", campo: "ideia", pergunta: "Você já tem uma ideia de negócio?",
    opcoes: [
      { v: "definida", t: "Sim, tenho uma ideia definida", d: "Sei o problema que quero resolver." },
      { v: "algumas", t: "Tenho algumas ideias", d: "Ainda não escolhi qual seguir." },
      { v: "nao", t: "Não, quero liderar um projeto", d: "Quero empreender com um projeto da Veridian." },
    ],
  },
  {
    id: "ideia-frase", bloco: 0, tipo: "texto", campo: "ideia_frase", se: temIdeia,
    pergunta: "Conte a sua ideia em uma frase", ajuda: "Pode ser simples. Ninguém além da equipe da Veridian vai ler.",
    placeholder: "Ex.: um app que ajuda clínicas a confirmar consultas pelo WhatsApp",
  },
  {
    id: "ideia-estagio", bloco: 0, tipo: "unica", campo: "ideia_estagio", se: temIdeia, pergunta: "Em que ponto a sua ideia está?",
    opcoes: [
      { v: "papel", t: "Só no papel" },
      { v: "conversas", t: "Já conversei com possíveis clientes" },
      { v: "prototipo", t: "Tenho um protótipo ou uma primeira versão" },
      { v: "vendendo", t: "Já vendo, mas preciso crescer" },
    ],
  },
  {
    id: "i-caminhos", bloco: 0, tipo: "info", visual: "caminhos",
    titulo: "Dois caminhos para empreender com a Veridian",
    texto: "Você pode construir a sua própria ideia ou liderar um projeto que a Veridian já selecionou. Nos dois, a plataforma da Veridian faz o trabalho pesado.",
  },
  {
    id: "motivo", bloco: 0, tipo: "multipla", campo: "motivo", pergunta: "Por que você quer empreender?", ajuda: "Marque o que pesar para você.",
    opcoes: [
      { v: "liberdade", t: "Ter liberdade e decidir o próprio caminho" },
      { v: "patrimonio", t: "Construir patrimônio, não só salário" },
      { v: "impacto", t: "Resolver um problema que eu conheço de perto" },
      { v: "renda", t: "Criar uma nova fonte de renda" },
      { v: "legado", t: "Deixar algo que dure" },
      { v: "ia", t: "Aproveitar o momento da inteligência artificial" },
    ],
  },
  {
    id: "ja-empreendeu", bloco: 0, tipo: "unica", campo: "ja_empreendeu", pergunta: "Você já empreendeu antes?",
    opcoes: [
      { v: "nunca", t: "Nunca, seria a primeira vez" },
      { v: "tentei", t: "Já tentei, mas não foi para frente" },
      { v: "tenho", t: "Tenho ou tive uma empresa" },
      { v: "varias", t: "Já criei mais de um negócio" },
    ],
  },
  { id: "i-portfolio", bloco: 0, tipo: "info", visual: "portfolio", titulo: "A Veridian já cria e opera startups", texto: "Estes produtos foram criados e são operados na plataforma da Veridian, com o mesmo método que você vai usar." },

  // 2 — Momento
  {
    id: "situacao", bloco: 1, tipo: "unica", campo: "situacao", pergunta: "Qual a sua situação hoje?",
    opcoes: [
      { v: "clt", t: "Trabalho com carteira assinada" },
      { v: "empresario", t: "Tenho a minha empresa" },
      { v: "autonomo", t: "Sou autônomo ou profissional liberal" },
      { v: "transicao", t: "Estou em transição de carreira" },
      { v: "estudante", t: "Estou estudando" },
    ],
  },
  {
    id: "dedicacao", bloco: 1, tipo: "unica", campo: "dedicacao", pergunta: "Quanto tempo por semana você pode dedicar ao negócio?",
    opcoes: [
      { v: "integral", t: "Dedicação integral" },
      { v: "20-40", t: "20 a 40 horas" },
      { v: "10-20", t: "10 a 20 horas" },
      { v: "ate-10", t: "Até 10 horas" },
    ],
  },
  {
    id: "i-tempo", bloco: 1, tipo: "info", visual: "modulos", se: (r) => r.dedicacao !== "integral",
    titulo: "Você não precisa largar tudo para começar",
    texto: "Os módulos da Veridian fazem o trabalho do dia a dia. Você entra onde só o dono pode entrar: decisões, clientes e direção.",
  },
  {
    id: "quando", bloco: 1, tipo: "unica", campo: "quando", pergunta: "Quando você quer começar?",
    opcoes: [
      { v: "agora", t: "Agora, este mês" },
      { v: "3m", t: "Nos próximos 3 meses" },
      { v: "6m", t: "Nos próximos 6 meses" },
      { v: "explorando", t: "Ainda estou explorando" },
    ],
  },

  // 3 — O que você traz
  {
    id: "competencias", bloco: 2, tipo: "multipla", campo: "competencias", pergunta: "No que você é mais forte?", ajuda: "Escolha até 3.", max: 3,
    opcoes: [
      { v: "vendas", t: "Vendas e relacionamento com clientes" },
      { v: "gestao", t: "Gestão de pessoas e de equipes" },
      { v: "operacao", t: "Operação e processos" },
      { v: "marketing", t: "Marketing e comunicação" },
      { v: "financas", t: "Finanças e números" },
      { v: "tecnologia", t: "Tecnologia e produto" },
      { v: "setor", t: "Conhecimento profundo de um setor" },
    ],
  },
  {
    id: "setores", bloco: 2, tipo: "multipla", campo: "setores", pergunta: "Que setores você conhece ou quer explorar?", ajuda: "Marque quantos quiser.",
    opcoes: SETORES,
  },
  {
    id: "experiencia", bloco: 2, tipo: "unica", campo: "experiencia", pergunta: "Quantos anos de experiência profissional você tem?",
    opcoes: [
      { v: "0-3", t: "Até 3 anos" },
      { v: "4-9", t: "4 a 9 anos" },
      { v: "10-19", t: "10 a 19 anos" },
      { v: "20+", t: "20 anos ou mais" },
    ],
  },
  {
    id: "rede", bloco: 2, tipo: "unica", campo: "rede", pergunta: "Você tem acesso a possíveis clientes no setor que escolheu?",
    opcoes: [
      { v: "muitos", t: "Sim, conheço muita gente que compraria" },
      { v: "alguns", t: "Conheço algumas pessoas" },
      { v: "nao", t: "Ainda não" },
    ],
  },
  { id: "i-perfil", bloco: 2, tipo: "info", visual: "perfil", titulo: "Seu perfil de founder está se formando", texto: "Com o que você contou até aqui, já dá para ver onde você soma mais em uma startup." },

  // 4 — Como você quer empreender
  { id: "f-ideia", bloco: 3, tipo: "frase", campo: "frase_ideia", se: (r) => r.ideia !== "definida", frase: "Tenho vontade de empreender, mas falta a ideia certa." },
  { id: "i-ideia", bloco: 3, tipo: "info", se: sim("frase_ideia"), titulo: "Você pode começar por um projeto da Veridian", texto: "A Veridian seleciona founders para liderar projetos que já passaram pela pesquisa de mercado. Você assume o negócio; o Studio entrega produto, marketing e operação." },
  { id: "f-programar", bloco: 3, tipo: "frase", campo: "frase_programar", frase: "Não sei programar, e isso me trava." },
  { id: "i-programar", bloco: 3, tipo: "info", visual: "modulos", se: sim("frase_programar"), titulo: "Você não precisa programar", texto: "O Fabric constrói e evolui o produto. Você decide o que ele precisa fazer e aprova o que é entregue." },
  { id: "f-validar", bloco: 3, tipo: "frase", campo: "frase_validar", frase: "Tenho medo de investir e ninguém comprar." },
  { id: "i-validar", bloco: 3, tipo: "info", visual: "validacao", se: sim("frase_validar"), titulo: "Primeiro validar, depois construir", texto: "Antes de qualquer código, a Veridian pesquisa o mercado, define público e proposta de valor e coloca a página da oferta no ar." },
  { id: "f-time", bloco: 3, tipo: "frase", campo: "frase_time", frase: "Montar um time no começo custa caro demais." },
  { id: "i-time", bloco: 3, tipo: "info", visual: "fases", se: sim("frase_time"), titulo: "Um time completo desde o primeiro dia", texto: "Produto, marketing, operação e finanças no mesmo lugar, acompanhando a startup em cada fase, da ideia ao primeiro cliente pagante e além." },
  {
    id: "investimento", bloco: 3, tipo: "unica", campo: "investimento", pergunta: "Quanto você pretende investir nos primeiros 6 meses?",
    ajuda: "Ajuda a indicar o caminho certo para você. Não é compromisso.",
    opcoes: [
      { v: "tempo", t: "Só o meu tempo, por enquanto" },
      { v: "ate-20k", t: "Até R$ 20 mil" },
      { v: "20-60k", t: "De R$ 20 mil a R$ 60 mil" },
      { v: "60k+", t: "Mais de R$ 60 mil" },
    ],
  },
  {
    id: "sociedade", bloco: 3, tipo: "unica", campo: "sociedade", pergunta: "Você toparia ter a Veridian como sócia do negócio?",
    ajuda: "A Veridian pode entrar com o projeto e a estrutura em troca de uma participação.",
    opcoes: [
      { v: "sim", t: "Sim, faz sentido" },
      { v: "depende", t: "Depende das condições" },
      { v: "nao", t: "Prefiro ficar com 100%" },
    ],
  },
  {
    id: "trava", bloco: 3, tipo: "multipla", campo: "trava", pergunta: "O que mais te impede de começar hoje?",
    opcoes: [
      { v: "ideia", t: "Não sei qual ideia seguir" },
      { v: "tecnica", t: "Não sei construir o produto" },
      { v: "dinheiro", t: "Falta de dinheiro" },
      { v: "tempo", t: "Falta de tempo" },
      { v: "vender", t: "Não sei como vender" },
      { v: "sozinho", t: "Não quero empreender sozinho" },
    ],
  },
  { id: "i-final", bloco: 4, tipo: "info", visual: "fases", titulo: "Tudo pronto para montar o seu caminho", texto: "Com as suas respostas, a Veridian monta o seu perfil de founder e indica por onde começar." },
  { id: "contato", bloco: 4, tipo: "contato" },
];

export const etapasVisiveis = (r: Respostas) => ETAPAS.filter((e) => !e.se || e.se(r));

const rotulo = (lista: Opcao[], v: string) => lista.find((o) => o.v === v)?.t ?? v;
export function rotuloDe(campo: string, v: string): string {
  const e = ETAPAS.find((x) => "campo" in x && x.campo === campo);
  return e && "opcoes" in e ? rotulo(e.opcoes, v) : v;
}

export type Perfil = {
  caminho: "construir" | "explorar" | "liderar";
  caminhoTitulo: string;
  caminhoTexto: string;
  arquetipo: string;
  arquetipoTexto: string;
  fortes: string[];
  setores: string[];
  combinam: (typeof PORTFOLIO)[number][];
  proximos: string[];
};

const ARQ: Record<string, [string, string]> = {
  vendas: ["Founder de mercado", "Você abre portas e fecha negócios. É a peça que mais falta em startups criadas por quem só sabe construir."],
  marketing: ["Founder de mercado", "Você sabe chamar atenção e contar a história do produto. É a peça que mais falta em startups criadas por quem só sabe construir."],
  gestao: ["Founder operador", "Você organiza pessoas e processos. Startups que crescem precisam de quem faça a operação andar."],
  operacao: ["Founder operador", "Você organiza pessoas e processos. Startups que crescem precisam de quem faça a operação andar."],
  financas: ["Founder operador", "Você enxerga os números. Startups que crescem precisam de quem cuide do caixa e da margem."],
  setor: ["Founder especialista", "Você conhece um setor por dentro. É de onde saem os problemas que valem um negócio."],
  tecnologia: ["Founder construtor", "Você entende produto e tecnologia. Com a Veridian cuidando de mercado e operação, você foca no que constrói."],
};

export function montarPerfil(r: Respostas): Perfil {
  const comp = (r.competencias as string[] | undefined) ?? [];
  const set = (r.setores as string[] | undefined) ?? [];
  const caminho = r.ideia === "definida" ? "construir" : r.ideia === "algumas" ? "explorar" : "liderar";
  const ordem = ["setor", "vendas", "marketing", "gestao", "operacao", "financas", "tecnologia"];
  const chave = ordem.find((c) => comp.includes(c)) ?? "gestao";
  const [arquetipo, arquetipoTexto] = ARQ[chave];
  const combinam = PORTFOLIO.filter((p) => set.includes(p.setor));
  const caminhos = {
    construir: ["Construir a sua ideia com o Studio", "A Veridian valida o mercado da sua ideia, constrói o produto e cuida de marketing e operação. Você lidera o negócio."],
    explorar: ["Escolher a ideia certa e construir com o Studio", "Primeiro a Veridian pesquisa o mercado das suas ideias para escolher a mais promissora. Depois, o caminho é o mesmo: produto, marketing e operação com o Studio."],
    liderar: ["Liderar um projeto da Veridian", "A Veridian seleciona founders para liderar projetos que ela já pesquisou. Você assume o negócio; a Veridian entra com o projeto e a estrutura e participa como sócia."],
  } as const;
  const proximos = [
    "A equipe da Veridian lê as suas respostas",
    "Você recebe uma mensagem no WhatsApp para uma conversa",
    caminho === "liderar" ? "Na conversa, você conhece os projetos que combinam com você" : "Na conversa, você conta a sua ideia e vê como ela seria construída",
    "Se fizer sentido para os dois lados, vocês definem o formato da parceria",
  ];
  return {
    caminho,
    caminhoTitulo: caminhos[caminho][0],
    caminhoTexto: caminhos[caminho][1],
    arquetipo,
    arquetipoTexto,
    fortes: comp.map((c) => rotuloDe("competencias", c)),
    setores: set.filter((s) => s !== "outro").map((s) => rotulo(SETORES, s)),
    combinam,
    proximos,
  };
}
