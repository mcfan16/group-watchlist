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

// Solo picks: shows the current person rated 4 or 5 stars, that at least one
// other family member has also rated (so "nobody's rated it" never counts as
// a safe solo pick), sorted by how little the rest of the family wants it —
// lowest average from everyone else first, since that's the safest solo bet.
export function sortPersonalView(shows, ratings, person) {
  const eligible = shows.filter((show) => {
    const myRating = ratings.find((r) => r.show_id === show.id && r.person === person);
    if (!myRating || myRating.stars < 4) return false;
    return otherRatings(show, ratings, person).length > 0;
  });

  return eligible.sort((a, b) => {
    const othersA = otherRatings(a, ratings, person).map((r) => r.stars);
    const othersB = otherRatings(b, ratings, person).map((r) => r.stars);
    const avgA = othersA.reduce((sum, s) => sum + s, 0) / othersA.length;
    const avgB = othersB.reduce((sum, s) => sum + s, 0) / othersB.length;
    if (avgA !== avgB) return avgA - avgB;

    const myA = ratings.find((r) => r.show_id === a.id && r.person === person).stars;
    const myB = ratings.find((r) => r.show_id === b.id && r.person === person).stars;
    return myB - myA;
  });
}
