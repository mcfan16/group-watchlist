"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ShowRow from "@/components/ShowRow";

export default function FamilyView() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShows() {
      const { data, error } = await supabase
        .from("shows")
        .select("*")
        .eq("status", "queued");

      if (error) {
        console.error("Failed to load shows:", error);
      } else {
        setShows(data);
      }
      setLoading(false);
    }

    loadShows();
  }, []);

  return (
    <div className="page">
      <div className="topbar">
        <h1>Family Queue</h1>
        <Link className="btn" href="/add">
          + Add new
        </Link>
      </div>

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
      ) : (
        shows.map((show) => <ShowRow key={show.id} show={show} />)
      )}
    </div>
  );
}
