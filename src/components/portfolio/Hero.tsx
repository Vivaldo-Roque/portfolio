import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, Download } from "lucide-react";
import { PROFILE, SOCIAL_LINKS } from "@/config/profile";
import { useLanguage } from "@/context/language-context";
import { ScrambleText, useScrambleSection } from "./ScrambleText";

function Typewriter({ words }: { words: string[] }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return;
    const current = words[wordIndex];
    const speed = deleting ? 40 : 90;
    const timeout = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, text.length + 1);
        setText(next);
        if (next === current) {
          setTimeout(() => setDeleting(true), 1400);
        }
      } else {
        const next = current.slice(0, text.length - 1);
        setText(next);
        if (next === "") {
          setDeleting(false);
          setWordIndex((i) => (i + 1) % words.length);
        }
      }
    }, speed);
    return () => clearTimeout(timeout);
  }, [text, deleting, wordIndex, words]);

  return (
    <span className="font-mono-code text-foreground/90">
      {text}
      <span className="animate-caret ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] bg-moss" />
    </span>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { t, language } = useLanguage();

  useScrambleSection(ref, { staggerMs: 140 });

  const words = [t("text_changing1"), t("text_changing2"), t("text_changing3")];

  return (
    <>
      <div id="home" className="snap-target pointer-events-none h-0 w-full" aria-hidden="true" />
      <section
        ref={ref}
        data-stack
        style={{ zIndex: 0 }}
        className="section-sticky snap-viewport flex items-center overflow-hidden"
      >
        <span className="sr-only">
          Serra da Leba, Angola — mountains with birds in flight
        </span>

        {/* Main hero content */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-32 pb-24 drop-shadow-[0_2px_18px_rgba(0,0,0,0.85)] sm:pt-40">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="font-mono-code flex items-center gap-2.5 whitespace-nowrap text-xs uppercase tracking-widest text-foreground/85"
          >
            <span
              className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-moss"
              aria-hidden
            />
            <ScrambleText className="block" text={t("hero_hello")} />
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="font-display mt-4 text-5xl font-bold leading-[0.95] tracking-tight text-white sm:text-7xl md:text-8xl"
          >
            <ScrambleText className="block" text={PROFILE.firstName} />
            <ScrambleText className="block" text={PROFILE.lastName} />
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className="mt-6 text-xl text-white sm:text-2xl"
          >
            <Typewriter words={words} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.3 }}
            className="mt-6 max-w-xl text-base text-foreground/90 sm:text-lg"
          >
            <ScrambleText as="p" className="block" text={t("hero_tagline")} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#work"
              onClick={(e) => e.stopPropagation()}
              className="group relative inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-mono-code text-xs font-semibold uppercase tracking-widest text-black transition hover:bg-white/90"
            >
              {t("btn_see_portfolio")}
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </a>
            <a
              href={PROFILE.cv[language]}
              target="_blank"
              rel="noreferrer noopener"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-black/50 px-6 py-3 font-mono-code text-xs uppercase tracking-widest text-white backdrop-blur-sm transition hover:border-moss hover:text-moss"
            >
              <Download className="h-4 w-4" />
              {t("btn_download_cv")}
            </a>
          </motion.div>

          <div className="mt-20 flex flex-col items-start gap-4">
            <div className="flex items-center gap-3 text-foreground/80">
              <span className="h-px w-10 bg-foreground/50" />
              <span className="font-mono-code text-xs uppercase tracking-widest">
                {t("hero_scroll")}
              </span>
            </div>
          </div>
        </div>

        {/* Social links */}
        <div
          className="absolute right-6 top-24 z-20 hidden gap-4 sm:flex"
          onClick={(e) => e.stopPropagation()}
        >
          {SOCIAL_LINKS.map(({ href, Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={label}
              className="rounded-full border border-input bg-background/40 p-2 text-foreground/80 backdrop-blur transition hover:border-moss hover:text-moss"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
