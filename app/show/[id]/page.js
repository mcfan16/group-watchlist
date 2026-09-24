"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useIdentity } from "@/lib/identity";
import StarRating from "@/components/StarRating";

export default function ShowDetail() {
  const { id } = useParams();
  const router = useRouter();
  const name = useIdentity();
  const [show, setShow] = useState(null);
  const [myRating, setMyRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!name) return;

    async function load() {
      const { data: showData, error: showError } = await supabase
        .from("shows")
        .select("*")
        .eq("id", id)
        .single();

      if (showError) {
        console.error("Failed to load show:", showError);
        setLoading(false);
        return;
      }
      setShow(showData);

      const { data: ratingData } = await supabase
        .from("ratings")
        .select("stars")
        .eq("show_id", id)
        .eq("person", name)
        .maybeSingle();

      if (ratingData) setMyRating(ratingData.stars);
      setLoading(false);
    }

    load();
  }, [id, name]);

  async function handleSubmit() {
    setSubmitting(true);
    const { error } = await supabase
      .from("ratings")
      .upsert(
        { show_id: id, person: name, stars: myRating, updated_at: new Date().toISOString() },
        { onConflict: "show_id,person" }
      );
    setSubmitting(false);

    if (error) {
      console.error("Failed to save rating:", error);
      return;
    }
    router.push("/");
  }

  if (loading) return null;
  if (!show) {
    return (
      <div className="page">
        <p>Couldn&apos;t find that show.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <Link href="/">&larr; Back to queue</Link>

      <div className="topbar" style={{ marginTop: 16 }}>
        <h1>{show.title}</h1>
      </div>

      {show.cover_image_url ? (
        <img
          className="cover"
          src={show.cover_image_url}
          alt={show.title}
          style={{ width: 120, height: 180, marginBottom: 16 }}
        />
      ) : (
        <div
          className="cover-placeholder"
          style={{ width: 120, height: 180, marginBottom: 16, fontSize: 36 }}
        >
          🎬
        </div>
      )}

      {show.platforms?.length > 0 && (
        <p>
          {show.platforms.map((platform) => (
            <span className="platform-badge" key={platform}>
              {platform}
            </span>
          ))}
        </p>
      )}

      {show.genre && (
        <p>
          <strong>Genre:</strong> {show.genre}
        </p>
      )}

      {show.synopsis && <p>{show.synopsis}</p>}

      {(show.tomatometer != null || show.popcornmeter != null) && (
        <p>
          {show.tomatometer != null && `🍅 ${show.tomatometer}%`}
          {show.tomatometer != null && show.popcornmeter != null && "   "}
          {show.popcornmeter != null && `🍿 ${show.popcornmeter}%`}
        </p>
      )}

      {show.link_url && (
        <p>
          <a href={show.link_url} target="_blank" rel="noopener noreferrer">
            View link ↗
          </a>
        </p>
      )}

      <div style={{ marginTop: 24 }}>
        <p style={{ fontWeight: 600, marginBottom: 8 }}>
          How interested are you in watching this?
        </p>
        <StarRating value={myRating} onChange={setMyRating} />
        <button
          className="btn"
          onClick={handleSubmit}
          disabled={myRating === 0 || submitting}
          style={{ marginTop: 16 }}
        >
          {submitting ? "Saving..." : "Submit rating"}
        </button>
      </div>
    </div>
  );
}
