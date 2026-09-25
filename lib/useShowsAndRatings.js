"use client";

import { useCallback, useEffect, useState } from "react";

const POLL_INTERVAL_MS = 10000;

export function useShowsAndRatings() {
  const [shows, setShows] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const response = await fetch("/api/shows?status=queued");
      const data = await response.json();
      if (!response.ok) {
        console.error("Failed to load shows:", data.error);
      } else {
        setShows(data.shows || []);
        setRatings(data.ratings || []);
      }
    } catch (err) {
      console.error("Failed to load shows:", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [loadData]);

  return { shows, ratings, loading, refresh: loadData };
}
