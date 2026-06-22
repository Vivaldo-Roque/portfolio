import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type RefObject } from "react";
import { ArrowDown, ExternalLink, Pause, Play, X } from "lucide-react";
import { Github } from "@/components/portfolio/BrandIcons";

export type Scene = {
  eyebrow: string;
  title: string;
  body: string;
  accent: string;
};

export type ShowcaseProject = {
  name: string;
  description: string;
  tags: string[];
  href: string;
  accent: string;
  scenes: Scene[];
};

function SceneBlock({
  scene,
  index,
  total,
  scrollRoot,
}: {
  scene: Scene;
  index: number;
  total: number;
  scrollRoot: RefObject<HTMLDivElement | null>;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    container: scrollRoot as RefObject<HTMLElement>,
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 1.05]);

  return (
    <section
      ref={ref}
      data-scene-index={index}
      className="relative flex h-screen w-full snap-start items-center justify-center overflow-hidden"
    >
      <motion.div
        aria-hidden
        style={{ scale, opacity }}
        className={`absolute inset-10 rounded-[2.5rem] bg-gradient-to-br ${scene.accent} blur-3xl hidden dark:block`}
      />
      <motion.div
        aria-hidden
        style={{ y }}
        className="absolute inset-0 bg-grid opacity-20"
      />
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto max-w-3xl px-8 text-center"
      >
        <p className="font-mono-code text-xs uppercase tracking-[0.3em] text-lime">
          {scene.eyebrow} · {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
        </p>
        <h3 className="font-display mt-4 text-4xl font-bold leading-tight text-foreground sm:text-6xl">
          {scene.title}
        </h3>
        <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
          {scene.body}
        </p>
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

  return (
    <div className="relative h-full w-full bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-4 p-5">
        <div className="pointer-events-auto rounded-full border border-moss/30 bg-background/70 px-4 py-2 backdrop-blur">
          <p className="font-mono-code text-[10px] uppercase tracking-widest text-moss">
            // showcase
          </p>
          <p className="font-display text-sm font-semibold text-foreground sm:text-base">
            {project.name}
          </p>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setAuto((a) => !a)}
            className="inline-flex items-center gap-2 rounded-full border border-moss/40 bg-background/70 px-4 py-2 text-xs font-semibold text-foreground backdrop-blur transition hover:border-moss hover:bg-moss/10 hover:text-lime"
            aria-label={auto ? "Pause auto-play" : "Play auto-play"}
          >
            {auto ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {auto ? "Auto" : "Scroll"}
          </button>
          <a
            href={project.href}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full border border-moss/40 bg-background/70 px-4 py-2 text-xs font-semibold text-foreground backdrop-blur transition hover:border-moss hover:bg-moss/10 hover:text-lime"
          >
            <Github className="h-3.5 w-3.5" />
            <ExternalLink className="h-3 w-3" />
          </a>
          <button
            onClick={onClose}
            aria-label="Close showcase"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-moss/30 bg-background/70 text-foreground backdrop-blur transition hover:border-moss hover:bg-moss/10 hover:text-lime"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 sm:flex">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to scene ${i + 1}`}
            className={`pointer-events-auto h-2.5 rounded-full transition-all ${active === i ? "w-6 bg-lime" : "w-2.5 bg-moss/40 hover:bg-moss"
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
          className="absolute inset-x-0 top-0 z-40 h-0.5 origin-left bg-lime"
        />
      )}

      <div
        ref={scrollRoot}
        className="h-full w-full snap-y snap-mandatory overflow-y-auto scroll-smooth"
      >
        <section
          data-scene-index={0}
          className="relative flex h-screen w-full snap-start flex-col items-center justify-center overflow-hidden"
        >
          <div aria-hidden className={`absolute inset-0 bg-gradient-to-br ${project.accent}`} />
          <div aria-hidden className="absolute inset-0 bg-grid opacity-30" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 mx-auto max-w-3xl px-8 text-center"
          >
            <p className="font-mono-code text-xs uppercase tracking-[0.3em] text-lime">
              Showcase · {project.name}
            </p>
            <h2 className="font-display mt-4 text-5xl font-bold leading-[0.95] sm:text-7xl">
              <span className="text-gradient-leaf">{project.name}</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              {project.description}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="font-mono-code rounded-full border border-moss/30 px-3 py-1 text-[10px] uppercase tracking-widest text-moss"
                >
                  {t}
                </span>
              ))}
            </div>
            <button
              onClick={() => goTo(1)}
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-moss px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-lime"
            >
              Explorar
              <ArrowDown className="h-4 w-4" />
            </button>
          </motion.div>
        </section>

        {project.scenes.map((s, i) => (
          <SceneBlock
            key={i}
            scene={s}
            index={i + 1}
            total={total}
            scrollRoot={scrollRoot}
          />
        ))}
      </div>
    </div>
  );
}
