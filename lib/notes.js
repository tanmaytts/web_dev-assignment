// In-memory store for notes. This lives on the server for the lifetime of the
// running process. No database is used, so restarting the server resets the data.
//
// A global is used so the same store survives module reloads during development.

function createStore() {
  return {
    notes: [
      {
        id: "1",
        title: "Welcome to your Notes App",
        content: "Create, edit, and delete notes. Everything is stored in memory on the server.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    nextId: 2,
  };
}

const store = globalThis.__notesStore ?? (globalThis.__notesStore = createStore());

export function getAllNotes() {
  return [...store.notes].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );
}

export function getNote(id) {
  return store.notes.find((note) => note.id === id) ?? null;
}

export function createNote({ title, content }) {
  const now = new Date().toISOString();
  const note = {
    id: String(store.nextId++),
    title: title.trim(),
    content: content.trim(),
    createdAt: now,
    updatedAt: now,
  };
  store.notes.push(note);
  return note;
}

export function updateNote(id, { title, content }) {
  const note = getNote(id);
  if (!note) {
    return null;
  }
  if (typeof title === "string") {
    note.title = title.trim();
  }
  if (typeof content === "string") {
    note.content = content.trim();
  }
  note.updatedAt = new Date().toISOString();
  return note;
}

export function deleteNote(id) {
  const index = store.notes.findIndex((note) => note.id === id);
  if (index === -1) {
    return false;
  }
  store.notes.splice(index, 1);
  return true;
}
