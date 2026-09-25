import { supabase } from "@/lib/supabase";

export async function GET(request, { params }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const person = searchParams.get("person");

  const { data: show, error: showError } = await supabase
    .from("shows")
    .select("*")
    .eq("id", id)
    .single();

  if (showError) {
    console.error("Failed to load show:", showError);
    return Response.json({ error: "Couldn't find that show." }, { status: 404 });
  }

  let myRating = null;
  if (person) {
    const { data: ratingData } = await supabase
      .from("ratings")
      .select("stars")
      .eq("show_id", id)
      .eq("person", person)
      .maybeSingle();
    myRating = ratingData?.stars ?? null;
  }

  return Response.json({ show, myRating });
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();

  if (body.status !== "queued" && body.status !== "watched") {
    return Response.json({ error: "Invalid status." }, { status: 400 });
  }

  const { error } = await supabase
    .from("shows")
    .update({ status: body.status })
    .eq("id", id);

  if (error) {
    console.error("Failed to update show:", error);
    return Response.json({ error: "Couldn't update that show." }, { status: 500 });
  }

  return Response.json({ ok: true });
}

export async function DELETE(request, { params }) {
  const { id } = await params;

  const { error } = await supabase.from("shows").delete().eq("id", id);

  if (error) {
    console.error("Failed to delete show:", error);
    return Response.json({ error: "Couldn't delete that show." }, { status: 500 });
  }

  return Response.json({ ok: true });
}
