import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight, Compass, Cpu, Globe2, Network, Rocket, Terminal } from "lucide-react";
import portrait from "@/assets/vivaldo-portrait.jpg";
import { useLanguage } from "../../context/language-context";
import { ScrambleText, useScrambleSection } from "./ScrambleText";
import AboutGlobe from "./AboutGlobe";

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
  Icon: typeof Compass;
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
          <span className="font-mono-code text-xs text-muted-foreground">
            — {stop.place}
          </span>
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

        {/* Authentic, full descriptive text from Vivaldo's original bio */}
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

  // Every single sentence from Vivaldo's original about_me_p1, about_me_p2, and about_me_p3
  // preserved verbatim in languages.json, divided naturally across the 4 stops of the walking globe!
  const stops: Stop[] = [
    {
      id: "roots",
      num: "01",
      year: t("about_stop1_year"),
      tag: t("about_stop1_tag"),
      place: t("about_stop1_place"),
      title: t("about_stop1_title"),
      paragraphs: [t("about_stop1_p1"), t("about_stop1_p2"), t("about_stop1_p3")],
      metrics: [
        { label: t("about_stop1_m1_label"), value: t("about_stop1_m1_val") },
        { label: t("about_stop1_m2_label"), value: t("about_stop1_m2_val") },
        { label: t("about_stop1_m3_label"), value: t("about_stop1_m3_val") },
      ],
      chips: [
        t("about_stop1_chip1"),
        t("about_stop1_chip2"),
        t("about_stop1_chip3"),
        t("about_stop1_chip4"),
      ],
      Icon: Compass,
    },
    {
      id: "training",
      num: "02",
      year: t("about_stop2_year"),
      tag: t("about_stop2_tag"),
      place: t("about_stop2_place"),
      title: t("about_stop2_title"),
      paragraphs: [t("about_stop2_p1")],
      bullets: [t("about_stop2_b1"), t("about_stop2_b2")],
      afterBullets: t("about_stop2_after"),
      metrics: [
        { label: t("about_stop2_m1_label"), value: t("about_stop2_m1_val") },
        { label: t("about_stop2_m2_label"), value: t("about_stop2_m2_val") },
        { label: t("about_stop2_m3_label"), value: t("about_stop2_m3_val") },
      ],
      chips: [
        t("about_stop2_chip1"),
        t("about_stop2_chip2"),
        t("about_stop2_chip3"),
        t("about_stop2_chip4"),
      ],
      Icon: Network,
    },
    {
      id: "cadet42",
      num: "03",
      year: t("about_stop3_year"),
      tag: t("about_stop3_tag"),
      place: t("about_stop3_place"),
      title: t("about_stop3_title"),
      paragraphs: [t("about_stop3_p1"), t("about_stop3_p2"), t("about_stop3_p3")],
      metrics: [
        { label: t("about_stop3_m1_label"), value: t("about_stop3_m1_val") },
        { label: t("about_stop3_m2_label"), value: t("about_stop3_m2_val") },
        { label: t("about_stop3_m3_label"), value: t("about_stop3_m3_val") },
      ],
      chips: [
        t("about_stop3_chip1"),
        t("about_stop3_chip2"),
        t("about_stop3_chip3"),
        t("about_stop3_chip4"),
        t("about_stop3_chip5"),
      ],
      Icon: Terminal,
    },
    {
      id: "stack",
      num: "04",
      year: t("about_stop4_year"),
      tag: t("about_stop4_tag"),
      place: t("about_stop4_place"),
      title: t("about_stop4_title"),
      paragraphs: [t("about_stop4_p1"), t("about_stop4_p2")],
      highlightLabel: t("about_stop4_hl_label"),
      highlightBody: t("about_stop4_hl_body"),
      metrics: [
        { label: t("about_stop4_m1_label"), value: t("about_stop4_m1_val") },
        { label: t("about_stop4_m2_label"), value: t("about_stop4_m2_val") },
        { label: t("about_stop4_m3_label"), value: t("about_stop4_m3_val") },
      ],
      chips: [
        t("about_stop4_chip1"),
        t("about_stop4_chip2"),
        t("about_stop4_chip3"),
        t("about_stop4_chip4"),
        t("about_stop4_chip5"),
        t("about_stop4_chip6"),
        t("about_stop4_chip7"),
      ],
      Icon: Rocket,
    },
  ];

  const current = stops[activeStop] || stops[0];

  const scrollToStop = (id: string) => {
    document.getElementById(`stop-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="about" className="relative min-h-screen bg-background text-foreground" aria-label={t("about_me_title")}>
      {/* Subtle architectural grid backdrop */}
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-35" aria-hidden />

      {/* =====================================================================
          MOBILE & TABLET STICKY GLOBE HUD (< lg):
          Stays pinned at the top of the phone screen while the 4 stages scroll underneath!
         ===================================================================== */}
      <div className="sticky top-0 z-30 border-b border-border bg-black/90 px-4 pt-14 pb-3 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          {/* Compact 3D Walking Globe on Mobile */}
          <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl border border-input bg-black sm:h-28 sm:w-32">
            <AboutGlobe activeStop={activeStop} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <img
                src={portrait}
                alt="Vivaldo Cristóvão Roque"
                className="h-7 w-7 shrink-0 rounded-full border border-input object-cover object-[50%_20%]"
                style={{ filter: "grayscale(0.3) contrast(1.08)" }}
              />
              <p className="font-mono-code truncate text-[10px] uppercase tracking-widest text-moss">
                {current.num} / 04 · {current.tag}
              </p>
            </div>
            <p className="font-display mt-1 truncate text-sm font-bold text-white">
              {current.title}
            </p>
            {/* Mobile step buttons 01..04 */}
            <div className="mt-2 flex items-center gap-1.5">
              {stops.map((s, idx) => {
                const isAct = idx === activeStop;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => scrollToStop(s.id)}
                    className={`font-mono-code flex-1 rounded-md py-1 text-[10px] uppercase tracking-wider transition ${
                      isAct
                        ? "bg-white font-semibold text-black"
                        : "border border-border bg-surface text-muted-foreground"
                    }`}
                  >
                    {s.num}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* =================================================================
              DESKTOP LEFT STICKY EXPEDITION PASSPORT & 3D GLOBE (lg: 4 cols)
             ================================================================= */}
          <aside className="hidden lg:col-span-4 lg:block">
            <div className="lg:sticky lg:top-20 lg:flex lg:h-[calc(100vh-5rem)] lg:flex-col lg:justify-between lg:py-4">
              <div className="overflow-hidden rounded-2xl border border-input bg-surface/90 p-3.5 backdrop-blur-md">
                {/* Identity Header with Vivaldo's Real Portrait */}
                <div className="mb-3 flex items-center gap-3 rounded-xl border border-border bg-black/60 p-2.5">
                  <img
                    src={portrait}
                    alt="Vivaldo Cristóvão Roque"
                    className="h-12 w-12 shrink-0 rounded-lg border border-input object-cover object-[50%_20%]"
                    style={{ filter: "grayscale(0.3) contrast(1.08)" }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-mono-code flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-moss">
                      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-moss" />
                      LUANDA · ANGOLA
                    </p>
                    <h1 className="font-display truncate text-sm font-bold text-white">
                      Vivaldo Cristóvão Roque
                    </h1>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {t("about_globe_hint")}
                    </p>
                  </div>
                </div>

                {/* 3D Planet Stage where the character walks from stop 01 -> 04 */}
                <div className="relative aspect-[4/3.6] w-full overflow-hidden rounded-xl border border-border bg-black">
                  <AboutGlobe
                    activeStop={activeStop}
                    onSelectStop={(idx) => scrollToStop(stops[idx]?.id || "roots")}
                  />

                  <span className="font-mono-code pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/75 px-2.5 py-1 text-[9px] uppercase tracking-widest text-white backdrop-blur">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-moss" />
                    {current.num} · {current.tag}
                  </span>
                </div>

                {/* Expedition Progress Rail (clickable chapters) */}
                <div className="mt-3 space-y-1">
                  {stops.map((s, idx) => {
                    const isAct = idx === activeStop;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => scrollToStop(s.id)}
                        className={`group flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left transition ${
                          isAct
                            ? "bg-white text-black"
                            : "text-muted-foreground hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span
                            className={`inline-block h-1.5 w-1.5 rounded-full ${
                              isAct ? "bg-moss" : "bg-muted-foreground/40 group-hover:bg-moss"
                            }`}
                          />
                          <span className="font-mono-code text-[10px] uppercase tracking-[0.18em]">
                            {s.num} · {s.tag}
                          </span>
                        </span>
                        <span
                          className={`font-mono-code text-[9px] ${
                            isAct ? "font-semibold text-black/70" : "text-muted-foreground/70"
                          }`}
                        >
                          {s.year.split(" ")[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom quick actions */}
              <div className="mt-3 flex items-center justify-between gap-2">
                <Link
                  to="/chapter/$chapterId"
                  params={{ chapterId: "work" }}
                  className="font-mono-code inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-black transition hover:bg-white/90"
                >
                  {t("about_btn_see_projects")}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
                <a
                  href="/#contact"
                  className="font-mono-code inline-flex items-center justify-center rounded-full border border-input px-4 py-2.5 text-[10px] uppercase tracking-widest text-foreground transition hover:border-moss hover:text-moss"
                >
                  {t("btn_contact_me")}
                </a>
              </div>
            </div>
          </aside>

          {/* =================================================================
              RIGHT NARRATIVE EXPEDITION (8 cols — Vivaldo's exact original text across 4 stops)
             ================================================================= */}
          <div className="lg:col-span-8">
            {/* Prologue Header with Vivaldo's Portrait Card */}
            <div className="flex min-h-[60vh] flex-col justify-center pb-10 pt-8 sm:pt-16 lg:min-h-[72vh] lg:pt-28">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <img
                  src={portrait}
                  alt="Vivaldo Cristóvão Roque"
                  className="h-24 w-24 shrink-0 rounded-2xl border border-input object-cover object-[50%_20%] sm:h-28 sm:w-28"
                  style={{ filter: "grayscale(0.25) contrast(1.06)" }}
                />
                <div>
                  <p className="font-mono-code flex items-center gap-2.5 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-moss" />
                    01 / 04 · {t("about_title_pre")} {t("about_title_gradient")}
                  </p>
                  <h2 className="font-display mt-2 text-3xl font-bold leading-[0.98] tracking-tight text-white sm:text-5xl">
                    Vivaldo Cristóvão Roque
                  </h2>
                  <p className="mt-3 max-w-xl text-base text-foreground/90 sm:text-lg">
                    {t("about_me_p1")}
                  </p>
                </div>
              </div>

              {/* Quick summary stats bar */}
              <div className="mt-8 grid max-w-2xl grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
                {[
                  { k: t("about_stat_degree_label"), v: t("about_stat_degree_val"), I: Globe2 },
                  { k: t("about_stat_net_label"), v: t("about_stat_net_val"), I: Cpu },
                  { k: t("about_stat_prog_label"), v: t("about_stat_prog_val"), I: Terminal },
                  { k: t("about_stat_focus_label"), v: t("about_stat_focus_val"), I: Rocket },
                ].map(({ k, v, I }) => (
                  <div key={k} className="rounded-xl border border-border bg-surface/60 p-3">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="font-mono-code text-[10px] uppercase tracking-widest">{k}</span>
                      <I className="h-3.5 w-3.5 text-moss" />
                    </div>
                    <p className="font-display mt-1.5 text-xs font-semibold text-white sm:text-sm">{v}</p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => scrollToStop("roots")}
                className="font-mono-code mt-10 inline-flex w-fit items-center gap-2 text-xs uppercase tracking-[0.25em] text-moss transition hover:text-white"
              >
                {t("about_walk_btn")}
                <ArrowDown className="h-4 w-4 animate-bounce" />
              </button>
            </div>

            {/* The 4 Interactive Stops with 100% of Vivaldo's original descriptive text */}
            {stops.map((s, idx) => (
              <JourneyStop
                key={s.id}
                stop={s}
                index={idx}
                total={stops.length}
                onActive={setActiveStop}
              />
            ))}

            {/* Closing CTA card at the end of the journey */}
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
      </div>
    </section>
  );
}
