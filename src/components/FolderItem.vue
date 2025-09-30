<script setup lang="ts">
import { computed } from "vue";
import type { ClickEvent } from "@/types";

const props = defineProps<{
  label: string;
  active?: boolean;
  icon?: string;
  indent?: number;
}>();

const emit = defineEmits<ClickEvent>();

const paddingLeft = computed(() => `${8 + (props.indent ?? 0) * 12}px`);
const iconClass = computed(() => props.icon ?? "pi pi-folder");

function handleClick() {
  emit("click");
}
</script>

<template>
  <div
    class="folder-item"
    :class="{ active: !!active }"
    :style="{ paddingLeft }"
    @click="handleClick"
  >
    <i class="icon" :class="iconClass" />
    <span class="label">{{ label }}</span>
  </div>
  
</template>

<style scoped>
.folder-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  height: 32px;
  border-radius: var(--radius-md);
  cursor: pointer;
  user-select: none;
  transition: all var(--transition-fast);
  padding: var(--spacing-xs) var(--spacing-sm);
}

.folder-item:hover {
  background-color: var(--bg-hover);
}

.folder-item.active {
  background-color: var(--bg-active);
  color: var(--color-primary);
}

.icon {
  width: 16px;
  height: 16px;
  color: var(--text-secondary);
}

.folder-item.active .icon {
  color: var(--color-primary);
}

.label {
  font-size: var(--font-size-base);
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
}

.folder-item.active .label {
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
}
</style>


