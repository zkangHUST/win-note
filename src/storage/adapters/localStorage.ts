// LocalStorage 存储适配器
import type { StorageAdapter } from '../types';

export class LocalStorageAdapter implements StorageAdapter {
  private prefix: string;

  constructor(prefix: string = 'win-note') {
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(this.getKey(key));
      if (item === null) return null;
      return JSON.parse(item);
    } catch (error) {
      console.error(`Failed to get item ${key}:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to set item ${key}:`, error);
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error(`Failed to delete item ${key}:`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = Object.keys(localStorage);
      const prefixedKeys = keys.filter(key => key.startsWith(this.prefix + ':'));
      prefixedKeys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw error;
    }
  }

  async getAll<T>(): Promise<Record<string, T>> {
    try {
      const result: Record<string, T> = {};
      const keys = Object.keys(localStorage);
      const prefixedKeys = keys.filter(key => key.startsWith(this.prefix + ':'));
      
      for (const key of prefixedKeys) {
        const originalKey = key.replace(`${this.prefix}:`, '');
        const item = localStorage.getItem(key);
        if (item !== null) {
          result[originalKey] = JSON.parse(item);
        }
      }
      
      return result;
    } catch (error) {
      console.error('Failed to get all items:', error);
      return {};
    }
  }

  async setMultiple<T>(data: Record<string, T>): Promise<void> {
    try {
      const promises = Object.entries(data).map(([key, value]) => 
        this.set(key, value)
      );
      await Promise.all(promises);
    } catch (error) {
      console.error('Failed to set multiple items:', error);
      throw error;
    }
  }

  async keys(): Promise<string[]> {
    try {
      const keys = Object.keys(localStorage);
      return keys
        .filter(key => key.startsWith(this.prefix + ':'))
        .map(key => key.replace(`${this.prefix}:`, ''));
    } catch (error) {
      console.error('Failed to get keys:', error);
      return [];
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      return localStorage.getItem(this.getKey(key)) !== null;
    } catch (error) {
      console.error(`Failed to check if key exists ${key}:`, error);
      return false;
    }
  }
}
