import { NextResponse } from "next/server";
import { getAllNotes, createNote } from "@/lib/notes";

// GET /api/notes -> return every saved note
export async function GET() {
  return NextResponse.json(getAllNotes());
}

// POST /api/notes -> create a new note from a title and content
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";

  if (!title && !content) {
    return NextResponse.json(
      { error: "A note needs a title or some content." },
      { status: 400 }
    );
  }

  const note = createNote({ title, content });
  return NextResponse.json(note, { status: 201 });
}
