import { useCallback, useEffect, useRef, useState } from "react";
import {
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Radio,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useSound } from "@/context/sound-context";

type HologramCommsProps = {
  idleVideoSrc?: string;
  hoverVideoSrc?: string;
  fallbackImage: string;
  alt: string;
  label?: string;
};

/* ─── Reusable person silhouette (seated, facing inward) ─────────────────── */
function PersonSilhouette({
  x,
  y,
  scale = 1,
  flipX = false,
  opacity = 0.92,
}: {
  x: number;
  y: number;
  scale?: number;
  flipX?: boolean;
  opacity?: number;
}) {
  const transform = `translate(${x},${y}) scale(${flipX ? -scale : scale},${scale})`;
  return (
    <g transform={transform} fill={`rgba(8,14,20,${opacity})`}>
      {/* head */}
      <ellipse cx="0" cy="-110" rx="22" ry="26" />
      {/* neck */}
      <rect x="-7" y="-86" width="14" height="18" rx="4" />
      {/* torso */}
      <path d="M-32,-68 Q-38,0 -30,52 L30,52 Q38,0 32,-68 Z" />
      {/* left upper arm */}
      <path d="M-32,-52 Q-62,-30 -58,10 L-46,12 Q-44,-22 -22,-44 Z" />
      {/* left forearm on table */}
      <path d="M-58,10 Q-80,30 -90,42 L-74,50 Q-66,38 -44,18 Z" />
      {/* right upper arm */}
      <path d="M32,-52 Q62,-30 58,10 L46,12 Q44,-22 22,-44 Z" />
      {/* right forearm on table */}
      <path d="M58,10 Q80,30 90,42 L74,50 Q66,38 44,18 Z" />
      {/* legs/lap */}
      <path d="M-30,52 Q-36,110 -28,130 L-6,130 L0,80 L6,130 L28,130 Q36,110 30,52 Z" />
    </g>
  );
}

export function HologramComms({
  idleVideoSrc,
  hoverVideoSrc,
  fallbackImage,
  alt,
  label = "HOLO_LINK // V.ROQUE",
}: HologramCommsProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const glitchTimerRef = useRef<number | null>(null);
  const idleVideoRef = useRef<HTMLVideoElement | null>(null);
  const hoverVideoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { playGlitch } = useSound();

  const activeVideo = useCallback(
    () => (isHovered && hoverVideoRef.current ? hoverVideoRef.current : idleVideoRef.current),
    [isHovered],
  );

  /* ── Glitch ─────────────────────────────────────────────────────────── */
  const triggerGlitch = (nextHover: boolean) => {
    if (glitchTimerRef.current) window.clearTimeout(glitchTimerRef.current);
    setIsGlitching(true);
    playGlitch();
    setIsHovered(nextHover);
    glitchTimerRef.current = window.setTimeout(() => setIsGlitching(false), 420);
  };
  useEffect(
    () => () => {
      if (glitchTimerRef.current) window.clearTimeout(glitchTimerRef.current);
    },
    [],
  );

  /* ── Fullscreen ──────────────────────────────────────────────────────── */
  const toggleFullscreen = async () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      await el.requestFullscreen().catch(() => {});
    } else {
      await document.exitFullscreen().catch(() => {});
    }
  };
  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  /* ── Playback controls ───────────────────────────────────────────────── */
  const togglePlay = () => {
    const v = activeVideo();
    if (!v) return;
    if (v.paused) { void v.play().catch(() => {}); setIsPlaying(true); }
    else { v.pause(); setIsPlaying(false); }
  };
  const toggleMute = () => {
    const v = activeVideo();
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };
  const seek = (delta: number) => {
    const v = activeVideo();
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(v.duration || 0, v.currentTime + delta));
  };

  /* ── Progress ────────────────────────────────────────────────────────── */
  useEffect(() => {
    const id = setInterval(() => {
      const v = activeVideo();
      if (v && v.duration) setProgress(v.currentTime / v.duration);
    }, 250);
    return () => clearInterval(id);
  }, [activeVideo]);

  /* ── Hover / play sync ───────────────────────────────────────────────── */
  useEffect(() => {
    if (!isPlaying) return;
    if (isHovered && hoverVideoRef.current) {
      hoverVideoRef.current.currentTime = 0;
      void hoverVideoRef.current.play().catch(() => {});
    } else if (!isHovered && idleVideoRef.current) {
      void idleVideoRef.current.play().catch(() => {});
    }
  }, [isHovered, isPlaying]);

  const hasVideo = Boolean(idleVideoSrc);

  /* ── Chroma-key canvas ───────────────────────────────────────────────── */
  useEffect(() => {
    if (!hasVideo) return;
    const video = isHovered && hoverVideoSrc ? hoverVideoRef.current : idleVideoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const render = () => {
      if (video.readyState >= 2 && video.videoWidth > 0) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = frame.data;
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i];
          const g = d[i + 1];
          const b = d[i + 2];
          const maxRB = Math.max(r, b);
          const excess = g - maxRB;
          if (g > 50 && excess > 14) {
            d[i + 3] = excess > 40 ? 0 : Math.round(255 * (1 - (excess - 14) / 26));
          } else if (excess > 8) {
            // Suppress green spill on edge pixels
            d[i + 1] = maxRB + 8;
          }
        }
        ctx.putImageData(frame, 0, 0);
      }
      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, [hasVideo, isHovered, hoverVideoSrc]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => triggerGlitch(true)}
      onMouseLeave={() => triggerGlitch(false)}
      className={`group relative select-none bg-black ${isFullscreen ? "flex flex-col" : ""}`}
      style={isFullscreen ? { background: "#000" } : undefined}
    >
      <style>{`
        @keyframes holo-hand-glitch {
          0%   { transform:translate(0,0) skewX(0deg); opacity:1; }
          15%  { transform:translate(-4px,1px) skewX(-6deg); opacity:0.65; }
          30%  { transform:translate(5px,-1px) skewX(8deg); opacity:0.9; }
          45%  { transform:translate(-6px,0) skewX(-10deg) scaleY(1.03); opacity:0.45; }
          65%  { transform:translate(3px,1px) skewX(4deg); opacity:0.85; }
          80%  { transform:translate(-2px,0) skewX(-2deg); opacity:0.7; }
          100% { transform:translate(0,0) skewX(0deg); opacity:1; }
        }
        @keyframes holo-beam-cut {
          0%   { transform:translateY(100%); opacity:0; }
          25%  { opacity:0.85; }
          75%  { opacity:0.7; }
          100% { transform:translateY(-100%); opacity:0; }
        }
        @keyframes holo-crt-roll {
          0%   { transform:translateY(-100%); }
          100% { transform:translateY(250%); }
        }
        @keyframes holo-crt-flicker {
          0%,100% { opacity:0.94; }
          48%  { opacity:0.96; }
          50%  { opacity:0.84; }
          52%  { opacity:0.95; }
          88%  { opacity:0.92; }
          90%  { opacity:0.87; }
        }
        @keyframes holo-console-pulse {
          0%,100% { opacity:0.45; }
          50% { opacity:0.9; }
        }
      `}</style>

      {/* ── Telemetry bar ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-3 pt-2 pb-1">
        <span className="font-mono-code flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-cyan-400/90">
          <Radio className="h-2.5 w-2.5 animate-pulse" />
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono-code text-[9px] uppercase tracking-widest text-white/40">
            {isGlitching ? "SYNC..." : isHovered ? "CH_02" : "CH_01"}
          </span>
          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Sair de ecrã inteiro" : "Ecrã inteiro"}
            aria-label={isFullscreen ? "Sair de ecrã inteiro" : "Ecrã inteiro"}
            className="flex h-5 w-5 items-center justify-center rounded border border-white/15 bg-white/5 text-white/50 transition hover:border-cyan-400/40 hover:text-cyan-300"
          >
            {isFullscreen
              ? <Minimize2 className="h-3 w-3" />
              : <Maximize2 className="h-3 w-3" />}
          </button>
        </div>
      </div>

      {/* ── Scene ─────────────────────────────────────────────────────── */}
      <div
        className={`relative mx-auto w-full overflow-hidden ${isFullscreen ? "flex-1" : ""}`}
        style={{ aspectRatio: isFullscreen ? undefined : "16/9", height: isFullscreen ? "calc(100% - 80px)" : undefined }}
      >
        {/* Projector cone */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-[20%] top-0 z-0 opacity-60 transition-opacity duration-300 group-hover:opacity-85"
          style={{
            clipPath: "polygon(18% 0%,82% 0%,56% 100%,44% 100%)",
            background:
              "linear-gradient(to top,rgba(34,211,238,0.5) 0%,rgba(16,185,129,0.18) 55%,rgba(34,211,238,0.03) 100%)",
          }}
        />

        {/* Hologram projection */}
        <div
          className="absolute inset-x-0 top-0 z-10 overflow-hidden"
          style={{
            bottom: "20%",
            clipPath: "polygon(18% 0%,82% 0%,56% 100%,44% 100%)",
            maskImage: "linear-gradient(to top,transparent 0%,black 20%)",
            WebkitMaskImage: "linear-gradient(to top,transparent 0%,black 20%)",
            animation: isGlitching
              ? "holo-hand-glitch 0.42s steps(2,end)"
              : "holo-crt-flicker 3.2s infinite",
            filter: isGlitching
              ? "drop-shadow(-3px 0 0 rgba(255,0,128,0.55)) drop-shadow(3px 0 0 rgba(0,255,255,0.6))"
              : undefined,
          }}
        >
          {hasVideo ? (
            <>
              {idleVideoSrc && (
                <video ref={idleVideoRef} src={idleVideoSrc} autoPlay loop muted playsInline
                  className="pointer-events-none absolute h-px w-px opacity-0" />
              )}
              {hoverVideoSrc && (
                <video ref={hoverVideoRef} src={hoverVideoSrc} loop muted playsInline
                  className="pointer-events-none absolute h-px w-px opacity-0" />
              )}
              <canvas ref={canvasRef}
                className="h-full w-full object-contain object-bottom mix-blend-screen"
                style={{ filter: "grayscale(1) contrast(1.55) brightness(0.9)" }} />
            </>
          ) : (
            <img src={fallbackImage} alt={alt}
              className="h-full w-full object-contain object-bottom mix-blend-screen"
              style={{ filter: "grayscale(1) contrast(1.55) brightness(0.82)" }} />
          )}
          {/* Hologram tint */}
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-cyan-400/35 mix-blend-color" />
          {/* Scanlines */}
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40"
            style={{ backgroundImage: "repeating-linear-gradient(0deg,rgba(0,0,0,0.5) 0px,rgba(0,0,0,0.5) 1px,transparent 1px,transparent 3px)" }} />
          {/* CRT roll */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-transparent via-cyan-300/20 to-transparent mix-blend-screen"
            style={{ animation: "holo-crt-roll 3.6s linear infinite" }} />
          {isGlitching && (
            <div aria-hidden className="pointer-events-none absolute inset-x-0 h-8 bg-gradient-to-b from-transparent via-cyan-300/45 to-transparent mix-blend-screen"
              style={{ animation: "holo-beam-cut 0.4s ease-out forwards" }} />
          )}
        </div>

        {/* ── SVG War-Room (behind the hologram projection) ──────────────── */}
        <svg
          aria-hidden
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMax meet"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
        >
          <defs>
            <radialGradient id="tableGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(34,211,238,0.18)" />
              <stop offset="100%" stopColor="rgba(34,211,238,0)" />
            </radialGradient>
            <linearGradient id="padGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(80,100,110,0.95)" />
              <stop offset="100%" stopColor="rgba(10,15,20,0.98)" />
            </linearGradient>
            <filter id="lensGlow" x="-120%" y="-120%" width="340%" height="340%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="ambientBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" />
            </filter>
          </defs>

          {/* ── Round holographic table ─────────────────────────────── */}
          {/* Table glow */}
          <ellipse cx="800" cy="808" rx="480" ry="80" fill="url(#tableGlow)" filter="url(#ambientBlur)" />
          {/* Table surface */}
          <ellipse cx="800" cy="820" rx="420" ry="62"
            fill="rgba(0,18,24,0.88)"
            stroke="rgba(34,211,238,0.4)" strokeWidth="1.5" />
          {/* Inner rings */}
          <ellipse cx="800" cy="820" rx="300" ry="44"
            fill="none" stroke="rgba(34,211,238,0.3)" strokeWidth="1" />
          <ellipse cx="800" cy="820" rx="160" ry="24"
            fill="rgba(34,211,238,0.05)" stroke="rgba(34,211,238,0.5)" strokeWidth="0.8" />

          {/* ── Projector base ─────────────────────────────────────── */}
          <polygon
            points="748,874 760,862 840,862 852,874 852,896 840,908 760,908 748,896"
            fill="url(#padGrad)"
            stroke="rgba(34,211,238,0.6)" strokeWidth="1.5"
          />
          <ellipse cx="800" cy="884" rx="30" ry="10"
            fill="rgba(0,0,0,0.7)" stroke="rgba(34,211,238,0.6)" strokeWidth="1.2" />
          <ellipse cx="800" cy="872" rx="16" ry="5.5"
            fill="rgba(34,211,238,0.95)" filter="url(#lensGlow)" />
          {/* spiky feet */}
          {[-90, -60, -32, 32, 60, 90].map((dx, i) => (
            <line key={i}
              x1={800 + dx * 0.45} y1="898" x2={800 + dx} y2="912"
              stroke="rgba(120,170,190,0.65)" strokeWidth="2.5" strokeLinecap="round" />
          ))}

          {/* ── PEOPLE: 8 figures seated around the round table ─────── */}

          {/* Far-left (9 o'clock) — facing right */}
          <PersonSilhouette x={342} y={790} scale={0.72} flipX={false} opacity={0.95} />

          {/* Upper-left (10–11 o'clock) — slightly angled */}
          <PersonSilhouette x={450} y={720} scale={0.64} flipX={false} opacity={0.88} />

          {/* Upper-left-center (11 o'clock) */}
          <PersonSilhouette x={590} y={688} scale={0.60} flipX={false} opacity={0.82} />

          {/* Upper-center-left (12 o'clock, partially behind projector) */}
          <PersonSilhouette x={700} y={678} scale={0.56} flipX={false} opacity={0.70} />

          {/* Far-right (3 o'clock) — facing left */}
          <PersonSilhouette x={1258} y={790} scale={0.72} flipX={true} opacity={0.95} />

          {/* Upper-right (1–2 o'clock) */}
          <PersonSilhouette x={1150} y={720} scale={0.64} flipX={true} opacity={0.88} />

          {/* Upper-right-center (1 o'clock) */}
          <PersonSilhouette x={1010} y={688} scale={0.60} flipX={true} opacity={0.82} />

          {/* Upper-center-right (12 o'clock) */}
          <PersonSilhouette x={900} y={678} scale={0.56} flipX={true} opacity={0.70} />

          {/* ── Side consoles ──────────────────────────────────────── */}
          {/* Left console */}
          <rect x="62" y="600" width="100" height="66" rx="5"
            fill="rgba(0,25,35,0.85)" stroke="rgba(34,211,238,0.3)" strokeWidth="1" />
          <rect x="69" y="607" width="86" height="52" rx="3"
            fill="rgba(34,211,238,0.07)"
            style={{ animation: "holo-console-pulse 2.8s ease-in-out infinite" }} />
          {/* grid lines */}
          {[0,1,2,3].map(r => (
            <line key={r} x1="72" y1={612 + r * 12} x2="152" y2={612 + r * 12}
              stroke="rgba(34,211,238,0.12)" strokeWidth="0.7" />
          ))}

          {/* Right console */}
          <rect x="1438" y="600" width="100" height="66" rx="5"
            fill="rgba(0,25,35,0.85)" stroke="rgba(34,211,238,0.3)" strokeWidth="1" />
          <rect x="1445" y="607" width="86" height="52" rx="3"
            fill="rgba(34,211,238,0.07)"
            style={{ animation: "holo-console-pulse 3.1s ease-in-out infinite 0.5s" }} />
          {[0,1,2,3].map(r => (
            <line key={r} x1="1448" y1={612 + r * 12} x2="1528" y2={612 + r * 12}
              stroke="rgba(34,211,238,0.12)" strokeWidth="0.7" />
          ))}

          {/* ── Bottom floor glow ──────────────────────────────────── */}
          <ellipse cx="800" cy="895" rx="560" ry="12" fill="rgba(34,211,238,0.04)" />
        </svg>

        {/* Hover hint */}
        <div className="pointer-events-none absolute inset-x-0 top-1 z-30 flex justify-center">
          <span className={`font-mono-code rounded border border-cyan-400/30 bg-black/60 px-2 py-0.5 text-[8px] uppercase tracking-widest text-cyan-300/70 transition-opacity duration-300 ${isHovered ? "opacity-0" : "opacity-80"}`}>
            Passa o rato para interagir
          </span>
        </div>
      </div>

      {/* ── Media controls ────────────────────────────────────────────── */}
      {hasVideo && (
        <div className="px-3 pt-1.5 pb-2">
          {/* Progress bar */}
          <div
            className="mb-2 h-0.5 w-full cursor-pointer overflow-hidden rounded-full bg-white/10"
            onClick={(e) => {
              const v = activeVideo();
              if (!v || !v.duration) return;
              const rect = e.currentTarget.getBoundingClientRect();
              v.currentTime = ((e.clientX - rect.left) / rect.width) * v.duration;
            }}
          >
            <div
              className="h-full rounded-full bg-cyan-400 transition-all duration-200"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          {/* Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <CtrlBtn onClick={() => seek(-5)} title="Recuar 5s" aria-label="Recuar 5s">
                <SkipBack className="h-3 w-3" />
              </CtrlBtn>
              <CtrlBtn onClick={togglePlay} title={isPlaying ? "Pausar" : "Reproduzir"} aria-label={isPlaying ? "Pausar" : "Reproduzir"} highlight>
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              </CtrlBtn>
              <CtrlBtn onClick={() => seek(5)} title="Avançar 5s" aria-label="Avançar 5s">
                <SkipForward className="h-3 w-3" />
              </CtrlBtn>
            </div>
            <div className="flex items-center gap-1">
              <CtrlBtn onClick={toggleMute} title={isMuted ? "Ativar som" : "Silenciar"} aria-label={isMuted ? "Ativar som" : "Silenciar"}>
                {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
              </CtrlBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CtrlBtn({
  children, highlight, ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { highlight?: boolean }) {
  return (
    <button type="button" {...props}
      className={`flex items-center justify-center rounded border transition ${highlight
        ? "h-7 w-7 border-cyan-400/60 bg-cyan-400/15 text-cyan-300 hover:bg-cyan-400/30"
        : "h-6 w-6 border-white/15 bg-white/5 text-white/60 hover:border-cyan-400/40 hover:text-cyan-300"
      }`}
    >
      {children}
    </button>
  );
}
