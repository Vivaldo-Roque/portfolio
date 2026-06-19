import { motion } from "framer-motion";
import { useState } from "react";
import { GraduationCap, Briefcase, Award, Sparkles } from "lucide-react";
import { useLanguage } from "../../context/language-context";

type Item = {
  period: string;
  title: string;
  place?: string;
  body: string;
};

function Timeline({ items, accent }: { items: Item[]; accent: "moss" | "lime" }) {
  const dotColor = accent === "moss" ? "bg-moss shadow-[0_0_10px_var(--moss)]" : "bg-lime shadow-[0_0_10px_var(--lime)]";
  const tagColor = accent === "moss" ? "text-lime" : "text-moss";
  return (
    <div className="relative mt-10">
      <div
        aria-hidden
        className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-moss/0 via-moss/40 to-moss/0"
      />
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
              <div className={`absolute left-3 top-2 h-3 w-3 rounded-full ${dotColor}`} />
            </div>
            <div>
              <p className={`font-mono-code text-xs uppercase tracking-widest ${tagColor}`}>
                {it.period}
              </p>
              <h4 className="font-display mt-1.5 text-xl font-semibold">{it.title}</h4>
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

function CompetenciasPanel() {
  const { t } = useLanguage();

  const certifications: Item[] = [
    {
      period: "2024",
      title: t("certifications_0_title"),
      place: t("certifications_0_place"),
      body: t("certifications_0_body"),
    },
    {
      period: "2024",
      title: t("certifications_1_title"),
      place: t("certifications_1_place"),
      body: t("certifications_1_body"),
    },
    {
      period: "2023",
      title: t("certifications_2_title"),
      place: t("certifications_2_place"),
      body: t("certifications_2_body"),
    },
    {
      period: t("experience_2_title").includes("Freelance") ? "Em curso" : "Ongoing",
      title: t("certifications_3_title"),
      place: t("certifications_3_place"),
      body: t("certifications_3_body"),
    },
  ];

  const softSkills = [
    t("soft_problem_solving"),
    t("soft_algorithmic_thinking"),
    t("soft_clean_code"),
    t("soft_git_flow"),
    t("soft_agile"),
    t("soft_code_review"),
    t("soft_peer_mentoring"),
    t("soft_technical_comm"),
    t("soft_languages"),
  ];

  return (
    <div className="mt-10 space-y-12">
      <div>
        <h3 className="font-display flex items-center gap-3 text-xl font-semibold">
          <Award className="h-5 w-5 text-lime" />
          {t("origin_sec_certifications")}
          <span className="h-px flex-1 bg-gradient-to-r from-moss/40 to-transparent" />
        </h3>
        <Timeline items={certifications} accent="lime" />
      </div>

      <div>
        <h3 className="font-display flex items-center gap-3 text-xl font-semibold">
          <Sparkles className="h-5 w-5 text-moss" />
          {t("origin_sec_softskills")}
          <span className="h-px flex-1 bg-gradient-to-r from-moss/40 to-transparent" />
        </h3>
        <div className="mt-6 flex flex-wrap gap-2.5">
          {softSkills.map((s, i) => (
            <motion.span
              key={s}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="font-mono-code rounded-full border border-moss/30 bg-surface/60 px-3.5 py-1.5 text-xs text-foreground/90 backdrop-blur transition hover:border-moss hover:text-lime"
            >
              {s}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OriginStory() {
  const { t } = useLanguage();
  const [tab, setTab] = useState<"academic" | "experience" | "competencias">("academic");

  const academic: Item[] = [
    {
      period: "2016 – 2018",
      title: t("academic_0_title"),
      place: t("academic_0_place"),
      body: t("academic_0_body"),
    },
    {
      period: "2019 – 2023",
      title: t("academic_1_title"),
      place: t("academic_1_place"),
      body: t("academic_1_body"),
    },
    {
      period: "2024",
      title: t("academic_2_title"),
      place: t("academic_2_place"),
      body: t("academic_2_body"),
    },
    {
      period: "2024",
      title: t("academic_3_title"),
      place: t("academic_3_place"),
      body: t("academic_3_body"),
    },
    {
      period: "2025 – 2027",
      title: t("academic_4_title"),
      place: t("academic_4_place"),
      body: t("academic_4_body"),
    },
  ];

  const experience: Item[] = [
    {
      period: "Jul – Ago 2023",
      title: t("experience_0_title"),
      place: t("experience_0_place"),
      body: t("experience_0_body"),
    },
    {
      period: "2023 – Presente",
      title: t("experience_1_title"),
      place: t("experience_1_place"),
      body: t("experience_1_body"),
    },
    {
      period: t("experience_2_title").includes("Freelance") ? "Em curso" : "Ongoing",
      title: t("experience_2_title"),
      place: t("experience_2_place"),
      body: t("experience_2_body"),
    },
  ];

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
          <p className="font-mono-code text-sm text-moss">// {t("origin_chapter")}</p>
          <h2 className="font-display mt-3 text-4xl font-bold sm:text-5xl">
            {t("origin_title_pre")} <span className="text-gradient-leaf">{t("origin_title_gradient")}</span>
          </h2>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            {t("origin_subtitle")}
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="mt-12 inline-flex flex-wrap gap-1 rounded-2xl border border-moss/30 bg-surface/40 p-1 backdrop-blur">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`font-mono-code inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs uppercase tracking-widest transition ${
                tab === id
                  ? "bg-moss text-primary-foreground"
                  : "text-muted-foreground hover:text-lime"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {tab === "academic" && <Timeline key="academic" items={academic} accent="moss" />}
        {tab === "experience" && <Timeline key="experience" items={experience} accent="lime" />}
        {tab === "competencias" && <CompetenciasPanel key="competencias" />}
      </div>
    </section>
  );
}


