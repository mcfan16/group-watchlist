import Link from "next/link";

export default function ShowRow({ show, ratings = [] }) {
  return (
    <Link href={`/show/${show.id}`} className="card">
      {show.cover_image_url ? (
        <img className="cover" src={show.cover_image_url} alt={show.title} />
      ) : (
        <div className="cover-placeholder">🎬</div>
      )}
      <div>
        <p className="show-title">{show.title}</p>
        {show.platforms?.map((platform) => (
          <span className="platform-badge" key={platform}>
            {platform}
          </span>
        ))}
        {ratings.length > 0 && (
          <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 10 }}>
            {ratings.map((r) => (
              <span
                key={r.person}
                style={{ fontSize: 12, color: "var(--color-text-muted)" }}
              >
                {r.person}: {"★".repeat(r.stars)}
                {"☆".repeat(5 - r.stars)}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
