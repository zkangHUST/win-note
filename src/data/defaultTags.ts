import type { Tag } from "@/types";

/**
 * 默认标签配置
 * 用于应用首次启动时的初始化
 */
export const DEFAULT_TAGS: Tag[] = [
  { id: "all", label: "全部", count: 128, icon: "pi pi-tags" },
  { id: "work", label: "工作", count: 42, color: "#3b82f6" },
  { id: "life", label: "生活记录", count: 31, color: "#10b981" },
  { id: "idea", label: "想法", count: 17, color: "#f59e0b" },
  { id: "project", label: "项目文档", count: 25, color: "#8b5cf6" },
  { id: "meeting", label: "会议", count: 12, color: "#06b6d4" },
  { id: "study", label: "学习笔记", count: 18, color: "#84cc16" },
  { id: "travel", label: "旅行", count: 8, color: "#f97316" },
  { id: "health", label: "健康管理", count: 15, color: "#ef4444" },
  { id: "finance", label: "财务", count: 9, color: "#22c55e" },
  { id: "family", label: "家庭事务", count: 22, color: "#ec4899" },
  { id: "friends", label: "朋友", count: 14, color: "#6366f1" },
  { id: "hobby", label: "爱好", count: 11, color: "#f59e0b" },
  { id: "shopping", label: "购物清单", count: 6, color: "#8b5cf6" },
  { id: "food", label: "美食", count: 13, color: "#f97316" },
  { id: "sports", label: "运动", count: 7, color: "#10b981" },
  { id: "music", label: "音乐收藏", count: 5, color: "#ec4899" },
  { id: "movie", label: "电影", count: 4, color: "#6366f1" },
  { id: "book", label: "读书心得", count: 16, color: "#84cc16" },
  { id: "tech", label: "技术", count: 19, color: "#06b6d4" },
  { id: "daily", label: "日常", count: 23, color: "#a855f7" },
  { id: "plan", label: "计划", count: 10, color: "#f43f5e" },
  { id: "goal", label: "目标", count: 14, color: "#06b6d4" },
  { id: "task", label: "任务", count: 21, color: "#84cc16" },
  { id: "note", label: "笔记", count: 33, color: "#f59e0b" },
  { id: "memo", label: "备忘", count: 7, color: "#8b5cf6" },
  { id: "todo", label: "待办", count: 19, color: "#ef4444" },
  { id: "done", label: "完成", count: 16, color: "#10b981" },
  { id: "urgent", label: "紧急", count: 5, color: "#f97316" },
  { id: "important", label: "重要", count: 12, color: "#ec4899" },
];

/**
 * 获取默认标签
 * @returns 默认标签数组
 */
export function getDefaultTags(): Tag[] {
  return [...DEFAULT_TAGS];
}

/**
 * 创建默认标签（深拷贝）
 * @returns 默认标签数组的深拷贝
 */
export function createDefaultTags(): Tag[] {
  return JSON.parse(JSON.stringify(DEFAULT_TAGS));
}
