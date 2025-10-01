<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import FolderList from './FolderList.vue';
import type { FolderNode } from '@/types';

const props = defineProps<{
  visible: boolean;
  folders: FolderNode[];
  currentFolderId?: string;
  noteTitle: string;
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'move', folderId: string): void;
}>();

const selectedFolderId = ref<string>('all');
const isVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

// 过滤掉当前文件夹，避免移动到相同位置
const availableFolders = computed(() => {
  return props.folders.filter(folder => folder.id !== props.currentFolderId);
});

// 监听对话框打开，重置选择
watch(isVisible, (visible) => {
  if (visible) {
    selectedFolderId.value = 'all';
  }
});

function handleFolderSelect(folderId: string) {
  selectedFolderId.value = folderId;
}

function handleMove() {
  emit('move', selectedFolderId.value);
  isVisible.value = false;
}

function handleCancel() {
  isVisible.value = false;
}
</script>

<template>
  <div v-if="isVisible" class="dialog-overlay" @click="handleCancel">
    <div class="dialog" @click.stop>
      <div class="dialog-header">
        <h3 class="dialog-title">移动到文件夹</h3>
        <button class="close-btn" @click="handleCancel">
          <i class="pi pi-times"></i>
        </button>
      </div>
      
      <div class="dialog-content">
        <p class="note-info">将笔记 "{{ noteTitle }}" 移动到：</p>
        
        <div class="folder-list-container">
          <FolderList
            :items="availableFolders"
            :active-id="selectedFolderId"
            @select="handleFolderSelect"
          />
        </div>
      </div>
      
      <div class="dialog-footer">
        <button class="btn btn-secondary" @click="handleCancel">
          取消
        </button>
        <button 
          class="btn btn-primary" 
          @click="handleMove"
          :disabled="!selectedFolderId"
        >
          移动
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-primary);
}

.dialog-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.close-btn:hover {
  background-color: var(--bg-hover);
  color: var(--text-primary);
}

.dialog-content {
  padding: var(--spacing-lg);
  flex: 1;
  overflow: hidden;
}

.note-info {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-sm);
}

.folder-list-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm);
}

.dialog-footer {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: flex-end;
  padding: var(--spacing-lg);
  border-top: 1px solid var(--border-primary);
}

.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--border-primary);
}

.btn-secondary:hover {
  background: var(--bg-hover);
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-dark, var(--color-primary));
  opacity: 0.9;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

