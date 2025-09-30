<script setup lang="ts">
import { computed } from "vue";
import FolderItem from "./FolderItem.vue";
import type { FolderNode, SelectEvent } from "@/types";

const props = defineProps<{
  items: FolderNode[];
  activeId?: string;
  indentStart?: number;
}>();

const emit = defineEmits<SelectEvent>();

type FlatItem = {
  id: string;
  label: string;
  icon?: string;
  level: number;
};

function flatten(nodes: FolderNode[], level: number, acc: FlatItem[]) {
  for (const node of nodes) {
    acc.push({ id: node.id, label: node.label, icon: node.icon, level });
    if (node.children && node.children.length) {
      flatten(node.children, level + 1, acc);
    }
  }
}

const flatItems = computed<FlatItem[]>(() => {
  const start = props.indentStart ?? 0;
  const result: FlatItem[] = [];
  flatten(props.items ?? [], start, result);
  return result;
});

function onSelect(id: string) {
  emit("select", id);
}
</script>

<template>
  <div class="folder-list">
    <FolderItem
      v-for="item in flatItems"
      :key="item.id"
      :label="item.label"
      :icon="item.icon"
      :indent="item.level"
      :active="item.id === activeId"
      @click="onSelect(item.id)"
    />
  </div>
</template>

<style scoped>
.folder-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}
</style>


