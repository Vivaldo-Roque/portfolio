import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type SoundContextValue = {
  muted: boolean;
  toggleMute: () => void;
  playClick: () => void;
  playHover: () => void;
  playScrollTick: () => void;
  playGlitch: () => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

const STORAGE_KEY = "portfolio_sound_muted";

export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(STORAGE_KEY) === "true";
  });

  const ctxRef = useRef<AudioContext | null>(null);
  const lastHoverRef = useRef(0);
  const lastGlitchRef = useRef(0);
  const mutedRef = useRef(muted);
  const ambientNodesRef = useRef<{
    masterGain: GainNode;
    stop: () => void;
  } | null>(null);

  useEffect(() => {
    mutedRef.current = muted;
    localStorage.setItem(STORAGE_KEY, String(muted));
  }, [muted]);

  const getAudioContext = useCallback((): AudioContext | null => {
    if (mutedRef.current || typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      ctxRef.current = new AudioCtx();
    }
    if (ctxRef.current.state === "suspended") {
      void ctxRef.current.resume().catch(() => {});
    }
    return ctxRef.current;
  }, []);

  const startAmbientTheme = useCallback((ctx: AudioContext) => {
    if (ambientNodesRef.current || mutedRef.current) return;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.045, ctx.currentTime + 2.5);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(420, ctx.currentTime);

    // Slow LFO for cinematic breathing filter sweep
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.08, ctx.currentTime);
    lfoGain.gain.setValueAtTime(180, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    // Deep cinematic sci-fi chord (D2, A2, F3)
    const freqs = [73.42, 110.0, 174.61];
    const oscs = freqs.map((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = idx === 0 ? "sawtooth" : "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.detune.setValueAtTime((idx - 1) * 6, ctx.currentTime);
      osc.connect(filter);
      osc.start();
      return osc;
    });

    filter.connect(masterGain);
    masterGain.connect(ctx.destination);
    lfo.start();

    ambientNodesRef.current = {
      masterGain,
      stop: () => {
        try {
          lfo.stop();
          oscs.forEach((o) => o.stop());
          masterGain.disconnect();
        } catch {
          // ignore if already stopped
        }
        ambientNodesRef.current = null;
      },
    };
  }, []);

  // Unlock AudioContext & start cinematic ambient pad on first user gesture
  useEffect(() => {
    const unlock = () => {
      if (!mutedRef.current) {
        const ctx = getAudioContext();
        if (ctx) startAmbientTheme(ctx);
      }
    };
    window.addEventListener("pointerdown", unlock, { once: true, passive: true });
    window.addEventListener("keydown", unlock, { once: true, passive: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [getAudioContext, startAmbientTheme]);

  const playClick = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(1100, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.045);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }, [getAudioContext]);

  const playHover = useCallback(() => {
    const nowMs = performance.now();
    if (nowMs - lastHoverRef.current < 45) return;
    lastHoverRef.current = nowMs;

    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1650, now);
    osc.frequency.exponentialRampToValueAtTime(2100, now + 0.022);

    gain.gain.setValueAtTime(0.025, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  }, [getAudioContext]);

  const playScrollTick = useCallback(() => {
    // Scroll sound disabled to keep scrolling smooth and distraction-free
  }, []);

  const playGlitch = useCallback(() => {
    const nowMs = performance.now();
    if (nowMs - lastGlitchRef.current < 140) return;
    lastGlitchRef.current = nowMs;

    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.setValueAtTime(880, now + 0.02);
    osc.frequency.setValueAtTime(140, now + 0.045);
    osc.frequency.exponentialRampToValueAtTime(640, now + 0.075);

    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.085);
  }, [getAudioContext]);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      mutedRef.current = next;
      if (next) {
        ambientNodesRef.current?.stop();
      } else {
        const ctx = getAudioContext();
        if (ctx) startAmbientTheme(ctx);
        setTimeout(() => playClick(), 0);
      }
      return next;
    });
  }, [getAudioContext, playClick, startAmbientTheme]);

  // Global delegated listeners for button/link clicks and hover
  useEffect(() => {
    const interactiveSelector = 'button, a, [role="button"]';

    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest(interactiveSelector);
      if (target) {
        playClick();
      }
    };

    const onPointerEnter = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && typeof target.matches === "function" && target.matches(interactiveSelector)) {
        playHover();
      }
    };

    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("pointerenter", onPointerEnter, { capture: true });

    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("pointerenter", onPointerEnter, { capture: true });
    };
  }, [playClick, playHover]);

  return (
    <SoundContext.Provider
      value={{ muted, toggleMute, playClick, playHover, playScrollTick, playGlitch }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSound(): SoundContextValue {
  const ctx = useContext(SoundContext);
  if (!ctx) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return ctx;
}
