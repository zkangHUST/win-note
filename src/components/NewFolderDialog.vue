<script setup lang="ts">
import { ref } from "vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import FloatLabel from "primevue/floatlabel";
import { ICON_OPTIONS } from "@/constants/icons";

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "create", data: { name: string; icon: string }): void;
}>();

const folderName = ref("");
const selectedIcon = ref("pi pi-folder");

const iconOptions = ICON_OPTIONS;

function handleCreate() {
  if (folderName.value.trim()) {
    emit("create", {
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
    header="New Folder"
    :style="{ width: '400px' }"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="dialog-content">
      <div class="form-group">
        <FloatLabel variant="in">
          <InputText
            id="folder-name"
            v-model="folderName"
            class="form-input"
            @keyup.enter="handleCreate"
          />
          <label for="folder-name">Folder Name</label>
        </FloatLabel>
      </div>
      
      <div class="form-group">
        <label class="form-label">Select Icon</label>
        <div class="icon-picker">
          <div
            v-for="icon in iconOptions"
            :key="icon"
            :class="['icon-option', { active: selectedIcon === icon }]"
            @click="selectedIcon = icon"
          >
            <i :class="icon" class="icon"></i>
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
          label="Create"
          :disabled="!folderName.trim()"
          severity="primary"
          @click="handleCreate"
        />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 8px 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-input {
  width: 100%;
}


.form-dropdown {
  width: 100%;
}

.icon-picker {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
  gap: 6px;
  max-height: 200px;
  overflow-y: auto;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background-color: #f9fafb;
}

.icon-option {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  aspect-ratio: 1;
}

.icon-option:hover {
  background-color: #e5e7eb;
  transform: translateY(-1px);
}

.icon-option.active {
  background-color: #3b82f6;
  color: white;
  border-color: #2563eb;
}

.icon {
  font-size: 18px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.p-button.p-button-primary) {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

:deep(.p-button.p-button-primary:hover) {
  background-color: #2563eb;
  border-color: #2563eb;
}

:deep(.p-button.p-button-primary:focus) {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}
</style>
