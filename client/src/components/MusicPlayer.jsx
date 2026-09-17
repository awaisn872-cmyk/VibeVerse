import { Pause, Play, ExternalLink, X } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";

export default function MusicPlayer() {
  const { track, playing, toggle, stop } = usePlayer();
  if (!track) return null;

  const youtubeUrl = track.link || `https://www.youtube.com/results?search_query=${encodeURIComponent(`${track.title} ${track.artist} official`)}`;

  return (
    <div className="player">
      <img src={track.cover} alt="" />
      <div className="player-meta">
        <b>{track.title}</b>
        <span>{track.artist}</span>
      </div>
      {track.audioUrl ? (
        <button className="play-btn" onClick={toggle} aria-label={playing ? "Pause" : "Play"}>
          {playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
        </button>
      ) : (
        <a className="play-btn youtube-play" href={youtubeUrl} target="_blank" rel="noreferrer" aria-label="Play on YouTube">
          <Play fill="currentColor" />
        </a>
      )}
      <a className="player-youtube" href={youtubeUrl} target="_blank" rel="noreferrer">
        Open on YouTube <ExternalLink size={14} />
      </a>
      <button onClick={stop} aria-label="Close player"><X /></button>
    </div>
  );
}
