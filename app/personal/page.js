"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useIdentity } from "@/lib/identity";
import { useShowsAndRatings } from "@/lib/useShowsAndRatings";
import ShowRow from "@/components/ShowRow";
import SwipeActions from "@/components/SwipeActions";
import { sortPersonalView } from "@/lib/sorting";

export default function PersonalView() {
  const router = useRouter();
  const name = useIdentity();
  const { shows, ratings, loading, refresh } = useShowsAndRatings();

  async function handleDelete(showId) {
    const { error } = await supabase.from("shows").delete().eq("id", showId);
    if (error) console.error("Failed to delete show:", error);
    refresh();
  }

  async function handleMarkWatched(showId) {
    const { error } = await supabase
      .from("shows")
      .update({ status: "watched" })
      .eq("id", showId);
    if (error) console.error("Failed to mark show watched:", error);
    refresh();
  }

  function ratingsForShow(showId) {
    return ratings.filter((r) => r.show_id === showId);
  }

  const personalShows = sortPersonalView(shows, ratings, name);

  return (
    <div className="page">
      <div className="topbar">
        <h1>My Personal Picks</h1>
        <Link className="btn" href="/add">
          + Add new
        </Link>
      </div>

      <p style={{ marginBottom: 16 }}>
        <Link href="/" style={{ color: "var(--color-teal)", fontWeight: 600 }}>
          ← Back to Family Queue
        </Link>
      </p>

      {loading ? null : personalShows.length === 0 ? (
        <p style={{ color: "var(--color-text-muted)" }}>
          Nothing here yet — this fills up once you've rated something 4 or 5
          stars.
        </p>
      ) : (
        personalShows.map((show) => (
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
