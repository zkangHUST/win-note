<script setup lang="ts">
import { ref, onErrorCaptured } from "vue";

const hasError = ref(false);
const error = ref<Error | null>(null);

onErrorCaptured((err: Error) => {
  hasError.value = true;
  error.value = err;
  console.error("Error caught by boundary:", err);
  return false; // 阻止错误继续传播
});

function resetError() {
  hasError.value = false;
  error.value = null;
}
</script>

<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-content">
      <h3 class="error-title">出现了一个错误</h3>
      <p class="error-message">{{ error?.message || "未知错误" }}</p>
      <button class="btn btn-primary" @click="resetError">
        重试
      </button>
    </div>
  </div>
  <slot v-else />
</template>

<style scoped>
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: var(--spacing-lg);
}

.error-content {
  text-align: center;
  max-width: 400px;
}

.error-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-error);
  margin-bottom: var(--spacing-md);
}

.error-message {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
  line-height: var(--line-height-normal);
}
</style>
