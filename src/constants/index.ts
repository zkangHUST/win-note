// 应用常量定义

// 应用配置
export const APP_CONFIG = {
  name: "Win Note",
  version: "0.1.0",
  description: "一个简洁的笔记应用",
} as const;

// 布局配置
export const LAYOUT_CONFIG = {
  sidebarWidth: 200,
  splitterSize: 8,
  minSize: 15,
  maxSize: 85,
} as const;

// 编辑器配置
export const EDITOR_CONFIG = {
  placeholder: "开始记录你的想法...",
  toolbar: [
    ["bold", "italic", "underline"],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
} as const;

// 存储键名
export const STORAGE_KEYS = {
  notes: "win-note-notes",
  folders: "win-note-folders",
  tags: "win-note-tags",
  settings: "win-note-settings",
  activeNoteId: "win-note-active-note-id",
  activeFolderId: "win-note-active-folder-id",
  activeTagId: "win-note-active-tag-id",
} as const;

// 事件名称
export const EVENTS = {
  noteCreated: "note:created",
  noteUpdated: "note:updated",
  noteDeleted: "note:deleted",
  folderSelected: "folder:selected",
  tagSelected: "tag:selected",
  editorContentChanged: "editor:content-changed",
} as const;

// 默认值
export const DEFAULTS = {
  noteTitle: "无标题笔记",
  folderName: "新建文件夹",
  tagName: "新标签",
  maxTitleLength: 100,
  maxSnippetLength: 200,
} as const;

// 主题配置
export const THEME_CONFIG = {
  light: {
    primary: "#3b82f6",
    background: "#ffffff",
    surface: "#f9fafb",
    text: "#111827",
  },
  dark: {
    primary: "#60a5fa",
    background: "#111827",
    surface: "#1f2937",
    text: "#f9fafb",
  },
} as const;
