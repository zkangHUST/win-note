// IndexedDB 存储适配器
import type { StorageAdapter } from '../types';

export class IndexedDBAdapter implements StorageAdapter {
  private dbName: string;
  private dbVersion: number;
  private storeName: string;
  private db: IDBDatabase | null = null;

  constructor(dbName: string = 'WinNoteDB', version: number = 1) {
    this.dbName = dbName;
    this.dbVersion = version;
    this.storeName = 'data';
  }

  private async openDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'key' });
        }
      };
    });
  }

  private async getTransaction(mode: IDBTransactionMode = 'readonly') {
    const db = await this.openDB();
    return db.transaction([this.storeName], mode);
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const transaction = await this.getTransaction();
      const store = transaction.objectStore(this.storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.get(key);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const result = request.result;
          resolve(result ? result.value : null);
        };
      });
    } catch (error) {
      console.error(`Failed to get item ${key}:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const transaction = await this.getTransaction('readwrite');
      const store = transaction.objectStore(this.storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.put({ key, value });
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      console.error(`Failed to set item ${key}:`, error);
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const transaction = await this.getTransaction('readwrite');
      const store = transaction.objectStore(this.storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.delete(key);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      console.error(`Failed to delete item ${key}:`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      const transaction = await this.getTransaction('readwrite');
      const store = transaction.objectStore(this.storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw error;
    }
  }

  async getAll<T>(): Promise<Record<string, T>> {
    try {
      const transaction = await this.getTransaction();
      const store = transaction.objectStore(this.storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const result: Record<string, T> = {};
          request.result.forEach((item: any) => {
            result[item.key] = item.value;
          });
          resolve(result);
        };
      });
    } catch (error) {
      console.error('Failed to get all items:', error);
      return {};
    }
  }

  async setMultiple<T>(data: Record<string, T>): Promise<void> {
    try {
      const transaction = await this.getTransaction('readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const promises = Object.entries(data).map(([key, value]) => 
        new Promise<void>((resolve, reject) => {
          const request = store.put({ key, value });
          request.onerror = () => reject(request.error);
          request.onsuccess = () => resolve();
        })
      );
      
      await Promise.all(promises);
    } catch (error) {
      console.error('Failed to set multiple items:', error);
      throw error;
    }
  }

  async keys(): Promise<string[]> {
    try {
      const transaction = await this.getTransaction();
      const store = transaction.objectStore(this.storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.getAllKeys();
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result as string[]);
      });
    } catch (error) {
      console.error('Failed to get keys:', error);
      return [];
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      const transaction = await this.getTransaction();
      const store = transaction.objectStore(this.storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.get(key);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(!!request.result);
      });
    } catch (error) {
      console.error(`Failed to check if key exists ${key}:`, error);
      return false;
    }
  }
}
