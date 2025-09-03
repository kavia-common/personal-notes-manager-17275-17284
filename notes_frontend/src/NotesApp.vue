<template>
  <div class="app">
    <!-- Top Navigation -->
    <header class="topbar">
      <div class="brand">
        <span class="logo">📝</span>
        <span class="title">Notes</span>
      </div>

      <div class="actions">
        <div class="search">
          <span class="icon">🔍</span>
          <input
            v-model="query"
            type="text"
            placeholder="Search notes..."
            aria-label="Search notes"
            @input="onSearch"
          />
          <button
            v-if="query"
            class="clear"
            aria-label="Clear search"
            @click="clearSearch"
          >
            ✕
          </button>
        </div>

        <button class="new-btn" aria-label="Create new note" @click="newNote">
          <span class="plus">＋</span>
          <span class="label">New</span>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="content">
      <aside class="sidebar" :class="{ hidden: isMobile && showEditor }">
        <NotesList
          :notes="filteredNotes"
          :loading="loading"
          :selected-id="selectedId"
          @select="selectNote"
          @delete="deleteNote"
        />
      </aside>

      <section class="editor" :class="{ hidden: isMobile && !showEditor }">
        <NoteEditor
          v-if="currentNote"
          :note="currentNote"
          :saving="saving"
          @save="saveNote"
          @cancel="cancelEdit"
        />
        <div v-else class="placeholder">
          <div class="ph-card">
            <h2>No note selected</h2>
            <p>
              Select a note from the list or create a new one to get started.
            </p>
            <button class="new-btn ph" @click="newNote">Create a note</button>
          </div>
        </div>
      </section>
    </main>

    <!-- Floating Action Button -->
    <button class="fab" aria-label="Add note" @click="newNote">＋</button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import NotesList from "./components/NotesList.vue";
import NoteEditor from "./components/NoteEditor.vue";
import { useNotesStore } from "./store/notes";
import { useMedia } from "./composables/useMedia";

const store = useNotesStore();
const query = ref(store.search);
const selectedId = ref<string | null>(null);
const showEditor = ref(false);

const { isMobile } = useMedia();

const loading = computed(() => store.loading);
const saving = computed(() => store.saving);
const filteredNotes = computed(() => store.filteredNotes);
const currentNote = computed(
  () => store.notes.find((n) => n.id === selectedId.value) || null
);

function onSearch() {
  store.setSearch(query.value);
}

function clearSearch() {
  query.value = "";
  store.setSearch("");
}

function selectNote(id: string) {
  selectedId.value = id;
  if (isMobile.value) showEditor.value = true;
}

async function newNote() {
  const created = await store.createNote({
    title: "",
    content: "",
  });
  selectedId.value = created.id;
  if (isMobile.value) showEditor.value = true;
}

async function saveNote(payload: {
  id: string;
  title: string;
  content: string;
}) {
  await store.updateNote(payload.id, {
    title: payload.title,
    content: payload.content,
  });
}

async function deleteNote(id: string) {
  if (!confirm("Delete this note?")) return;
  await store.deleteNote(id);
  if (selectedId.value === id) {
    selectedId.value = null;
    showEditor.value = false;
  }
}

function cancelEdit() {
  if (isMobile.value) showEditor.value = false;
}

onMounted(() => {
  store.fetchNotes();
});

watch(
  () => store.notes.length,
  (len) => {
    if (len === 0) selectedId.value = null;
  }
);
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Topbar */
.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  background: var(--bg-light);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: var(--shadow-1);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--color-primary);
  color: white;
  font-size: 18px;
  box-shadow: 0 6px 16px rgba(79, 142, 247, 0.35);
}
.title {
  font-weight: 700;
  color: var(--color-secondary);
  font-size: 18px;
}

/* Search */
.actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f5f7fb;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}
.search input {
  border: none;
  background: transparent;
  outline: none;
  min-width: 200px;
  color: var(--color-secondary);
}
.search .icon {
  color: #7f8c8d;
  font-size: 14px;
}
.search .clear {
  border: none;
  background: transparent;
  color: #95a5a6;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 8px;
}
.search .clear:hover {
  color: var(--color-secondary);
}

/* New button */
.new-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(79, 142, 247, 0.35);
  transition: transform 0.08s ease, box-shadow 0.2s ease;
}
.new-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 28px rgba(79, 142, 247, 0.45);
}
.new-btn .plus {
  font-size: 18px;
  line-height: 1;
}
.new-btn.ph {
  background: var(--color-accent);
  color: #2c3e50;
  box-shadow: 0 10px 24px rgba(241, 196, 15, 0.35);
}

/* Content Layout */
.content {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 16px;
  padding: 16px;
}

.sidebar,
.editor {
  background: var(--bg-light);
}

.sidebar {
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  padding-right: 6px;
  overflow: hidden;
}

.editor {
  min-height: calc(100vh - 84px);
}

.placeholder {
  height: 100%;
  display: grid;
  place-items: center;
  padding: 24px;
}
.ph-card {
  text-align: center;
  max-width: 520px;
  padding: 24px;
  border-radius: var(--radius);
  border: 1px dashed rgba(0, 0, 0, 0.12);
}

/* FAB */
.fab {
  position: fixed;
  right: 20px;
  bottom: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: var(--color-accent);
  color: #2c3e50;
  font-size: 28px;
  box-shadow: var(--shadow-2);
  cursor: pointer;
  transition: transform 0.1s ease;
}
.fab:hover {
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 900px) {
  .content {
    grid-template-columns: 1fr;
  }

  .sidebar.hidden,
  .editor.hidden {
    display: none;
  }

  .search input {
    min-width: 140px;
    width: 140px;
  }
}
</style>
