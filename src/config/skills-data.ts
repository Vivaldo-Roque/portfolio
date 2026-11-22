export type SkillTierId = "field" | "foundation" | "explored";

export type SkillDomain = "Mobile" | "Web" | "Systems" | "Data & Infra" | "Game";

export type SkillMeta = {
  id: string;
  name: string;
  icon: string;
  tier: SkillTierId;
  domain: SkillDomain;
  relatedProjects: { id: string; nameKey: string }[];
};

const devicon = (slug: string, variant = "original") =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-${variant}.svg`;

/**
 * ============================================================================
 * CATÁLOGO DE TECNOLOGIAS & SKILLS
 * ============================================================================
 * Para adicionar uma nova tecnologia:
 * 1. Adiciona um novo objeto na lista abaixo com `id`, `name`, `icon` e `tier`.
 * 2. Adiciona as traduções `skill_<id>_headline`, `skill_<id>_story` e
 *    `skill_<id>_evidence` em `src/locales/pt/skills.yaml` e `src/locales/en/skills.yaml`.
 */
export const SKILLS: SkillMeta[] = [
  // ===========================================================================
  // TIER 1: NO TERRENO (Aplicadas em apps publicadas e stack principal)
  // ===========================================================================
  {
    id: "flutter",
    name: "Flutter",
    icon: devicon("flutter"),
    tier: "field",
    domain: "Mobile",
    relatedProjects: [
      { id: "cfop_trainer", nameKey: "cfop_trainer_title" },
      { id: "ecommerce_mobile", nameKey: "ecommerce_mobile_title" },
      { id: "ecommerce_web_admin", nameKey: "ecommerce_web_admin_title" },
    ],
  },
  {
    id: "dart",
    name: "Dart",
    icon: devicon("dart"),
    tier: "field",
    domain: "Mobile",
    relatedProjects: [
      { id: "cfop_trainer", nameKey: "cfop_trainer_title" },
      { id: "ecommerce_mobile", nameKey: "ecommerce_mobile_title" },
    ],
  },
  {
    id: "python",
    name: "Python",
    icon: devicon("python"),
    tier: "field",
    domain: "Web",
    relatedProjects: [
      { id: "vivacubesolver", nameKey: "vivacubesolver_title" },
      { id: "banco_viva", nameKey: "banco_viva_title" },
    ],
  },
  {
    id: "django",
    name: "Django",
    icon: devicon("django", "plain"),
    tier: "field",
    domain: "Web",
    relatedProjects: [{ id: "banco_viva", nameKey: "banco_viva_title" }],
  },
  {
    id: "java",
    name: "Java & Android SDK",
    icon: devicon("java"),
    tier: "field",
    domain: "Mobile",
    relatedProjects: [
      { id: "iska_minhas_notas", nameKey: "iska_minhas_notas_title" },
      { id: "vivacubesolver", nameKey: "vivacubesolver_title" },
    ],
  },
  {
    id: "sqlite",
    name: "SQLite & Firebase",
    icon: devicon("sqlite"),
    tier: "field",
    domain: "Data & Infra",
    relatedProjects: [
      { id: "cfop_trainer", nameKey: "cfop_trainer_title" },
      { id: "ecommerce_mobile", nameKey: "ecommerce_mobile_title" },
      { id: "ecommerce_web_admin", nameKey: "ecommerce_web_admin_title" },
    ],
  },

  // ===========================================================================
  // TIER 2: BASE SÓLIDA & FORMAÇÃO (42 Luanda, ISKA, ITEL, Harvard CS50)
  // ===========================================================================
  {
    id: "c_lang",
    name: "C & Unix / Linux",
    icon: devicon("c"),
    tier: "foundation",
    domain: "Systems",
    relatedProjects: [],
  },
  {
    id: "web_core",
    name: "HTML5, CSS3 & JavaScript",
    icon: devicon("javascript"),
    tier: "foundation",
    domain: "Web",
    relatedProjects: [
      { id: "tictactoe", nameKey: "tictactoe_title" },
      { id: "cfop_trainer", nameKey: "cfop_trainer_title" },
      { id: "banco_viva", nameKey: "banco_viva_title" },
    ],
  },
  {
    id: "react",
    name: "React & TypeScript",
    icon: devicon("react"),
    tier: "foundation",
    domain: "Web",
    relatedProjects: [],
  },
  {
    id: "mysql_net",
    name: "MySQL & Redes (CCNA)",
    icon: devicon("mysql"),
    tier: "foundation",
    domain: "Data & Infra",
    relatedProjects: [],
  },

  // ===========================================================================
  // TIER 3: EXPLORAÇÃO & CURTO CONTACTO (Testadas por curiosidade ou estudo)
  // ===========================================================================
  {
    id: "cpp_csharp",
    name: "C++ & C#",
    icon: devicon("cplusplus"),
    tier: "explored",
    domain: "Systems",
    relatedProjects: [],
  },
  {
    id: "unity",
    name: "Unity3D",
    icon: devicon("unity"),
    tier: "explored",
    domain: "Game",
    relatedProjects: [],
  },
  {
    id: "angular_next_nest",
    name: "Angular, Next.js & Nest.js",
    icon: devicon("nextjs", "original-wordmark"),
    tier: "explored",
    domain: "Web",
    relatedProjects: [],
  },
];
