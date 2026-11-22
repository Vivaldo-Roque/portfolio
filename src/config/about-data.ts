import { Compass, Network, Rocket, Terminal, type LucideIcon } from "lucide-react";

/**
 * ============================================================================
 * DADOS DAS 4 PARAGENS DO GLOBO 3D ("ABOUT ME")
 * ============================================================================
 * Define a estrutura das 4 etapas da página Sobre Mim.
 * Os textos traduzidos estão em `src/locales/{pt,en}/about.yaml`.
 */
export type AboutStopConfig = {
  id: string;
  num: string;
  prefix: "about_stop1" | "about_stop2" | "about_stop3" | "about_stop4";
  paragraphCount: number;
  bulletCount?: number;
  hasAfterBullets?: boolean;
  hasHighlight?: boolean;
  chipCount: number;
  Icon: LucideIcon;
};

export const ABOUT_STOPS_CONFIG: AboutStopConfig[] = [
  {
    id: "roots",
    num: "01",
    prefix: "about_stop1",
    paragraphCount: 3,
    chipCount: 4,
    Icon: Compass,
  },
  {
    id: "training",
    num: "02",
    prefix: "about_stop2",
    paragraphCount: 1,
    bulletCount: 2,
    hasAfterBullets: true,
    chipCount: 4,
    Icon: Network,
  },
  {
    id: "cadet42",
    num: "03",
    prefix: "about_stop3",
    paragraphCount: 3,
    chipCount: 5,
    Icon: Terminal,
  },
  {
    id: "stack",
    num: "04",
    prefix: "about_stop4",
    paragraphCount: 2,
    hasHighlight: true,
    chipCount: 7,
    Icon: Rocket,
  },
];
