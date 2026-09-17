import { useEffect, useState } from "react";
import { api } from "../services/api";
import { music as fallback } from "../data/fallbackData";
import MusicCard from "../components/MusicCard";

export default function Music() {
  const [data, setData] = useState(fallback);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMusic = async () => {
      try {
        const response = await api.get("/music");

        if (Array.isArray(response.data) && response.data.length) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Failed to load music:", error);
        setData(fallback);
      } finally {
        setLoading(false);
      }
    };

    loadMusic();
  }, []);

  const filteredMusic = data.filter((song) =>
    `${song.title || ""} ${song.artist || ""} ${song.album || ""}`
      .toLowerCase()
      .includes(q.toLowerCase())
  );

  return (
    <main className="page">
      <div className="page-title">
        <span className="kicker">AUDIO UNIVERSE</span>

        <h1>
          Find your <em>sound</em>
        </h1>

        <p>
          Press play on the songs and artists defining the moment.
        </p>

        <input
          className="search-input"
          placeholder="Search songs or artists..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="empty-state">
          Loading music...
        </div>
      ) : filteredMusic.length ? (
        <div className="music-grid">
          {filteredMusic.map((song, index) => (
            <MusicCard
              key={song._id || song.id || `${song.title}-${index}`}
              song={song}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          No songs found.
        </div>
      )}
    </main>
  );
}