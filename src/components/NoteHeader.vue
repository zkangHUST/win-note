<template>
  <Toolbar>
    <template #start>
      <div class="view-toggle">
        <div class="toggle-slider" :class="{ 'slide-right': props.viewMode === 'grid' }"></div>
        <button 
          class="view-btn" 
          :class="{ active: props.viewMode === 'list' }" 
          @click="onViewChange('list')"
          title="列表视图"
        >
          <i class="pi pi-list"></i>
        </button>
        <button 
          class="view-btn" 
          :class="{ active: props.viewMode === 'grid' }" 
          @click="onViewChange('grid')"
          title="网格视图"
        >
          <i class="pi pi-th-large"></i>
        </button>
      </div>
    </template>
    
    <template #end>
      <div class="notes-actions">
        <button @click="onDelete" class="delete-note-btn" title="删除笔记" :disabled="!activeNoteId">
          <i class="pi pi-trash"></i>
        </button>
        <button @click="onCreate" class="new-note-btn" title="新建笔记">
          <i class="pi pi-pen-to-square"></i>
        </button>
      </div>
    </template>
  </Toolbar>
</template>

<script setup lang="ts">
import Toolbar from "primevue/toolbar";

const props = withDefaults(defineProps<{
  activeNoteId?: string;
  viewMode?: "list" | "grid";
}>(), {
  viewMode: "list"
});

const emit = defineEmits<{
  (e: "delete"): void;
  (e: "create"): void;
  (e: "view-change", mode: "list" | "grid"): void;
}>();

function onDelete() {
  emit("delete");
}

function onCreate() {
  emit("create");
}

function onViewChange(mode: "list" | "grid") {
  console.log("NoteHeader: 切换视图模式:", mode, "当前模式:", props.viewMode);
  emit("view-change", mode);
}
</script>

<style scoped>
.view-toggle {
  position: relative;
  display: flex;
  align-items: center;
  gap: 2px;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: 1px;
  height: 28px;
}

.toggle-slider {
  position: absolute;
  top: 1px;
  left: 1px;
  width: 26px;
  height: 26px;
  background-color: var(--bg-active);
  border-radius: calc(var(--radius-md) - 2px);
  transition: transform 0.3s ease;
  z-index: 1;
}

.toggle-slider.slide-right {
  transform: translateX(calc(26px + 2px));
}

.view-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: none;
  border-radius: calc(var(--radius-md) - 2px);
  background-color: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.2s ease;
  z-index: 2;
}

.view-btn:hover {
  color: var(--text-primary);
}

.view-btn .pi {
  font-size: 12px;
}

.notes-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.delete-note-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background-color: #fef2f2;
  color: #dc2626;
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete-note-btn:hover:not(:disabled) {
  background-color: #fee2e2;
  transform: scale(1.05);
}

.delete-note-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.delete-note-btn .pi {
  font-size: 12px;
}

.new-note-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background-color: #f8fafc;
  color: #3b82f6;
  cursor: pointer;
  transition: all 0.2s ease;
}

.new-note-btn:hover {
  background-color: #e2e8f0;
  transform: scale(1.05);
}

.new-note-btn .pi {
  font-size: 14px;
}
</style>
