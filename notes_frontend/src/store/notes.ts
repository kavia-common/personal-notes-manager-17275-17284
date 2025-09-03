import { reactive, computed } from "vue";
import { notesApi } from "../utils/api";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

interface NewNotePayload {
  title: string;
  content: string;
}

const state = reactive({
  notes: [] as Note[],
  loading: false,
  saving: false,
  search: "",
});

/**
 * PUBLIC_INTERFACE
 * Create and access the notes store.
 */
export function useNotesStore() {
  /**
   * PUBLIC_INTERFACE
   * Fetch all notes from the API and populate the store.
   */
  async function fetchNotes() {
    state.loading = true;
    try {
      const data = await notesApi.list();
      state.notes = data;
    } catch (e) {
      console.error("Failed to fetch notes", e);
    } finally {
      state.loading = false;
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Create a new note and insert it at the top of the list.
   */
  async function createNote(payload: NewNotePayload) {
    state.saving = true;
    try {
      const created = await notesApi.create(payload);
      state.notes.unshift(created);
      return created;
    } finally {
      state.saving = false;
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Update an existing note and replace it in the list.
   */
  async function updateNote(id: string, payload: NewNotePayload) {
    state.saving = true;
    try {
      const updated = await notesApi.update(id, payload);
      const idx = state.notes.findIndex((n) => n.id === id);
      if (idx >= 0) state.notes[idx] = updated;
      return updated;
    } finally {
      state.saving = false;
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Delete a note by id and remove it from the list.
   */
  async function deleteNote(id: string) {
    try {
      await notesApi.remove(id);
      const idx = state.notes.findIndex((n) => n.id === id);
      if (idx >= 0) state.notes.splice(idx, 1);
    } catch (e) {
      console.error("Failed to delete note", e);
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Update the search query for client-side filtering.
   */
  function setSearch(q: string) {
    state.search = q;
  }

  const filteredNotes = computed(() => {
    const q = state.search.trim().toLowerCase();
    if (!q) return state.notes;
    return state.notes.filter(
      (n) =>
        (n.title || "").toLowerCase().includes(q) ||
        (n.content || "").toLowerCase().includes(q)
    );
  });

  return {
    // state
    notes: state.notes as Note[],
    get loading() {
      return state.loading;
    },
    get saving() {
      return state.saving;
    },
    get search() {
      return state.search;
    },

    // getters
    filteredNotes,

    // actions
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    setSearch,
  };
}
