<script setup lang="ts">
const props = defineProps<{
  size?: "sm" | "md" | "lg";
  text?: string;
}>();

const sizeClass = computed(() => {
  switch (props.size) {
    case "sm": return "spinner-sm";
    case "lg": return "spinner-lg";
    default: return "spinner-md";
  }
});
</script>

<template>
  <div class="loading-container">
    <div class="spinner" :class="sizeClass"></div>
    <p v-if="text" class="loading-text">{{ text }}</p>
  </div>
</template>

<script lang="ts">
import { computed } from "vue";
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
}

.spinner {
  border: 2px solid var(--border-primary);
  border-top: 2px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-sm {
  width: 20px;
  height: 20px;
}

.spinner-md {
  width: 32px;
  height: 32px;
}

.spinner-lg {
  width: 48px;
  height: 48px;
}

.loading-text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
