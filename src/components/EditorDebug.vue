<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const editorContainer = ref<HTMLElement>();
const toolbarHeight = ref(0);
const contentHeight = ref(0);
const totalHeight = ref(0);

function updateHeights() {
  if (!editorContainer.value) return;
  
  const container = editorContainer.value;
  const toolbar = container.querySelector('.p-editor-toolbar') as HTMLElement;
  const content = container.querySelector('.p-editor-content') as HTMLElement;
  const quillEditor = container.querySelector('.ql-editor') as HTMLElement;
  
  totalHeight.value = container.offsetHeight;
  toolbarHeight.value = toolbar?.offsetHeight || 0;
  contentHeight.value = content?.offsetHeight || 0;
}

onMounted(() => {
  // 延迟执行，确保Editor已渲染
  setTimeout(updateHeights, 100);
  
  // 监听窗口大小变化
  window.addEventListener('resize', updateHeights);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateHeights);
});
</script>

<template>
  <div ref="editorContainer" class="editor-debug-container">
    <div class="editor-debug">
      <div>总高度: {{ totalHeight }}px</div>
      <div>工具栏: {{ toolbarHeight }}px</div>
      <div>内容区: {{ contentHeight }}px</div>
      <div>比例: {{ toolbarHeight > 0 ? Math.round(toolbarHeight / totalHeight * 100) : 0 }}% / {{ contentHeight > 0 ? Math.round(contentHeight / totalHeight * 100) : 0 }}%</div>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.editor-debug-container {
  position: relative;
  height: 100%;
}

.editor-debug {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  font-size: 12px;
  border-radius: 4px;
  z-index: 1000;
  font-family: monospace;
  line-height: 1.4;
}

.editor-debug div {
  margin: 2px 0;
}
</style>
