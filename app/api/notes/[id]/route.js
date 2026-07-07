import { NextResponse } from "next/server";
import { getNote, updateNote, deleteNote } from "@/lib/notes";

// GET /api/notes/:id -> return a single note
export async function GET(request, { params }) {
  const { id } = await params;
  const note = getNote(id);
  if (!note) {
    return NextResponse.json({ error: "Note not found." }, { status: 404 });
  }
  return NextResponse.json(note);
}

// PUT /api/notes/:id -> update an existing note
export async function PUT(request, { params }) {
  const { id } = await params;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const note = updateNote(id, {
    title: body.title,
    content: body.content,
  });

  if (!note) {
    return NextResponse.json({ error: "Note not found." }, { status: 404 });
  }
  return NextResponse.json(note);
}

// DELETE /api/notes/:id -> remove a note
export async function DELETE(request, { params }) {
  const { id } = await params;
  const removed = deleteNote(id);
  if (!removed) {
    return NextResponse.json({ error: "Note not found." }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
