/**
 * ID 生成工具
 * 用于生成各种类型的唯一 ID
 */

/**
 * ID 类型枚举
 */
export enum IdType {
  NOTE = 'note',
  FOLDER = 'folder',
  TAG = 'tag',
  USER = 'user',
  COMMENT = 'comment',
  ATTACHMENT = 'attachment',
}

/**
 * ID 生成选项
 */
export interface IdOptions {
  /** 前缀类型 */
  type: IdType;
  /** 自定义前缀（可选） */
  prefix?: string;
  /** 是否包含时间戳 */
  includeTimestamp?: boolean;
  /** 随机字符串长度 */
  randomLength?: number;
  /** 是否使用 UUID 格式 */
  useUuid?: boolean;
}

/**
 * 默认 ID 生成选项
 */
const DEFAULT_OPTIONS: Partial<IdOptions> = {
  includeTimestamp: true,
  randomLength: 8,
  useUuid: false,
};

/**
 * 生成随机字符串
 * @param length 字符串长度
 * @returns 随机字符串
 */
function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 生成时间戳字符串
 * @returns 时间戳字符串
 */
function generateTimestamp(): string {
  return Date.now().toString(36);
}

/**
 * 生成 UUID v4
 * @returns UUID 字符串
 */
function generateUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


/**
 * 生成完整 ID
 * @param options ID 生成选项
 * @returns 生成的 ID
 */
export function generateId(options: IdOptions): string {
  const config = { ...DEFAULT_OPTIONS, ...options };
  
  // 使用 UUID 格式
  if (config.useUuid) {
    return generateUuid();
  }
  
  // 使用自定义前缀
  if (config.prefix) {
    const parts = [config.prefix];
    
    if (config.includeTimestamp) {
      parts.push(generateTimestamp());
    }
    
    if (config.randomLength && config.randomLength > 0) {
      parts.push(generateRandomString(config.randomLength));
    }
    
    return parts.join('_');
  }
  
  // 使用类型前缀
  const parts: string[] = [config.type];
  
  if (config.includeTimestamp) {
    parts.push(generateTimestamp());
  }
  
  if (config.randomLength && config.randomLength > 0) {
    parts.push(generateRandomString(config.randomLength));
  }
  
  return parts.join('_');
}

/**
 * 生成笔记 ID
 * @returns 笔记 ID
 */
export function generateNoteId(): string {
  return generateId({ type: IdType.NOTE });
}

/**
 * 生成文件夹 ID
 * @returns 文件夹 ID
 */
export function generateFolderId(): string {
  return generateId({ type: IdType.FOLDER });
}

/**
 * 生成标签 ID
 * @returns 标签 ID
 */
export function generateTagId(): string {
  return generateId({ type: IdType.TAG });
}

/**
 * 生成短 ID（用于显示）
 * @param type ID 类型
 * @returns 短 ID
 */
export function generateShortId(type: IdType): string {
  const typeMap = {
    [IdType.NOTE]: 'n',
    [IdType.FOLDER]: 'f',
    [IdType.TAG]: 't',
    [IdType.USER]: 'u',
    [IdType.COMMENT]: 'c',
    [IdType.ATTACHMENT]: 'a',
  };
  
  const prefix = typeMap[type] || 'x';
  const timestamp = Date.now().toString(36);
  const random = generateRandomString(4);
  
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * 验证 ID 格式
 * @param id ID 字符串
 * @param type 期望的类型
 * @returns 是否有效
 */
export function validateId(id: string, type?: IdType): boolean {
  if (!id || typeof id !== 'string') {
    return false;
  }
  
  // UUID 格式验证
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(id)) {
    return true;
  }
  
  // 自定义格式验证
  const parts = id.split('_');
  if (parts.length < 2) {
    return false;
  }
  
  // 检查类型前缀
  if (type) {
    const typeMap = {
      [IdType.NOTE]: 'note',
      [IdType.FOLDER]: 'folder',
      [IdType.TAG]: 'tag',
      [IdType.USER]: 'user',
      [IdType.COMMENT]: 'comment',
      [IdType.ATTACHMENT]: 'attachment',
    };
    
    if (parts[0] !== typeMap[type]) {
      return false;
    }
  }
  
  return true;
}

/**
 * 从 ID 中提取类型
 * @param id ID 字符串
 * @returns ID 类型或 null
 */
export function extractIdType(id: string): IdType | null {
  if (!id || typeof id !== 'string') {
    return null;
  }
  
  // UUID 格式
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(id)) {
    return null; // UUID 无法确定类型
  }
  
  const parts = id.split('_');
  if (parts.length < 1) {
    return null;
  }
  
  const typeMap: Record<string, IdType> = {
    'note': IdType.NOTE,
    'folder': IdType.FOLDER,
    'tag': IdType.TAG,
    'user': IdType.USER,
    'comment': IdType.COMMENT,
    'attachment': IdType.ATTACHMENT,
  };
  
  return typeMap[parts[0]] || null;
}

/**
 * 生成批量 ID
 * @param type ID 类型
 * @param count 数量
 * @returns ID 数组
 */
export function generateBatchIds(type: IdType, count: number): string[] {
  const ids: string[] = [];
  for (let i = 0; i < count; i++) {
    ids.push(generateId({ type }));
  }
  return ids;
}

/**
 * 生成带时间戳的 ID（用于排序）
 * @param type ID 类型
 * @returns 带时间戳的 ID
 */
export function generateTimestampedId(type: IdType): string {
  return generateId({
    type,
    includeTimestamp: true,
    randomLength: 6,
  });
}
