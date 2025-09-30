<script setup lang="ts">
import type { ClickEvent } from "@/types";

const props = defineProps<{
  label: string;
  color?: string;
  count?: number;
  active?: boolean;
  icon?: string;
}>();

const emit = defineEmits<ClickEvent>();

function handleClick() {
  emit("click");
}
</script>

<template>
  <div class="tag-item" :class="{ active: !!active }" @click="handleClick">
    <i v-if="icon" class="icon" :class="icon"></i>
    <span class="label">{{ label }}</span>
    <span v-if="typeof count === 'number'" class="count">{{ count }}</span>
  </div>
</template>

<style scoped>
.tag-item {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  height: 28px;
  padding: 0 var(--spacing-md);
  border-radius: var(--radius-full);
  cursor: pointer;
  user-select: none;
  background-color: var(--bg-tertiary);
  color: var(--text-secondary);
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}

.tag-item:hover {
  background-color: var(--bg-hover);
  transform: translateY(-1px);
}

.tag-item.active {
  background-color: var(--color-primary);
  color: var(--text-inverse);
  border-color: var(--color-primary);
}

.icon {
  width: 14px;
  height: 14px;
}

.label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.count {
  font-size: var(--font-size-xs);
  padding: 0 var(--spacing-xs);
  border-radius: var(--radius-full);
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: var(--font-weight-semibold);
}

.tag-item.active .count {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>


