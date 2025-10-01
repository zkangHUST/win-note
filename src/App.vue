<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import AppSidebar from "./components/Sidebar.vue";
import NoteList from "./components/NoteList.vue";
import ErrorBoundary from "./components/ErrorBoundary.vue";
import Editor from "primevue/editor";
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";
import { useNotes } from "@/composables/useNotes";
import { useFolders } from "@/composables/useFolders";
import { initializeStorage } from "@/storage";

const sidebarVisible = ref(true);
const { folders, activeFolderId, selectFolder, initializeFolders, createFolder } = useFolders();
const { notes, activeNoteId, editorContent, selectNote, createNote, moveNoteToFolder, initializeNotes, updateNoteContent } = useNotes(activeFolderId);

// 监听文件夹切换
function onSelectFolder(id: string) {
  console.log("📁 切换文件夹:", id);
  selectFolder(id);
  console.log("📁 当前活动文件夹ID:", activeFolderId.value);
  console.log("📝 当前笔记列表:", notes.value.map(n => ({ id: n.id, title: n.title, folderId: n.folderId })));
}

function onSelectNote(id: string) {
  selectNote(id);
}

function onCreateFolder(data: { name: string; icon: string }) {
  console.log("App: 处理创建文件夹事件:", data);
  
  try {
    // 创建新文件夹（作为顶级文件夹）
    const newFolder = createFolder(null, {
      label: data.name,
      icon: data.icon,
    });
    
    console.log("✅ App: 文件夹创建成功:", newFolder);
  } catch (error) {
    console.error("❌ App: 创建文件夹失败:", error);
  }
}

// 创建新笔记
async function onCreateNote() {
  try {
    console.log("📝 创建新笔记...");
    
    const newNote = await createNote({
      title: "新笔记",
      snippet: "",
      tags: [],
      folderId: activeFolderId.value === "all" ? undefined : activeFolderId.value,
    });
    
    // 自动选中新创建的笔记
    await selectNote(newNote.id);
    
    console.log("✅ 新笔记创建成功:", newNote);
  } catch (error) {
    console.error("❌ 创建笔记失败:", error);
  }
}

// 删除笔记（移动到回收站）
async function onDeleteNote() {
  console.log("🔍 删除按钮被点击");
  console.log("🔍 当前选中的笔记ID:", activeNoteId.value);
  console.log("🔍 当前笔记列表:", notes.value.map(n => ({ id: n.id, title: n.title })));
  
  if (!activeNoteId.value) {
    console.warn("⚠️ 没有选中的笔记可删除");
    alert("请先选择一个笔记");
    return;
  }
  
  try {
    console.log("🗑️ 移动笔记到回收站:", activeNoteId.value);
    
    // 将笔记移动到回收站文件夹
    const movedNote = await moveNoteToFolder(activeNoteId.value, "trash");
    
    if (movedNote) {
      console.log("✅ 笔记已移动到回收站:", movedNote.title);
      
      // 如果当前在回收站文件夹，保持选中状态
      // 否则切换到其他笔记
      if (activeFolderId.value !== "trash") {
        const remainingNotes = notes.value.filter(n => n.id !== activeNoteId.value && n.folderId !== 'trash');
        console.log("🔍 剩余笔记:", remainingNotes.map(n => ({ id: n.id, title: n.title })));
        if (remainingNotes.length > 0) {
          await selectNote(remainingNotes[0].id);
        } else {
          activeNoteId.value = "";
          editorContent.value = "";
        }
      }
    } else {
      console.error("❌ 移动笔记到回收站失败");
      alert("删除失败，请重试");
    }
  } catch (error) {
    console.error("❌ 移动笔记到回收站失败:", error);
    alert("删除失败: " + (error instanceof Error ? error.message : String(error)));
  }
}



// 监听编辑器内容变化，自动更新笔记内容和标题
watch(editorContent, async (newContent) => {
  if (activeNoteId.value && newContent !== undefined) {
    await updateNoteContent(activeNoteId.value, newContent);
  }
});

// 初始化存储和数据
onMounted(async () => {
  try {
    await initializeStorage();
    await initializeFolders();
    await initializeNotes();
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
});
</script>

<template>

  <ErrorBoundary>
    <main class="container">
      <div class="layout">
        <AppSidebar 
          v-model:visible="sidebarVisible" 
          :folders="folders"
          :active-folder-id="activeFolderId"
          @select-folder="onSelectFolder"
          @create-folder="onCreateFolder"
        />
        <div class="content">
          <div class="note-area">
            <Splitter style="width: 100%; height: 100%" :gutterSize="8">
              <SplitterPanel :size="30" :minSize="15">
                <div class="notes-panel">
                  <div class="notes-header">
                    <h3 class="notes-title">笔记</h3>
                    <div class="notes-actions">
                      <button @click="onDeleteNote" class="delete-note-btn" title="删除笔记" :disabled="!activeNoteId">
                        <i class="pi pi-trash"></i>
                      </button>
                      <!-- 调试信息 -->
                      <div style="font-size: 10px; color: #666; margin-left: 8px;">
                        ID: {{ activeNoteId || 'none' }}
                      </div>
                      <button @click="onCreateNote" class="new-note-btn" title="新建笔记">
                        <i class="pi pi-pen-to-square"></i>
                      </button>
                    </div>
                  </div>
                  <NoteList :items="notes" :active-id="activeNoteId" dense @select="onSelectNote" />
                </div>
              </SplitterPanel>
              <SplitterPanel :size="70" :minSize="30">
                <div class="editor-container">
                  <Editor v-model="editorContent" editorStyle="height: 600px" />
                </div>
              </SplitterPanel>
            </Splitter>
          </div>
        </div>
      </div>
    </main>
  </ErrorBoundary>
</template>

<style scoped>
.container {
  height: 100vh;
  display: flex;
  background-color: var(--bg-primary);
}

.layout {
  display: flex;
  flex: 1;
  width: 100%;
}

.content {
  flex: 1;
  padding: var(--spacing-md);
  overflow: auto;
  background-color: var(--bg-primary);
}

.note-area {
  display: flex;
  height: 100%;
}

.editor-container {
  height: 100%;
}

.notes-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--surface-card);
  border-radius: var(--border-radius);
  overflow: hidden;
}

.notes-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: var(--surface-hover);
  border-bottom: 1px solid var(--surface-border);
  flex-shrink: 0;
}

.notes-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.notes-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.new-note-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background-color: #f8fafc;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
  border: 1px solid #e2e8f0;
}

.new-note-btn:hover {
  background-color: #e2e8f0;
  color: #475569;
  transform: scale(1.05);
}

.new-note-btn:active {
  transform: scale(0.95);
}

.delete-note-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background-color: #fef2f2;
  color: #dc2626;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
  border: 1px solid #fecaca;
}

.delete-note-btn:hover:not(:disabled) {
  background-color: #fecaca;
  color: #b91c1c;
  transform: scale(1.05);
}

.delete-note-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.delete-note-btn:disabled {
  background-color: #f8fafc;
  color: #cbd5e1;
  border-color: #e2e8f0;
  cursor: not-allowed;
  opacity: 0.6;
}

.delete-note-btn .pi {
  font-size: 14px;
}

.new-note-btn .pi {
  font-size: 14px;
}
</style>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}
</style>