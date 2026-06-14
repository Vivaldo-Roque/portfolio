import React, { useState, useEffect, useRef } from 'react';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(10); // Default 10% based on original code '10'

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    const audio = new Audio('/audio/ruy_mingas-minha_terra.mp3');
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

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    // Initial volume setting
    audio.volume = volume / 100;

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlayer = () => {
    setIsHidden(!isHidden);
  };

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((err) => console.log('Playback failed:', err));
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
    audioRef.current.volume = newVolume / 100;
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const displayMins = minutes < 10 ? `0${minutes}` : String(minutes);
    const displaySecs = seconds < 10 ? `0${seconds}` : String(seconds);
    return `${displayMins}:${displaySecs}`;
  };

  const currentSeekPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={`player-container ${isHidden ? 'hidden' : ''}`}
      onClick={togglePlayer}
      style={{ cursor: 'pointer' }}
    >
      <div className="player">
        <div className="wrapper">
          <div className="details">
            <div className="track-name">Minha terra</div>
            <div className="track-artist">Ruy Mingas</div>
          </div>

          <div className="slider_container" onClick={(e) => e.stopPropagation()}>
            <div className="current-time">{formatTime(currentTime)}</div>
            <input
              type="range"
              min="0"
              max="100"
              value={currentSeekPercent}
              className="seek_slider"
              onChange={handleSeek}
            />
            <div className="total-duration">{formatTime(duration)}</div>
          </div>

          <div className="slider_container" onClick={(e) => e.stopPropagation()}>
            <i className="fa fa-volume-down"></i>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              className="volume_slider"
              onChange={handleVolumeChange}
            />
            <i className="fa fa-volume-up"></i>
            <div>
              <span id="volume_value">{volume}</span>%
            </div>
          </div>

          <div className="buttons" onClick={(e) => e.stopPropagation()}>
            <div className="playpause-track" onClick={handlePlayPause}>
              {isPlaying ? (
                <i className="fa fa-pause-circle fa-5x"></i>
              ) : (
                <i className="fa fa-play-circle fa-5x"></i>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
