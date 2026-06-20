import { motion } from "framer-motion";
import { ExternalLink, Play } from "lucide-react";
import { Github } from "@/components/portfolio/BrandIcons";
import { Link } from "@tanstack/react-router";
import { Project } from "@/lib/projects";
import { useLanguage } from "@/context/language-context";

export function ProjectCard({
  p,
  i,
}: {
  p: Project;
  i: number;
}) {
  const { t } = useLanguage();
  return (
    <motion.article
      key={p.name}
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3, delay: i * 0.06 }}
      whileHover={{ y: -8 }}
      className="group glass relative flex flex-col overflow-hidden rounded-2xl transition hover:glow-border"
    >
      <Link
        to="/projects/$projectId"
        params={{ projectId: p.id }}
        aria-label={`Open ${p.name} showcase`}
        className={`relative h-40 w-full overflow-hidden bg-gradient-to-br text-left block ${p.accent}`}
      >
        <div className="absolute inset-0 bg-grid opacity-60" />
        {p.image && (
          <img
            src={p.image}
            alt={`${p.name} screenshot`}
            className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-80"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface/95 to-transparent" />
        <span className="font-mono-code absolute bottom-3 left-4 text-xs uppercase tracking-widest text-lime">
          {p.category === "Web" ? t("type_web") : t("type_mobile")}
        </span>
        <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-moss/40 bg-background/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-foreground backdrop-blur transition group-hover:border-moss group-hover:text-lime">
          <Play className="h-3 w-3" />
          {t("showcase_title")}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-semibold text-foreground">{p.name}</h3>
        <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <span
              key={t}
              className="font-mono-code rounded-full border border-moss/20 px-2.5 py-1 text-[10px] uppercase tracking-widest text-moss"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            to="/projects/$projectId"
            params={{ projectId: p.id }}
            className="inline-flex items-center gap-2 rounded-full bg-moss px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-lime"
          >
            <Play className="h-3.5 w-3.5" />
            {t("showcase_explore")}
          </Link>
          <a
            href={p.href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`Open ${p.name} on GitHub`}
            className="inline-flex items-center gap-2 rounded-full border border-moss/30 px-4 py-2 text-xs font-semibold text-foreground transition hover:border-moss hover:bg-moss/10 hover:text-lime"
          >
            <Github className="h-3.5 w-3.5" />
            GitHub
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
