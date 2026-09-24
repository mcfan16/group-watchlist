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

function otherRatings(show, ratings, person) {
  return ratings.filter((r) => r.show_id === show.id && r.person !== person);
}

const NEUTRAL_AVERAGE = 3;

// Solo picks: shows the current person rated 4 or 5 stars, sorted by how
// little the rest of the family wants it — lowest average from everyone
// else first, since that's the safest solo bet. A show nobody else has
// rated yet is treated as a neutral 3 for this sort, so it naturally lands
// between "family doesn't want it" (below 3) and "family also likes it"
// (above 3) instead of being excluded outright.
export function sortPersonalView(shows, ratings, person) {
  const eligible = shows.filter((show) => {
    const myRating = ratings.find((r) => r.show_id === show.id && r.person === person);
    return myRating && myRating.stars >= 4;
  });

  function othersAverage(show) {
    const others = otherRatings(show, ratings, person).map((r) => r.stars);
    if (others.length === 0) return NEUTRAL_AVERAGE;
    return others.reduce((sum, s) => sum + s, 0) / others.length;
  }

  return eligible.sort((a, b) => {
    const avgA = othersAverage(a);
    const avgB = othersAverage(b);
    if (avgA !== avgB) return avgA - avgB;

    const myA = ratings.find((r) => r.show_id === a.id && r.person === person).stars;
    const myB = ratings.find((r) => r.show_id === b.id && r.person === person).stars;
    return myB - myA;
  });
}
