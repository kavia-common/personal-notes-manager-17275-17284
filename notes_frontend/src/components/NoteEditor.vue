<template>
  <div class="wrap">
    <div class="toolbar">
      <input
        v-model="local.title"
        type="text"
        placeholder="Title"
        class="title"
        aria-label="Note title"
      />

      <div class="spacer" />

      <button class="btn ghost" @click="$emit('cancel')">Back</button>
      <button
        class="btn primary"
        :disabled="saving || !changed"
        title="Save note"
        @click="onSave"
      >
        <span v-if="saving" class="spinner" />
        <span v-else>Save</span>
      </button>
    </div>

    <textarea
      v-model="local.content"
      class="editor"
      placeholder="Start typing your note here..."
      aria-label="Note content"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from "vue";

export interface NoteEditorModel {
  id: string;
  title: string;
  content: string;
}

const props = defineProps<{
  note: NoteEditorModel;
  saving: boolean;
}>();

const emit = defineEmits<{
  (e: "save", payload: { id: string; title: string; content: string }): void;
  (e: "cancel"): void;
}>();

const local = reactive({
  id: props.note.id,
  title: props.note.title,
  content: props.note.content,
});

watch(
  () => props.note,
  (n) => {
    local.id = n.id;
    local.title = n.title;
    local.content = n.content;
  },
  { deep: true }
);

const changed = computed(
  () => local.title !== props.note.title || local.content !== props.note.content
);

function onSave() {
  emit("save", {
    id: local.id,
    title: local.title.trim(),
    content: local.content,
  });
}
</script>

<style scoped>
.wrap {
  height: calc(100vh - 84px);
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 10px;
}
.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 8px;
  background: #fcfdff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
}
.title {
  width: 40%;
  min-width: 220px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: white;
  padding: 10px 12px;
  border-radius: 10px;
  outline: none;
  font-weight: 700;
  color: var(--color-secondary);
}
.title:focus {
  border-color: rgba(79, 142, 247, 0.55);
  box-shadow: 0 0 0 3px rgba(79, 142, 247, 0.15);
}
.spacer {
  flex: 1;
}
.btn {
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: white;
  padding: 9px 12px;
  border-radius: 10px;
  cursor: pointer;
}
.btn.ghost {
  background: transparent;
}
.btn.primary {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  box-shadow: 0 10px 24px rgba(79, 142, 247, 0.35);
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-top-color: white;
  border-radius: 50%;
  display: inline-block;
  animation: spin 1s linear infinite;
  vertical-align: middle;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.editor {
  width: 100%;
  height: 100%;
  resize: none;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 14px;
  background: white;
  line-height: 1.6;
  color: #374151;
  outline: none;
  box-shadow: var(--shadow-1);
}
.editor:focus {
  border-color: rgba(79, 142, 247, 0.55);
  box-shadow: 0 0 0 3px rgba(79, 142, 247, 0.15);
}
</style>
