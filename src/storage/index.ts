// 存储层入口文件
export * from './types';
export * from './manager';
export * from './adapters/localStorage';
export * from './adapters/indexedDB';

// 存储工厂
import { StorageManager } from './manager';
import { LocalStorageAdapter } from './adapters/localStorage';
import { IndexedDBAdapter } from './adapters/indexedDB';
import type { StorageConfig } from './types';

// 创建默认存储配置
export function createDefaultStorage(): StorageManager {
  const adapter = new LocalStorageAdapter('win-note');
  
  const config: StorageConfig = {
    adapter,
    prefix: 'win-note',
    version: '1.0.0',
    autoSave: false, // 禁用自动保存
    saveInterval: 5000,
  };

  return new StorageManager(config);
}

// 创建 IndexedDB 存储配置
export function createIndexedDBStorage(): StorageManager {
  const adapter = new IndexedDBAdapter('WinNoteDB', 1);
  
  const config: StorageConfig = {
    adapter,
    prefix: 'win-note',
    version: '1.0.0',
    autoSave: false, // 禁用自动保存
    saveInterval: 3000,
  };

  return new StorageManager(config);
}

// 存储实例（单例）
let storageInstance: StorageManager | null = null;

export function getStorage(): StorageManager {
  if (!storageInstance) {
    // 优先使用 IndexedDB，降级到 LocalStorage
    if (typeof indexedDB !== 'undefined') {
      storageInstance = createIndexedDBStorage();
    } else {
      storageInstance = createDefaultStorage();
    }
  }
  return storageInstance;
}

// 初始化存储
export async function initializeStorage(): Promise<StorageManager> {
  const storage = getStorage();
  await storage.initialize();
  return storage;
}
