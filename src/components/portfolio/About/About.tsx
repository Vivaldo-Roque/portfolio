import { motion } from "framer-motion";
import portrait from "@/assets/vivaldo-portrait.jpg";
import { useLanguage } from "@/context/language-context";
import ReactMarkdown from "react-markdown";
import bioEn from "@/content/about/bio-en.md?raw";
import bioPt from "@/content/about/bio-pt.md?raw";

export default function About() {
  const { t, language } = useLanguage();
  const bio = language === "pt" ? bioPt : bioEn;

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
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-moss/30">
            <img
              src={portrait}
              alt="Vivaldo Roque — Software Engineer"
              loading="lazy"
              width={1024}
              height={1280}
              className="h-full w-full object-cover"
              style={{ filter: "saturate(0.85) contrast(1.05)" }}
            />
            <div
              aria-hidden
              className="absolute inset-0 mix-blend-color"
              style={{
                background:
                  "linear-gradient(135deg, rgba(46,204,113,0.55), rgba(13,31,23,0.6))",
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent"
            />
          </div>

          <div className="absolute -bottom-6 -right-6 hidden rounded-2xl border border-moss/40 bg-surface/90 p-4 backdrop-blur md:block">
            <p className="font-mono-code text-xs uppercase tracking-widest text-moss">
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
            className="font-mono-code text-sm text-moss"
          >
            // {t("about_chapter")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="font-display mt-3 text-4xl font-bold sm:text-5xl"
          >
            {t("about_title_pre")} <span className="text-gradient-leaf">{t("about_title_gradient")}</span>
          </motion.h2>

          <div className="mt-8 text-lg text-muted-foreground">
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.3 }}
                    className="mt-5 first:mt-0"
                  >
                    {children}
                  </motion.p>
                ),
                ul: ({ children }) => (
                  <ul className="my-4 space-y-2 list-none">{children}</ul>
                ),
                li: ({ children }) => (
                  <motion.li
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-2 pl-2"
                  >
                    <span className="text-moss select-none mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-moss" />
                    <span>{children}</span>
                  </motion.li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-foreground">{children}</strong>
                ),
              }}
            >
              {bio}
            </ReactMarkdown>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="rounded-full bg-moss px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-lime hover:shadow-[0_0_15px_-5px_var(--moss)]"
            >
              {t("btn_contact_me")}
            </a>
            <a
              href="#work"
              className="rounded-full border border-moss/40 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-moss hover:bg-moss/10"
            >
              {t("btn_see_portfolio")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
