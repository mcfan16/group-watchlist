"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const POLL_INTERVAL_MS = 10000;

export function useShowsAndRatings() {
  const [shows, setShows] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return { shows, ratings, loading, refresh: loadData };
}
