"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PLATFORMS = ["Netflix", "YouTube", "Hulu", "Amazon Prime", "Disney+"];

export default function AddShow() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [platforms, setPlatforms] = useState([]);
  const [otherChecked, setOtherChecked] = useState(false);
  const [otherPlatform, setOtherPlatform] = useState("");
  const [genre, setGenre] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [tomatometer, setTomatometer] = useState("");
  const [popcornmeter, setPopcornmeter] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [rtUrl, setRtUrl] = useState("");
  const [rtLoading, setRtLoading] = useState(false);
  const [rtError, setRtError] = useState("");
  const [rtFound, setRtFound] = useState(false);

  function togglePlatform(platform) {
    setPlatforms((current) =>
      current.includes(platform)
        ? current.filter((p) => p !== platform)
        : [...current, platform]
    );
  }

  function applyPlatforms(foundPlatforms) {
    const matched = foundPlatforms.filter((p) => PLATFORMS.includes(p));
    const leftover = foundPlatforms.filter((p) => !PLATFORMS.includes(p));
    setPlatforms(matched);
    if (leftover.length > 0) {
      setOtherChecked(true);
      setOtherPlatform(leftover.join(", "));
    } else {
      setOtherChecked(false);
      setOtherPlatform("");
    }
  }

  async function handleLookup() {
    if (!rtUrl.trim()) return;

    setRtLoading(true);
    setRtError("");
    setRtFound(false);

    try {
      const response = await fetch("/api/parse-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: rtUrl.trim() }),
      });
      const data = await response.json();

      if (!response.ok) {
        setRtError(data.error || "Couldn't read that link — try again or add manually below.");
        setRtLoading(false);
        return;
      }

      if (data.title) setTitle(data.title);
      if (data.genre) setGenre(data.genre);
      if (data.synopsis) setSynopsis(data.synopsis);
      if (data.tomatometer != null) setTomatometer(String(data.tomatometer));
      if (data.popcornmeter != null) setPopcornmeter(String(data.popcornmeter));
      if (data.cover_image_url) setCoverImageUrl(data.cover_image_url);
      if (data.link_url) setLinkUrl(data.link_url);
      if (data.platforms?.length) applyPlatforms(data.platforms);

      setRtFound(true);
    } catch (err) {
      console.error("Link lookup failed:", err);
      setRtError("Couldn't reach that link — check it and try again, or add manually below.");
    }

    setRtLoading(false);
  }

  async function handleSave(event) {
    event.preventDefault();
    if (!title.trim()) {
      setError("Give it at least a title before saving.");
      return;
    }

    setSaving(true);
    setError("");

    const allPlatforms =
      otherChecked && otherPlatform.trim()
        ? [...platforms, otherPlatform.trim()]
        : platforms;

    const response = await fetch("/api/shows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        platforms: allPlatforms,
        genre: genre.trim() || null,
        synopsis: synopsis.trim() || null,
        tomatometer: tomatometer ? Number(tomatometer) : null,
        popcornmeter: popcornmeter ? Number(popcornmeter) : null,
        link_url: linkUrl.trim() || null,
        cover_image_url: coverImageUrl || null,
      }),
    });

    setSaving(false);

    if (!response.ok) {
      const data = await response.json();
      setError("Couldn't save that show — try again in a moment.");
      console.error(data.error);
      return;
    }

    router.push("/");
  }

  return (
    <div className="page">
      <div className="topbar">
        <h1>Add a show</h1>
      </div>

      <div className="field" style={{ marginBottom: 20 }}>
        <label htmlFor="rtUrl">Paste a Rotten Tomatoes link</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            id="rtUrl"
            type="url"
            className="text-input"
            style={{ flex: 1 }}
            value={rtUrl}
            onChange={(e) => setRtUrl(e.target.value)}
            placeholder="https://www.rottentomatoes.com/m/..."
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleLookup}
            disabled={rtLoading || !rtUrl.trim()}
          >
            {rtLoading ? "Looking up..." : "Look it up"}
          </button>
        </div>
        {rtError && (
          <p className="error-message">
            {rtError} Or just fill in the fields below by hand.
          </p>
        )}
        {rtFound && !rtError && (
          <p style={{ color: "var(--color-teal)", fontSize: 14, marginTop: 6 }}>
            Found it! Check the details below before saving.
          </p>
        )}
      </div>

      <p style={{ color: "var(--color-text-muted)", fontSize: 14, marginBottom: 12 }}>
        Or just fill these in yourself:
      </p>

      <form className="show-form" onSubmit={handleSave}>
        <div className="field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's the show or movie called?"
          />
        </div>

        <div className="field">
          <label>Where can you watch it?</label>
          <div className="checkbox-row">
            {PLATFORMS.map((platform) => (
              <label key={platform}>
                <input
                  type="checkbox"
                  checked={platforms.includes(platform)}
                  onChange={() => togglePlatform(platform)}
                />
                {platform}
              </label>
            ))}
            <label>
              <input
                type="checkbox"
                checked={otherChecked}
                onChange={() => setOtherChecked((current) => !current)}
              />
              Other
            </label>
          </div>
          {otherChecked && (
            <input
              type="text"
              value={otherPlatform}
              onChange={(e) => setOtherPlatform(e.target.value)}
              placeholder="Which platform?"
              style={{ marginTop: 8 }}
            />
          )}
        </div>

        <div className="field">
          <label htmlFor="genre">Genre</label>
          <input
            id="genre"
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="Comedy, sci-fi, action..."
          />
        </div>

        <div className="field">
          <label htmlFor="synopsis">Synopsis</label>
          <textarea
            id="synopsis"
            rows={3}
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            placeholder="What's it about?"
          />
        </div>

        <div className="field">
          <label htmlFor="tomatometer">Tomatometer score (critics)</label>
          <input
            id="tomatometer"
            type="number"
            min="0"
            max="100"
            value={tomatometer}
            onChange={(e) => setTomatometer(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="popcornmeter">Popcornmeter score (audience)</label>
          <input
            id="popcornmeter"
            type="number"
            min="0"
            max="100"
            value={popcornmeter}
            onChange={(e) => setPopcornmeter(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="linkUrl">Link (Rotten Tomatoes, YouTube, anything)</label>
          <input
            id="linkUrl"
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button className="btn" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save to queue"}
        </button>
      </form>
    </div>
  );
}
