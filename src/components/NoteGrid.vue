<template>
  <div class="note-grid">
    <Card
      v-for="note in items"
      :key="note.id"
      class="note-card"
      :class="{ active: note.id === activeId }"
      @click="onSelect(note.id)"
      @contextmenu="onContextMenu($event, note.id)"
    >
      <template #header>
        <div class="card-header">
          <h4 class="card-title" :title="note.title">{{ note.title }}</h4>
          <div class="card-actions">
            <i v-if="note.isStarred" class="pi pi-star-fill starred-icon" title="已收藏"></i>
          </div>
        </div>
      </template>
      
      <template #content>
        <div v-if="note.snippet" class="card-content" :title="note.snippet">
          {{ note.snippet }}
        </div>
      </template>
      
      <template #footer>
        <div class="card-footer">
          <div v-if="note.tags?.length" class="card-tags">
            <span class="tag" v-for="t in note.tags" :key="t">#{{ t }}</span>
          </div>
          <span v-if="note.updatedAt" class="card-date">{{ note.updatedAt }}</span>
        </div>
      </template>
    </Card>
    
    <!-- 右键菜单 -->
    <ContextMenu 
      ref="contextMenuRef" 
      :model="contextMenuItems" 
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import ContextMenu from "primevue/contextmenu";
import Card from "primevue/card";
import type { Note, SelectEvent } from "@/types";
import type { MenuItem } from "primevue/menuitem";

const props = defineProps<{
  items: Note[];
  activeId?: string;
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
  contextMenuRef.value?.show(event);
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
</script>

<style scoped>
.note-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  height: 100%;
  overflow-y: auto;
}

.note-card {
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 160px;
  max-height: 200px;
}

.note-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.note-card.active {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  padding-bottom: 0;
}

.card-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
  line-height: var(--line-height-tight);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  flex: 1;
}

.card-actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.starred-icon {
  color: #fbbf24;
  font-size: 14px;
}

.card-content {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  padding: 0 var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.card-footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--spacing-sm);
  padding: 0 var(--spacing-md) var(--spacing-md);
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  flex: 1;
}

.tag {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-full);
  padding: var(--spacing-xs) var(--spacing-sm);
  font-weight: var(--font-weight-medium);
}

.card-date {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
  flex-shrink: 0;
}
</style>
