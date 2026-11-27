import { Github, Linkedin, Twitter } from "@/components/portfolio/BrandIcons";

/**
 * ============================================================================
 * CONFIGURAÇÃO CENTRAL DO PERFIL (Single Source of Truth)
 * ============================================================================
 * Qualquer alteração nos teus dados de contacto, localização, links de redes
 * sociais ou caminho dos CVs atualiza automaticamente em todo o site
 * (Hero, About, Contact e Footer).
 */
export const PROFILE = {
  fullName: "Vivaldo Cristóvão Roque",
  shortName: "Vivaldo Roque",
  firstName: "VIVALDO",
  lastName: "ROQUE",
  email: "2001vivaldo@gmail.com",
  phoneDisplay: "(+244) 928 994 233",
  whatsappUrl: "https://wa.me/244928994233",
  locationShort: "Sequele · Ícolo e Bengo, Angola",
  locationFull: "Angola, Ícolo e Bengo, Sequele",
  locationMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Angola,+Ícolo+e+Bengo,+Sequele",
  githubUrl: "https://github.com/Vivaldo-Roque/",
  linkedinUrl: "https://www.linkedin.com/in/vivaldoroque/",
  twitterUrl: "https://twitter.com/vivaldo_roque",
  cv: {
    pt: "/cv/vivaldo_roque_cv_pt.pdf",
    en: "/cv/vivaldo_roque_cv_en.pdf",
  },
} as const;

export const SOCIAL_LINKS = [
  { label: "GitHub", href: PROFILE.githubUrl, Icon: Github },
  { label: "LinkedIn", href: PROFILE.linkedinUrl, Icon: Linkedin },
  { label: "Twitter", href: PROFILE.twitterUrl, Icon: Twitter },
] as const;

export const PRELOAD_IMAGES = [
  "/img/header.jpg",
  "/img/works/cfoptrainer.png",
  "/img/works/vivacubesolver.jpg",
  "/img/works/bancoviva.png",
  "/img/works/flutter_web_ecommerce_1.png",
] as const;

export const PRELOAD_FONTS = [
  '400 1em "Space Grotesk"',
  '700 1em "Space Grotesk"',
  '400 1em "JetBrains Mono"',
] as const;
