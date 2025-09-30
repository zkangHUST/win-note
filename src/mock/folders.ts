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
];


