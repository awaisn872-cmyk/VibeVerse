import { Star, Bookmark, Play, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { fallbackPoster, resolveWikipediaImage } from "../services/mediaService";

export default function MovieCard({ movie }) {
  const movieId = movie._id || movie.id;
  const generatedFallback = fallbackPoster(movie.title, movie.year);
  const [poster, setPoster] = useState(movie.poster || generatedFallback);

  useEffect(() => {
    let alive = true;
    const initial = movie.poster || "";

    const loadPoster = async () => {
      if (initial) {
        try {
          const test = new Image();
          test.onload = () => alive && setPoster(initial);
          test.onerror = async () => {
            const image = await resolveWikipediaImage(movie.title);
            if (alive) setPoster(image || generatedFallback);
          };
          test.src = initial;
          return;
        } catch {}
      }
      const image = await resolveWikipediaImage(movie.title);
      if (alive) setPoster(image || generatedFallback);
    };

    loadPoster();
    return () => { alive = false; };
  }, [movie.poster, movie.title, movie.year, generatedFallback]);

  const [saved, setSaved] = useState(() => {
    const list = JSON.parse(localStorage.getItem("vv_watchlist") || "[]");
    return list.includes(movieId);
  });

  const toggle = () => {
    const list = JSON.parse(localStorage.getItem("vv_watchlist") || "[]");
    const newList = list.includes(movieId)
      ? list.filter((x) => x !== movieId)
      : [...list, movieId];
    localStorage.setItem("vv_watchlist", JSON.stringify(newList));
    setSaved(newList.includes(movieId));
  };

  const youtubeUrl = movie.link || `https://www.youtube.com/results?search_query=${encodeURIComponent(`${movie.title} official trailer`)}`;

  return (
    <article className="movie-card">
      <div className="poster">
        <img src={poster} alt={`${movie.title} poster`} loading="lazy" onError={(e) => {
          if (e.currentTarget.src !== generatedFallback) e.currentTarget.src = generatedFallback;
        }} />
        <div className="poster-overlay">
          <a href={youtubeUrl} target="_blank" rel="noreferrer" aria-label={`Watch ${movie.title} trailer on YouTube`}>
            <Play fill="currentColor" />
          </a>
        </div>
        <button onClick={toggle} className={`save ${saved ? "saved" : ""}`}>
          <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
        </button>
        <span className="rating"><Star size={13} fill="currentColor" />{movie.rating || "N/A"}</span>
      </div>
      <div className="card-info">
        <a href={youtubeUrl} target="_blank" rel="noreferrer" className="movie-title-link" title={`Watch ${movie.title} on YouTube`}>
          <h3>{movie.title}</h3><ExternalLink size={13} />
        </a>
        <p>{movie.year || "—"} · {movie.genre || "Movie"}</p>
      </div>
    </article>
  );
}
