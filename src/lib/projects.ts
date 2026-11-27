export type Scene = {
  eyebrow: string;
  title: string;
  body: string;
  accent: string;
  image?: string;
  caption?: string;
};

export type ProjectTier = "field" | "lab";

export type RawProjectSceneYaml = {
  eyebrow?: string;
  title?: string;
  body?: string;
  image?: string;
  caption?: string;
};

export type RawProjectLocaleYaml = {
  name: string;
  description: string;
  scenes?: RawProjectSceneYaml[];
};

export type RawProjectYaml = {
  id: string;
  order?: number;
  category: "Web" | "Mobile";
  tier?: ProjectTier;
  year?: string;
  tags: string[];
  href?: string;
  liveUrl?: string;
  image: string;
  gallery?: string[];
  pt: RawProjectLocaleYaml;
  en: RawProjectLocaleYaml;
};

export type ShowcaseProject = {
  id: string;
  order?: number;
  name: string;
  description: string;
  tags: string[];
  href: string;
  liveUrl?: string;
  accent: string;
  image: string;
  gallery?: string[];
  tier?: ProjectTier;
  year?: string;
  scenes: Scene[];
  i18n?: {
    pt: RawProjectLocaleYaml;
    en: RawProjectLocaleYaml;
  };
};

export type Project = ShowcaseProject & {
  category: "Web" | "Mobile";
  folderPath?: string;
};

// Automatically index every image/media asset placed inside any project's subfolder
const projectAssetModules = import.meta.glob<string>(
  "../content/projects/**/*.{png,jpg,jpeg,webp,gif,svg,avif}",
  {
    eager: true,
    import: "default",
  },
);

/**
 * Resolves an image path from a YAML project file:
 * - First checks if the image exists inside the project's own subfolder (`src/content/projects/<folder>/<image>`).
 * - If you write `"/img/..."` or `"https://..."`, it uses it as-is.
 * - Fallback: points to `"/img/works/<image>"` if not found locally.
 */
export function resolveProjectImage(img?: string, folderPath?: string): string {
  if (!img) return "";
  const trimmed = img.trim();
  if (!trimmed) return "";
  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  // Clean leading "./" if the user wrote "./cover.png"
  const cleanName = trimmed.replace(/^\.\//, "");

  // 1. Look inside the project's own isolated subfolder first
  if (folderPath) {
    const localKey = `${folderPath}/${cleanName}`;
    if (projectAssetModules[localKey]) {
      return projectAssetModules[localKey];
    }
  }

  // 2. Also match by filename in any project subfolder if folderPath wasn't provided
  for (const [assetPath, assetUrl] of Object.entries(projectAssetModules)) {
    if (assetPath.endsWith(`/${cleanName}`)) {
      return assetUrl;
    }
  }

  return `/img/works/${cleanName}`;
}

/**
 * Generates high-contrast, Monako-style architectural SVG data-URI placeholders
 * whenever a scene doesn't have a dedicated secondary screenshot yet.
 */
export function makeArchitecturalPlaceholder(
  projectName: string,
  sceneTitle: string,
  tags: string[],
  sceneIndex: number,
): string {
  const safeName = projectName.replace(/[&<>"]/g, "");
  const safeScene = sceneTitle.replace(/[&<>"]/g, "");
  const safeTags = tags.slice(0, 4).join(" · ").replace(/[&<>"]/g, "");
  const accents = ["#2FBF71", "#38D982", "#26A660", "#2FBF71"];
  const col = accents[sceneIndex % accents.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 760" width="1200" height="760">
    <defs>
      <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#1b211e" stroke-width="1"/>
      </pattern>
      <radialGradient id="glow" cx="72%" cy="38%" r="55%">
        <stop offset="0%" stop-color="${col}" stop-opacity="0.18"/>
        <stop offset="100%" stop-color="#050606" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1200" height="760" fill="#070908"/>
    <rect width="1200" height="760" fill="url(#grid)"/>
    <rect width="1200" height="760" fill="url(#glow)"/>
    <!-- Top wireframe HUD frame -->
    <rect x="56" y="52" width="1088" height="656" rx="22" fill="#0c0f0d" fill-opacity="0.72" stroke="#242c27" stroke-width="1.5"/>
    <line x1="56" y1="108" x2="1144" y2="108" stroke="#1e2621" stroke-width="1"/>
    <circle cx="90" cy="80" r="5" fill="${col}"/>
    <circle cx="112" cy="80" r="5" fill="#2a332e"/>
    <circle cx="134" cy="80" r="5" fill="#2a332e"/>
    <text x="165" y="85" fill="#7c8a82" font-family="monospace" font-size="14" letter-spacing="3">SCENE 0${sceneIndex + 1} // ${safeName.toUpperCase()}</text>
    <!-- Isometric wireframe architecture diagram inside placeholder -->
    <g transform="translate(680, 220)" stroke="${col}" fill="none">
      <rect x="0" y="0" width="360" height="220" rx="12" stroke="#2a352f" stroke-width="1.5" fill="#101512"/>
      <rect x="24" y="28" width="140" height="18" rx="4" fill="${col}" fill-opacity="0.22" stroke="none"/>
      <rect x="24" y="60" width="312" height="1" fill="#222b26" stroke="none"/>
      <rect x="24" y="80" width="210" height="12" rx="3" fill="#1c2420" stroke="none"/>
      <rect x="24" y="104" width="260" height="12" rx="3" fill="#1c2420" stroke="none"/>
      <rect x="24" y="140" width="96" height="52" rx="8" stroke="${col}" stroke-opacity="0.55" stroke-width="1.2" fill="#0b120e"/>
      <rect x="132" y="140" width="96" height="52" rx="8" stroke="#2a352f" stroke-width="1.2" fill="#0c100e"/>
      <rect x="240" y="140" width="96" height="52" rx="8" stroke="#2a352f" stroke-width="1.2" fill="#0c100e"/>
      <!-- Connected node below -->
      <path d="M 180 220 L 180 280 L 90 280 L 90 320" stroke="${col}" stroke-opacity="0.7" stroke-width="1.5" stroke-dasharray="5 5"/>
      <path d="M 180 220 L 180 280 L 270 280 L 270 320" stroke="#3a4740" stroke-width="1.5"/>
      <rect x="10" y="320" width="160" height="68" rx="10" stroke="${col}" stroke-opacity="0.65" fill="#0d1410"/>
      <rect x="190" y="320" width="160" height="68" rx="10" stroke="#2a352f" fill="#0d100e"/>
    </g>
    <!-- Left Caption Block -->
    <text x="110" y="250" fill="${col}" font-family="monospace" font-size="15" letter-spacing="4">● ARQUITETURA &amp; PREVIEW</text>
    <text x="110" y="315" fill="#FFFFFF" font-family="sans-serif" font-weight="bold" font-size="44">${safeName}</text>
    <text x="110" y="368" fill="#A5B2AA" font-family="sans-serif" font-size="24">${safeScene}</text>
    <text x="110" y="445" fill="#6F7D75" font-family="monospace" font-size="15" letter-spacing="2">${safeTags}</text>
    <rect x="110" y="485" width="190" height="38" rx="19" fill="none" stroke="#2FBF71" stroke-opacity="0.5"/>
    <text x="135" y="509" fill="#2FBF71" font-family="monospace" font-size="13" letter-spacing="2">PLACEHOLDER 0${sceneIndex + 1}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const defaultScenes = (
  name: string,
  tags: string[],
  primaryImage?: string,
  secondaryImage?: string,
): Scene[] => [
  {
    eyebrow: "Problema",
    title: "O ponto de partida",
    body: `${name} nasceu de uma necessidade real — um problema concreto que precisava de uma solução pensada de raíz.`,
    accent: "from-neutral-800/40 to-neutral-950/40",
    image: primaryImage || makeArchitecturalPlaceholder(name, "Contexto & Problema Real", tags, 0),
    caption: "01 · VISÃO GERAL & INTERFACE PRINCIPAL",
  },
  {
    eyebrow: "Stack",
    title: "Construído com intenção",
    body: `Escolhi ${tags.join(", ")} para equilibrar performance, manutenção e velocidade de iteração.`,
    accent: "from-neutral-800/40 to-neutral-950/40",
    image: makeArchitecturalPlaceholder(name, "Arquitetura & Stack Técnica", tags, 1),
    caption: `02 · ARQUITETURA (${tags.slice(0, 3).join(" · ")})`,
  },
  {
    eyebrow: "Experiência",
    title: "Fluído, acessível, focado",
    body: "Interface limpa, animações sóbrias e foco total no fluxo principal — sem ruído.",
    accent: "from-neutral-800/40 to-neutral-950/40",
    image:
      secondaryImage ||
      primaryImage ||
      makeArchitecturalPlaceholder(name, "Fluxo de Utilizador & UI", tags, 2),
    caption: "03 · EXPERIÊNCIA DE UTILIZADOR & FLUXO",
  },
  {
    eyebrow: "Resultado",
    title: "O que ficou",
    body: "Um produto que entrega valor desde o primeiro clique e que continua a evoluir.",
    accent: "from-neutral-800/40 to-neutral-950/40",
    image: makeArchitecturalPlaceholder(name, "Performance & Entrega em Produção", tags, 3),
    caption: "04 · ENTREGA & IMPACTO",
  },
];

// Automatically load every .yaml/.yml file inside src/content/projects/<project-folder>/
// Ignore folders or files starting with "_" (such as _TEMPLATE/project.yaml)
const projectYamlModules = import.meta.glob<RawProjectYaml>("../content/projects/**/*.{yaml,yml}", {
  eager: true,
  import: "default",
});

export const projects: Project[] = Object.entries(projectYamlModules)
  .filter(([filePath, raw]) => {
    const segments = filePath.split("/");
    const hasUnderscoreSegment = segments.some((seg) => seg.startsWith("_"));
    return !hasUnderscoreSegment && Boolean(raw && raw.id && raw.pt && raw.en);
  })
  .map(([filePath, raw]) => {
    const folderPath = filePath.substring(0, filePath.lastIndexOf("/"));
    const primaryImg = resolveProjectImage(raw.image, folderPath);
    const galleryImgs = (raw.gallery || [])
      .map((img) => resolveProjectImage(img, folderPath))
      .filter(Boolean);
    const secondaryImg = galleryImgs[1] || galleryImgs[0] || primaryImg;
    const defaultName = raw.pt?.name || raw.en?.name || raw.id;

    return {
      id: raw.id,
      order: raw.order ?? 999,
      name: defaultName,
      description: raw.pt?.description || raw.en?.description || "",
      tags: raw.tags || [],
      category: raw.category || "Web",
      tier: raw.tier || "field",
      year: raw.year,
      href: raw.href || "#",
      liveUrl: raw.liveUrl,
      accent: "from-neutral-800/40 to-neutral-950/40",
      image: primaryImg,
      gallery: galleryImgs.length > 0 ? galleryImgs : [primaryImg],
      folderPath,
      scenes: defaultScenes(defaultName, raw.tags || [], primaryImg, secondaryImg),
      i18n: {
        pt: raw.pt,
        en: raw.en,
      },
    };
  })
  .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
