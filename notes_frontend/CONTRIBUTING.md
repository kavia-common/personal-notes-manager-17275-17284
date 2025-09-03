# Contributing Notes

Development:
- Run `pnpm dev` to start Slidev at http://localhost:3030 (or per vite.config.ts).
- The app is mounted within slides.md as a single-page app.

API:
- Set VITE_NOTES_API_BASE in `.env` to point to the notes_database REST API.
- Expected endpoints:
  - GET    /notes
  - POST   /notes         { title, content }
  - PUT    /notes/:id     { title, content }
  - DELETE /notes/:id

Styling:
- Colors from palette:
  - Primary:  #4F8EF7
  - Secondary:#34495E
  - Accent:   #F1C40F
- Keep a minimal, modern aesthetic with soft shadows and rounded corners.
