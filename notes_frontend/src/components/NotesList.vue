<template>
  <div class="list">
    <div class="scroll">
      <div v-if="loading" class="loading">
        <div class="spinner" />
        <span>Loading notes...</span>
      </div>

      <div v-else>
        <div v-if="!notes.length" class="empty">
          <p>No notes found.</p>
        </div>

        <ul v-else class="items">
          <li
            v-for="n in notes"
            :key="n.id"
            class="item"
            :class="{ active: n.id === selectedId }"
            role="button"
            @click="$emit('select', n.id)"
          >
            <div class="meta">
              <h4 class="title">{{ n.title || "Untitled" }}</h4>
              <time class="time">
                {{ formatDate(n.updatedAt || n.createdAt) }}
              </time>
            </div>
            <p class="preview">{{ n.content?.slice(0, 120) }}</p>

            <button
              class="delete"
              aria-label="Delete note"
              title="Delete"
              @click.stop="$emit('delete', n.id)"
            >
              🗑️
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface NoteListItem {
  id: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

defineProps<{
  notes: NoteListItem[];
  loading: boolean;
  selectedId: string | null;
}>();

defineEmits<{
  (e: "select", id: string): void;
  (e: "delete", id: string): void;
}>();

function formatDate(s?: string) {
  if (!s) return "";
  try {
    const d = new Date(s);
    return d.toLocaleString();
  } catch {
    return s;
  }
}
</script>

<style scoped>
.list {
  height: calc(100vh - 84px);
  overflow: hidden;
}
.scroll {
  height: 100%;
  overflow: auto;
  padding: 8px 4px 24px 2px;
}
.loading {
  display: grid;
  place-items: center;
  gap: 8px;
  color: #7f8c8d;
  height: 180px;
}
.spinner {
  width: 22px;
  height: 22px;
  border: 3px solid rgba(0, 0, 0, 0.08);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty {
  display: grid;
  place-items: center;
  color: #95a5a6;
  padding: 28px 8px;
  font-size: 14px;
}

.items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}

.item {
  position: relative;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  box-shadow: var(--shadow-1);
  transition: box-shadow 0.2s ease, transform 0.04s ease, border 0.2s ease;
}
.item:hover {
  box-shadow: var(--shadow-2);
  transform: translateY(-1px);
  border-color: rgba(79, 142, 247, 0.45);
}
.item.active {
  border-color: var(--color-primary);
  outline: 2px solid rgba(79, 142, 247, 0.15);
}

.meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}
.title {
  margin: 0;
  font-size: 14px;
  color: var(--color-secondary);
  font-weight: 700;
}
.time {
  color: #95a5a6;
  font-size: 12px;
}
.preview {
  margin: 6px 0 0;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.45;
}

.delete {
  position: absolute;
  right: 8px;
  top: 8px;
  border: none;
  background: transparent;
  color: #bdc3c7;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 8px;
  display: none;
}
.item:hover .delete {
  display: inline-block;
}
.delete:hover {
  background: #fff4f4;
  color: #e74c3c;
}
</style>
