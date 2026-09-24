"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const PLATFORMS = ["Netflix", "YouTube", "Hulu", "Amazon Prime"];

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
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function togglePlatform(platform) {
    setPlatforms((current) =>
      current.includes(platform)
        ? current.filter((p) => p !== platform)
        : [...current, platform]
    );
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

    const { error: saveError } = await supabase.from("shows").insert({
      title: title.trim(),
      platforms: allPlatforms,
      genre: genre.trim() || null,
      synopsis: synopsis.trim() || null,
      tomatometer: tomatometer ? Number(tomatometer) : null,
      popcornmeter: popcornmeter ? Number(popcornmeter) : null,
      link_url: linkUrl.trim() || null,
    });

    setSaving(false);

    if (saveError) {
      setError("Couldn't save that show — try again in a moment.");
      console.error(saveError);
      return;
    }

    router.push("/");
  }

  return (
    <div className="page">
      <div className="topbar">
        <h1>Add a show</h1>
      </div>

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
          <label htmlFor="tomatometer">Tomatometer score</label>
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
          <label htmlFor="popcornmeter">Popcornmeter score</label>
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
