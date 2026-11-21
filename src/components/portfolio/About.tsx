import { motion } from "framer-motion";
import portrait from "@/assets/vivaldo-portrait.jpg";
import { useLanguage } from "../../context/language-context";

export default function About() {
  const { t } = useLanguage();

  const paragraphs = [
    t("about_me_p1"),
    t("about_me_p2"),
    t("about_me_p3"),
  ];

  return (
    <section id="about" className="relative py-32" aria-label={t("about_me_title")}>
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border">
            <img
              src={portrait}
              alt="Vivaldo Roque — Software Engineer"
              loading="lazy"
              width={1024}
              height={1280}
              className="h-full w-full object-cover"
              style={{ filter: "grayscale(0.35) contrast(1.08)" }}
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent"
            />
          </div>

          <div className="absolute -bottom-6 -right-6 hidden rounded-2xl border border-input bg-surface/90 p-4 backdrop-blur md:block">
            <p className="font-mono-code flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-moss" aria-hidden />
              based in
            </p>
            <p className="font-display mt-1 text-lg font-semibold">
              Luanda · Angola
            </p>
          </div>
        </motion.div>

        <div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono-code flex items-center gap-2.5 text-xs uppercase tracking-widest text-muted-foreground"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-moss" aria-hidden />
            {t("about_chapter")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="font-display mt-3 text-4xl font-bold sm:text-5xl"
          >
            {t("about_title_pre")} <span className="text-foreground">{t("about_title_gradient")}</span>
          </motion.h2>

          <div className="mt-8 space-y-5 text-lg text-muted-foreground whitespace-pre-line">
            {paragraphs.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                {p}
              </motion.p>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="/#contact"
              className="rounded-full bg-foreground px-6 py-3 font-mono-code text-xs font-semibold uppercase tracking-widest text-background transition hover:bg-foreground/90"
            >
              {t("btn_contact_me")}
            </a>
            <a
              href="/#work"
              className="rounded-full border border-input px-6 py-3 font-mono-code text-xs uppercase tracking-widest text-foreground transition hover:border-moss hover:text-moss"
            >
              {t("btn_see_portfolio")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

