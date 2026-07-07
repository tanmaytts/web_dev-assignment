"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state, shared between creating a new note and editing an existing one.
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const isEditing = editingId !== null;

  // Read: load every note from the backend when the page mounts.
  async function loadNotes() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/notes");
      if (!res.ok) {
        throw new Error("Could not load notes.");
      }
      setNotes(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

  function resetForm() {
    setTitle("");
    setContent("");
    setEditingId(null);
  }

  // Create or Update, depending on whether a note is being edited.
  async function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim() && !content.trim()) {
      setError("A note needs a title or some content.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const res = await fetch(
        isEditing ? `/api/notes/${editingId}` : "/api/notes",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content }),
        }
      );
      if (!res.ok) {
        throw new Error("Could not save the note.");
      }
      resetForm();
      await loadNotes();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function startEditing(note) {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setError("");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // Delete a note the user no longer needs.
  async function handleDelete(id) {
    setError("");
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Could not delete the note.");
      }
      if (editingId === id) {
        resetForm();
      }
      await loadNotes();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Notes App</h1>
        <p className="mt-1 text-sm text-slate-500">
          A full-stack notes manager built with Next.js API Routes and Tailwind CSS.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <h2 className="mb-4 text-lg font-semibold">
          {isEditing ? "Edit note" : "Create a note"}
        </h2>

        <label className="mb-3 block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your note a title"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </label>

        <label className="mb-4 block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Content</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write something worth remembering"
            rows={4}
            className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </label>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : isEditing ? "Update note" : "Add note"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold">
          Your notes{!loading && ` (${notes.length})`}
        </h2>

        {loading ? (
          <p className="text-sm text-slate-500">Loading notes...</p>
        ) : notes.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
            No notes yet. Create your first one above.
          </p>
        ) : (
          <ul className="space-y-3">
            {notes.map((note) => (
              <li
                key={note.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">
                      {note.title || "Untitled note"}
                    </h3>
                    {note.content && (
                      <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-600">
                        {note.content}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => startEditing(note)}
                      className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
