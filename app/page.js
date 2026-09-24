"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useIdentity } from "@/lib/identity";
import ShowRow from "@/components/ShowRow";
import { sortFamilyView } from "@/lib/sorting";

const POLL_INTERVAL_MS = 10000;

export default function FamilyView() {
  const name = useIdentity();
  const [shows, setShows] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unratedOnly, setUnratedOnly] = useState(false);

  const loadData = useCallback(async () => {
    const [showsResult, ratingsResult] = await Promise.all([
      supabase.from("shows").select("*").eq("status", "queued"),
      supabase.from("ratings").select("*"),
    ]);

    if (showsResult.error) console.error("Failed to load shows:", showsResult.error);
    if (ratingsResult.error) console.error("Failed to load ratings:", ratingsResult.error);

    setShows(showsResult.data || []);
    setRatings(ratingsResult.data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [loadData]);

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
          <ShowRow key={show.id} show={show} ratings={ratingsForShow(show.id)} />
        ))
      )}
    </div>
  );
}
