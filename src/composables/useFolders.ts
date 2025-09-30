import { ref, computed } from "vue";
import type { FolderNode } from "@/types";
import { mockFolders } from "@/mock/folders";

export function useFolders() {
  const folders = ref<FolderNode[]>(mockFolders);
  const activeFolderId = ref<string>("inbox");

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
      id: `folder_${Date.now()}`,
      parentId,
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

    return newFolder;
  }

  function deleteFolder(id: string) {
    const deleteFromList = (list: FolderNode[]): boolean => {
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) {
          list.splice(i, 1);
          return true;
        }
        if (list[i].children && deleteFromList(list[i].children)) {
          return true;
        }
      }
      return false;
    };

    deleteFromList(folders.value);
    if (activeFolderId.value === id) {
      activeFolderId.value = "inbox";
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
  };
}
