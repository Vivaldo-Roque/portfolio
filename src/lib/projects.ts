export type Scene = {
  eyebrow: string;
  title: string;
  body: string;
  accent: string;
};

export type ShowcaseProject = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  href: string;
  accent: string;
  image: string;
  scenes: Scene[];
};

export type Project = ShowcaseProject & {
  category: "Web" | "Mobile";
};

export const defaultScenes = (name: string, tags: string[]): Scene[] => [
  {
    eyebrow: "Problema",
    title: "O ponto de partida",
    body: `${name} nasceu de uma necessidade real — um problema concreto que precisava de uma solução pensada de raíz.`,
    accent: "from-moss/40 to-emerald-500/10",
  },
  {
    eyebrow: "Stack",
    title: "Construído com intenção",
    body: `Escolhi ${tags.join(', ')} para equilibrar performance, manutenção e velocidade de iteração.`,
    accent: "from-lime/40 to-moss/10",
  },
  {
    eyebrow: "Experiência",
    title: "Fluído, acessível, focado",
    body: "Interface limpa, animações sóbrias e foco total no fluxo principal — sem ruído.",
    accent: "from-emerald-400/40 to-moss/10",
  },
  {
    eyebrow: "Resultado",
    title: "O que ficou",
    body: "Um produto que entrega valor desde o primeiro clique e que continua a evoluir.",
    accent: "from-moss/40 to-lime/20",
  },
];

export const projects: Project[] = [
  {
    id: "cfop_trainer",
    name: "CFOP Trainer",
    description: "CFOP TRAINER, UMA FERRAMENTA PARA AJUDÁ-LO A APRENDER E TREINAR CFOP.",
    tags: ["Flutter", "Dardo", "Sqlite", "HTML", "CSS", "JAVASCRIPT"],
    category: "Mobile",
    href: "#",
    accent: "from-moss/30 to-emerald-500/10",
    image: "/img/works/cfoptrainer.png",
    scenes: defaultScenes("CFOP Trainer", ["Flutter", "Dardo", "Sqlite", "HTML", "CSS", "JAVASCRIPT"]),
  },
  {
    id: "tictactoe",
    name: "Jogo da Velha",
    description: "JOGO TICTACTOE COM IA USANDO JAVASCRIPT.",
    tags: ["CSS", "HTML", "JAVASCRIPT"],
    category: "Web",
    href: "https://github.com/Vivaldo-Roque/TicTacToe",
    accent: "from-lime/30 to-moss/10",
    image: "/img/works/tictactoe.png",
    scenes: defaultScenes("Jogo da Velha", ["CSS", "HTML", "JAVASCRIPT"]),
  },
  {
    id: "vivacubesolver",
    name: "VivaCubeSolver",
    description: "APLICATIVO CAPAZ DE RESOLVER O CUBO MÁGICO A PARTIR DE IMAGENS CAPTURADAS PELA CÂMERA.",
    tags: ["Android", "Java", "Python"],
    category: "Mobile",
    href: "https://github.com/Vivaldo-Roque/VivaCubeSolver",
    accent: "from-emerald-400/30 to-moss/10",
    image: "/img/works/vivacubesolver.jpg",
    scenes: defaultScenes("VivaCubeSolver", ["Android", "Java", "Python"]),
  },
  {
    id: "iska_minhas_notas",
    name: "ISKA MINHAS NOTAS",
    description: "APLICATIVO CAPAZ DE EXTRAIR DADOS DO ALUNO DA SECRETARIA ONLINE DO ISKA ATRAVÉS DAS CREDENCIAIS DO ALUNO.",
    tags: ["Android", "Java", "Jsoup", "Apache POI", "HTML"],
    category: "Mobile",
    href: "https://github.com/Vivaldo-Roque/ISKA_Minhas_Notas",
    accent: "from-moss/40 to-lime/10",
    image: "/img/works/iskaminhasnotas.png",
    scenes: defaultScenes("ISKA MINHAS NOTAS", ["Android", "Java", "Jsoup", "Apache POI", "HTML"]),
  },
  {
    id: "banco_viva",
    name: "Banco Viva",
    description: "Este é um projeto simples criado utilizando a framework Django. Simula um sistema de conta bancária com operações CRUD básicas (Criar, Ler, Atualizar, Apagar). Criei-o como parte da minha jornada de aprendizagem.",
    tags: ["Python", "Django", "Bootstrap", "Fontawesome"],
    category: "Web",
    href: "https://github.com/Vivaldo-Roque/bancoviva",
    accent: "from-lime/20 to-emerald-500/10",
    image: "/img/works/bancoviva.png",
    scenes: defaultScenes("Banco Viva", ["Python", "Django", "Bootstrap", "Fontawesome"]),
  },
  {
    id: "ecommerce_mobile",
    name: "App Mobile de Ecommerce",
    description: "UMA APLICAÇÃO MOBILE DE ECOMMERCE COMPLETA CONSTRUÍDA COM FLUTTER, PROPORCIONANDO UMA EXPERIÊNCIA DE COMPRA PERFEITA PARA OS USUÁRIOS.",
    tags: ["Flutter", "Dart", "GetX", "Firebase Authentication", "Firebase Firestore", "Firebase Hosting"],
    category: "Mobile",
    href: "#",
    accent: "from-emerald-500/30 to-moss/10",
    image: "/img/works/flutter_ecommerce_1.png",
    scenes: defaultScenes("App Mobile de Ecommerce", ["Flutter", "Dart", "GetX", "Firebase Authentication", "Firebase Firestore", "Firebase Hosting"]),
  },
  {
    id: "ecommerce_web_admin",
    name: "Dashboard Admin Web de Ecommerce",
    description: "UM DASHBOARD ADMIN WEB ABRANGENTE PARA GESTÃO DE OPERAÇÕES DE ECOMMERCE, CONSTRUÍDO COM FLUTTER PARA WEB.",
    tags: ["Flutter", "Dart", "GetX", "Firebase Authentication", "Firebase Firestore", "Firebase Hosting"],
    category: "Web",
    href: "#",
    accent: "from-moss/30 to-emerald-500/10",
    image: "/img/works/flutter_web_ecommerce_1.png",
    scenes: defaultScenes("Dashboard Admin Web de Ecommerce", ["Flutter", "Dart", "GetX", "Firebase Authentication", "Firebase Firestore", "Firebase Hosting"]),
  },
];
