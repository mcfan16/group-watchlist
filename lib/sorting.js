function statsFor(show, ratings) {
  const showRatings = ratings.filter((r) => r.show_id === show.id);
  if (showRatings.length === 0) return null;

  const stars = showRatings.map((r) => r.stars);
  const min = Math.min(...stars);
  const avg = stars.reduce((sum, s) => sum + s, 0) / stars.length;
  return { min, avg };
}

// Highest predicted agreement first: lowest individual rating wins the
// comparison (one holdout sinks a show), ties broken by average rating,
// and anything with zero ratings sinks to the very bottom.
export function sortFamilyView(shows, ratings) {
  return [...shows].sort((a, b) => {
    const statsA = statsFor(a, ratings);
    const statsB = statsFor(b, ratings);

    if (!statsA && !statsB) return 0;
    if (!statsA) return 1;
    if (!statsB) return -1;
    if (statsB.min !== statsA.min) return statsB.min - statsA.min;
    return statsB.avg - statsA.avg;
  });
}
