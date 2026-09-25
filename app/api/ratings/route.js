import { supabase } from "@/lib/supabase";

export async function POST(request) {
  const body = await request.json();
  const { show_id, person, stars } = body;

  if (!show_id || !person || !stars) {
    return Response.json({ error: "Missing rating fields." }, { status: 400 });
  }

  const { error } = await supabase
    .from("ratings")
    .upsert(
      { show_id, person, stars, updated_at: new Date().toISOString() },
      { onConflict: "show_id,person" }
    );

  if (error) {
    console.error("Failed to save rating:", error);
    return Response.json({ error: "Couldn't save that rating." }, { status: 500 });
  }

  return Response.json({ ok: true });
}
