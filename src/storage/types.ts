// 存储层类型定义

export interface StorageAdapter {
  // 基础 CRUD 操作
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  
  // 批量操作
  getAll<T>(): Promise<Record<string, T>>;
  setMultiple<T>(data: Record<string, T>): Promise<void>;
  
  // 键管理
  keys(): Promise<string[]>;
  has(key: string): Promise<boolean>;
}

// 存储配置
export interface StorageConfig {
  adapter: StorageAdapter;
  prefix: string;
  version: string;
  autoSave: boolean;
  saveInterval: number; // 毫秒
}

// 数据版本控制
export interface DataVersion {
  version: string;
  timestamp: number;
  checksum?: string;
}

// 存储的数据结构
export interface StoredData {
  version: DataVersion;
  notes: Record<string, any>;
  folders: Record<string, any>;
  tags: Record<string, any>;
  settings: Record<string, any>;
  state: Record<string, any>;
}

// 存储事件
export interface StorageEvent {
  type: 'save' | 'load' | 'error' | 'clear';
  key?: string;
  data?: any;
  error?: Error;
  timestamp: number;
}

// 存储监听器
export type StorageListener = (event: StorageEvent) => void;
