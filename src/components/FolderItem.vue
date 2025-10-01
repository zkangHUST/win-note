<script setup lang="ts">
import { computed, ref } from "vue";
import ContextMenu from "primevue/contextmenu";
import type { ClickEvent } from "@/types";
import type { MenuItem } from "primevue/menuitem";

const props = defineProps<{
  id: string;
  label: string;
  active?: boolean;
  icon?: string;
  indent?: number;
  isSystem?: boolean;
}>();

const emit = defineEmits<ClickEvent & {
  (e: "edit", id: string): void;
  (e: "delete", id: string): void;
}>();

const contextMenuRef = ref<InstanceType<typeof ContextMenu>>();

const paddingLeft = computed(() => `${8 + (props.indent ?? 0) * 12}px`);
const iconClass = computed(() => props.icon ?? "pi pi-folder");

function handleClick() {
  emit("click");
}

function onContextMenu(event: MouseEvent) {
  event.preventDefault();
  if (contextMenuRef.value) {
    contextMenuRef.value.show(event);
  }
}

function onEdit() {
  emit("edit", props.id);
}

function onDelete() {
  console.log("🗑️ FolderItem: 删除按钮被点击:", props.id);
  emit("delete", props.id);
}

const contextMenuItems = computed<MenuItem[]>(() => {
  const items: MenuItem[] = [
    {
      label: "编辑",
      icon: "pi pi-pencil",
      command: onEdit
    }
  ];
  
  if (!props.isSystem) {
    items.push(
      {
        separator: true
      },
      {
        label: "删除",
        icon: "pi pi-trash",
        command: onDelete
      }
    );
  }
  
  return items;
});
</script>

<template>
  <div
    class="folder-item"
    :class="{ active: !!active }"
    :style="{ paddingLeft }"
    @click="handleClick"
    @contextmenu="onContextMenu"
  >
    <i class="icon" :class="iconClass" />
    <span class="label">{{ label }}</span>
  </div>
  
  <!-- 右键菜单 -->
  <ContextMenu 
    ref="contextMenuRef" 
    :model="contextMenuItems" 
  />
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


