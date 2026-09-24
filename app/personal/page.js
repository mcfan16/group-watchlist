"use client";

import Link from "next/link";
import { useIdentity } from "@/lib/identity";
import { useShowsAndRatings } from "@/lib/useShowsAndRatings";
import ShowRow from "@/components/ShowRow";
import { sortPersonalView } from "@/lib/sorting";

export default function PersonalView() {
  const name = useIdentity();
  const { shows, ratings, loading } = useShowsAndRatings();

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
          Nothing here yet — this fills up once you and someone else have both
          rated the same show, and you liked it more than they did.
        </p>
      ) : (
        personalShows.map((show) => (
          <ShowRow key={show.id} show={show} ratings={ratingsForShow(show.id)} />
        ))
      )}
    </div>
  );
}
