import { Heart, Play, Pause, ExternalLink, UserRound } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import { useState } from "react";

const artistIds = {
  "The Weeknd": "a1",
  "Taylor Swift": "a2",
  "Bruno Mars": "a3",
  "Billie Eilish": "a4",
  "Arijit Singh": "a5",
  "Atif Aslam": "a6",
  "Dua Lipa": "a7",
  "Ed Sheeran": "a8",
  Adele: "a9",
  "Justin Bieber": "a10",
  "Ali Zafar": "a11",
  "Rahat Fateh Ali Khan": "a12",
};

export default function MusicCard({ song }) {
  const { track, playing, play, toggle } = usePlayer();
  const songId = song._id || song.id;
  const isCurrent = (track?._id || track?.id) === songId;

  const [fav, setFav] = useState(() => {
    const favorites = JSON.parse(localStorage.getItem("vv_favs") || "[]");
    return favorites.includes(songId);
  });

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("vv_favs") || "[]");
    const newFavorites = favorites.includes(songId)
      ? favorites.filter((id) => id !== songId)
      : [...favorites, songId];
    localStorage.setItem("vv_favs", JSON.stringify(newFavorites));
    setFav(newFavorites.includes(songId));
  };

  const youtubeIds = {
    "Blinding Lights": "4NRXx6U8ABQ",
    "As It Was": "H5v3kku4y6Q",
    "Espresso": "eVli-tstM5E",
    "Beautiful Things": "Oa_RSwwpPaA",
    "APT.": "ekr2nIex040",
    "Die With A Smile": "kPa7bsKwL-c",
    "Tum Hi Ho": "Umqb9KENgmk",
    "Chaleya": "VAdGW7QDJiU",
    "Kesariya": "BddP6PYo2gs"
  };

  const youtubeUrl = song.link || (youtubeIds[song.title]
    ? `https://www.youtube.com/watch?v=${youtubeIds[song.title]}`
    : `https://www.youtube.com/results?search_query=${encodeURIComponent(`${song.title} ${song.artist} official`)}`);

  const handlePlay = () => {
    if (song.audioUrl) {
      if (isCurrent) toggle();
      else play(song);
      return;
    }
    window.open(youtubeUrl, "_blank", "noopener,noreferrer");
    play({ ...song, link: youtubeUrl });
  };

  const artistName = String(song.artist || "Unknown Artist").split(" & ")[0];
  const artistId = artistIds[artistName];

  return (
    <article className="music-card">
      <div className="cover">
        <img
          src={song.cover || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=700&q=80"}
          alt={song.title}
          loading="lazy"
        />
        <button onClick={handlePlay} aria-label={`Play ${song.title}`}>
          {isCurrent && playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
        </button>
      </div>

      <div className="music-info">
        <h3>{song.title}</h3>
        {artistId ? (
          <a className="artist-link" href={`/artists/${artistId}`}>
            <UserRound size={12} /> {song.artist}
          </a>
        ) : (
          <p>{song.artist || "Unknown Artist"}</p>
        )}
        {song.album && <small>{song.album}</small>}
      </div>

      <button className={`heart ${fav ? "fav" : ""}`} onClick={toggleFavorite}>
        <Heart size={19} fill={fav ? "currentColor" : "none"} />
      </button>

      <a href={youtubeUrl} target="_blank" rel="noreferrer" className="listen">
        <ExternalLink size={14} /> YouTube
      </a>
    </article>
  );
}
