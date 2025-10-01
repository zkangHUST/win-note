import { ref, computed, type Ref } from "vue";
import type { Note } from "@/types";
import { mockNotes } from "@/mock/notes";
import { getStorage } from "@/storage";
import { getNoteStorage, type NoteMetadata } from "@/storage/noteStorage";
import { generateNoteId } from "@/utils/idGenerator";

export function useNotes(activeFolderId?: Ref<string>) {
  const storage = getStorage();
  const noteStorage = getNoteStorage();
  const notes = ref<NoteMetadata[]>([]);
  const activeNoteId = ref<string>("");
  const editorContent = ref<string>("");

  const activeNote = computed(() => 
    notes.value.find(note => note.id === activeNoteId.value)
  );

  const filteredNotes = computed(() => {
    console.log("🔄 重新计算笔记列表, 当前文件夹ID:", activeFolderId?.value);
    console.log("📝 所有笔记:", notes.value.map(n => ({ id: n.id, title: n.title, folderId: n.folderId, isStarred: n.isStarred })));
    
    if (!activeFolderId?.value || activeFolderId.value === 'all') {
      // 在"全部"文件夹中，排除回收站中的笔记
      const result = notes.value.filter(note => note.folderId !== 'trash');
      console.log("📁 全部文件夹 - 过滤后笔记:", result.map(n => ({ id: n.id, title: n.title, folderId: n.folderId })));
      return result;
    }
    
    if (activeFolderId.value === 'favorites') {
      // 在"收藏"文件夹中，显示所有收藏的笔记
      const result = notes.value.filter(note => note.isStarred === true);
      console.log("⭐ 收藏文件夹 - 过滤后笔记:", result.map(n => ({ id: n.id, title: n.title, folderId: n.folderId, isStarred: n.isStarred })));
      return result;
    }
    
    const result = notes.value.filter(note => note.folderId === activeFolderId.value);
    console.log(`📁 文件夹 ${activeFolderId.value} - 过滤后笔记:`, result.map(n => ({ id: n.id, title: n.title, folderId: n.folderId })));
    return result;
  });

  async function selectNote(id: string) {
    // 如果当前有选中的笔记，先检查内容是否有变化并保存
    if (activeNoteId.value && activeNoteId.value !== id) {
      const currentNote = notes.value.find(n => n.id === activeNoteId.value);
      if (currentNote) {
        console.log("💾 检测到内容变化，自动保存笔记:", currentNote.title);
        await noteStorage.saveNoteContent(activeNoteId.value, editorContent.value);
        // 更新元数据
        const updatedMetadata = {
          ...currentNote,
          updatedAt: new Date().toISOString().split('T')[0],
        };
        await noteStorage.saveNoteMetadata(updatedMetadata);
      }
    }
    
    // 切换到新笔记
    activeNoteId.value = id;
    const note = notes.value.find(n => n.id === id);
    if (note) {
      // 按需加载笔记内容
      editorContent.value = await noteStorage.getNoteContent(id);
    }
  }

  // 初始化数据
  async function initializeNotes() {
    try {
      // 初始化笔记存储
      await noteStorage.initializeNotesMetadata();
      
      // 获取笔记元数据列表
      const notesList = noteStorage.getNotesList();
      
      if (notesList.length > 0) {
        notes.value = notesList;
        if (notes.value.length > 0) {
          activeNoteId.value = notes.value[0].id;
          // 按需加载第一个笔记的内容
          editorContent.value = await noteStorage.getNoteContent(notes.value[0].id);
        }
      } else {
        // 使用 mock 数据初始化
        console.log("🔄 使用 mock 数据初始化笔记");
        for (const mockNote of mockNotes) {
          const noteMetadata: NoteMetadata = {
            id: mockNote.id,
            title: mockNote.title,
            snippet: mockNote.snippet,
            updatedAt: mockNote.updatedAt || new Date().toISOString().split('T')[0],
            tags: mockNote.tags,
            folderId: mockNote.folderId,
            icon: mockNote.icon,
          };
          await noteStorage.saveNoteMetadata(noteMetadata);
          if (mockNote.content) {
            await noteStorage.saveNoteContent(mockNote.id, mockNote.content);
          }
        }
        
        // 重新加载笔记列表
        notes.value = noteStorage.getNotesList();
        if (notes.value.length > 0) {
          activeNoteId.value = notes.value[0].id;
          editorContent.value = await noteStorage.getNoteContent(notes.value[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to initialize notes:', error);
      // 降级到 mock 数据
      notes.value = mockNotes.map(n => ({
        id: n.id,
        title: n.title,
        snippet: n.snippet,
        updatedAt: n.updatedAt || new Date().toISOString().split('T')[0],
        tags: n.tags,
        folderId: n.folderId,
        icon: n.icon,
      }));
      if (notes.value.length > 0) {
        activeNoteId.value = notes.value[0].id;
        editorContent.value = notes.value[0].snippet ?? "";
      }
    }
  }

  // 保存笔记到存储
  async function saveNotes() {
    try {
      const notesMap: Record<string, Note> = {};
      notes.value.forEach(note => {
        notesMap[note.id] = note;
      });
      storage.updateNotes(notesMap);
      await storage.save();
    } catch (error) {
      console.error('Failed to save notes:', error);
    }
  }

  async function updateNoteContent(id: string, content: string) {
    const note = notes.value.find(n => n.id === id);
    if (note) {
      // 从 HTML 中提取标题和摘要
      const { title, snippet } = await extractTitleAndSnippetFromHTML(content);
      
      // 更新元数据
      const updatedMetadata = {
        ...note,
        updatedAt: new Date().toISOString().split('T')[0],
        snippet: snippet,
      };
      
      if (title && title !== note.title && title !== "新笔记") {
        console.log("📝 标题变化:", note.title, "->", title);
        updatedMetadata.title = title;
      }
      
      // 更新本地数据
      Object.assign(note, updatedMetadata);
      
      // 保存元数据
      await noteStorage.saveNoteMetadata(updatedMetadata);
      
      // 保存内容
      await noteStorage.saveNoteContent(id, content);
    }
  }

  // 从 HTML 中提取第一个和第二个非空行作为标题和摘要
  async function extractTitleAndSnippetFromHTML(content: string): Promise<{ title: string; snippet: string }> {
    if (!content || content.trim() === '') return { title: "", snippet: "" };
    
    // 将整个 HTML 内容转换为纯文本
    console.log("contenr:", content);
    const plainText = await htmlToPlainText(content);
    console.log("🔍 HTML 转换为纯文本:", plainText.substring(0, 100));
    
    // 按行分割并找到非空行
    const lines = plainText.split('\n');
    const nonEmptyLines = lines
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    console.log("📝 非空行数量:", nonEmptyLines.length);
    
    let title = "";
    let snippet = "";
    
    if (nonEmptyLines.length >= 1) {
      // 第一个非空行作为标题
      title = nonEmptyLines[0];
      console.log("📝 第一个非空行作为标题:", title);
    }
    
    if (nonEmptyLines.length >= 2) {
      // 第二个非空行作为摘要
      snippet = nonEmptyLines[1];
      console.log("📄 第二个非空行作为摘要:", snippet);
    } else if (nonEmptyLines.length === 1) {
      // 如果只有一个非空行，将其内容作为摘要
      snippet = title;
      console.log("📄 只有一个非空行，作为摘要:", snippet);
    }
    
    // 限制标题长度
    if (title && title.length > 50) {
      title = title.substring(0, 50) + '...';
    }
    
    return { title, snippet };
  }

  // HTML 到纯文本的转换函数（使用 html-to-text 库）
  async function htmlToPlainText(html: string): Promise<string> {
    if (!html) return "";
    
    try {
      // 动态导入 html-to-text 库
      const { convert } = await import('html-to-text') as any;
      
      // 使用 html-to-text 库进行转换
      const text = convert(html, {
        wordwrap: false,  // 不自动换行
        selectors: [
          { selector: 'a', options: { ignoreHref: true } },  // 忽略链接地址
          { selector: 'img', format: 'skip' },  // 跳过图片
          { selector: 'br', format: 'skip' },   // 跳过换行标签
        ]
      });
      
      // 只去除首尾空白，保持原始格式
      return text.trim();
    } catch (error) {
      console.warn('HTML 转换失败，使用备用方法:', error);
      // 备用方法：简单的正则表达式替换
      return html.replace(/<[^>]*>/g, '').trim();
    }
  }

  async function createNote(note: Omit<Note, "id">) {
    const noteId = generateNoteId();
    const newNoteMetadata: NoteMetadata = {
      id: noteId,
      title: note.title,
      snippet: note.snippet,
      updatedAt: new Date().toISOString().split('T')[0],
      tags: note.tags,
      folderId: note.folderId,
      icon: note.icon,
    };
    
    // 保存元数据
    await noteStorage.saveNoteMetadata(newNoteMetadata);
    
    // 保存内容
    if (note.content) {
      await noteStorage.saveNoteContent(noteId, note.content);
    }
    
    // 更新本地列表
    notes.value.unshift(newNoteMetadata);
    
    console.log("📝 创建新笔记:", newNoteMetadata.title);
    return newNoteMetadata;
  }

  async function deleteNote(id: string) {
    const index = notes.value.findIndex(n => n.id === id);
    if (index > -1) {
      // 从存储中删除
      await noteStorage.deleteNote(id);
      
      // 从本地列表中删除
      notes.value.splice(index, 1);
      
      if (activeNoteId.value === id) {
        activeNoteId.value = notes.value[0]?.id ?? "";
        if (notes.value[0]) {
          editorContent.value = await noteStorage.getNoteContent(notes.value[0].id);
        } else {
          editorContent.value = "";
        }
      }
    }
  }

  async function moveNoteToFolder(noteId: string, folderId: string) {
    const note = notes.value.find(n => n.id === noteId);
    if (note) {
      const updatedMetadata = {
        ...note,
        folderId: folderId,
        updatedAt: new Date().toISOString().split('T')[0],
      };
      
      // 更新本地数据
      Object.assign(note, updatedMetadata);
      
      // 保存到存储
      await noteStorage.saveNoteMetadata(updatedMetadata);
      
      return note;
    }
    return null;
  }

  async function toggleStar(noteId: string) {
    const note = notes.value.find(n => n.id === noteId);
    if (note) {
      const updatedMetadata = {
        ...note,
        isStarred: !note.isStarred,
        updatedAt: new Date().toISOString().split('T')[0],
      };
      
      // 更新本地数据
      Object.assign(note, updatedMetadata);
      
      // 保存到存储
      await noteStorage.saveNoteMetadata(updatedMetadata);
      
      console.log("⭐ 切换收藏状态:", note.title, "->", updatedMetadata.isStarred ? "已收藏" : "未收藏");
      return note;
    }
    return null;
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
    moveNoteToFolder,
    toggleStar,
    initializeNotes,
    saveNotes,
  };
}
