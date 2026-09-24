const BROWSER_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const ICON_PLATFORM_MAP = [
  [/disney/i, "Disney+"],
  [/netflix/i, "Netflix"],
  [/hulu/i, "Hulu"],
  [/amazon|prime/i, "Amazon Prime"],
  [/hbo|max/i, "Max"],
  [/peacock/i, "Peacock"],
  [/paramount/i, "Paramount+"],
  [/apple/i, "Apple TV+"],
  [/youtube/i, "YouTube"],
];

const GENERIC_AFFILIATE_TEXT = ["stream", "rent", "buy", "watch"];

function extractJsonById(html, id) {
  const match = html.match(new RegExp(`<script[^>]*id="${id}"[^>]*>([\\s\\S]*?)</script>`));
  if (!match) return null;
  try {
    return JSON.parse(match[1].trim());
  } catch {
    return null;
  }
}

function extractPlatforms(whereToWatch) {
  if (!whereToWatch?.affiliates) return [];
  const names = new Set();
  for (const affiliate of whereToWatch.affiliates) {
    const mapped = ICON_PLATFORM_MAP.find(([pattern]) => pattern.test(affiliate.icon || ""));
    if (mapped) {
      names.add(mapped[1]);
    } else if (affiliate.text && !GENERIC_AFFILIATE_TEXT.includes(affiliate.text.toLowerCase())) {
      names.add(affiliate.text);
    }
  }
  return [...names];
}

export async function POST(request) {
  const { url } = await request.json();

  if (!url || !url.includes("rottentomatoes.com")) {
    return Response.json(
      { error: "That doesn't look like a Rotten Tomatoes link." },
      { status: 400 }
    );
  }

  let html;
  try {
    const pageResponse = await fetch(url, {
      headers: { "User-Agent": BROWSER_USER_AGENT },
    });
    if (!pageResponse.ok) {
      return Response.json(
        { error: "Couldn't reach that page — check the link and try again." },
        { status: 502 }
      );
    }
    html = await pageResponse.text();
  } catch (err) {
    console.error("Failed to fetch Rotten Tomatoes page:", err);
    return Response.json(
      { error: "Couldn't reach that page — check the link and try again." },
      { status: 502 }
    );
  }

  const hero = extractJsonById(html, "media-hero-json");
  const scorecard = extractJsonById(html, "media-scorecard-json");
  const whereToWatch = extractJsonById(html, "where-to-watch-json");

  if (!hero && !scorecard) {
    return Response.json(
      { error: "Couldn't find show details on that page." },
      { status: 422 }
    );
  }

  return Response.json({
    title: hero?.content?.title || null,
    genre: hero?.content?.metadataGenres?.join(", ") || null,
    cover_image_url: hero?.content?.posterSrc || null,
    synopsis: scorecard?.description || null,
    tomatometer: scorecard?.criticsScore?.score != null ? Number(scorecard.criticsScore.score) : null,
    popcornmeter: scorecard?.audienceScore?.score != null ? Number(scorecard.audienceScore.score) : null,
    platforms: extractPlatforms(whereToWatch),
    link_url: url,
  });
}
