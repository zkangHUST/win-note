import { getStorage } from '@/storage';
import type { Note, FolderNode, Tag } from '@/types';

/**
 * 数据清理工具
 * 用于清理和修复存储中的脏数据
 */
export class DataCleaner {
  private storage = getStorage();

  /**
   * 清理所有脏数据
   */
  async cleanAllDirtyData(): Promise<{
    cleaned: boolean;
    issues: string[];
    fixed: string[];
  }> {
    const issues: string[] = [];
    const fixed: string[] = [];

    try {
      // 1. 清理笔记数据
      const noteIssues = await this.cleanNotes();
      issues.push(...noteIssues.issues);
      fixed.push(...noteIssues.fixed);

      // 2. 清理文件夹数据
      const folderIssues = await this.cleanFolders();
      issues.push(...folderIssues.issues);
      fixed.push(...folderIssues.fixed);

      // 3. 清理标签数据
      const tagIssues = await this.cleanTags();
      issues.push(...tagIssues.issues);
      fixed.push(...tagIssues.fixed);

      // 4. 清理孤立数据
      const orphanIssues = await this.cleanOrphanedData();
      issues.push(...orphanIssues.issues);
      fixed.push(...orphanIssues.fixed);

      // 5. 保存清理后的数据
      if (fixed.length > 0) {
        await this.storage.save();
        fixed.push('数据已保存到存储');
      }

      return {
        cleaned: issues.length > 0,
        issues,
        fixed,
      };
    } catch (error) {
      console.error('数据清理失败:', error);
      return {
        cleaned: false,
        issues: [`清理失败: ${error}`],
        fixed: [],
      };
    }
  }

  /**
   * 清理笔记数据
   */
  private async cleanNotes(): Promise<{ issues: string[]; fixed: string[] }> {
    const issues: string[] = [];
    const fixed: string[] = [];
    const notes = this.storage.getNotes();

    for (const [id, note] of Object.entries(notes)) {
      // 检查必需字段
      if (!note.id || !note.label || !note.title) {
        issues.push(`笔记 ${id} 缺少必需字段`);
        delete notes[id];
        fixed.push(`删除无效笔记: ${id}`);
        continue;
      }

      // 检查 ID 一致性
      if (note.id !== id) {
        issues.push(`笔记 ${id} ID 不一致`);
        note.id = id;
        fixed.push(`修复笔记 ID: ${id}`);
      }

      // 检查时间格式
      if (note.updatedAt && !this.isValidDate(note.updatedAt)) {
        issues.push(`笔记 ${id} 时间格式无效`);
        note.updatedAt = new Date().toISOString().split('T')[0];
        fixed.push(`修复笔记时间: ${id}`);
      }

      // 检查标签格式
      if (note.tags && !Array.isArray(note.tags)) {
        issues.push(`笔记 ${id} 标签格式无效`);
        note.tags = [];
        fixed.push(`修复笔记标签: ${id}`);
      }

      // 检查文件夹引用
      if (note.folderId && !this.folderExists(note.folderId)) {
        issues.push(`笔记 ${id} 引用了不存在的文件夹: ${note.folderId}`);
        note.folderId = undefined;
        fixed.push(`移除无效文件夹引用: ${id}`);
      }
    }

    this.storage.updateNotes(notes);
    return { issues, fixed };
  }

  /**
   * 清理文件夹数据
   */
  private async cleanFolders(): Promise<{ issues: string[]; fixed: string[] }> {
    const issues: string[] = [];
    const fixed: string[] = [];
    const folders = this.storage.getFolders();

    for (const [id, folder] of Object.entries(folders)) {
      // 检查必需字段
      if (!folder.id || !folder.label) {
        issues.push(`文件夹 ${id} 缺少必需字段`);
        delete folders[id];
        fixed.push(`删除无效文件夹: ${id}`);
        continue;
      }

      // 检查 ID 一致性
      if (folder.id !== id) {
        issues.push(`文件夹 ${id} ID 不一致`);
        folder.id = id;
        fixed.push(`修复文件夹 ID: ${id}`);
      }

      // 检查子文件夹
      if (folder.children) {
        const validChildren = folder.children.filter(child => {
          if (!child.id || !child.label) {
            issues.push(`子文件夹 ${child.id} 无效`);
            return false;
          }
          return true;
        });
        
        if (validChildren.length !== folder.children.length) {
          folder.children = validChildren;
          fixed.push(`清理文件夹 ${id} 的无效子项`);
        }
      }
    }

    this.storage.updateFolders(folders);
    return { issues, fixed };
  }

  /**
   * 清理标签数据
   */
  private async cleanTags(): Promise<{ issues: string[]; fixed: string[] }> {
    const issues: string[] = [];
    const fixed: string[] = [];
    const tags = this.storage.getTags();

    for (const [id, tag] of Object.entries(tags)) {
      // 检查必需字段
      if (!tag.id || !tag.label) {
        issues.push(`标签 ${id} 缺少必需字段`);
        delete tags[id];
        fixed.push(`删除无效标签: ${id}`);
        continue;
      }

      // 检查 ID 一致性
      if (tag.id !== id) {
        issues.push(`标签 ${id} ID 不一致`);
        tag.id = id;
        fixed.push(`修复标签 ID: ${id}`);
      }

      // 检查计数格式
      if (tag.count !== undefined && (typeof tag.count !== 'number' || tag.count < 0)) {
        issues.push(`标签 ${id} 计数无效`);
        tag.count = 0;
        fixed.push(`修复标签计数: ${id}`);
      }
    }

    this.storage.updateTags(tags);
    return { issues, fixed };
  }

  /**
   * 清理孤立数据
   */
  private async cleanOrphanedData(): Promise<{ issues: string[]; fixed: string[] }> {
    const issues: string[] = [];
    const fixed: string[] = [];
    const notes = this.storage.getNotes();
    const folders = this.storage.getFolders();
    const tags = this.storage.getTags();

    // 检查笔记中的标签引用
    const validTagIds = new Set(Object.keys(tags));
    for (const [noteId, note] of Object.entries(notes)) {
      if (note.tags) {
        const validTags = note.tags.filter(tagId => validTagIds.has(tagId));
        if (validTags.length !== note.tags.length) {
          issues.push(`笔记 ${noteId} 包含无效标签引用`);
          note.tags = validTags;
          fixed.push(`清理笔记 ${noteId} 的无效标签引用`);
        }
      }
    }

    // 检查笔记中的文件夹引用
    const validFolderIds = new Set(Object.keys(folders));
    for (const [noteId, note] of Object.entries(notes)) {
      if (note.folderId && !validFolderIds.has(note.folderId)) {
        issues.push(`笔记 ${noteId} 引用了不存在的文件夹`);
        note.folderId = undefined;
        fixed.push(`清理笔记 ${noteId} 的无效文件夹引用`);
      }
    }

    this.storage.updateNotes(notes);
    return { issues, fixed };
  }

  /**
   * 检查日期格式是否有效
   */
  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && dateString.match(/^\d{4}-\d{2}-\d{2}$/);
  }

  /**
   * 检查文件夹是否存在
   */
  private folderExists(folderId: string): boolean {
    const folders = this.storage.getFolders();
    return folderId in folders;
  }

  /**
   * 重置所有数据到默认状态
   */
  async resetToDefaults(): Promise<void> {
    try {
      console.log('🔄 重置数据到默认状态...');
      
      // 清空存储
      await this.storage.clear();
      
      // 重新初始化
      const { initializeStorage } = await import('@/storage');
      await initializeStorage();
      
      console.log('✅ 数据重置完成');
    } catch (error) {
      console.error('❌ 数据重置失败:', error);
      throw error;
    }
  }

  /**
   * 导出清理报告
   */
  async generateCleanReport(): Promise<{
    timestamp: string;
    totalNotes: number;
    totalFolders: number;
    totalTags: number;
    issues: string[];
    fixed: string[];
  }> {
    const notes = this.storage.getNotes();
    const folders = this.storage.getFolders();
    const tags = this.storage.getTags();

    const cleanResult = await this.cleanAllDirtyData();

    return {
      timestamp: new Date().toISOString(),
      totalNotes: Object.keys(notes).length,
      totalFolders: Object.keys(folders).length,
      totalTags: Object.keys(tags).length,
      issues: cleanResult.issues,
      fixed: cleanResult.fixed,
    };
  }
}

// 导出单例实例
export const dataCleaner = new DataCleaner();
