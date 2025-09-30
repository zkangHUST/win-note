import { ref, computed } from "vue";
import type { Note } from "@/types";
import { mockNotes } from "@/mock/notes";

export function useNotes() {
  const notes = ref<Note[]>(mockNotes);
  const activeNoteId = ref<string>(mockNotes[0]?.id ?? "");
  const editorContent = ref<string>(mockNotes[0]?.snippet ?? "");

  const activeNote = computed(() => 
    notes.value.find(note => note.id === activeNoteId.value)
  );

  const filteredNotes = computed(() => notes.value);

  function selectNote(id: string) {
    activeNoteId.value = id;
    const note = notes.value.find(n => n.id === id);
    if (note) {
      editorContent.value = note.snippet ?? "";
    }
  }

  function updateNoteContent(id: string, content: string) {
    const note = notes.value.find(n => n.id === id);
    if (note) {
      note.snippet = content;
      editorContent.value = content;
    }
  }

  function createNote(note: Omit<Note, "id">) {
    const newNote: Note = {
      ...note,
      id: `note_${Date.now()}`,
    };
    notes.value.unshift(newNote);
    return newNote;
  }

  function deleteNote(id: string) {
    const index = notes.value.findIndex(n => n.id === id);
    if (index > -1) {
      notes.value.splice(index, 1);
      if (activeNoteId.value === id) {
        activeNoteId.value = notes.value[0]?.id ?? "";
        editorContent.value = notes.value[0]?.snippet ?? "";
      }
    }
  }

  return {
    notes: filteredNotes,
    activeNoteId,
    activeNote,
    editorContent,
    selectNote,
    updateNoteContent,
    createNote,
    deleteNote,
  };
}
