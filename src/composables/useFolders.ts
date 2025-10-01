import { ref, computed } from "vue";
import type { FolderNode } from "@/types";
import { getStorage } from "@/storage";
import { createDefaultFolders } from "@/data";
import { generateFolderId } from "@/utils/idGenerator";

export function useFolders() {
  const storage = getStorage();
  const folders = ref<FolderNode[]>([]);
  const activeFolderId = ref<string>("all");

  const activeFolder = computed(() => 
    findFolderById(folders.value, activeFolderId.value)
  );

  function findFolderById(folderList: FolderNode[], id: string): FolderNode | undefined {
    for (const folder of folderList) {
      if (folder.id === id) {
        return folder;
      }
      if (folder.children) {
        const found = findFolderById(folder.children, id);
        if (found) return found;
      }
    }
    return undefined;
  }

  function selectFolder(id: string) {
    activeFolderId.value = id;
  }

  function toggleFolder(id: string) {
    const folder = findFolderById(folders.value, id);
    if (folder) {
      folder.isExpanded = !folder.isExpanded;
    }
  }

  function createFolder(parentId: string | null, folder: Omit<FolderNode, "id" | "children">) {
    const newFolder: FolderNode = {
      ...folder,
      id: generateFolderId(),
      parentId: parentId || undefined,
    };

    if (parentId) {
      const parent = findFolderById(folders.value, parentId);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(newFolder);
      }
    } else {
      folders.value.push(newFolder);
    }

    saveFolders(); // 自动保存
    console.log('📁 创建新文件夹:', newFolder.label, 'ID:', newFolder.id);
    
    return newFolder;
  }

  function deleteFolder(id: string) {
    const deleteFromList = (list: FolderNode[]): boolean => {
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) {
          list.splice(i, 1);
          return true;
        }
        if (list[i].children && deleteFromList(list[i].children!)) {
          return true;
        }
      }
      return false;
    };

    deleteFromList(folders.value);
    if (activeFolderId.value === id) {
      activeFolderId.value = "all";
    }
    saveFolders(); // 自动保存
  }

  // 初始化文件夹数据
  async function initializeFolders() {
    try {
      const storedFolders = storage.getFolders();
      console.log('📁 文件夹数据加载:', {
        存储中的数据: Object.keys(storedFolders).length,
        存储的键: Object.keys(storedFolders)
      });
      
      if (Object.keys(storedFolders).length > 0) {
        // 将存储的文件夹数据转换为数组
        folders.value = Object.values(storedFolders);
        console.log('✅ 从存储加载文件夹数据:', folders.value.length, '个文件夹');
      } else {
        // 没有存储数据，创建默认文件夹结构
        folders.value = createDefaultFolders();
        console.log('🔄 创建默认文件夹结构:', folders.value.length, '个文件夹');
        await saveFolders();
        console.log('💾 默认文件夹数据已保存到存储');
      }
    } catch (error) {
      console.error('❌ 文件夹数据加载失败:', error);
    }
  }


  // 保存文件夹到存储
  async function saveFolders() {
    try {
      const foldersMap: Record<string, FolderNode> = {};
      folders.value.forEach(folder => {
        foldersMap[folder.id] = folder;
      });
      console.log('💾 保存文件夹数据:', {
        文件夹数量: folders.value.length,
        文件夹列表: folders.value.map(f => f.label)
      });
      storage.updateFolders(foldersMap);
      await storage.save();
      console.log('✅ 文件夹数据保存成功');
    } catch (error) {
      console.error('❌ 保存文件夹失败:', error);
    }
  }

  return {
    folders,
    activeFolderId,
    activeFolder,
    selectFolder,
    toggleFolder,
    createFolder,
    deleteFolder,
    initializeFolders,
    saveFolders,
  };
}
