<script setup lang="ts">
import { computed } from "vue";
import type { Note, SelectEvent } from "@/types";

const props = defineProps<{
  items: Note[];
  activeId?: string;
  dense?: boolean;
}>();

const emit = defineEmits<SelectEvent>();

function onSelect(id: string) {
  emit("select", id);
}

const isDense = computed(() => !!props.dense);
</script>

<template>
  <div class="note-list" :class="{ dense: isDense }">
    <div
      v-for="note in items"
      :key="note.id"
      class="note-item"
      :class="{ active: note.id === activeId }"
      @click="onSelect(note.id)"
    >
      <div class="title-row">
        <span class="title" :title="note.title">{{ note.title }}</span>
        <span v-if="note.updatedAt" class="date">{{ note.updatedAt }}</span>
      </div>
      <div v-if="note.snippet" class="snippet" :title="note.snippet">
        {{ note.snippet }}
      </div>
      <div v-if="note.tags?.length" class="meta">
        <span class="tag" v-for="t in note.tags" :key="t">#{{ t }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.note-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  height: 100%;
  overflow-y: auto;
}

.note-item {
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 1px solid transparent;
  min-height: 120px;
  display: flex;
  flex-direction: column;
}

.note-item:hover {
  background-color: var(--bg-hover);
  border-color: var(--border-primary);
}

.note-item.active {
  background-color: var(--bg-active);
  border-color: var(--color-primary);
}

.title-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
  flex-shrink: 0;
}

.title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  flex: 1;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.date {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.snippet {
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: var(--line-height-normal);
  flex: 1;
  min-height: 20px;
}

.meta {
  margin-top: var(--spacing-sm);
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  flex-shrink: 0;
}

.tag {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-full);
  padding: var(--spacing-xs) var(--spacing-sm);
  font-weight: var(--font-weight-medium);
}

.note-list.dense .note-item {
  padding: var(--spacing-sm) var(--spacing-md);
  min-height: 100px;
}

.note-list.dense .title {
  font-size: var(--font-size-sm);
}

.note-list.dense .snippet {
  font-size: var(--font-size-xs);
}
</style>


