import { useEffect, useRef, type ElementType, type HTMLAttributes, type RefObject } from "react";

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

type QueueItem = {
  from: string;
  to: string;
  start: number;
  end: number;
  char?: string;
  nextCharAt?: number;
};

export class TextScrambler {
  private el: HTMLElement;
  private text = "";
  private queue: QueueItem[] = [];
  private frameRequest = 0;
  private lastTickAt = 0;
  private elapsedMs = 0;
  private resolve: (() => void) | null = null;

  constructor(el: HTMLElement) {
    this.el = el;
    this.update = this.update.bind(this);
  }

  setText(nextText: string): Promise<void> {
    const target = String(nextText || "");
    const prev = this.text || "";
    const len = Math.max(prev.length, target.length);
    const promise = new Promise<void>((res) => {
      this.resolve = res;
    });
    this.queue = [];
    for (let i = 0; i < len; i++) {
      const from = prev[i] || "";
      const to = target[i] || "";
      const start = randMs(40);
      const end = start + randMs(40);
      this.queue.push({ from, to, start, end });
    }
    this.text = target;
    cancelAnimationFrame(this.frameRequest);
    const now = performance.now();
    this.lastTickAt = now;
    this.elapsedMs = 0;
    this.update(now);
    return promise;
  }

  private update(now = performance.now()) {
    const dt = Math.max(0, now - this.lastTickAt);
    this.lastTickAt = now;
    this.elapsedMs += dt;
    let complete = 0;
    const buf = createBuffer();

    for (let i = 0, n = this.queue.length; i < n; i++) {
      const item = this.queue[i];
      const { from, to, start, end } = item;
      if (/\s/.test(to)) {
        complete++;
        buf.appendText(renderChar(to));
        continue;
      }
      if (this.elapsedMs >= end) {
        complete++;
        buf.appendCell(renderCell(to, renderChar(to)));
      } else if (this.elapsedMs >= start) {
        if (!item.char || (item.nextCharAt !== undefined && this.elapsedMs >= item.nextCharAt)) {
          item.char = CHARS[Math.floor(Math.random() * CHARS.length)];
          item.nextCharAt = this.elapsedMs + CHAR_HOLD_MS;
        }
        buf.appendCell(renderCell(to || from, escapeHtml(item.char), "scramble-dud"));
      } else if (from) {
        buf.appendCell(renderCell(to || from, renderChar(from)));
      } else {
        buf.appendCell(renderCell(to, "&nbsp;"));
      }
    }

    this.el.innerHTML = buf.toString();
    if (complete === this.queue.length) {
      const res = this.resolve;
      this.resolve = null;
      this.frameRequest = 0;
      if (res) res();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
    }
  }

  stop() {
    cancelAnimationFrame(this.frameRequest);
    this.frameRequest = 0;
    this.resolve = null;
    this.queue = [];
    this.text = "";
    this.lastTickAt = 0;
    this.elapsedMs = 0;
  }
}

export function ScrambleText({
  as: Tag = "span",
  text,
  className,
  ...rest
}: {
  as?: ElementType;
  text: string;
  className?: string;
} & HTMLAttributes<HTMLElement>) {
  const str = String(text || "");
  const overlayRef = useRef<HTMLSpanElement>(null);
  const prevTextRef = useRef<string>(str);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    if (prevTextRef.current !== str) {
      prevTextRef.current = str;
      const scrambler = new TextScrambler(el);
      scrambler.setText(str);
      return () => scrambler.stop();
    } else {
      el.textContent = str;
    }
  }, [str]);

  return (
    <Tag
      {...rest}
      className={className}
      style={{ display: "block", position: "relative" }}
    >
      <span aria-hidden="true" style={{ visibility: "hidden", display: "block" }}>
        {str}
      </span>
      <span
        ref={overlayRef}
        data-scramble-overlay="true"
        data-scramble-text={str}
        aria-label={str}
        style={{ position: "absolute", top: 0, left: 0, right: 0, whiteSpace: "inherit" }}
      >
        {str}
      </span>
    </Tag>
  );
}

/**
 * Monako-style scroll glitch trigger:
 * Observes a container (or individual scramble elements) and triggers a staggered
 * character scramble whenever the section enters the active viewport zone.
 */
export function useScrambleSection(
  ref: RefObject<HTMLElement | null>,
  { staggerMs = 140 }: { entryRatio?: number; staggerMs?: number } = {},
) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const getItems = () =>
      Array.from(root.querySelectorAll<HTMLElement>("[data-scramble-overlay]"), (el) => ({
        el,
        scrambler: new TextScrambler(el),
      }));

    let items = getItems();
    const timers: number[] = [];
    let isActive = false;
    let runId = 0;

    const reset = () => {
      timers.forEach((t) => window.clearTimeout(t));
      timers.length = 0;
      items.forEach(({ el, scrambler }) => {
        scrambler.stop();
        el.textContent = el.dataset.scrambleText || "";
      });
    };

    const trigger = () => {
      items = getItems();
      runId += 1;
      const currentRun = runId;
      reset();
      items.forEach(({ el, scrambler }, idx) => {
        el.innerHTML = "";
        timers.push(
          window.setTimeout(() => {
            if (runId !== currentRun) return;
            scrambler.setText(el.dataset.scrambleText || "");
          }, idx * staggerMs),
        );
      });
    };

    const check = () => {
      const vh =
        document.querySelector<HTMLElement>(".snap-viewport")?.getBoundingClientRect().height ||
        window.innerHeight ||
        1;
      const stacks = Array.from(document.querySelectorAll<HTMLElement>("[data-stack]"));
      const idx = stacks.indexOf(root);
      let inView = false;
      if (idx !== -1) {
        // Sticky chapter: active when scrollY is within [idx*vh - 0.45*vh, idx*vh + 0.55*vh]
        const progress = (window.scrollY - idx * vh) / vh;
        inView = progress >= -0.45 && progress <= 0.55;
      } else {
        const rect = root.getBoundingClientRect();
        inView = rect.top <= vh * 0.65 && rect.bottom >= vh * 0.35;
      }

      if (inView && !isActive) {
        isActive = true;
        trigger();
      } else if (!inView && isActive) {
        isActive = false;
        runId += 1;
        reset();
      }
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      runId += 1;
      reset();
    };
  }, [ref, staggerMs]);
}
