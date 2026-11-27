import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import FloatingNav from "@/components/portfolio/FloatingNav";
import Hero from "@/components/portfolio/Hero";
import Chapter, { CHAPTERS } from "@/components/portfolio/Chapter";
import Contact from "@/components/portfolio/Contact";
import Footer from "@/components/portfolio/Footer";
import ThreeHero from "@/components/portfolio/ThreeHero";
import Preloader from "@/components/portfolio/Preloader";

export const Route = createFileRoute("/$lang/")({
  component: Index,
});

import { SUSPEND_SNAP_EVENT } from "@/lib/events";
const SUSPEND_DURATION_MS = 1200;

function useChapterTransitions(onActiveChapter: (idx: number) => void) {
  useEffect(() => {
    const root = document.documentElement;
    const stacks = Array.from(document.querySelectorAll<HTMLElement>("[data-stack]"));
    stacks.forEach((el) => el.style.setProperty("--hero-blur", "0.001"));
    requestAnimationFrame(() => {
      stacks.forEach((el) => el.style.setProperty("--hero-blur", "0"));
    });

    let ticking = false;
    let snapEnabled = true;
    let suspendUntil = 0;
    let suspendTimer = 0;
    let lastActive = -1;

    const update = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const vh =
          document.querySelector<HTMLElement>(".snap-viewport")?.getBoundingClientRect().height ||
          window.innerHeight ||
          1;
        const sy = window.scrollY;

        const currentIdx = Math.max(0, Math.min(4, Math.round(sy / vh)));
        if (currentIdx !== lastActive) {
          lastActive = currentIdx;
          onActiveChapter(currentIdx);
        }

        const slots = document.querySelectorAll<HTMLElement>("[data-stack]");
        for (let i = 0; i < slots.length; i++) {
          const el = slots[i];
          const raw = (sy - i * vh) / vh;
          const p = raw <= 0 ? 0 : raw >= 1 ? 1 : raw;
          const isBlurring = p > 0.002 && p < 0.998;
          const isCovered = p >= 0.998;
          const nextBlurring = isBlurring ? "true" : "false";
          const nextCovered = isCovered ? "true" : "false";
          if (el.dataset.blurring !== nextBlurring) {
            el.dataset.blurring = nextBlurring;
          }
          if (el.dataset.covered !== nextCovered) {
            el.dataset.covered = nextCovered;
          }
          const nextVal = p.toFixed(3);
          if (el.dataset.blur !== nextVal) {
            el.dataset.blur = nextVal;
            el.style.setProperty("--hero-blur", nextVal);
          }
        }

        if (performance.now() < suspendUntil) {
          root.classList.remove("snap-scroll");
          return;
        }

        const stopEl = document.querySelector<HTMLElement>("[data-scroll-snap-stop]");
        if (stopEl) {
          const low = Math.max(24, vh * 0.04);
          const high = Math.max(96, vh * 0.14);
          const top = stopEl.getBoundingClientRect().top;
          if (snapEnabled && top <= low) {
            snapEnabled = false;
          } else if (!snapEnabled && top > high) {
            snapEnabled = true;
          }
        } else {
          snapEnabled = true;
        }

        root.classList.toggle("snap-scroll", snapEnabled);
      });
    };

    const onSuspend = (e: Event) => {
      const detail = (e as CustomEvent<{ duration?: number }>).detail;
      const duration = Number(detail?.duration) || SUSPEND_DURATION_MS;
      suspendUntil = performance.now() + duration;
      root.classList.remove("snap-scroll");
      window.clearTimeout(suspendTimer);
      suspendTimer = window.setTimeout(update, duration);
    };

    window.addEventListener(SUSPEND_SNAP_EVENT, onSuspend);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();

    return () => {
      window.removeEventListener(SUSPEND_SNAP_EVENT, onSuspend);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.clearTimeout(suspendTimer);
      root.classList.remove("snap-scroll");
    };
  }, [onActiveChapter]);
}

function Index() {
  const [activeChapter, setActiveChapter] = useState(0);

  useChapterTransitions(setActiveChapter);

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <Preloader />
      {/* Top snap sentinel at y=0 */}
      <div className="snap-target pointer-events-none absolute left-0 top-0 h-px w-px" aria-hidden="true" />
      <FloatingNav />

      {/* Fixed global 3D + Portrait stage that transforms across Hero + 4 Chapters */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <ThreeHero activeChapter={activeChapter} />
      </div>

      <Hero />
      {CHAPTERS.map((c, i) => (
        <Chapter key={c.id} id={c.id} index={i} />
      ))}
      <div
        id="contact-slot"
        className="snap-target relative bg-background"
        style={{ zIndex: CHAPTERS.length + 2 }}
        data-scroll-snap-stop="true"
      >
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
