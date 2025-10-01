<script setup lang="ts">
import { computed, ref } from "vue";
import ContextMenu from "primevue/contextmenu";
import Divider from "primevue/divider";
import type { Note, SelectEvent } from "@/types";
import type { MenuItem } from "primevue/menuitem";

const props = defineProps<{
  items: Note[];
  activeId?: string;
  dense?: boolean;
}>();

const emit = defineEmits<SelectEvent & {
  (e: "move-to-folder", noteId: string): void;
  (e: "delete", noteId: string): void;
  (e: "toggle-star", noteId: string): void;
}>();

const contextMenuRef = ref<InstanceType<typeof ContextMenu>>();
const selectedNoteId = ref<string>("");

function onSelect(id: string) {
  emit("select", id);
}

function onContextMenu(event: MouseEvent, noteId: string) {
  event.preventDefault();
  selectedNoteId.value = noteId;
  
  if (contextMenuRef.value) {
    contextMenuRef.value.show(event);
  }
}

function onMoveToFolder() {
  if (selectedNoteId.value) {
    emit("move-to-folder", selectedNoteId.value);
  }
}

function onDelete() {
  if (selectedNoteId.value) {
    emit("delete", selectedNoteId.value);
  }
}

function onToggleStar() {
  if (selectedNoteId.value) {
    emit("toggle-star", selectedNoteId.value);
  }
}

const contextMenuItems = computed<MenuItem[]>(() => {
  const selectedNote = props.items.find(n => n.id === selectedNoteId.value);
  const isStarred = selectedNote?.isStarred || false;
  
  return [
    {
      label: "移动到文件夹",
      icon: "pi pi-folder",
      command: onMoveToFolder
    },
    {
      label: isStarred ? "取消收藏" : "收藏",
      icon: isStarred ? "pi pi-star-fill" : "pi pi-star",
      command: onToggleStar
    },
    {
      separator: true
    },
    {
      label: "删除",
      icon: "pi pi-trash",
      command: onDelete
    }
  ];
});

const isDense = computed(() => !!props.dense);
</script>

<template>
  <div class="note-list" :class="{ dense: isDense }">
    <template v-for="(note, index) in items" :key="note.id">
      <div
        class="note-item"
        :class="{ active: note.id === activeId }"
        @click="onSelect(note.id)"
        @contextmenu="onContextMenu($event, note.id)"
      >
        <div class="title-row">
          <span class="title" :title="note.title">{{ note.title }}</span>
          <div class="title-actions">
            <i v-if="note.isStarred" class="pi pi-star-fill starred-icon" title="已收藏"></i>
            <span v-if="note.updatedAt" class="date">{{ note.updatedAt }}</span>
          </div>
        </div>
        <div v-if="note.snippet" class="snippet" :title="note.snippet">
          {{ note.snippet }}
        </div>
        <div v-if="note.tags?.length" class="meta">
          <span class="tag" v-for="t in note.tags" :key="t">#{{ t }}</span>
        </div>
      </div>
      <Divider v-if="index < items.length - 1" />
    </template>
    
    <!-- 右键菜单 -->
    <ContextMenu 
      ref="contextMenuRef" 
      :model="contextMenuItems" 
    />
  </div>
</template>

<style scoped>
.note-list {
  display: flex;
  flex-direction: column;
  /* gap: var(--spacing-xs); */
  height: 100%;
  overflow-y: auto;
  padding-right: var(--spacing-sm);
  padding-left: var(--spacing-sm);
}

.note-item {
  padding: var(--spacing-md);
  border-radius: var(--radius-md); 
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
  background-color: #e0e0e0;
  /* border-color: var(--color-primary); */
}

.title-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
  flex-shrink: 0;
}

.title-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
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

.starred-icon {
  color: #fbbf24;
  font-size: var(--font-size-sm);
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


