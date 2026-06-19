import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "../../context/language-context";

export const MusicPlayer: React.FC = () => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(30); // Default 30% volume
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/audio/ruy_mingas-minha_terra.mp3");
    audio.loop = false;
    audioRef.current = audio;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    audio.volume = volume / 100;

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((err) => console.log("Playback failed:", err));
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const seekPercentage = Number(e.target.value);
    const newTime = (seekPercentage / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    audioRef.current.volume = newVolume / 100;
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioRef.current.volume = nextMuted ? 0 : volume / 100;
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const displayMins = minutes < 10 ? `0${minutes}` : String(minutes);
    const displaySecs = seconds < 10 ? `0${seconds}` : String(seconds);
    return `${displayMins}:${displaySecs}`;
  };

  const currentSeekPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="glass mx-auto flex w-full max-w-xl flex-col items-center gap-4 rounded-3xl p-6 shadow-2xl backdrop-blur-md border border-moss/20"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col">
          <span className="font-mono-code text-xs uppercase tracking-widest text-moss/80">
            {t("player_now_playing")}
          </span>
          <span className="font-display text-lg font-bold text-foreground">Minha terra</span>
          <span className="text-sm text-muted-foreground">Ruy Mingas</span>
        </div>
        
        {/* Play/Pause Button */}
        <button
          onClick={handlePlayPause}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-lime text-primary-foreground shadow-lg transition duration-300 hover:scale-105 hover:bg-moss"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-1" fill="currentColor" />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="flex w-full items-center gap-3">
        <span className="font-mono-code text-xs text-muted-foreground">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max="100"
          value={currentSeekPercent}
          onChange={handleSeek}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-lime hover:accent-moss"
          style={{
            background: `linear-gradient(to right, var(--color-lime, #A8FF3E) ${currentSeekPercent}%, var(--color-muted, #0D1F17) ${currentSeekPercent}%)`
          }}
        />
        <span className="font-mono-code text-xs text-muted-foreground">{formatTime(duration)}</span>
      </div>

      {/* Volume Controls */}
      <div className="flex w-full items-center justify-end gap-3">
        <button
          onClick={toggleMute}
          className="text-muted-foreground transition hover:text-lime"
          aria-label="Toggle mute"
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="h-1.5 w-24 cursor-pointer appearance-none rounded-lg bg-muted accent-lime hover:accent-moss"
          style={{
            background: `linear-gradient(to right, var(--color-lime, #A8FF3E) ${isMuted ? 0 : volume}%, var(--color-muted, #0D1F17) ${isMuted ? 0 : volume}%)`
          }}
        />
        <span className="font-mono-code text-xs text-muted-foreground w-8 text-right">
          {isMuted ? 0 : volume}%
        </span>
      </div>
    </div>
  );
};
