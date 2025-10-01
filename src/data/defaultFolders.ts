import type { FolderNode } from "@/types";

/**
 * 默认文件夹结构配置
 * 用于应用首次启动时的初始化
 */
export const DEFAULT_FOLDERS: FolderNode[] = [
  { id: "all", label: "全部", icon: "pi pi-th-large" },
  { id: "inbox", label: "收件箱", icon: "pi pi-inbox" },
  {
    id: "notes",
    label: "我的笔记",
    icon: "pi pi-book",
    children: [
      { id: "daily", label: "日记" },
      { id: "ideas", label: "想法" },
    ],
  },
  { id: "archive", label: "归档", icon: "pi pi-inbox" },
  { id: "work", label: "工作", icon: "pi pi-briefcase" },
  {
    id: "projects",
    label: "项目",
    icon: "pi pi-folder",
    children: [
      { id: "project-a", label: "项目A" },
      { id: "project-b", label: "项目B" },
      { id: "project-c", label: "项目C" },
    ],
  },
  { id: "personal", label: "个人", icon: "pi pi-user" },
  {
    id: "learning",
    label: "学习",
    icon: "pi pi-graduation-cap",
    children: [
      { id: "tutorials", label: "教程" },
      { id: "research", label: "研究" },
      { id: "notes", label: "笔记" },
    ],
  },
  { id: "favorites", label: "收藏", icon: "pi pi-star" },
  { id: "trash", label: "回收站", icon: "pi pi-trash" },
];

/**
 * 获取默认文件夹结构
 * @returns 默认文件夹数组
 */
export function getDefaultFolders(): FolderNode[] {
  return [...DEFAULT_FOLDERS];
}

/**
 * 创建默认文件夹结构（深拷贝）
 * @returns 默认文件夹数组的深拷贝
 */
export function createDefaultFolders(): FolderNode[] {
  return JSON.parse(JSON.stringify(DEFAULT_FOLDERS));
}
