<script setup lang="ts">
import { ref } from "vue";
import FolderList from "./FolderList.vue";
import TagList from "./TagList.vue";
import NewFolderDialog from "./NewFolderDialog.vue";
import { useTags } from "@/composables/useTags";
import type { FolderNode } from "@/types";

const props = defineProps<{
  visible: boolean;
  folders: FolderNode[];
  activeFolderId: string;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "select-folder", id: string): void;
  (e: "create-folder", data: { name: string; icon: string }): void;
}>();

const { tags, activeTagId, selectTag } = useTags();

const showNewFolderDialog = ref(false);

function onSelectFolder(id: string) {
  emit("select-folder", id);
}

function onSelectTag(id: string) {
  selectTag(id);
}

function createNewFolder() {
  console.log("🔄 打开新建文件夹对话框");
  showNewFolderDialog.value = true;
}

function handleCreateFolder(data: { name: string; icon: string }) {
  console.log("创建文件夹:", data);
  
  // 通过 emit 事件传递给父组件处理
  emit("create-folder", data);
  showNewFolderDialog.value = false;
}
</script>

<template>
    <div class="sidebar">
        <div class="sidebar-header">
            <h3 class="app-title">Win Note</h3>
        </div>
        
        <!-- <div class="divider"></div> -->

              <div class="folders">
                <FolderList :items="props.folders" :active-id="props.activeFolderId" @select="onSelectFolder" />
              </div>
        
        <div class="divider"></div>
        
        <div class="tags">
            <TagList :items="tags" :active-id="activeTagId" @select="onSelectTag" />
        </div>
        
        <div class="new-folder">
            <button class="new-folder-btn" @click="createNewFolder">
                <i class="pi pi-plus"></i>
                New Folder
            </button>
        </div>
    </div>
    
    <NewFolderDialog
        v-model:visible="showNewFolderDialog"
        @create="handleCreateFolder"
    />
</template>

<style scoped>
.sidebar {
    width: var(--sidebar-width);
    height: 100%;
    background-color: #fafafa;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #e5e5e5;
}

.sidebar-header {
    padding: 24px 20px 20px;
    border-bottom: 1px solid #e5e5e5;
    background-color: #ffffff;
}

.app-title {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 4px 0;
    color: #1a1a1a;
    letter-spacing: -0.01em;
}

.folders {
    flex: 1;
    padding: 16px 20px;
    overflow-y: auto;
}

.divider {
    height: 1px;
    background-color: #e5e5e5;
    margin: 16px 20px;
    flex-shrink: 0;
}

.tags {
    flex: 1;
    padding: 16px 20px;
    overflow-y: auto;
}

.new-folder {
    padding: 12px 20px;
    border-top: 1px solid #e5e5e5;
}

.new-folder-btn {
    width: 100%;
    padding: 8px 12px;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: background-color 0.2s ease;
}

.new-folder-btn:hover {
    background-color: #2563eb;
}

.new-folder-btn:active {
    background-color: #1d4ed8;
}
</style>
