import { createContext, useContext, useRef, useState } from "react";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [track, setTrack] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const play = (song) => {
    setTrack(song);
    setPlaying(true);

    // Remote copyrighted tracks are intentionally not downloaded or bundled.
    // If the app has a licensed audioUrl, play it locally; otherwise MusicCard
    // opens the selected track on YouTube where playback is handled by YouTube.
    if (song?.audioUrl && audioRef.current) {
      audioRef.current.src = song.audioUrl;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => setPlaying(false));
    }
  };

  const toggle = () => {
    if (!track?.audioUrl || !audioRef.current) return;
    if (playing) audioRef.current.pause();
    else audioRef.current.play().catch(() => setPlaying(false));
    setPlaying((value) => !value);
  };

  const seek = (value) => {
    if (audioRef.current) audioRef.current.currentTime = Number(value);
    setProgress(Number(value));
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setTrack(null);
    setPlaying(false);
    setProgress(0);
  };

  return (
    <PlayerContext.Provider value={{ track, playing, play, toggle, stop, progress, duration, seek }}>
      {children}
      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime || 0)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
        onEnded={() => { setPlaying(false); setProgress(0); }}
      />
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used inside PlayerProvider");
  return context;
};
