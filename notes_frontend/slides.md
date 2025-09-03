---
theme: default
title: Notes
layout: cover
class: text-left
info: |
  Minimal Slidev-based Notes Manager
  - Create, edit, delete, and search notes
  - Responsive layout with top nav, main content, and FAB
  - Consumes notes_database REST API
transition: slide-left
mdc: true
drawings:
  persist: false
---

<!-- App Shell -->
<script setup lang="ts">
import NotesApp from './src/NotesApp.vue'
</script>

<NotesApp />

<style>
:root {
  --color-primary: #4F8EF7;
  --color-secondary: #34495E;
  --color-accent: #F1C40F;

  --bg-light: #ffffff;
  --text-color: #2c3e50;

  --radius: 12px;
  --shadow-1: 0 2px 10px rgba(0,0,0,0.06);
  --shadow-2: 0 8px 24px rgba(0,0,0,0.12);
}

/* Reset and base */
body, .slidev-layout, .slidev-page {
  background: var(--bg-light) !important;
  color: var(--text-color);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
}

a {
  color: var(--color-primary);
  text-decoration: none;
}

button {
  outline: none;
}

.slidev-layout.cover {
  padding: 0 !important;
}
</style>
