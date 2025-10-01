import type { FolderNode } from "@/types";

export const mockFolders: FolderNode[] = [
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
  { id: "archive", label: "归档", icon: "pi pi-archive" },
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


