import { motion } from "framer-motion";
import { useState } from "react";
import { GraduationCap, Briefcase, Award, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import {
  ACADEMIC_TIMELINE,
  CERTIFICATIONS_TIMELINE,
  EXPERIENCE_TIMELINE,
  SOFT_SKILL_KEYS,
  type TimelineItemConfig,
} from "@/config/origin-data";

type Item = {
  period: string;
  title: string;
  place?: string;
  body: string;
};

function Timeline({ items }: { items: Item[] }) {
  return (
    <div className="relative mt-10">
      <div aria-hidden className="absolute left-5 top-0 bottom-0 w-px bg-border" />
      <ul className="space-y-10">
        {items.map((it, i) => (
          <motion.li
            key={it.title}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="relative grid grid-cols-[40px_1fr] gap-5"
          >
            <div className="relative">
              <div className="absolute left-3.5 top-2 h-2 w-2 rounded-full bg-moss" />
            </div>
            <div>
              <p className="font-mono-code text-xs uppercase tracking-widest text-muted-foreground">
                {it.period}
              </p>
              <h4 className="font-display mt-1.5 text-xl font-semibold text-foreground">
                {it.title}
              </h4>
              {it.place && (
                <p className="font-mono-code mt-1 text-xs text-muted-foreground/80">
                  {it.place}
                </p>
              )}
              <p className="mt-3 text-muted-foreground">{it.body}</p>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

export default function OriginStory() {
  const { t } = useLanguage();
  const [tab, setTab] = useState<"academic" | "experience" | "competencias">("academic");

  const resolveItems = (configs: TimelineItemConfig[]): Item[] =>
    configs.map((c) => ({
      period: c.periodLiteral || (c.periodKey ? t(c.periodKey) : ""),
      title: t(c.titleKey),
      place: t(c.placeKey),
      body: t(c.bodyKey),
    }));

  const academic = resolveItems(ACADEMIC_TIMELINE);
  const experience = resolveItems(EXPERIENCE_TIMELINE);
  const certifications = resolveItems(CERTIFICATIONS_TIMELINE);
  const softSkills = SOFT_SKILL_KEYS.map((key) => t(key));

  const tabs = [
    { id: "academic" as const, label: t("origin_tab_academic"), Icon: GraduationCap },
    { id: "experience" as const, label: t("origin_tab_experience"), Icon: Briefcase },
    { id: "competencias" as const, label: t("origin_tab_certifications"), Icon: Award },
  ];

  return (
    <section
      id="origin"
      className="relative overflow-hidden py-32"
      aria-label="Origin story"
    >
      <div className="absolute inset-0 bg-grid opacity-40" aria-hidden />
      <div
        className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.25 }}
        >
          <p className="font-mono-code flex items-center gap-2.5 text-xs uppercase tracking-widest text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-moss" aria-hidden />
            {t("origin_chapter")}
          </p>
          <h2 className="font-display mt-3 text-4xl font-bold sm:text-5xl">
            {t("origin_title_pre")}{" "}
            <span className="text-foreground">{t("origin_title_gradient")}</span>
          </h2>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            {t("origin_subtitle")}
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="mt-12 inline-flex flex-wrap gap-1 rounded-2xl border border-input bg-surface/40 p-1 backdrop-blur">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`font-mono-code inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs uppercase tracking-widest transition ${
                tab === id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {tab === "academic" && <Timeline key="academic" items={academic} />}
        {tab === "experience" && <Timeline key="experience" items={experience} />}
        {tab === "competencias" && (
          <div className="mt-10 space-y-12">
            <div>
              <h3 className="font-display flex items-center gap-3 text-xl font-semibold">
                <Award className="h-5 w-5 text-moss" />
                {t("origin_sec_certifications")}
                <span className="h-px flex-1 bg-border" />
              </h3>
              <Timeline items={certifications} />
            </div>

            <div>
              <h3 className="font-display flex items-center gap-3 text-xl font-semibold">
                <Sparkles className="h-5 w-5 text-moss" />
                {t("origin_sec_softskills")}
                <span className="h-px flex-1 bg-border" />
              </h3>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {softSkills.map((s, i) => (
                  <motion.span
                    key={s}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    className="font-mono-code rounded-full border border-input bg-surface/60 px-3.5 py-1.5 text-xs text-foreground/90 backdrop-blur transition hover:border-moss hover:text-moss"
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
