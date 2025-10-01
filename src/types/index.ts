// 基础类型定义
export interface BaseEntity {
  id: string;
  label: string;
  icon?: string;
}

// 笔记相关类型
export interface Note {
  id: string;
  title: string;
  snippet?: string;
  updatedAt?: string;
  tags?: string[];
  content?: string;
  folderId?: string;
  icon?: string;
  isStarred?: boolean;
}

// 文件夹相关类型
export interface FolderNode extends BaseEntity {
  children?: FolderNode[];
  parentId?: string;
  isExpanded?: boolean;
  isSystem?: boolean;
}

// 标签相关类型
export interface Tag extends BaseEntity {
  count?: number;
  color?: string;
}

// 组件Props类型
export interface ListItemProps {
  activeId?: string;
  dense?: boolean;
}

export interface SelectableItemProps extends ListItemProps {
  onSelect?: (id: string) => void;
}

// 事件类型
export interface SelectEvent {
  (e: "select", id: string): void;
}

export interface ClickEvent {
  (e: "click"): void;
}

// 布局相关类型
export interface LayoutConfig {
  sidebarWidth: number;
  splitterSize: number;
  minSize: number;
}

// 应用状态类型
export interface AppState {
  activeNoteId: string | null;
  activeFolderId: string;
  activeTagId: string;
  sidebarVisible: boolean;
  editorContent: string;
}

// 主题类型
export interface ThemeConfig {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  hoverColor: string;
  activeColor: string;
}
