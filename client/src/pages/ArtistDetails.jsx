import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { api } from "../services/api";
import { artists as fallback } from "../data/fallbackData";

export default function ArtistDetails() {
  const { id } = useParams();
  const [artist, setArtist] = useState(() => fallback.find((x) => x.id === id) || null);
  const [image, setImage] = useState("");

  useEffect(() => {
    api.get(`/artists/${id}`)
      .then((r) => setArtist(r.data))
      .catch(() => setArtist(fallback.find((x) => x.id === id) || null));
  }, [id]);

  useEffect(() => {
    if (!artist?.name) return;
    let alive = true;
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      artist.name.replace(/\s+/g, "_")
    )}`)
      .then((r) => r.json())
      .then((data) => {
        const src = data?.thumbnail?.source || data?.originalimage?.source;
        if (alive && src) setImage(src);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [artist?.name]);

  if (!artist) {
    return <main className="page"><h1>Artist not found</h1></main>;
  }

  return (
    <main className="details artist-detail">
      <div className="detail-inner">
        <Link to="/artists" className="back"><ArrowLeft /> Artists</Link>
        <div className="artist-hero">
          <img src={image || artist.image} alt={artist.name} />
          <div>
            <span className="kicker">{artist.genre}</span>
            <h1>{artist.name}</h1>
            <p>{artist.bio}</p>
            <a
              className="primary"
              href={artist.link || `https://www.youtube.com/results?search_query=${encodeURIComponent(artist.name + " official")}`}
              target="_blank"
              rel="noreferrer"
            >
              Open official links <ExternalLink size={17} />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
