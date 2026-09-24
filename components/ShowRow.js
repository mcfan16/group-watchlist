export default function ShowRow({ show }) {
  return (
    <div className="card">
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
      </div>
    </div>
  );
}
