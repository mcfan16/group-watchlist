import { supabase } from "@/lib/supabase";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "queued";

  const { data: shows, error: showsError } = await supabase
    .from("shows")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (showsError) {
    console.error("Failed to load shows:", showsError);
    return Response.json({ error: "Couldn't load shows." }, { status: 500 });
  }

  const { data: ratings, error: ratingsError } = await supabase
    .from("ratings")
    .select("*");

  if (ratingsError) {
    console.error("Failed to load ratings:", ratingsError);
    return Response.json({ error: "Couldn't load ratings." }, { status: 500 });
  }

  return Response.json({ shows, ratings });
}

export async function POST(request) {
  const body = await request.json();

  if (!body.title || !body.title.trim()) {
    return Response.json({ error: "A title is required." }, { status: 400 });
  }

  const { error } = await supabase.from("shows").insert({
    title: body.title.trim(),
    platforms: body.platforms || [],
    genre: body.genre || null,
    synopsis: body.synopsis || null,
    tomatometer: body.tomatometer ?? null,
    popcornmeter: body.popcornmeter ?? null,
    link_url: body.link_url || null,
    cover_image_url: body.cover_image_url || null,
  });

  if (error) {
    console.error("Failed to save show:", error);
    return Response.json({ error: "Couldn't save that show." }, { status: 500 });
  }

  return Response.json({ ok: true });
}
