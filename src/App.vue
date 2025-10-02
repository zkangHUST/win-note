<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import AppSidebar from "./components/Sidebar.vue";
import NoteList from "./components/NoteList.vue";
import ErrorBoundary from "./components/ErrorBoundary.vue";
import MoveToFolderDialog from "./components/MoveToFolderDialog.vue";
import NoteHeader from "./components/NoteHeader.vue";
import Editor from "primevue/editor";
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";
import { useNotes } from "@/composables/useNotes";
import { useFolders } from "@/composables/useFolders";
import { initializeStorage } from "@/storage";

const sidebarVisible = ref(true);
const { folders, activeFolderId, selectFolder, initializeFolders, createFolder, editFolder, deleteFolder } = useFolders();
const { notes, activeNoteId, editorContent, selectNote, createNote, moveNoteToFolder, toggleStar, initializeNotes, updateNoteContent } = useNotes(activeFolderId);

// 移动笔记对话框状态
const showMoveDialog = ref(false);
const noteToMove = ref<{ id: string; title: string } | null>(null);

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

// 处理移动笔记到文件夹
function onMoveToFolder(noteId: string) {
  const note = notes.value.find(n => n.id === noteId);
  if (note) {
    noteToMove.value = { id: note.id, title: note.title };
    showMoveDialog.value = true;
  }
}

// 处理删除笔记
async function onDeleteNote(noteId: string) {
  console.log("🗑️ 删除笔记:", noteId);
  
  try {
    // 将笔记移动到回收站文件夹
    const movedNote = await moveNoteToFolder(noteId, "trash");
    
    if (movedNote) {
      console.log("✅ 笔记已移动到回收站:", movedNote.title);
      
      // 如果当前在回收站文件夹，保持选中状态
      // 否则切换到其他笔记
      if (activeFolderId.value !== "trash") {
        const remainingNotes = notes.value.filter(n => n.id !== noteId && n.folderId !== 'trash');
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

// 处理切换收藏状态
async function onToggleStar(noteId: string) {
  console.log("⭐ 切换收藏状态:", noteId);
  
  try {
    const updatedNote = await toggleStar(noteId);
    if (updatedNote) {
      console.log("✅ 收藏状态已更新:", updatedNote.title, updatedNote.isStarred ? "已收藏" : "未收藏");
    }
  } catch (error) {
    console.error("❌ 切换收藏状态失败:", error);
    alert("操作失败: " + (error instanceof Error ? error.message : String(error)));
  }
}

// 执行移动操作
async function handleMoveNote(folderId: string) {
  if (!noteToMove.value) return;
  
  try {
    console.log("📝 移动笔记:", noteToMove.value.title, "到文件夹:", folderId);
    await moveNoteToFolder(noteToMove.value.id, folderId);
    console.log("✅ 笔记移动成功");
  } catch (error) {
    console.error("❌ 移动笔记失败:", error);
  } finally {
    showMoveDialog.value = false;
    noteToMove.value = null;
  }
}

function onCreateFolder(data: { name: string; icon: string; parentId: string | null }) {
  console.log("App: 处理创建文件夹事件:", data);
  
  try {
    // 创建新文件夹
    const newFolder = createFolder(data.parentId, {
      label: data.name,
      icon: data.icon,
    });
    
    console.log("✅ App: 文件夹创建成功:", newFolder);
  } catch (error) {
    console.error("❌ App: 创建文件夹失败:", error);
  }
}

function onEditFolder(data: { id: string; name: string; icon: string }) {
  console.log("App: 处理编辑文件夹事件:", data);
  
  try {
    const updatedFolder = editFolder(data.id, {
      label: data.name,
      icon: data.icon,
    });
    
    if (updatedFolder) {
      console.log("✅ App: 文件夹编辑成功:", updatedFolder);
    } else {
      console.error("❌ App: 文件夹编辑失败: 未找到文件夹");
    }
  } catch (error) {
    console.error("❌ App: 编辑文件夹失败:", error);
  }
}

function onDeleteFolder(id: string) {
  console.log("App: 处理删除文件夹事件:", id);
  
  try {
    deleteFolder(id);
    console.log("✅ App: 文件夹删除成功:", id);
  } catch (error) {
    console.error("❌ App: 删除文件夹失败:", error);
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
          @edit-folder="onEditFolder"
          @delete-folder="onDeleteFolder"
        />
        <div class="content">
          <div class="note-area">
            <Splitter style="width: 100%; height: 100%" :gutterSize="8">
              <SplitterPanel :size="30" :minSize="15">
                <div class="notes-panel">
                  <NoteHeader 
                    :active-note-id="activeNoteId"
                    @delete="() => onDeleteNote(activeNoteId)"
                    @create="onCreateNote"
                  />
                  <NoteList 
                    :items="notes" 
                    :active-id="activeNoteId" 
                    dense 
                    @select="onSelectNote"
                    @move-to-folder="onMoveToFolder"
                    @delete="onDeleteNote"
                    @toggle-star="onToggleStar"
                  />
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
    
    <!-- 移动笔记对话框 -->
    <MoveToFolderDialog
      v-model:visible="showMoveDialog"
      :folders="folders"
      :current-folder-id="activeFolderId"
      :note-title="noteToMove?.title || ''"
      @move="handleMoveNote"
    />
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
  /* padding: var(--spacing-md); */
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
  /* padding-right: var(--spacing-sm); */
  overflow: hidden;
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