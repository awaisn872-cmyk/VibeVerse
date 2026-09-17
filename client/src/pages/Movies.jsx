import { useEffect, useState } from "react";
import { api } from "../services/api";
import { movies as fallback } from "../data/fallbackData";
import MovieCard from "../components/MovieCard";

export default function Movies() {
  const [data, setData] = useState(fallback);
  const [q, setQ] = useState("");

  useEffect(() => {
    api
      .get("/movies")
      .then((r) => {
        if (Array.isArray(r.data) && r.data.length > 0) {
          setData(r.data);
        }
      })
      .catch(() => {
        setData(fallback);
      });
  }, []);

  const list = data.filter((x) =>
    `${x.title || ""} ${x.genre || ""}`
      .toLowerCase()
      .includes(q.toLowerCase())
  );

  return (
    <main className="page">
      <div className="page-title">
        <span className="kicker">CINEMA</span>

        <h1>
          Explore <em>movies</em>
        </h1>

        <p>
          Blockbusters, animation, drama and worlds worth getting lost in.
        </p>

        <input
          className="search-input"
          placeholder="Search movies or genres…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="movie-grid">
        {list.map((m, index) => (
          <MovieCard
            key={m._id || m.id || `${m.title}-${index}`}
            movie={m}
          />
        ))}
      </div>
    </main>
  );
}