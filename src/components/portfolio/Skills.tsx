import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Compass, Cpu, FlaskConical, Layers, Rocket, Terminal } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { projects } from "@/lib/projects";
import { SKILLS, type SkillTierId } from "@/config/skills-data";

export default function Skills() {
  const { t, language } = useLanguage();

  const [activeTier, setActiveTier] = useState<"all" | SkillTierId>("all");
  const [selectedId, setSelectedId] = useState<string>("flutter");

  const tiers: {
    id: SkillTierId;
    num: string;
    title: string;
    badge: string;
    subtitle: string;
    dotClass: string;
    borderClass: string;
    Icon: typeof Rocket;
  }[] = [
    {
      id: "field",
      num: "01",
      title: t("skills_tier_field_title"),
      badge: t("skills_tier_field_badge"),
      subtitle: t("skills_tier_field_sub"),
      dotClass: "bg-moss shadow-[0_0_8px_var(--moss)]",
      borderClass: "border-moss/50",
      Icon: Rocket,
    },
    {
      id: "foundation",
      num: "02",
      title: t("skills_tier_foundation_title"),
      badge: t("skills_tier_foundation_badge"),
      subtitle: t("skills_tier_foundation_sub"),
      dotClass: "bg-white",
      borderClass: "border-white/30",
      Icon: Terminal,
    },
    {
      id: "explored",
      num: "03",
      title: t("skills_tier_explored_title"),
      badge: t("skills_tier_explored_badge"),
      subtitle: t("skills_tier_explored_sub"),
      dotClass: "bg-white/35",
      borderClass: "border-border",
      Icon: FlaskConical,
    },
  ];

  const selectedSkill = useMemo(
    () => SKILLS.find((s) => s.id === selectedId) || SKILLS[0],
    [selectedId],
  );

  const visibleTiers = useMemo(
    () => (activeTier === "all" ? tiers : tiers.filter((tr) => tr.id === activeTier)),
    [activeTier, t],
  );

  const counts = useMemo(
    () => ({
      all: SKILLS.length,
      field: SKILLS.filter((s) => s.tier === "field").length,
      foundation: SKILLS.filter((s) => s.tier === "foundation").length,
      explored: SKILLS.filter((s) => s.tier === "explored").length,
    }),
    [],
  );

  return (
    <section
      id="skills"
      className="relative min-h-screen py-24 sm:py-32"
      aria-label={t("skills_title_gradient")}
    >
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-30" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header with honest engineering manifesto */}
        <div className="max-w-3xl">
          <p className="font-mono-code flex items-center gap-2.5 text-xs uppercase tracking-widest text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-moss" aria-hidden />
            04 / 04 · {t("skills_chapter")}
          </p>
          <h1 className="font-display mt-3 text-3xl font-bold leading-tight text-white sm:text-5xl">
            {t("skills_page_title")}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("skills_page_subtitle")}
          </p>
        </div>

        {/* Tier Filter Bar */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTier("all")}
            className={`font-mono-code inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs uppercase tracking-wider transition ${
              activeTier === "all"
                ? "bg-white font-semibold text-black"
                : "border border-border bg-surface text-muted-foreground hover:border-input hover:text-white"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            {t("skills_filter_all", { count: counts.all })}
          </button>
          {tiers.map((tr) => {
            const active = activeTier === tr.id;
            const c = counts[tr.id];
            return (
              <button
                key={tr.id}
                type="button"
                onClick={() => setActiveTier(tr.id)}
                className={`font-mono-code inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs uppercase tracking-wider transition ${
                  active
                    ? "bg-white font-semibold text-black"
                    : "border border-border bg-surface text-muted-foreground hover:border-input hover:text-white"
                }`}
              >
                <span className={`inline-block h-2 w-2 rounded-full ${tr.dotClass}`} />
                {tr.num} · {tr.title.split(" (")[0]} ({c})
              </button>
            );
          })}
        </div>

        {/* Main interactive layout: 3 Honest Depth Zones + Sticky Inspector */}
        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* LEFT: The 3 Honest Zones */}
          <div className="space-y-10 lg:col-span-7 xl:col-span-8">
            {visibleTiers.map((tr) => {
              const items = SKILLS.filter((s) => s.tier === tr.id);
              const TierIcon = tr.Icon;
              return (
                <div
                  key={tr.id}
                  className="rounded-2xl border border-border bg-surface/65 p-5 backdrop-blur-sm sm:p-7"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono-code inline-flex items-center gap-2 rounded-full border border-input bg-black/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-foreground">
                      <span className={`inline-block h-2 w-2 rounded-full ${tr.dotClass}`} />
                      {t("skills_zone_prefix")} {tr.num} · {tr.badge}
                    </span>
                    <TierIcon className="h-4 w-4 text-moss" />
                  </div>

                  <h2 className="font-display mt-3 text-xl font-bold text-white sm:text-2xl">
                    {tr.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {tr.subtitle}
                  </p>

                  {/* Skill Cards inside this zone */}
                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {items.map((sk) => {
                      const isSelected = sk.id === selectedSkill.id;
                      return (
                        <motion.button
                          key={sk.id}
                          type="button"
                          whileHover={{ y: -2 }}
                          onClick={() => setSelectedId(sk.id)}
                          className={`group flex items-start gap-3.5 rounded-xl border p-4 text-left transition ${
                            isSelected
                              ? "border-moss bg-black shadow-[0_0_25px_-8px_rgba(47,191,113,0.45)]"
                              : "border-border bg-black/50 hover:border-input hover:bg-black/80"
                          }`}
                        >
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface p-2">
                            <img
                              src={sk.icon}
                              alt={sk.name}
                              loading="lazy"
                              className="h-full w-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.opacity = "0.35";
                              }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="font-display truncate text-base font-bold text-white group-hover:text-moss">
                                {sk.name}
                              </h3>
                              <span
                                className={`inline-block h-2 w-2 shrink-0 rounded-full ${
                                  isSelected ? "bg-moss" : "bg-white/20"
                                }`}
                              />
                            </div>
                            <p className="font-mono-code mt-1 truncate text-[10px] uppercase tracking-wider text-moss">
                              {t(`skill_${sk.id}_evidence`)}
                            </p>
                            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                              {t(`skill_${sk.id}_headline`)}
                            </p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: Sticky Inspector ("Raio-X de Experiência Real") */}
          <aside className="lg:sticky lg:top-24 lg:col-span-5 xl:col-span-4">
            <div className="overflow-hidden rounded-2xl border border-input bg-surface/95 p-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <span className="font-mono-code flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-moss">
                  <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-moss" />
                  {t("skills_inspector_title")}
                </span>
                <Cpu className="h-4 w-4 text-muted-foreground" />
              </div>

              {/* Selected Skill Header */}
              <div className="mt-5 flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-input bg-black p-3">
                  <img
                    src={selectedSkill.icon}
                    alt={selectedSkill.name}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <span className="font-mono-code rounded-full border border-border bg-black px-2.5 py-0.5 text-[9px] uppercase tracking-widest text-muted-foreground">
                    {selectedSkill.tier === "field"
                      ? t("skills_inspector_tier_field")
                      : selectedSkill.tier === "foundation"
                        ? t("skills_inspector_tier_foundation")
                        : t("skills_inspector_tier_explored")}
                  </span>
                  <h3 className="font-display mt-1.5 text-2xl font-bold text-white">
                    {selectedSkill.name}
                  </h3>
                </div>
              </div>

              {/* Honest summary & story */}
              <div className="mt-5 space-y-3 rounded-xl border border-border bg-black/70 p-4">
                <p className="text-sm font-medium leading-snug text-white">
                  {t(`skill_${selectedSkill.id}_headline`)}
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {t(`skill_${selectedSkill.id}_story`)}
                </p>
              </div>

              {/* Concrete proof / where I used it */}
              <div className="mt-5">
                <p className="font-mono-code text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {t("skills_inspector_where")}
                </p>
                <p className="font-mono-code mt-1 text-xs text-moss">
                  • {t(`skill_${selectedSkill.id}_evidence`)}
                </p>

                {selectedSkill.relatedProjects.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {selectedSkill.relatedProjects.map((rp) => (
                      <Link
                        key={rp.id}
                        to="/projects/$projectId"
                        params={{ projectId: rp.id }}
                        className="group flex items-center justify-between rounded-xl border border-border bg-black/80 px-3.5 py-2.5 text-xs text-white transition hover:border-moss"
                      >
                        <span className="font-display font-semibold group-hover:text-moss">
                          {projects.find((p) => p.id === rp.id)?.i18n?.[language]?.name ||
                            t(rp.nameKey)}
                        </span>
                        <span className="font-mono-code inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-white">
                          {t("showcase_title")}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 rounded-xl border border-border bg-black/40 p-3 text-xs text-muted-foreground">
                    {selectedSkill.tier === "foundation"
                      ? t("skills_inspector_empty_foundation")
                      : t("skills_inspector_empty_explored")}
                  </div>
                )}
              </div>

              <div className="mt-6 border-t border-border pt-4">
                <Link
                  to="/chapter/$chapterId"
                  params={{ chapterId: "work" }}
                  className="font-mono-code flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-black transition hover:bg-white/90"
                >
                  <Compass className="h-3.5 w-3.5" />
                  {t("skills_inspector_all_projects")}
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
