/**
 * ID 生成器使用示例
 * 展示各种 ID 生成方式
 */

import { 
  generateId, 
  generateNoteId, 
  generateFolderId, 
  generateTagId,
  generateShortId,
  generateBatchIds,
  generateTimestampedId,
  validateId,
  extractIdType,
  IdType 
} from './idGenerator';

// 基本使用示例
console.log('=== 基本 ID 生成 ===');
console.log('笔记 ID:', generateNoteId());
console.log('文件夹 ID:', generateFolderId());
console.log('标签 ID:', generateTagId());

// 自定义选项
console.log('\n=== 自定义选项 ===');
console.log('UUID 格式:', generateId({ type: IdType.NOTE, useUuid: true }));
console.log('自定义前缀:', generateId({ type: IdType.NOTE, prefix: 'custom' }));
console.log('无时间戳:', generateId({ type: IdType.NOTE, includeTimestamp: false }));
console.log('短随机字符串:', generateId({ type: IdType.NOTE, randomLength: 4 }));

// 短 ID（用于显示）
console.log('\n=== 短 ID ===');
console.log('短笔记 ID:', generateShortId(IdType.NOTE));
console.log('短文件夹 ID:', generateShortId(IdType.FOLDER));
console.log('短标签 ID:', generateShortId(IdType.TAG));

// 批量生成
console.log('\n=== 批量生成 ===');
console.log('5个笔记 ID:', generateBatchIds(IdType.NOTE, 5));

// 带时间戳的 ID（用于排序）
console.log('\n=== 带时间戳的 ID ===');
console.log('时间戳笔记 ID:', generateTimestampedId(IdType.NOTE));

// ID 验证
console.log('\n=== ID 验证 ===');
const noteId = generateNoteId();
console.log(`ID "${noteId}" 是否有效:`, validateId(noteId));
console.log(`ID "${noteId}" 是否为笔记类型:`, validateId(noteId, IdType.NOTE));
console.log(`ID "${noteId}" 是否为文件夹类型:`, validateId(noteId, IdType.FOLDER));

// 提取 ID 类型
console.log('\n=== 提取 ID 类型 ===');
console.log(`ID "${noteId}" 的类型:`, extractIdType(noteId));
console.log(`UUID 的类型:`, extractIdType('550e8400-e29b-41d4-a716-446655440000'));

// 实际使用场景示例
console.log('\n=== 实际使用场景 ===');

// 创建新笔记
const newNote = {
  id: generateNoteId(),
  label: '新笔记',
  title: '新笔记标题',
  snippet: '这是笔记内容...',
  updatedAt: new Date().toISOString().split('T')[0],
  tags: [],
  folderId: undefined,
};

// 创建新文件夹
const newFolder = {
  id: generateFolderId(),
  label: '新文件夹',
  icon: 'pi pi-folder',
  parentId: undefined,
  isExpanded: false,
};

// 创建新标签
const newTag = {
  id: generateTagId(),
  label: '新标签',
  count: 0,
  color: '#3b82f6',
};

console.log('新笔记:', newNote);
console.log('新文件夹:', newFolder);
console.log('新标签:', newTag);

// 性能测试
console.log('\n=== 性能测试 ===');
const startTime = performance.now();
const testIds = generateBatchIds(IdType.NOTE, 1000);
const endTime = performance.now();
console.log(`生成 1000 个 ID 耗时: ${(endTime - startTime).toFixed(2)}ms`);

// ID 唯一性测试
console.log('\n=== 唯一性测试 ===');
const uniqueIds = new Set();
for (let i = 0; i < 10000; i++) {
  uniqueIds.add(generateNoteId());
}
console.log(`生成 10000 个 ID，唯一性: ${uniqueIds.size === 10000 ? '通过' : '失败'}`);

export {
  newNote,
  newFolder,
  newTag,
  testIds,
};
