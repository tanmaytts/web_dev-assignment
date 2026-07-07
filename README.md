# Notes App

A full-stack Notes App built with **Next.js** and **Tailwind CSS**. It shows how
Next.js unifies the frontend and backend in a single project: the React UI and the
API Routes that serve it live side by side, and all four CRUD operations (Create,
Read, Update, Delete) run through those built-in API Routes.

## Features

- Create a new note with a title and content
- View all saved notes on the home page
- Edit an existing note
- Delete a note you no longer need
- Data is stored in-memory on the server (no database required)
- The frontend communicates with the backend exclusively through Next.js API Routes

## How it works

```
User interacts with UI
        v
React component (frontend) sends fetch request
        v
Next.js API Route (backend) handles the request
        v
In-memory store is read or updated
        v
API Route returns JSON response
        v
React updates the UI
```

## Project structure

```
app/
  api/
    notes/
      route.js        GET (list) and POST (create)
      [id]/
        route.js      GET (one), PUT (update), DELETE
  globals.css         Tailwind styles
  layout.js           Root layout
  page.js             Notes UI (client component)
lib/
  notes.js            In-memory store and CRUD helpers
```

## API Routes

| Method | Path             | Description         |
| ------ | ---------------- | ------------------- |
| GET    | /api/notes       | List every note     |
| POST   | /api/notes       | Create a new note   |
| GET    | /api/notes/:id   | Get a single note   |
| PUT    | /api/notes/:id   | Update a note       |
| DELETE | /api/notes/:id   | Delete a note       |

## Getting started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Notes on storage

All notes are held in memory on the server, so the data resets whenever the server
restarts. This keeps the project focused on how Next.js API Routes and CRUD work,
without the extra setup of a database.
