<script setup lang="ts">
import TagItem from "./TagItem.vue";
import type { Tag, SelectEvent } from "@/types";

defineProps<{
  items: Tag[];
  activeId?: string;
}>();

const emit = defineEmits<SelectEvent>();

function onClick(id: string) {
  emit("select", id);
}
</script>

<template>
  <div class="tag-list">
    <TagItem
      v-for="t in items"
      :key="t.id"
      :label="t.label"
      :count="t.count"
      :icon="t.icon"
      :class="{ active: t.id === activeId }"
      @click="onClick(t.id)"
    />
  </div>
</template>

<style scoped>
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}
</style>


