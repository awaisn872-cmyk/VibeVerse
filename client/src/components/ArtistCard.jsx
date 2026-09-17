import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function ArtistCard({ artist }) {
  const [image, setImage] = useState(artist.image);

  useEffect(() => {
    let alive = true;
    const test = new Image();
    test.onload = () => {};
    test.onerror = async () => {
      try {
        const r = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            String(artist.name).replace(/\s+/g, "_")
          )}`
        );
        const data = await r.json();
        const src = data?.thumbnail?.source || data?.originalimage?.source;
        if (alive && src) setImage(src);
      } catch {}
    };
    test.src = artist.image || "";
    return () => { alive = false; };
  }, [artist.image, artist.name]);

  return (
    <article className="artist-card">
      <img src={image} alt={artist.name} loading="lazy" />
      <div className="artist-shade" />
      <div className="artist-info">
        <span>{artist.genre}</span>
        <h3>{artist.name}</h3>
        <Link to={`/artists/${artist.id}`}>
          View artist <ArrowUpRight size={15} />
        </Link>
      </div>
    </article>
  );
}
