<script setup lang="ts">
import { ref } from "vue";
import AppSidebar from "./components/Sidebar.vue";
import NoteList from "./components/NoteList.vue";
import ErrorBoundary from "./components/ErrorBoundary.vue";
import EditorDebug from "./components/EditorDebug.vue";
import Editor from "primevue/editor";
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";
import { useNotes } from "@/composables/useNotes";

const sidebarVisible = ref(true);
const { notes, activeNoteId, editorContent, selectNote } = useNotes();

function onSelectNote(id: string) {
  selectNote(id);
}
</script>

<template>
  <ErrorBoundary>
    <main class="container">
      <div class="layout">
        <AppSidebar v-model:visible="sidebarVisible" />
        <div class="content">
          <div class="note-area">
            <Splitter style="width: 100%; height: 100%" :gutterSize="8">
              <SplitterPanel :size="30" :minSize="15">
                <NoteList :items="notes" :active-id="activeNoteId" dense @select="onSelectNote" />
              </SplitterPanel>
              <SplitterPanel :size="70" :minSize="30">
                <div class="editor-container">
                  <Editor v-model="editorContent" editorStyle="height: 100%" />
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
  height: 50vh;
  border: 5px solid red;
  background-color: aqua;
  padding: 20px;
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