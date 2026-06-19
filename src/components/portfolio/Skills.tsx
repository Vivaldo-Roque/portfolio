import { motion } from "framer-motion";
import { useLanguage } from "../../context/language-context";

type Skill = { name: string; icon: string };
type Group = { titleKey: string; defaultTitle: string; emoji: string; skills: Skill[] };

const ICON = (slug: string, variant = "original") =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-${variant}.svg`;

const focus = ["Flutter", "Dart", "Django", "Python"];

function SkillCard({ skill, delay }: { skill: Skill; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.25, delay }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col items-center justify-center gap-3 rounded-2xl border border-moss/10 bg-surface/60 p-5 backdrop-blur transition hover:border-moss/60 hover:shadow-[0_0_15px_-5px_var(--moss)]"
    >
      <div className="relative flex h-12 w-12 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-moss/0 blur-xl transition group-hover:bg-moss/30" />
        <img
          src={skill.icon}
          alt={`${skill.name} logo`}
          loading="lazy"
          className="relative h-10 w-10 object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).style.opacity = "0.3";
          }}
        />
      </div>
      <span className="font-mono-code text-xs text-muted-foreground transition group-hover:text-lime">
        {skill.name}
      </span>
    </motion.div>
  );
}

export default function Skills() {
  const { t } = useLanguage();

  const groups: Group[] = [
    {
      titleKey: "skills_levels_subtitle1",
      defaultTitle: "Web Development",
      emoji: "🌿",
      skills: [
        { name: "HTML5", icon: ICON("html5", "original") },
        { name: "CSS3", icon: ICON("css3", "original") },
        { name: "JavaScript", icon: ICON("javascript", "original") },
        { name: "React", icon: ICON("react", "original") },
        { name: "Angular", icon: ICON("angularjs", "original") },
        { name: "Next.js", icon: ICON("nextjs", "original-wordmark") },
        { name: "Nest.js", icon: ICON("nestjs", "plain") },
      ],
    },
    {
      titleKey: "backend_frameworks",
      defaultTitle: "Backend Frameworks",
      emoji: "🌳",
      skills: [
        { name: "Django", icon: ICON("django", "plain") },
      ],
    },
    {
      titleKey: "skills_levels_subtitle2",
      defaultTitle: "General Purpose Languages",
      emoji: "🌱",
      skills: [
        { name: "C", icon: ICON("c", "original") },
        { name: "C++", icon: ICON("cplusplus", "original") },
        { name: "C#", icon: ICON("csharp", "original") },
        { name: "Dart", icon: ICON("dart", "original") },
        { name: "Java", icon: ICON("java", "original") },
        { name: "Python", icon: ICON("python", "original") },
      ],
    },
    {
      titleKey: "skills_levels_subtitle3",
      defaultTitle: "Databases",
      emoji: "🪨",
      skills: [
        { name: "MySQL", icon: ICON("mysql", "original") },
        { name: "SQLite", icon: ICON("sqlite", "original") },
      ],
    },
    {
      titleKey: "skills_levels_subtitle4",
      defaultTitle: "Game Engines",
      emoji: "🎮",
      skills: [{ name: "Unity3D", icon: ICON("unity", "original") }],
    },
    {
      titleKey: "skills_levels_subtitle5",
      defaultTitle: "Cross-Platform Frameworks",
      emoji: "📱",
      skills: [{ name: "Flutter", icon: ICON("flutter", "original") }],
    },
    {
      titleKey: "skills_levels_subtitle6",
      defaultTitle: "Operating Systems & Toolchains",
      emoji: "🖥️",
      skills: [
        { name: "Android SDK", icon: ICON("android", "original") },
        { name: "Windows SDK", icon: ICON("windows8", "original") },
        { name: "Linux Toolchain", icon: ICON("linux", "original") },
      ],
    },
  ];

  return (
    <section id="skills" className="relative py-32" aria-label={t("skills_title_gradient")}>
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25 }}
        >
          <p className="font-mono-code text-sm text-moss">// {t("skills_chapter")}</p>
          <h2 className="font-display mt-3 text-4xl font-bold sm:text-5xl">
            {t("skills_title_pre")} <span className="text-gradient-leaf">{t("skills_title_gradient")}</span>
          </h2>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            {t("skills_subtitle")}
          </p>
        </motion.div>

        <div className="mt-16 space-y-14">
          {groups.map((g) => (
            <div key={g.defaultTitle}>
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="font-display flex items-center gap-3 text-xl font-semibold"
              >
                <span className="text-2xl">{g.emoji}</span>
                {t(g.titleKey) === g.titleKey ? g.defaultTitle : t(g.titleKey)}
                <span className="h-px flex-1 bg-gradient-to-r from-moss/40 to-transparent" />
              </motion.h3>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {g.skills.map((s, i) => (
                  <SkillCard key={s.name} skill={s} delay={i * 0.05} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Marquee */}
        <div className="mt-20 overflow-hidden rounded-2xl border border-moss/20 bg-deep/60 py-5">
          <div className="flex items-center gap-3 px-6">
            <span className="font-mono-code shrink-0 text-xs uppercase tracking-widest text-moss">
              {t("skills_marquee_prefix")} →
            </span>
            <div className="relative flex-1 overflow-hidden">
              <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
                {[...focus, ...focus, ...focus, ...focus].map((f, i) => (
                  <span
                    key={i}
                    className="font-display text-2xl font-semibold text-foreground/90"
                  >
                    {f}
                    <span className="ml-10 text-lime">·</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
