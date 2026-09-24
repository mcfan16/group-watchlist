"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ShowRow from "@/components/ShowRow";

export default function WatchedArchive() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("shows")
        .select("*")
        .eq("status", "watched")
        .order("created_at", { ascending: false });

      if (error) console.error("Failed to load watched shows:", error);
      setShows(data || []);
      setLoading(false);
    }

    load();
  }, []);

  return (
    <div className="page">
      <div className="topbar">
        <h1>Watched Archive</h1>
        <Link href="/" style={{ color: "var(--color-teal)", fontWeight: 600 }}>
          ← Back
        </Link>
      </div>

      {loading ? null : shows.length === 0 ? (
        <p style={{ color: "var(--color-text-muted)" }}>Nothing watched yet.</p>
      ) : (
        shows.map((show) => (
          <Link key={show.id} href={`/show/${show.id}`} className="row-gap">
            <ShowRow show={show} />
          </Link>
        ))
      )}
    </div>
  );
}
