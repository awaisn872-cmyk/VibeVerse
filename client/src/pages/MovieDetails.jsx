import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api";
import {
  Play,
  Bookmark,
  Star,
  ArrowLeft,
} from "lucide-react";

export default function MovieDetails() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [poster, setPoster] = useState("");

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const response = await api.get(`/movies/${id}`);
        setMovie(response.data);
      } catch (error) {
        console.error("Failed to load movie:", error);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [id]);

  useEffect(() => {
    if (!movie?.title) return;
    let alive = true;
    const fallback = `https://placehold.co/600x900/11101c/ffffff?text=${encodeURIComponent(movie.title)}`;
    setPoster(fallback);
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      movie.title.replace(/\s+/g, "_")
    )}`)
      .then((r) => r.json())
      .then((data) => {
        const src = data?.thumbnail?.source || data?.originalimage?.source;
        if (alive && src) setPoster(src);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [movie?.title]);

  if (loading) {
    return (
      <main className="details">
        <div className="detail-inner">
          <p>Loading movie...</p>
        </div>
      </main>
    );
  }

  if (!movie) {
    return (
      <main className="details">
        <div className="detail-inner">
          <Link to="/movies" className="back">
            <ArrowLeft />
            Movies
          </Link>

          <h1>Movie not found</h1>
          <p>We couldn't find this movie.</p>
        </div>
      </main>
    );
  }

  const movieId = movie._id || movie.id;

  const directTrailers = {
    "Dune: Part Two": "https://www.youtube.com/watch?v=Way9Dexny3w",
    "Deadpool & Wolverine": "https://www.youtube.com/watch?v=Idh8n5XuYIA",
    "Inside Out 2": "https://www.youtube.com/watch?v=LEjhY15eCx0",
    "Oppenheimer": "https://www.youtube.com/watch?v=bK6ldnjE3Y0",
    "Spider-Man: Across the Spider-Verse": "https://www.youtube.com/watch?v=cqGjhVJWtEg",
    "The Batman": "https://www.youtube.com/watch?v=mqqft2x_Aa4",
  };

  const trailerUrl =
    directTrailers[movie.title] ||
    movie.link ||
    `https://www.youtube.com/results?search_query=${encodeURIComponent(
      `${movie.title} official trailer`
    )}`;

  return (
    <main className="details">

      <div
        className="backdrop"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              #080510 15%,
              rgba(8,5,16,.72),
              #080510
            ),
            url(${poster || movie.backdrop || movie.poster})
          `,
        }}
      />

      <div className="detail-inner">

        <Link to="/movies" className="back">
          <ArrowLeft />
          Movies
        </Link>

        <div className="detail-content">

          <img
            src={poster || movie.poster}
            className="detail-poster"
            alt={movie.title}
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80";
            }}
          />

          <div>

            <span className="kicker">
              {movie.genre} · {movie.year}
            </span>

            <h1>{movie.title}</h1>

            <div className="detail-rating">
              <Star fill="currentColor" />
              {movie.rating || "N/A"}/10
            </div>

            <p>
              {movie.description ||
                "No description available for this movie."}
            </p>

            <div className="hero-actions">

              <a
                className="primary"
                href={trailerUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Play fill="currentColor" />
                Watch trailer
              </a>

              <button
                className="ghost"
                onClick={() => {
                  const list = JSON.parse(
                    localStorage.getItem("vv_watchlist") || "[]"
                  );

                  const exists = list.includes(movieId);

                  const updated = exists
                    ? list.filter((x) => x !== movieId)
                    : [...list, movieId];

                  localStorage.setItem(
                    "vv_watchlist",
                    JSON.stringify(updated)
                  );
                }}
              >
                <Bookmark />
                Add to watchlist
              </button>

            </div>

          </div>

        </div>
      </div>
    </main>
  );
}