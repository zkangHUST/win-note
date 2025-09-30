<script setup lang="ts">
import { ref } from "vue";
import FolderList from "./FolderList.vue";
import TagList from "./TagList.vue";
import { useFolders } from "@/composables/useFolders";
import { useTags } from "@/composables/useTags";

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
}>();

const { folders, activeFolderId, selectFolder } = useFolders();
const { tags, activeTagId, selectTag } = useTags();

function onSelectFolder(id: string) {
  selectFolder(id);
}

function onSelectTag(id: string) {
  selectTag(id);
}
</script>

<template>
    <div class="sidebar">
        <h3 class="sidebar-title">Win Note</h3>
        <div>on my PC</div>
        <div class="folders">
            <FolderList :items="folders" :active-id="activeFolderId" @select="onSelectFolder" />
        </div>
        <div class="tags">
            <TagList :items="tags" :active-id="activeTagId" @select="onSelectTag" />
        </div>
    </div>
</template>

<style scoped>
.sidebar {
    width: var(--sidebar-width);
    height: 100%;
    background-color: var(--bg-sidebar);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: var(--spacing-md);
    border-right: 1px solid var(--border-primary);
}

.sidebar-title {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--spacing-md);
    color: var(--text-primary);
}

.folders {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    margin-bottom: var(--spacing-md);
    color: var(--text-secondary);
    width: 100%;
}

.tags {
    margin-top: var(--spacing-lg);
    width: 100%;
}
</style>
