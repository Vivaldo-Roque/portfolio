import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "../../context/language-context";
import { ScrambleText, useScrambleSection } from "./ScrambleText";

export type ChapterId = "about" | "origin" | "work" | "skills";

export const CHAPTERS: { id: ChapterId; index: string; nav: string }[] = [
  { id: "about", index: "01", nav: "navabout" },
  { id: "origin", index: "02", nav: "navorigin" },
  { id: "work", index: "03", nav: "navworks" },
  { id: "skills", index: "04", nav: "navskills" },
];

const KEYS: Record<ChapterId, { chapter: string; pre: string; grad: string; sub: string }> = {
  about: { chapter: "about_chapter", pre: "about_title_pre", grad: "about_title_gradient", sub: "about_me_p1" },
  origin: { chapter: "origin_chapter", pre: "origin_title_pre", grad: "origin_title_gradient", sub: "origin_subtitle" },
  work: { chapter: "works_chapter", pre: "works_title_pre", grad: "works_title_gradient", sub: "works_subtitle" },
  skills: { chapter: "skills_chapter", pre: "skills_title_pre", grad: "skills_title_gradient", sub: "skills_subtitle" },
};

/**
 * One full-screen "chapter".
 * IMPORTANT: The outer `<div id={id} className="snap-target snap-viewport">` is a normal-flow
 * element (not sticky!) so its scroll-snap position is 100% static when scrolling up or down,
 * while the sticky `<section data-stack>` covers the entire page height so it stays pinned at top:0
 * as the next chapter slides over it.
 */
export default function Chapter({ id, index }: { id: ChapterId; index: number }) {
  const slotRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();
  const k = KEYS[id];
  const cur = CHAPTERS[index];

  useScrambleSection(slotRef, { staggerMs: 140 });

  return (
    <>
      {/* Static 1-px anchor in normal flow so scroll-snap has an immovable target both up & down */}
      <div id={id} className="snap-target pointer-events-none h-0 w-full" aria-hidden="true" />
      <section
        ref={slotRef}
        data-stack
        style={{ zIndex: index + 1 }}
        className="chapter section-sticky snap-viewport flex items-center overflow-hidden bg-transparent"
      >
        <span
          aria-hidden
          className="font-display pointer-events-none absolute -right-4 bottom-0 select-none text-[28vw] font-bold leading-none text-foreground/[0.03]"
        >
          {cur.index}
        </span>
        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 drop-shadow-[0_2px_18px_rgba(0,0,0,0.85)]">
          <p className="font-mono-code flex items-center gap-2.5 whitespace-nowrap text-xs uppercase tracking-[0.25em] text-foreground/85">
            <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-moss" aria-hidden />
            <ScrambleText text={`${cur.index} / 0${CHAPTERS.length} · ${t(cur.nav)}`} />
          </p>
          <ScrambleText
            as="h2"
            text={`${t(k.pre)} ${t(k.grad)}`}
            className="font-display mt-5 text-4xl font-bold leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl"
          />
          <ScrambleText
            as="p"
            text={t(k.sub)}
            className="mt-6 max-w-xl text-base text-foreground/90 sm:text-lg"
          />
          <Link
            to="/chapter/$chapterId"
            params={{ chapterId: id }}
            className="group mt-10 inline-flex items-center gap-2 rounded-full border border-white/35 bg-black/55 px-6 py-3 font-mono-code text-xs uppercase tracking-widest text-white backdrop-blur-sm transition hover:border-moss hover:text-moss"
          >
            {language === "pt" ? "Ver detalhes" : "See details"}
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </section>
    </>
  );
}
