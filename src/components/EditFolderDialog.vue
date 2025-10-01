<script setup lang="ts">
import { ref, watch } from "vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import FloatLabel from "primevue/floatlabel";
import { ICON_OPTIONS } from "@/constants/icons";
import type { FolderNode } from "@/types";

const props = defineProps<{
  visible: boolean;
  folder: FolderNode | null;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "save", data: { id: string; name: string; icon: string }): void;
}>();

const folderName = ref("");
const selectedIcon = ref("pi pi-folder");

const iconOptions = ICON_OPTIONS;

// 监听文件夹变化，更新表单数据
watch(() => props.folder, (newFolder) => {
  if (newFolder) {
    folderName.value = newFolder.label;
    selectedIcon.value = newFolder.icon || "pi pi-folder";
  }
}, { immediate: true });

function handleSave() {
  if (folderName.value.trim() && props.folder) {
    emit("save", {
      id: props.folder.id,
      name: folderName.value.trim(),
      icon: selectedIcon.value,
    });
    handleCancel();
  }
}

function handleCancel() {
  folderName.value = "";
  selectedIcon.value = "pi pi-folder";
  emit("update:visible", false);
}
</script>

<template>
  <Dialog
    v-model:visible="props.visible"
    modal
    header="Edit Folder"
    :style="{ width: '400px' }"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="dialog-content">
      <div class="form-group">
        <FloatLabel variant="in">
          <InputText 
            id="folder-name" 
            v-model="folderName" 
            class="w-full"
            :class="{ 'p-invalid': !folderName.trim() }"
          />
          <label for="folder-name">Folder Name</label>
        </FloatLabel>
      </div>

      <div class="form-group">
        <label class="form-label">Icon</label>
        <div class="icon-picker">
          <div 
            v-for="icon in iconOptions" 
            :key="icon"
            class="icon-option"
            :class="{ active: selectedIcon === icon }"
            @click="selectedIcon = icon"
          >
            <i :class="icon"></i>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <Button 
          label="Cancel" 
          severity="secondary" 
          @click="handleCancel"
        />
        <Button 
          label="Save" 
          @click="handleSave"
          :disabled="!folderName.trim()"
        />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.dialog-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding: var(--spacing-md) 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.icon-picker {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
  gap: var(--spacing-xs);
  max-height: 200px;
  overflow-y: auto;
  padding: var(--spacing-xs);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  background-color: var(--bg-secondary);
}

.icon-option {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  background-color: transparent;
  border: 2px solid transparent;
}

.icon-option:hover {
  background-color: var(--bg-hover);
  border-color: var(--border-primary);
}

.icon-option.active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.icon-option i {
  font-size: 18px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
}
</style>
