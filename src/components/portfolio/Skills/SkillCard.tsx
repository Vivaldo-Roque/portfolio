import { motion } from "framer-motion";

type Skill = { name: string; icon: string };

export function SkillCard({ skill, delay }: { skill: Skill; delay: number }) {
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
