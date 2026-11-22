import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ExternalLink, Play, Search, X, Layers, Rocket, FlaskConical, Smartphone, Globe } from "lucide-react";
import { Github } from "@/components/portfolio/BrandIcons";
import { Link } from "@tanstack/react-router";
import { Project, ProjectTier, projects } from "@/lib/projects";
import { useLanguage } from "../../context/language-context";

function ProjectCard({ p, i }: { p: Project; i: number }) {
  const { t } = useLanguage();
  const isField = p.tier !== "lab";

  return (
    <motion.article
      key={p.id}
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(i * 0.04, 0.24) }}
      className="group glass relative flex flex-col overflow-hidden rounded-2xl border border-border transition duration-300 hover:-translate-y-1 hover:border-moss/60"
    >
      <Link
        to="/projects/$projectId"
        params={{ projectId: p.id }}
        aria-label={`Open ${p.name} showcase`}
        className="relative block aspect-[16/10] w-full overflow-hidden border-b border-border bg-black text-left"
      >
        <div className="absolute inset-0 bg-grid opacity-40" />
        {p.image && (
          <img
            src={p.image}
            alt={`${p.name} screenshot`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
            style={{ filter: "grayscale(0.18) contrast(1.05)" }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

        {/* Top-left Tier Badge: Applied in the Field vs Study/Lab */}
        <span
          className={`font-mono-code absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] uppercase tracking-widest backdrop-blur-md ${
            isField
              ? "border-moss/45 bg-black/80 text-white"
              : "border-white/15 bg-black/75 text-muted-foreground"
          }`}
        >
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full ${
              isField ? "bg-moss" : "bg-white/40"
            }`}
          />
          {isField ? t("works_tier_field_badge") : t("works_tier_lab_badge")}
        </span>

        {/* Top-right Showcase trigger pill */}
        <span className="font-mono-code absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-input bg-black/75 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-foreground backdrop-blur transition group-hover:border-moss group-hover:text-moss">
          <Play className="h-3 w-3" />
          {t("showcase_title")}
        </span>

        {/* Bottom-left Platform + Year */}
        <div className="font-mono-code absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] uppercase tracking-widest text-white/85">
          <span className="flex items-center gap-1.5">
            {p.category === "Web" ? (
              <Globe className="h-3 w-3 text-moss" />
            ) : (
              <Smartphone className="h-3 w-3 text-moss" />
            )}
            {p.category === "Web" ? t("type_web") : t("type_mobile")}
          </span>
          {p.year && <span className="text-muted-foreground">{p.year}</span>}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-xl font-bold text-white transition group-hover:text-moss">
          {p.name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {p.description}
        </p>

        {/* Tech tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {p.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono-code rounded-full border border-border bg-black/50 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-foreground/80"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="mt-5 flex flex-wrap items-center gap-2 pt-1">
          <Link
            to="/projects/$projectId"
            params={{ projectId: p.id }}
            className="font-mono-code inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-black transition hover:bg-white/90"
          >
            <Play className="h-3.5 w-3.5" />
            {t("showcase_explore")}
          </Link>
          {p.href && p.href !== "#" && (
            <a
              href={p.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`Open ${p.name}`}
              className="font-mono-code inline-flex items-center gap-1.5 rounded-full border border-input px-3.5 py-2 text-[11px] uppercase tracking-widest text-foreground transition hover:border-moss hover:text-moss"
            >
              <Github className="h-3.5 w-3.5" />
              {p.href.includes("play.google.com") ? "Google Play" : "GitHub"}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const { t, language } = useLanguage();

  const [categoryFilter, setCategoryFilter] = useState<"All" | "Web" | "Mobile">("All");
  const [tierFilter, setTierFilter] = useState<"All" | ProjectTier>("All");
  const [tagFilter, setTagFilter] = useState<string>("All");
  const [query, setQuery] = useState("");

  // Localized projects data structure (reads directly from each project's YAML file in src/content/projects/*.yaml)
  const localizedProjects = useMemo(() => {
    return projects.map((p) => {
      const loc = p.i18n?.[language] || p.i18n?.pt;
      return {
        ...p,
        name: loc?.name || p.name,
        description: loc?.description || p.description,
      };
    });
  }, [language]);

  // Unique top technologies for quick chip filtering as the project catalog grows
  const allTags = useMemo(() => {
    const counts = new Map<string, number>();
    localizedProjects.forEach((p) => {
      p.tags.forEach((tg) => {
        counts.set(tg, (counts.get(tg) || 0) + 1);
      });
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);
  }, [localizedProjects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return localizedProjects.filter((p) => {
      if (categoryFilter !== "All" && p.category !== categoryFilter) return false;
      const tier = p.tier || "field";
      if (tierFilter !== "All" && tier !== tierFilter) return false;
      if (tagFilter !== "All" && !p.tags.some((tg) => tg.toLowerCase() === tagFilter.toLowerCase())) {
        return false;
      }
      if (q) {
        const hay = `${p.name} ${p.description} ${p.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [localizedProjects, categoryFilter, tierFilter, tagFilter, query]);

  const counts = useMemo(() => {
    const total = localizedProjects.length;
    const field = localizedProjects.filter((p) => (p.tier || "field") === "field").length;
    const lab = localizedProjects.filter((p) => p.tier === "lab").length;
    const web = localizedProjects.filter((p) => p.category === "Web").length;
    const mobile = localizedProjects.filter((p) => p.category === "Mobile").length;
    return { total, field, lab, web, mobile };
  }, [localizedProjects]);

  const hasActiveFilters =
    categoryFilter !== "All" || tierFilter !== "All" || tagFilter !== "All" || query.trim() !== "";

  const resetFilters = () => {
    setCategoryFilter("All");
    setTierFilter("All");
    setTagFilter("All");
    setQuery("");
  };

  return (
    <section id="work" className="relative min-h-screen overflow-hidden py-24 sm:py-32" aria-label={t("works_titles")}>
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-30" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono-code flex items-center gap-2.5 text-xs uppercase tracking-widest text-muted-foreground">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-moss" aria-hidden />
              03 / 04 · {t("works_chapter")}
            </p>
            <h1 className="font-display mt-3 text-3xl font-bold text-white sm:text-5xl">
              {t("works_title_pre")} <span className="text-foreground">{t("works_title_gradient")}</span>
            </h1>
            <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
              {t("works_catalog_subtitle")}
            </p>
          </div>

          <a
            href="https://github.com/Vivaldo-Roque/"
            target="_blank"
            rel="noreferrer noopener"
            className="font-mono-code inline-flex w-fit items-center gap-2 rounded-full border border-input bg-surface px-5 py-2.5 text-xs uppercase tracking-widest text-foreground transition hover:border-moss hover:text-moss"
          >
            <Github className="h-4 w-4" />
            GitHub ({counts.total})
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* ===================================================================
            STICKY MULTI-AXIS FILTER & SEARCH BAR (built to scale to dozens of projects)
           =================================================================== */}
        <div className="mt-10 rounded-2xl border border-input bg-surface/90 p-4 backdrop-blur-md sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("works_search_placeholder")}
                className="font-mono-code w-full rounded-xl border border-border bg-black/70 py-2.5 pl-10 pr-9 text-xs text-white placeholder:text-muted-foreground focus:border-moss focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Tier Filter: All vs In the Field vs Study/Lab */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                {
                  id: "All" as const,
                  label: t("works_filter_all_count", { count: counts.total }),
                  Icon: Layers,
                },
                {
                  id: "field" as const,
                  label: t("works_filter_field_count", { count: counts.field }),
                  Icon: Rocket,
                },
                {
                  id: "lab" as const,
                  label: t("works_filter_lab_count", { count: counts.lab }),
                  Icon: FlaskConical,
                },
              ].map(({ id, label, Icon }) => {
                const active = tierFilter === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTierFilter(id)}
                    className={`font-mono-code inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[11px] uppercase tracking-wider transition ${
                      active
                        ? "bg-white font-semibold text-black"
                        : "border border-border bg-black/50 text-muted-foreground hover:border-input hover:text-white"
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${active ? "text-moss" : ""}`} />
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Platform Filter: All / Web / Mobile */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "All" as const, label: t("type_all") },
                { id: "Web" as const, label: `${t("type_web")} (${counts.web})` },
                { id: "Mobile" as const, label: `${t("type_mobile")} (${counts.mobile})` },
              ].map((f) => {
                const active = categoryFilter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setCategoryFilter(f.id)}
                    className={`font-mono-code rounded-xl px-3.5 py-2 text-[11px] uppercase tracking-wider transition ${
                      active
                        ? "bg-moss font-semibold text-black"
                        : "border border-border bg-black/50 text-muted-foreground hover:border-input hover:text-white"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Technology Tag Pills Row */}
          <div className="mt-3.5 flex flex-wrap items-center gap-1.5 border-t border-border/70 pt-3.5">
            <span className="font-mono-code mr-1 text-[10px] uppercase tracking-widest text-muted-foreground">
              Stack:
            </span>
            <button
              type="button"
              onClick={() => setTagFilter("All")}
              className={`font-mono-code rounded-full px-2.5 py-1 text-[10px] uppercase tracking-widest transition ${
                tagFilter === "All"
                  ? "bg-white font-semibold text-black"
                  : "border border-border bg-black/40 text-muted-foreground hover:text-white"
              }`}
            >
              {t("type_all")}
            </button>
            {allTags.map((tg) => {
              const active = tagFilter.toLowerCase() === tg.toLowerCase();
              return (
                <button
                  key={tg}
                  type="button"
                  onClick={() => setTagFilter(active ? "All" : tg)}
                  className={`font-mono-code rounded-full px-2.5 py-1 text-[10px] uppercase tracking-widest transition ${
                    active
                      ? "bg-white font-semibold text-black"
                      : "border border-border bg-black/40 text-muted-foreground hover:border-input hover:text-white"
                  }`}
                >
                  {tg}
                </button>
              );
            })}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="font-mono-code ml-auto inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-moss hover:underline"
              >
                <X className="h-3 w-3" />
                {t("works_filter_reset")}
              </button>
            )}
          </div>
        </div>

        {/* Active count status line */}
        <div className="mt-6 flex items-center justify-between">
          <p className="font-mono-code text-xs uppercase tracking-widest text-muted-foreground">
            {t("works_showing_count", { shown: filtered.length, total: counts.total })}
          </p>
        </div>

        {/* Projects Grid */}
        {filtered.length > 0 ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <ProjectCard key={p.id} p={p} i={i} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-border bg-surface/60 p-12 text-center">
            <p className="font-display text-xl font-semibold text-white">
              {t("works_empty_title")}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("works_empty_subtitle")}
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="font-mono-code mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-black"
            >
              {t("works_empty_btn")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
