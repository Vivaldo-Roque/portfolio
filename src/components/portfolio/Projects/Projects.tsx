import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ExternalLink, X } from "lucide-react";
import { Github } from "@/components/portfolio/BrandIcons";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Link } from "@tanstack/react-router";
import { projects } from "@/lib/projects";
import { useLanguage } from "@/context/language-context";
import { Fireflies } from "./Fireflies";
import { ProjectCard } from "./ProjectCard";

export default function Projects() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<"All" | "Web" | "Mobile">("All");
  const [open, setOpen] = useState(false);

  const filters = [
    { id: "All" as const, label: t("type_all") },
    { id: "Web" as const, label: t("type_web") },
    { id: "Mobile" as const, label: t("type_mobile") },
  ];

  // Localized projects data structure helper
  const localizedProjects = useMemo(() => {
    return projects.map(p => ({
      ...p,
      name: t(`${p.id}_title`) || p.name,
      description: t(`works${projects.indexOf(p) + 1}_desc`) || p.description,
    }));
  }, [t]);

  const filtered = localizedProjects.filter((p) => filter === "All" || p.category === filter);
  const featured = localizedProjects.slice(0, 3);

  return (
    <section id="work" className="relative overflow-hidden py-32" aria-label={t("works_titles")}>
      <div
        className="absolute inset-0 bg-gradient-to-b from-background via-deep to-background"
        aria-hidden
      />
      <Fireflies />

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25 }}
        >
          <p className="font-mono-code text-sm text-moss">// {t("works_chapter")}</p>
          <h2 className="font-display mt-3 text-4xl font-bold sm:text-5xl">
            {t("works_title_pre")} <span className="text-gradient-leaf">{t("works_title_gradient")}</span>
            <span className="block text-2xl font-medium text-muted-foreground sm:text-3xl">
              {t("works_subtitle")}
            </span>
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <ProjectCard key={p.name} p={p} i={i} />
          ))}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="group inline-flex items-center gap-2 rounded-full bg-moss px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-lime hover:shadow-[0_0_15px_-5px_var(--moss)]"
          >
            {t("btn_see_portfolio")}
            <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <a
            href="https://github.com/Vivaldo-Roque/"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full border border-moss/40 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-moss hover:bg-moss/10 hover:text-lime"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="left-0 top-0 grid h-screen max-h-screen w-screen max-w-none translate-x-0 translate-y-0 gap-0 overflow-y-auto rounded-none border-0 bg-background p-0 sm:rounded-none">
          <DialogTitle className="sr-only">{t("works_titles")}</DialogTitle>
          <DialogDescription className="sr-only">
            Full list of projects with category filters.
          </DialogDescription>

          <div className="sticky top-0 z-10 border-b border-moss/20 bg-background/85 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
              <div>
                <p className="font-mono-code text-xs text-moss">// {t("works_chapter")} · full</p>
                <h3 className="font-display mt-1 text-2xl font-bold sm:text-3xl">
                  {t("works_title_pre")} <span className="text-gradient-leaf">{t("works_title_gradient")}</span>
                </h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-moss/30 text-foreground transition hover:border-moss hover:bg-moss/10 hover:text-lime"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-6 pb-5">
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`font-mono-code rounded-full px-4 py-2 text-xs uppercase tracking-widest transition ${
                    filter === f.id
                      ? "bg-moss text-primary-foreground"
                      : "border border-moss/30 text-muted-foreground hover:border-moss hover:text-lime"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-6xl px-6 py-10">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p, i) => (
                <ProjectCard key={p.name} p={p} i={i} />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
