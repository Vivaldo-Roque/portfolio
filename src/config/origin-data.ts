/**
 * ============================================================================
 * DADOS DA JORNADA ("ORIGIN STORY" — FORMAÇÃO, EXPERIÊNCIA E CERTIFICAÇÕES)
 * ============================================================================
 * Aqui defines a estrutura e os anos/períodos da tua linha temporal.
 * Os textos traduzidos estão em `src/locales/{pt,en}/origin.yaml`.
 *
 * Para adicionar uma nova formação ou certificação:
 * 1. Adiciona um novo item à lista correspondente abaixo.
 * 2. Adiciona as chaves de tradução em `src/locales/pt/origin.yaml` e `src/locales/en/origin.yaml`.
 */

export type TimelineItemConfig = {
  periodKey?: string;
  periodLiteral?: string;
  titleKey: string;
  placeKey: string;
  bodyKey: string;
};

export const ACADEMIC_TIMELINE: TimelineItemConfig[] = [
  {
    periodLiteral: "2016 – 2018",
    titleKey: "academic_0_title",
    placeKey: "academic_0_place",
    bodyKey: "academic_0_body",
  },
  {
    periodLiteral: "2019 – 2023",
    titleKey: "academic_1_title",
    placeKey: "academic_1_place",
    bodyKey: "academic_1_body",
  },
  {
    periodLiteral: "2024",
    titleKey: "academic_2_title",
    placeKey: "academic_2_place",
    bodyKey: "academic_2_body",
  },
  {
    periodLiteral: "2024",
    titleKey: "academic_3_title",
    placeKey: "academic_3_place",
    bodyKey: "academic_3_body",
  },
  {
    periodKey: "academic_4_period",
    titleKey: "academic_4_title",
    placeKey: "academic_4_place",
    bodyKey: "academic_4_body",
  },
];

export const EXPERIENCE_TIMELINE: TimelineItemConfig[] = [
  {
    periodKey: "origin_period_piscine",
    titleKey: "experience_0_title",
    placeKey: "experience_0_place",
    bodyKey: "experience_0_body",
  },
  {
    periodKey: "origin_period_present",
    titleKey: "experience_1_title",
    placeKey: "experience_1_place",
    bodyKey: "experience_1_body",
  },
  {
    periodKey: "origin_period_ongoing",
    titleKey: "experience_2_title",
    placeKey: "experience_2_place",
    bodyKey: "experience_2_body",
  },
];

export const CERTIFICATIONS_TIMELINE: TimelineItemConfig[] = [
  {
    periodLiteral: "2024",
    titleKey: "certifications_0_title",
    placeKey: "certifications_0_place",
    bodyKey: "certifications_0_body",
  },
  {
    periodLiteral: "2024",
    titleKey: "certifications_1_title",
    placeKey: "certifications_1_place",
    bodyKey: "certifications_1_body",
  },
  {
    periodKey: "origin_period_ongoing",
    titleKey: "certifications_2_title",
    placeKey: "certifications_2_place",
    bodyKey: "certifications_2_body",
  },
];

export const SOFT_SKILL_KEYS = [
  "soft_problem_solving",
  "soft_algorithmic_thinking",
  "soft_clean_code",
  "soft_git_flow",
  "soft_agile",
  "soft_code_review",
  "soft_peer_mentoring",
  "soft_technical_comm",
  "soft_languages",
] as const;
