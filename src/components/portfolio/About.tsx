import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight, type LucideIcon } from "lucide-react";
import portrait from "@/assets/vivaldo-portrait.jpg";
import portraitCutout from "@/assets/vivaldo-portrait.png";
import meWelcomeVideo from "@/assets/me_welcome.mp4";
import { useLanguage } from "@/context/language-context";
import { ABOUT_STOPS_CONFIG } from "@/config/about-data";
import { PROFILE } from "@/config/profile";
import { ScrambleText, useScrambleSection } from "./ScrambleText";
import { HologramComms } from "./HologramComms";

type Stop = {
  id: string;
  num: string;
  year: string;
  tag: string;
  place: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  afterBullets?: string;
  highlightLabel?: string;
  highlightBody?: string;
  metrics: { label: string; value: string }[];
  chips: string[];
  Icon: LucideIcon;
};

function JourneyStop({
  stop,
  index,
  total,
  onActive,
}: {
  stop: Stop;
  index: number;
  total: number;
  onActive: (idx: number) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  useScrambleSection(ref, { staggerMs: 120 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && entry.intersectionRatio >= 0.35) {
          onActive(index);
        }
      },
      { threshold: [0.35, 0.6] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [index, onActive]);

  const Icon = stop.Icon;

  return (
    <section
      ref={ref}
      id={`stop-${stop.id}`}
      className="snap-target relative flex min-h-[75vh] items-center border-t border-border/70 py-14 sm:py-20 lg:min-h-screen lg:py-24"
    >
      {/* Giant watermark stage number */}
      <span
        aria-hidden
        className="font-display pointer-events-none absolute right-2 bottom-2 select-none text-[26vw] font-bold leading-none text-foreground/[0.03] sm:right-4 sm:bottom-4 sm:text-[22vw]"
      >
        {stop.num}
      </span>

      <div className="relative z-10 w-full">
        {/* Top telemetry bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="font-mono-code inline-flex items-center gap-2 rounded-full border border-input bg-surface px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-moss" />
            {stop.num} / 0{total} · {stop.tag}
          </span>
          <span className="font-mono-code text-xs uppercase tracking-[0.2em] text-moss">
            {stop.year}
          </span>
          <span className="font-mono-code text-xs text-muted-foreground">— {stop.place}</span>
        </div>

        {/* Stage Title with Monako glitch scramble */}
        <div className="mt-5 flex items-start gap-4 sm:mt-6">
          <div className="mt-1 hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-input bg-surface text-moss sm:flex">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <ScrambleText
              as="h2"
              text={stop.title}
              className="font-display text-2xl font-bold leading-[1.08] tracking-tight text-white sm:text-4xl md:text-5xl"
            />
          </div>
        </div>

        {/* Narrative paragraphs & optional bullets/highlights */}
        <div className="mt-5 max-w-2xl space-y-4 text-base leading-relaxed text-foreground/90 sm:text-lg">
          {stop.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}

          {stop.bullets && stop.bullets.length > 0 && (
            <ul className="my-4 grid gap-2.5 sm:grid-cols-2">
              {stop.bullets.map((b) => (
                <li
                  key={b}
                  className="font-mono-code flex items-center gap-2.5 rounded-xl border border-input bg-surface/90 px-4 py-3 text-xs text-white"
                >
                  <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-moss" />
                  {b}
                </li>
              ))}
            </ul>
          )}

          {stop.afterBullets && <p>{stop.afterBullets}</p>}

          {stop.highlightLabel && stop.highlightBody && (
            <div className="mt-5 rounded-xl border border-moss/35 bg-surface/85 p-4 sm:p-5">
              <p className="font-mono-code flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-moss">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-moss" />
                {stop.highlightLabel}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/90 sm:text-base">
                {stop.highlightBody}
              </p>
            </div>
          )}
        </div>

        {/* Concrete milestones / telemetry cards */}
        <div className="mt-7 grid max-w-2xl grid-cols-1 gap-2.5 min-[420px]:grid-cols-3 sm:gap-3">
          {stop.metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-border bg-surface/75 p-3.5 backdrop-blur-sm transition hover:border-input sm:p-4"
            >
              <p className="font-mono-code text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {m.label}
              </p>
              <p className="font-display mt-1 text-sm font-semibold text-white sm:text-base">
                {m.value}
              </p>
            </div>
          ))}
        </div>

        {/* Skill / Concept pills */}
        <div className="mt-5 flex flex-wrap gap-2">
          {stop.chips.map((c) => (
            <span
              key={c}
              className="font-mono-code rounded-full border border-input bg-black/60 px-3 py-1 text-[10px] uppercase tracking-widest text-foreground/85 sm:text-[11px]"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function About() {
  const { t } = useLanguage();
  const [activeStop, setActiveStop] = useState(0);

  // Build localized stops dynamically from ABOUT_STOPS_CONFIG + src/locales/{pt,en}/about.yaml
  const stops: Stop[] = ABOUT_STOPS_CONFIG.map((cfg) => {
    const p = cfg.prefix;
    return {
      id: cfg.id,
      num: cfg.num,
      year: t(`${p}_year`),
      tag: t(`${p}_tag`),
      place: t(`${p}_place`),
      title: t(`${p}_title`),
      paragraphs: Array.from({ length: cfg.paragraphCount }, (_, i) => t(`${p}_p${i + 1}`)),
      bullets: cfg.bulletCount
        ? Array.from({ length: cfg.bulletCount }, (_, i) => t(`${p}_b${i + 1}`))
        : undefined,
      afterBullets: cfg.hasAfterBullets ? t(`${p}_after`) : undefined,
      highlightLabel: cfg.hasHighlight ? t(`${p}_hl_label`) : undefined,
      highlightBody: cfg.hasHighlight ? t(`${p}_hl_body`) : undefined,
      metrics: [
        { label: t(`${p}_m1_label`), value: t(`${p}_m1_val`) },
        { label: t(`${p}_m2_label`), value: t(`${p}_m2_val`) },
        { label: t(`${p}_m3_label`), value: t(`${p}_m3_val`) },
      ],
      chips: Array.from({ length: cfg.chipCount }, (_, i) => t(`${p}_chip${i + 1}`)),
      Icon: cfg.Icon,
    };
  });

  const current = stops[activeStop] || stops[0];

  const scrollToStop = (id: string) => {
    document
      .getElementById(`stop-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="about"
      className="relative min-h-screen bg-background text-foreground"
      aria-label={t("about_me_title")}
    >
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-35" aria-hidden />

      {/* Featured Hologram Comms Intro (visible on desktop & mobile) */}
      <div className="relative z-10 mx-auto max-w-2xl px-4 pt-20 pb-4 sm:pt-24">
        <HologramComms
          idleVideoSrc={meWelcomeVideo}
          fallbackImage={portraitCutout}
          alt={PROFILE.fullName}
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
        {/* Centered Single-Column Narrative Expedition */}
        <div>
            <div className="flex min-h-[50vh] flex-col justify-center pb-10 pt-4 sm:pt-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <img
                  src={portrait}
                  alt={PROFILE.fullName}
                  className="h-24 w-24 shrink-0 rounded-2xl border border-input object-cover object-[50%_20%] sm:h-28 sm:w-28"
                  style={{ filter: "grayscale(0.25) contrast(1.06)" }}
                />
                <div>
                  <p className="font-mono-code flex items-center gap-2.5 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-moss" />
                    01 / 04 · {t("about_title_pre")} {t("about_title_gradient")}
                  </p>
                  <h2 className="font-display mt-2 text-3xl font-bold leading-[0.98] tracking-tight text-white sm:text-5xl">
                    {PROFILE.fullName}
                  </h2>
                  <p className="mt-3 max-w-xl text-base text-foreground/90 sm:text-lg">
                    {t("about_me_p1")}
                  </p>
                </div>
              </div>

              {/* Quick summary stats bar — removed */}

              <button
                type="button"
                onClick={() => scrollToStop("roots")}
                className="font-mono-code mt-10 inline-flex w-fit items-center gap-2 text-xs uppercase tracking-[0.25em] text-moss transition hover:text-white"
              >
                {t("about_walk_btn")}
                <ArrowDown className="h-4 w-4 animate-bounce" />
              </button>
            </div>

            {/* The 4 Interactive Stops */}
            {stops.map((s, idx) => (
              <JourneyStop
                key={s.id}
                stop={s}
                index={idx}
                total={stops.length}
                onActive={setActiveStop}
              />
            ))}

            {/* Closing CTA card */}
            <div className="my-14 rounded-2xl border border-input bg-surface/80 p-6 backdrop-blur-md sm:my-20 sm:p-10">
              <p className="font-mono-code flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-moss">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-moss" />
                {t("about_next_stop_eyebrow")}
              </p>
              <h3 className="font-display mt-3 text-2xl font-bold text-white sm:text-4xl">
                {t("about_next_stop_title")}
              </h3>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/chapter/$chapterId"
                  params={{ chapterId: "work" }}
                  className="font-mono-code inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-semibold uppercase tracking-widest text-black transition hover:bg-white/90 sm:px-6"
                >
                  {t("about_next_stop_btn")}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <a
                  href="/#contact"
                  className="font-mono-code inline-flex items-center gap-2 rounded-full border border-input px-5 py-3 text-xs uppercase tracking-widest text-foreground transition hover:border-moss hover:text-moss sm:px-6"
                >
                  {t("btn_contact_me")}
                </a>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}
