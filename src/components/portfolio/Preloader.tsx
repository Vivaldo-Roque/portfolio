import { useEffect, useRef, useState } from "react";
import portrait from "@/assets/vivaldo-portrait.jpg";

const CHARS = "!<>-_\\/[]{}—=+*^?#________";
const FRAME_MS = 1000 / 60;
const SPEED = 2;
const CHAR_HOLD_MS = FRAME_MS / SPEED / 0.28;
const toMs = (frames: number) => (frames * FRAME_MS) / SPEED;
const randMs = (maxFrames: number) => toMs(Math.floor(Math.random() * maxFrames));

const escapeHtml = (s: string) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[c] || c);

const renderChar = (c: string) => (c === "\n" ? "<br>" : escapeHtml(c));

const renderCell = (measure: string, visualHtml: string, extraClass = "") => {
  const cls = extraClass ? `scramble-cell__visual ${extraClass}` : "scramble-cell__visual";
  return `<span class="scramble-cell" data-scramble-measure="${escapeHtml(measure || " ")}"><span class="${cls}">${visualHtml}</span></span>`;
};

const createBuffer = () => {
  let html = "";
  let inWord = false;
  return {
    appendText(t: string) {
      if (inWord) {
        html += "</span>";
        inWord = false;
      }
      html += t;
    },
    appendCell(c: string) {
      if (!inWord) {
        html += '<span class="scramble-word">';
        inWord = true;
      }
      html += c;
    },
    toString() {
      if (inWord) html += "</span>";
      return html;
    },
  };
};

/**
 * Exact reverse-engineered `class B1` from monako.ai:
 * Scrambles existing text out into green glitch characters until every character vanishes.
 */
class ScrambleOut {
  private el: HTMLElement;
  private queue: { from: string; start: number; end: number; char: string | null; nextCharAt?: number }[] = [];
  private frameRequest = 0;
  private lastTickAt = 0;
  private elapsedMs = 0;

  constructor(el: HTMLElement) {
    this.el = el;
    this.update = this.update.bind(this);
  }

  start(text?: string) {
    const str = String(text || this.el.textContent || "");
    this.queue = [];
    for (let i = 0; i < str.length; i++) {
      const start = randMs(18);
      const end = start + toMs(14) + randMs(22);
      this.queue.push({ from: str[i], start, end, char: null });
    }
    cancelAnimationFrame(this.frameRequest);
    const now = performance.now();
    this.lastTickAt = now;
    this.elapsedMs = 0;
    this.update(now);
  }

  private update(now = performance.now()) {
    const dt = Math.max(0, now - this.lastTickAt);
    this.lastTickAt = now;
    this.elapsedMs += dt;
    let done = 0;
    const buf = createBuffer();

    for (let i = 0; i < this.queue.length; i++) {
      const item = this.queue[i];
      if (/\s/.test(item.from)) {
        if (this.elapsedMs >= item.end) {
          done++;
        } else {
          buf.appendText(renderChar(item.from));
        }
        continue;
      }
      if (this.elapsedMs >= item.end) {
        done++;
        continue;
      }
      if (this.elapsedMs >= item.start) {
        if (!item.char || (item.nextCharAt !== undefined && this.elapsedMs >= item.nextCharAt)) {
          item.char = CHARS[Math.floor(Math.random() * CHARS.length)];
          item.nextCharAt = this.elapsedMs + CHAR_HOLD_MS;
        }
        buf.appendCell(renderCell(item.from, escapeHtml(item.char), "scramble-dud"));
      } else {
        buf.appendCell(renderCell(item.from, renderChar(item.from)));
      }
    }

    this.el.innerHTML = buf.toString();
    if (done < this.queue.length) {
      this.frameRequest = requestAnimationFrame(this.update);
    } else {
      this.frameRequest = 0;
    }
  }

  stop() {
    cancelAnimationFrame(this.frameRequest);
    this.frameRequest = 0;
    this.queue = [];
    this.lastTickAt = 0;
    this.elapsedMs = 0;
  }
}

function ScrambleOutLabel({ text, stagger }: { text: string; stagger: number }) {
  return (
    <span style={{ display: "inline-block", position: "relative" }}>
      <span aria-hidden="true" style={{ visibility: "hidden" }}>
        {text}
      </span>
      <span
        data-scramble-out=""
        data-scramble-stagger={stagger}
        data-scramble-text={text}
        aria-label={text}
        style={{ position: "absolute", inset: 0, whiteSpace: "inherit" }}
      >
        {text}
      </span>
    </span>
  );
}

// Exact Monako preloader timings
const HOLD_BEFORE_EXIT_MS = 250;
const STAGGER = { counters: 0, bar: 120, eyebrow: 240, backdrop: 760 };
const ITEM_FADE_MS = 460;
const BACKDROP_FADE_MS = 520;
const TOTAL_EXIT_MS = STAGGER.backdrop + BACKDROP_FADE_MS;

const PRELOAD_IMAGES = [
  "/img/header.jpg",
  portrait,
  "/img/works/cfoptrainer.png",
  "/img/works/vivacubesolver.jpg",
  "/img/works/bancoviva.png",
  "/img/works/flutter_web_ecommerce_1.png",
];

const PRELOAD_FONTS = [
  '400 1em "Space Grotesk"',
  '700 1em "Space Grotesk"',
  '400 1em "JetBrains Mono"',
];

/**
 * Exact reverse-engineered Monako.ai boot preloader (`sS`):
 * - Preloads images and fonts while incrementing `IMG 00/06` and `FNT 00/03` counters
 *   and animating the 1px `w-64` horizontal progress bar (`scaleX`).
 * - Once complete, holds 250ms, then triggers `ScrambleOut` (`B1`) on the counters and
 *   `LOADING RESOURCES` label while fading/sliding them up (`-6px`) and finally fading out the black backdrop.
 */
export default function Preloader({ onDone }: { onDone?: () => void }) {
  const total = PRELOAD_IMAGES.length + PRELOAD_FONTS.length;
  const [counts, setCounts] = useState({ images: 0, fonts: 0 });
  const [phase, setPhase] = useState<"loading" | "exiting" | "done">("loading");
  const rootRef = useRef<HTMLDivElement>(null);
  const loadedImages = useRef(new Set<string>());

  // Load fonts + paced step so the user sees the counter & bar animate smoothly even on local cache
  useEffect(() => {
    let cancelled = false;
    PRELOAD_FONTS.forEach((f, idx) => {
      const done = () => {
        window.setTimeout(() => {
          if (!cancelled) {
            setCounts((c) => ({ ...c, fonts: Math.min(PRELOAD_FONTS.length, c.fonts + 1) }));
          }
        }, 90 * (idx + 1));
      };
      if (typeof document !== "undefined" && document.fonts && typeof document.fonts.load === "function") {
        document.fonts.load(f).then(done, done);
      } else {
        done();
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const markImageLoaded = (key: string, idx: number) => {
    if (loadedImages.current.has(key)) return;
    loadedImages.current.add(key);
    window.setTimeout(() => {
      setCounts((c) => ({ ...c, images: Math.min(PRELOAD_IMAGES.length, c.images + 1) }));
    }, 75 * (idx + 1));
  };

  const loadedTotal = counts.images + counts.fonts;
  const progress = total === 0 ? 1 : Math.min(1, loadedTotal / total);

  useEffect(() => {
    if (phase !== "loading" || loadedTotal < total) return;
    const t = window.setTimeout(() => setPhase("exiting"), HOLD_BEFORE_EXIT_MS);
    return () => window.clearTimeout(t);
  }, [loadedTotal, total, phase]);

  useEffect(() => {
    if (phase !== "exiting") return;
    const root = rootRef.current;
    const scramblers: ScrambleOut[] = [];
    const timers: number[] = [];

    if (root) {
      Array.from(root.querySelectorAll<HTMLElement>("[data-scramble-out]")).forEach((el) => {
        const stagger = Number(el.getAttribute("data-scramble-stagger") || 0);
        const text = el.getAttribute("data-scramble-text") || el.textContent || "";
        const s = new ScrambleOut(el);
        scramblers.push(s);
        timers.push(window.setTimeout(() => s.start(text), stagger));
      });
    }

    const doneTimer = window.setTimeout(() => setPhase("done"), TOTAL_EXIT_MS);
    return () => {
      window.clearTimeout(doneTimer);
      timers.forEach((t) => window.clearTimeout(t));
      scramblers.forEach((s) => s.stop());
    };
  }, [phase]);

  useEffect(() => {
    if (phase === "done") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  useEffect(() => {
    if (phase === "done") onDone?.();
  }, [phase, onDone]);

  if (phase === "done") return null;

  const isExiting = phase === "exiting";
  const imgCounter = `IMG ${counts.images.toString().padStart(2, "0")}/${PRELOAD_IMAGES.length.toString().padStart(2, "0")}`;
  const fntCounter = `FNT ${counts.fonts.toString().padStart(2, "0")}/${PRELOAD_FONTS.length.toString().padStart(2, "0")}`;

  const itemStyle = (delayMs: number) => ({
    transition: `opacity ${ITEM_FADE_MS}ms ease-out, transform ${ITEM_FADE_MS}ms ease-out`,
    transitionDelay: `${delayMs}ms`,
    opacity: isExiting ? 0 : 1,
    transform: isExiting ? "translateY(-6px)" : "translateY(0)",
  });

  return (
    <div
      ref={rootRef}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.floor(progress * 100)}
      aria-label="Loading"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black pointer-events-auto"
      style={{
        opacity: isExiting ? 0 : 1,
        transition: `opacity ${BACKDROP_FADE_MS}ms ease-out`,
        transitionDelay: isExiting ? `${STAGGER.backdrop}ms` : "0ms",
      }}
    >
      {/* Hidden 1x1 off-screen image preloader nodes so the backdrop stays 100% pitch black */}
      <div className="pointer-events-none fixed -left-[9999px] -top-[9999px] h-px w-px overflow-hidden opacity-0" aria-hidden="true">
        {PRELOAD_IMAGES.map((src, i) => {
          const key = `${src}-${i}`;
          return (
            <img
              key={key}
              src={src}
              alt=""
              draggable={false}
              loading="eager"
              decoding="async"
              onLoad={() => markImageLoaded(key, i)}
              onError={() => markImageLoaded(key, i)}
              className="h-px w-px"
            />
          );
        })}
      </div>

      <div className="relative flex flex-col items-center gap-8 px-6">
        {/* Eyebrow: pulsing green dot + "loading resources" */}
        <div
          className="font-mono-code flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
          style={itemStyle(STAGGER.eyebrow)}
        >
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-moss" />
          <ScrambleOutLabel text="loading resources" stagger={STAGGER.eyebrow} />
        </div>

        {/* 1px Progress Bar */}
        <div className="w-full" style={itemStyle(STAGGER.bar)}>
          <div className="h-px w-64 max-w-full overflow-hidden bg-border">
            <div
              className="h-full origin-left bg-foreground"
              style={{
                transform: `scaleX(${progress})`,
                transition: "transform 180ms ease-out",
              }}
            />
          </div>
        </div>

        {/* Telemetry Counters: IMG 06/06 · FNT 03/03 */}
        <div
          className="font-mono-code flex items-center gap-6 text-[9px] uppercase tracking-[0.22em] text-muted-foreground/75"
          style={itemStyle(STAGGER.counters)}
        >
          <ScrambleOutLabel text={imgCounter} stagger={STAGGER.counters} />
          <ScrambleOutLabel text={fntCounter} stagger={STAGGER.counters + 60} />
        </div>
      </div>
    </div>
  );
}
