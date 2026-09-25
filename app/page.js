"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useIdentity } from "@/lib/identity";
import { useShowsAndRatings } from "@/lib/useShowsAndRatings";
import ShowRow from "@/components/ShowRow";
import SwipeActions from "@/components/SwipeActions";
import { sortFamilyView } from "@/lib/sorting";

export default function FamilyView() {
  const router = useRouter();
  const name = useIdentity();
  const { shows, ratings, loading, refresh } = useShowsAndRatings();
  const [unratedOnly, setUnratedOnly] = useState(false);
  const [watchedCount, setWatchedCount] = useState(0);

  useEffect(() => {
    async function loadWatchedCount() {
      const response = await fetch("/api/shows?status=watched");
      const data = await response.json();
      if (!response.ok) {
        console.error("Failed to load watched count:", data.error);
        return;
      }
      setWatchedCount(data.shows?.length || 0);
    }
    loadWatchedCount();
  }, [shows]);

  async function handleDelete(showId) {
    const response = await fetch(`/api/shows/${showId}`, { method: "DELETE" });
    if (!response.ok) console.error("Failed to delete show:", await response.json());
    refresh();
  }

  async function handleMarkWatched(showId) {
    const response = await fetch(`/api/shows/${showId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "watched" }),
    });
    if (!response.ok) console.error("Failed to mark show watched:", await response.json());
    refresh();
  }

  function ratingsForShow(showId) {
    return ratings.filter((r) => r.show_id === showId);
  }

  const sortedShows = sortFamilyView(shows, ratings);
  const visibleShows = unratedOnly
    ? sortedShows.filter(
        (show) => !ratings.some((r) => r.show_id === show.id && r.person === name)
      )
    : sortedShows;

  return (
    <div className="page">
      <div className="topbar">
        <h1>Family Queue</h1>
        <Link className="btn" href="/add">
          + Add new
        </Link>
      </div>

      <p style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <Link href="/personal" style={{ color: "var(--color-teal)", fontWeight: 600 }}>
          Switch to my Personal view →
        </Link>
        <Link href="/watched" style={{ color: "var(--color-text-muted)", fontSize: 14 }}>
          Watched ({watchedCount})
        </Link>
      </p>

      {!loading && shows.length > 0 && (
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
            fontSize: 14,
            color: "var(--color-text-muted)",
          }}
        >
          <input
            type="checkbox"
            checked={unratedOnly}
            onChange={() => setUnratedOnly((current) => !current)}
          />
          Show only unrated by me
        </label>
      )}

      {loading ? null : shows.length === 0 ? (
        <div className="empty-state">
          <p>
            Welcome to your shared video queue! This is an easy way for you
            and your friends/family to share shows that you are interested in
            and decide on what to watch next.
          </p>
          <Link className="btn" href="/add">
            Start by adding your first movie or show
          </Link>
        </div>
      ) : visibleShows.length === 0 ? (
        <p style={{ color: "var(--color-text-muted)" }}>
          Nothing left to rate — nice work!
        </p>
      ) : (
        visibleShows.map((show) => (
          <SwipeActions
            key={show.id}
            onDelete={() => handleDelete(show.id)}
            onMarkWatched={() => handleMarkWatched(show.id)}
            onTap={() => router.push(`/show/${show.id}`)}
          >
            <ShowRow show={show} ratings={ratingsForShow(show.id)} />
          </SwipeActions>
        ))
      )}
    </div>
  );
}
