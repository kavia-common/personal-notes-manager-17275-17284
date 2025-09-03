# Notes Frontend (Slidev)

A modern, minimalistic Slidev-based web app to manage personal notes.

Features:
- Create, edit, delete notes
- List and search notes
- Responsive design with top nav, main content area, and floating action button
- Light theme using colors: Primary #4F8EF7, Secondary #34495E, Accent #F1C40F

Tech:
- Slidev (Vite + Vue 3)
- Simple reactive store
- REST API client to the notes_database service

Getting Started:
1. Install dependencies
   - pnpm install
2. Run in dev
   - pnpm dev
   - Open http://localhost:3030
3. Build for production
   - pnpm build

Configuration:
- Copy .env.example to .env and set:
  - VITE_NOTES_API_BASE="http://localhost:4000" (or your gateway)  
    Defaults to "/api" if not provided.

REST API Assumptions:
- GET    {API_BASE}/notes
- POST   {API_BASE}/notes            body: { title, content }
- PUT    {API_BASE}/notes/:id        body: { title, content }
- DELETE {API_BASE}/notes/:id

Structure:
- slides.md              -> mounts the NotesApp shell
- src/NotesApp.vue       -> layout, search, fab, wiring
- src/components/*.vue   -> NotesList & NoteEditor
- src/store/notes.ts     -> reactive store for CRUD and filtering
- src/utils/api.ts       -> API client

Notes:
- This is a SPA embedded into Slidev's first slide. The rest of Slidev's default demo content has been replaced to focus on the app UI.
- Styling sticks to minimal shapes, soft shadows, and the provided palette.
