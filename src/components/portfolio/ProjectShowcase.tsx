import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type RefObject } from "react";
import { ArrowDown, ExternalLink, Pause, Play, X, Smartphone, Monitor } from "lucide-react";
import { Github } from "@/components/portfolio/BrandIcons";
import { makeArchitecturalPlaceholder } from "@/lib/projects";
import { useLanguage } from "../../context/language-context";

export type Scene = {
  eyebrow: string;
  title: string;
  body: string;
  accent: string;
  image?: string;
  caption?: string;
};

export type ShowcaseProject = {
  id?: string;
  name: string;
  description: string;
  tags: string[];
  href: string;
  liveUrl?: string;
  accent: string;
  image?: string;
  category?: "Web" | "Mobile";
  tier?: "field" | "lab";
  year?: string;
  scenes: Scene[];
};

/**
 * Framed Device / Architectural Mockup Window for each Showcase Scene:
 * Renders a browser or mobile hardware frame around the project screenshot (or architectural placeholder).
 */
function FramedProjectVisual({
  src,
  alt,
  caption,
  isMobile,
  badge,
}: {
  src: string;
  alt: string;
  caption?: string;
  isMobile?: boolean;
  badge?: string;
}) {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      {/* Outer hardware bezel */}
      <div className="overflow-hidden rounded-2xl border border-input bg-surface/95 shadow-[0_25px_70px_rgba(0,0,0,0.75)] backdrop-blur-md">
        {/* Top window / device telemetry bar */}
        <div className="flex items-center justify-between border-b border-border bg-black/80 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-moss" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="font-mono-code ml-2 truncate text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {caption || alt}
            </span>
          </div>
          <span className="font-mono-code inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-0.5 text-[9px] uppercase tracking-widest text-foreground/80">
            {isMobile ? <Smartphone className="h-3 w-3 text-moss" /> : <Monitor className="h-3 w-3 text-moss" />}
            {badge || (isMobile ? "MOBILE FRAME" : "WEB FRAME")}
          </span>
        </div>

        {/* Framed Image Viewport */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <img
            src={src}
            alt={alt}
            loading="eager"
            className="relative z-10 h-full w-full object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
          />
          <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
}

function SceneBlock({
  scene,
  index,
  total,
  project,
  scrollRoot,
}: {
  scene: Scene;
  index: number;
  total: number;
  project: ShowcaseProject;
  scrollRoot: RefObject<HTMLDivElement | null>;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    container: scrollRoot as RefObject<HTMLElement>,
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const visualSrc =
    scene.image ||
    makeArchitecturalPlaceholder(project.name, scene.title, project.tags, index - 1);
  const isEven = index % 2 === 0;

  return (
    <section
      ref={ref}
      data-scene-index={index}
      className="relative flex min-h-screen w-full snap-start items-center justify-center overflow-hidden border-t border-border/60 py-20"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-25" />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-8 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12"
      >
        {/* Text Narrative Column (5 cols) */}
        <div className={`lg:col-span-5 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
          <p className="font-mono-code flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-moss">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-moss" />
            {scene.eyebrow} · {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
          </p>
          <h3 className="font-display mt-3 text-3xl font-bold leading-tight text-white sm:text-5xl">
            {scene.title}
          </h3>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {scene.body}
          </p>

          {/* Scene tech tags */}
          <div className="mt-6 flex flex-wrap gap-1.5">
            {project.tags.map((tg) => (
              <span
                key={tg}
                className="font-mono-code rounded-full border border-border bg-surface px-3 py-1 text-[10px] uppercase tracking-widest text-foreground/80"
              >
                {tg}
              </span>
            ))}
          </div>
        </div>

        {/* Framed Image / Placeholder Visual Column (7 cols) */}
        <div className={`lg:col-span-7 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
          <FramedProjectVisual
            src={visualSrc}
            alt={`${project.name} — ${scene.title}`}
            caption={scene.caption || `${project.name} // ${scene.eyebrow}`}
            isMobile={project.category === "Mobile"}
            badge={`SCENE 0${index + 1}`}
          />
        </div>
      </motion.div>
    </section>
  );
}

export default function ProjectShowcase({
  project,
  onClose,
}: {
  project: ShowcaseProject;
  onClose: () => void;
}) {
  const { t, language, setLanguage } = useLanguage();
  const scrollRoot = useRef<HTMLDivElement>(null);
  const [auto, setAuto] = useState(false);
  const [active, setActive] = useState(0);
  const total = project.scenes.length + 1;

  useEffect(() => {
    const root = scrollRoot.current;
    if (!root) return;
    const sections = root.querySelectorAll<HTMLElement>("[data-scene-index]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.5) {
            setActive(Number(e.target.getAttribute("data-scene-index")));
          }
        });
      },
      { root, threshold: [0.5, 0.75] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!auto) return;
    const root = scrollRoot.current;
    if (!root) return;
    const id = setInterval(() => {
      const next = (active + 1) % total;
      root
        .querySelector<HTMLElement>(`[data-scene-index="${next}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 5000);
    return () => clearInterval(id);
  }, [auto, active, total]);

  const goTo = (i: number) => {
    scrollRoot.current
      ?.querySelector<HTMLElement>(`[data-scene-index="${i}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const heroImage =
    project.image ||
    makeArchitecturalPlaceholder(project.name, "Visão Geral do Produto", project.tags, 0);

  return (
    <div className="relative h-full w-full bg-background">
      {/* Top Floating Bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="pointer-events-auto rounded-full border border-input bg-black/80 px-4 py-2 backdrop-blur-md">
          <p className="font-mono-code flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-moss">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-moss" />
            showcase · {String(active + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
          </p>
          <p className="font-display text-xs font-semibold text-white sm:text-sm">
            {project.name}
          </p>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <div
            role="group"
            aria-label="Language switcher"
            className="font-mono-code inline-flex items-center rounded-full border border-input bg-black/80 p-0.5 text-[10px] uppercase tracking-widest backdrop-blur-md"
          >
            <button
              type="button"
              onClick={() => setLanguage("pt")}
              aria-pressed={language === "pt"}
              className={`rounded-full px-2.5 py-1 transition ${
                language === "pt"
                  ? "bg-moss font-bold text-black"
                  : "text-white/65 hover:text-white"
              }`}
            >
              PT
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              aria-pressed={language === "en"}
              className={`rounded-full px-2.5 py-1 transition ${
                language === "en"
                  ? "bg-moss font-bold text-black"
                  : "text-white/65 hover:text-white"
              }`}
            >
              EN
            </button>
          </div>
          <button
            onClick={() => setAuto((a) => !a)}
            className="font-mono-code inline-flex items-center gap-2 rounded-full border border-input bg-black/80 px-3.5 py-2 text-[11px] uppercase tracking-widest text-white backdrop-blur-md transition hover:border-moss hover:text-moss"
            aria-label={auto ? "Pause auto-play" : "Play auto-play"}
          >
            {auto ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{auto ? t("showcase_auto") : t("showcase_scroll")}</span>
          </button>
          {project.href && project.href !== "#" && (
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer noopener"
              className="font-mono-code inline-flex items-center gap-2 rounded-full border border-input bg-black/80 px-3.5 py-2 text-[11px] uppercase tracking-widest text-white backdrop-blur-md transition hover:border-moss hover:text-moss"
            >
              <Github className="h-3.5 w-3.5" />
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
          <button
            onClick={onClose}
            aria-label="Close showcase"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-input bg-black/80 text-white backdrop-blur-md transition hover:border-moss hover:text-moss sm:h-10 sm:w-10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Right Scene Progress Dots */}
      <div className="pointer-events-none absolute right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 sm:flex">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to scene ${i + 1}`}
            className={`pointer-events-auto h-2.5 rounded-full transition-all ${
              active === i ? "w-6 bg-moss" : "w-2.5 bg-white/25 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {auto && (
        <motion.div
          key={active}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 5, ease: "linear" }}
          className="absolute inset-x-0 top-0 z-40 h-0.5 origin-left bg-moss"
        />
      )}

      <div
        ref={scrollRoot}
        className="h-full w-full snap-y snap-mandatory overflow-y-auto scroll-smooth"
      >
        {/* SCENE 00: Hero Overview with Framed Primary Screenshot */}
        <section
          data-scene-index={0}
          className="relative flex min-h-screen w-full snap-start items-center justify-center overflow-hidden py-24"
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-30" />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-8 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12"
          >
            <div className="lg:col-span-5">
              <p className="font-mono-code flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-moss">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-moss" />
                Showcase · 01/{String(total).padStart(2, "0")}
              </p>
              <h1 className="font-display mt-3 text-4xl font-bold leading-[0.98] text-white sm:text-6xl">
                {project.name}
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {project.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="font-mono-code rounded-full border border-input bg-surface px-3 py-1 text-[10px] uppercase tracking-widest text-foreground/85"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => goTo(1)}
                  className="font-mono-code inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-semibold uppercase tracking-widest text-black transition hover:bg-white/90"
                >
                  {t("showcase_explore_scenes")}
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7">
              <FramedProjectVisual
                src={heroImage}
                alt={project.name}
                caption={`${project.name} // ${t("showcase_primary_capture")}`}
                isMobile={project.category === "Mobile"}
                badge="OVERVIEW"
              />
            </div>
          </motion.div>
        </section>

        {/* SCENES 01..04: Each with its own Framed Screenshot or Architectural Placeholder */}
        {project.scenes.map((s, i) => (
          <SceneBlock
            key={i}
            scene={s}
            index={i + 1}
            total={total}
            project={project}
            scrollRoot={scrollRoot}
          />
        ))}
      </div>
    </div>
  );
}
