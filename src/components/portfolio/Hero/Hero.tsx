import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, Download, X } from "lucide-react";
import { Github, Linkedin, Twitter } from "@/components/portfolio/BrandIcons";
import { BirdAnimation } from "@/components/portfolio/BirdAnimation";
import { MusicPlayer } from "@/components/portfolio/MusicPlayer";
import { useLanguage } from "@/context/language-context";
import { Typewriter } from "./Typewriter";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const { t, language } = useLanguage();

  // Parallax: image moves at 0.4x scroll speed
  const y = useTransform(scrollY, [0, 1000], [0, 400]);
  const overlayOpacity = useTransform(scrollY, [0, 600], [0.6, 0.95]);

  const [showCaption, setShowCaption] = useState(false);
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);

  const words = [
    t("text_changing1"),
    t("text_changing2"),
    t("text_changing3"),
  ];

  useEffect(() => {
    if (!showCaption) return;
    const timer = setTimeout(() => setShowCaption(false), 4000);
    return () => clearTimeout(timer);
  }, [showCaption]);

  useEffect(() => {
    if (isPlayerExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isPlayerExpanded]);

  const handleHeroClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("a") || target.closest("button") || target.closest("input")) {
      return;
    }
    setIsPlayerExpanded(true);
  };

  return (
    <section
      ref={ref}
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden cursor-pointer"
      onClick={handleHeroClick}
    >
      {/* Parallax Background Image */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 -top-[10%] h-[120%] p-0"
      >
        <img
          src="/img/header.jpg"
          alt="Serra da Leba, Angola — lush green mountain landscape"
          className="h-full w-full object-cover brightness-[0.75]"
          width={1920}
          height={1280}
        />
      </motion.div>

      {/* Gradient overlay */}
      <motion.div
        aria-hidden
        style={{ opacity: overlayOpacity }}
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-background dark:from-background/50 dark:via-background/60 dark:to-background/90"
      />

      {/* Photo caption tooltip */}
      <div
        className={`absolute bottom-6 right-6 z-20 rounded-full border border-moss/40 bg-background/70 px-4 py-2 backdrop-blur transition-opacity duration-300 ${showCaption ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
          }`}
      >
        <span className="font-mono-code text-xs uppercase tracking-widest text-lime">
          {t("hero_caption")}
        </span>
      </div>

      {/* Main hero content */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-32 pb-24 sm:pt-40">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="font-mono-code text-sm text-moss"
        >
          {t("hero_hello")}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="font-display mt-4 text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl md:text-8xl"
        >
          VIVALDO
          <br />
          <span className="text-gradient-leaf">ROQUE</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.2 }}
          className="mt-6 text-xl text-foreground/90 sm:text-2xl"
        >
          <Typewriter words={words} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.3 }}
          className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg"
        >
          {t("hero_tagline")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="#work"
            onClick={(e) => e.stopPropagation()}
            className="group relative inline-flex items-center gap-2 rounded-full bg-moss px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-lime hover:shadow-[0_0_15px_-5px_var(--moss)]"
          >
            {t("btn_see_portfolio")}
            <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </a>
          <a
            href={language === "pt" ? "/cv/vivaldo_roque_cv_pt.pdf" : "/cv/vivaldo_roque_cv_en.pdf"}
            target="_blank"
            rel="noreferrer noopener"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-2 rounded-full border border-moss/40 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-moss hover:bg-moss/10 hover:text-lime"
          >
            <Download className="h-4 w-4" />
            {t("btn_download_cv")}
          </a>
        </motion.div>

        <div className="mt-20 flex flex-col items-start gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowCaption((s) => !s);
            }}
            className="text-xs font-mono-code text-muted-foreground hover:text-lime underline transition"
          >
            {t("hero_caption").split(",")[0]}
          </button>
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="h-px w-10 bg-muted-foreground/40" />
            <span className="font-mono-code text-xs uppercase tracking-widest">{t("hero_scroll")}</span>
          </div>
        </div>
      </div>

      {/* Social links */}
      <div className="absolute right-6 top-24 z-20 hidden gap-4 sm:flex" onClick={(e) => e.stopPropagation()}>
        {[
          { href: "https://github.com/Vivaldo-Roque/", Icon: Github, label: "GitHub" },
          { href: "https://www.linkedin.com/in/vivaldoroque/", Icon: Linkedin, label: "LinkedIn" },
          { href: "https://twitter.com/vivaldo_roque", Icon: Twitter, label: "Twitter" },
        ].map(({ href, Icon, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={label}
            className="rounded-full border border-moss/30 bg-background/40 p-2 text-foreground/80 backdrop-blur transition hover:border-moss hover:text-lime"
          >
            <Icon className="h-4 w-4" />
          </a>
        ))}
      </div>

      {/* Full-Screen Immersive Overlay */}
      {isPlayerExpanded && (
        <div
          className="fixed inset-0 z-40 flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Same background image as hero */}
          <img
            src="/img/header.jpg"
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover brightness-[0.35]"
          />

          {/* Bird animation layer */}
          <div className="absolute inset-0 z-[1]">
            <BirdAnimation />
          </div>

          {/* Dark tint over everything */}
          <div className="absolute inset-0 z-[2] bg-background/25 pointer-events-none" />

          {/* Close button */}
          <button
            onClick={() => setIsPlayerExpanded(false)}
            className="absolute top-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-moss/20 bg-background/50 text-foreground transition hover:border-moss hover:bg-moss/10"
            aria-label={t("player_close")}
          >
            <X size={18} />
          </button>

          {/* Centered text content */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center px-6">
            <span className="font-mono-code text-sm text-lime">
              {t("hero_hello")}
            </span>
            <h2 className="font-display mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl">
              VIVALDO <span className="text-gradient-leaf">ROQUE</span>
            </h2>
            <div className="mt-4 text-lg sm:text-xl md:text-2xl">
              <Typewriter words={words} />
            </div>
            <p className="mt-6 max-w-lg text-sm text-muted-foreground sm:text-base">
              {t("hero_tagline")}
            </p>
          </div>

          {/* Music player at bottom center */}
          <div className="relative z-10 w-full pb-8">
            <MusicPlayer />
          </div>
        </div>
      )}
    </section>
  );
}
