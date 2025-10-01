// 存储管理器
import { reactive, watch } from 'vue';
import type { StorageAdapter, StorageConfig, StoredData, StorageEvent, StorageListener } from './types';

export class StorageManager {
  private config: StorageConfig;
  private adapter: StorageAdapter;
  private listeners: StorageListener[] = [];
  private autoSaveTimer: number | null = null;
  private isInitialized = false;

  // 响应式数据
  public data = reactive<StoredData>({
    version: {
      version: '1.0.0',
      timestamp: Date.now(),
    },
    notes: {},
    folders: {},
    tags: {},
    settings: {},
    state: {},
  });

  constructor(config: StorageConfig) {
    this.config = config;
    this.adapter = config.adapter;
    this.setupAutoSave();
  }

  // 初始化存储
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // 尝试加载现有数据
      const existingData = await this.adapter.get<StoredData>('app-data');
      if (existingData) {
        Object.assign(this.data, existingData);
      }

      // 监听数据变化
      this.watchDataChanges();
      
      this.isInitialized = true;
      this.emitEvent({ type: 'load', timestamp: Date.now() });
    } catch (error) {
      console.error('Failed to initialize storage:', error);
      this.emitEvent({ 
        type: 'error', 
        error: error as Error, 
        timestamp: Date.now() 
      });
    }
  }

  // 保存数据
  async save(): Promise<void> {
    try {
      this.data.version.timestamp = Date.now();
      
      // 使用 JSON 序列化/反序列化来创建纯对象，避免 Vue reactive 代理
      const dataToSave: StoredData = JSON.parse(JSON.stringify(this.data));
      
      await this.adapter.set('app-data', dataToSave);
      
      this.emitEvent({ type: 'save', timestamp: Date.now() });
    } catch (error) {
      console.error('❌ 保存数据失败:', error);
      this.emitEvent({ 
        type: 'error', 
        error: error as Error, 
        timestamp: Date.now() 
      });
      throw error;
    }
  }

  // 加载数据
  async load(): Promise<void> {
    try {
      const data = await this.adapter.get<StoredData>('app-data');
      if (data) {
        Object.assign(this.data, data);
        this.emitEvent({ type: 'load', timestamp: Date.now() });
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      this.emitEvent({ 
        type: 'error', 
        error: error as Error, 
        timestamp: Date.now() 
      });
      throw error;
    }
  }

  // 清空数据
  async clear(): Promise<void> {
    try {
      await this.adapter.clear();
      this.resetData();
      this.emitEvent({ type: 'clear', timestamp: Date.now() });
    } catch (error) {
      console.error('Failed to clear data:', error);
      this.emitEvent({ 
        type: 'error', 
        error: error as Error, 
        timestamp: Date.now() 
      });
      throw error;
    }
  }

  // 导出数据
  async exportData(): Promise<StoredData> {
    return JSON.parse(JSON.stringify(this.data));
  }

  // 导入数据
  async importData(data: StoredData): Promise<void> {
    try {
      Object.assign(this.data, data);
      await this.save();
      this.emitEvent({ type: 'save', timestamp: Date.now() });
    } catch (error) {
      console.error('Failed to import data:', error);
      this.emitEvent({ 
        type: 'error', 
        error: error as Error, 
        timestamp: Date.now() 
      });
      throw error;
    }
  }

  // 获取特定类型的数据
  getNotes() {
    return this.data.notes;
  }

  getFolders() {
    return this.data.folders;
  }

  getTags() {
    return this.data.tags;
  }

  getSettings() {
    return this.data.settings;
  }

  getState() {
    return this.data.state;
  }

  // 获取存储适配器
  getAdapter() {
    return this.adapter;
  }

  // 更新特定类型的数据
  updateNotes(notes: Record<string, any>) {
    this.data.notes = notes;
  }

  updateFolders(folders: Record<string, any>) {
    this.data.folders = folders;
  }

  updateTags(tags: Record<string, any>) {
    this.data.tags = tags;
  }

  updateSettings(settings: Record<string, any>) {
    this.data.settings = settings;
  }

  updateState(state: Record<string, any>) {
    this.data.state = state;
  }

  // 监听器管理
  addListener(listener: StorageListener) {
    this.listeners.push(listener);
  }

  removeListener(listener: StorageListener) {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  // 私有方法
  private setupAutoSave() {
    if (!this.config.autoSave) return;

    this.autoSaveTimer = window.setInterval(() => {
      this.save().catch(console.error);
    }, this.config.saveInterval);
  }

  private watchDataChanges() {
    let saveTimeout: ReturnType<typeof setTimeout> | null = null;
    
    // 监听数据变化，自动保存（带防抖）
    watch(
      () => this.data,
      () => {
        if (this.isInitialized && this.config.autoSave) {
          // 清除之前的定时器
          if (saveTimeout) {
            clearTimeout(saveTimeout);
          }
          
          // 设置新的定时器，延迟保存
          saveTimeout = setTimeout(() => {
            this.save().catch(console.error);
          }, this.config.saveInterval || 3000);
        }
      },
      { deep: true }
    );
  }

  private resetData() {
    Object.assign(this.data, {
      version: {
        version: '1.0.0',
        timestamp: Date.now(),
      },
      notes: {},
      folders: {},
      tags: {},
      settings: {},
      state: {},
    });
  }

  private emitEvent(event: StorageEvent) {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in storage listener:', error);
      }
    });
  }

  // 清理资源
  destroy() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
    this.listeners = [];
  }
}
