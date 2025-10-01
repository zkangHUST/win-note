// 笔记存储管理器
import { reactive } from 'vue';
import type { Note } from '@/types';
import { getStorage } from './index';

export interface NoteMetadata {
  id: string;
  title: string;
  snippet?: string;
  updatedAt: string;
  tags?: string[];
  folderId?: string;
  icon?: string;
}

export class NoteStorageManager {
  private storage = getStorage();
  private notesMetadata = reactive<Record<string, NoteMetadata>>({});
  private notesContent = reactive<Record<string, string>>({});
  private loadedNotes = new Set<string>();

  // 获取笔记元数据列表
  getNotesMetadata(): Record<string, NoteMetadata> {
    return this.notesMetadata;
  }

  // 获取单个笔记的完整内容
  async getNoteContent(noteId: string): Promise<string> {
    if (this.loadedNotes.has(noteId)) {
      return this.notesContent[noteId] || '';
    }

    try {
      // 从存储中加载笔记内容
      const content = await this.storage.getAdapter().get<string>(`note-content-${noteId}`);
      this.notesContent[noteId] = content || '';
      this.loadedNotes.add(noteId);
      return this.notesContent[noteId];
    } catch (error) {
      console.error(`Failed to load note content for ${noteId}:`, error);
      return '';
    }
  }

  // 保存笔记元数据
  async saveNoteMetadata(note: NoteMetadata): Promise<void> {
    this.notesMetadata[note.id] = note;
    // 转换为纯对象以避免 IndexedDB 克隆错误
    const plainMetadata = JSON.parse(JSON.stringify(this.notesMetadata));
    await this.storage.getAdapter().set('notes-metadata', plainMetadata);
  }

  // 保存笔记内容
  async saveNoteContent(noteId: string, content: string): Promise<void> {
    this.notesContent[noteId] = content;
    this.loadedNotes.add(noteId);
    await this.storage.getAdapter().set(`note-content-${noteId}`, content);
  }

  // 保存完整笔记
  async saveNote(note: Note): Promise<void> {
    const metadata: NoteMetadata = {
      id: note.id,
      title: note.title,
      snippet: note.snippet,
      updatedAt: note.updatedAt || new Date().toISOString().split('T')[0],
      tags: note.tags,
      folderId: note.folderId,
      icon: note.icon,
    };

    await this.saveNoteMetadata(metadata);
    
    if (note.content) {
      await this.saveNoteContent(note.id, note.content);
    }
  }

  // 删除笔记
  async deleteNote(noteId: string): Promise<void> {
    delete this.notesMetadata[noteId];
    delete this.notesContent[noteId];
    this.loadedNotes.delete(noteId);
    
    // 转换为纯对象以避免 IndexedDB 克隆错误
    const plainMetadata = JSON.parse(JSON.stringify(this.notesMetadata));
    await this.storage.getAdapter().set('notes-metadata', plainMetadata);
    await this.storage.getAdapter().set(`note-content-${noteId}`, '');
  }

  // 初始化笔记元数据
  async initializeNotesMetadata(): Promise<void> {
    try {
      const metadata = await this.storage.getAdapter().get<Record<string, NoteMetadata>>('notes-metadata');
      if (metadata) {
        Object.assign(this.notesMetadata, metadata);
      }
    } catch (error) {
      console.error('Failed to initialize notes metadata:', error);
    }
  }

  // 获取笔记列表（只包含元数据）
  getNotesList(): NoteMetadata[] {
    return Object.values(this.notesMetadata);
  }

  // 检查笔记内容是否已加载
  isNoteContentLoaded(noteId: string): boolean {
    return this.loadedNotes.has(noteId);
  }
}

// 单例实例
let noteStorageInstance: NoteStorageManager | null = null;

export function getNoteStorage(): NoteStorageManager {
  if (!noteStorageInstance) {
    noteStorageInstance = new NoteStorageManager();
  }
  return noteStorageInstance;
}
