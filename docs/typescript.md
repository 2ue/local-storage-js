# TypeScript 类型定义

本文档详细说明了 localStorage 增强库的 TypeScript 类型定义和使用方法。

## 核心接口

### LocalStorageEnhanced

主要的库接口，包含所有增强的 localStorage 方法：

```typescript
interface LocalStorageEnhanced {
    // setItem 方法重载
    setItem<T = any>(key: string, value: T): void;
    setItem<T = any>(keys: string[], values: T[] | T, deepTraversal?: boolean): void;
    setItem<T = any>(keyValueMap: Record<string, T>, _?: null, deepTraversal?: boolean): void;
    
    // getItem 方法重载
    getItem(key: string): string | null;
    getItem(keys: string[]): (string | null)[];
    getItem<T = Record<string, string | null>>(keyStructure: Record<string, string>): T;
    
    // 其他方法
    getItems(): Record<string, string | null>;
    getKeys(): string[];
    
    // removeItem 方法重载
    removeItem(key: string): void;
    removeItem(keys: string[]): void;
    removeItem(keyValueMap: Record<string, any>): void;
    
    clear(): void;
    hasKey(key: string | null | undefined): boolean;
}
```

### 内部工具类型

```typescript
type DataType = 
    | 'string' 
    | 'number' 
    | 'boolean' 
    | 'object' 
    | 'array' 
    | 'null' 
    | 'undefined' 
    | 'NaN' 
    | 'function' 
    | 'date';

interface UtilityFunctions {
    getType(para: any): DataType;
    map(para: any, fn: (keyOrIndex: string | number, value: any, original: any) => void): void;
    filterValue(val: any): string;
}
```

## 全局类型声明

库会自动在全局作用域中声明 `store` 对象：

```typescript
declare global {
    interface Window {
        store: LocalStorageEnhanced;
    }
    
    var store: LocalStorageEnhanced;
}
```

## 使用示例

### 基础类型安全使用

```typescript
// 推荐: 显式导入
import store from 'local-storage-js';

// 类型推断示例
const name: string | null = store.getItem('name');
const keys: string[] = store.getKeys();
const allItems: Record<string, string | null> = store.getItems();
const exists: boolean = store.hasKey('someKey');

// 泛型使用
interface User {
    name: string;
    age: number;
}

// 虽然存储时会序列化为字符串，但类型系统知道我们的意图
store.setItem<User>('user', { name: '张三', age: 25 });
```

### 批量操作类型安全

```typescript
// 推荐: 显式导入
import store from 'local-storage-js';

// 数组批量操作
const keys: string[] = ['key1', 'key2', 'key3'];
const values: string[] = ['value1', 'value2', 'value3'];
store.setItem(keys, values);

const results: (string | null)[] = store.getItem(keys);

// 对象批量操作
const keyValueMap: Record<string, any> = {
    name: '张三',
    age: 25,
    config: { theme: 'dark' }
};
store.setItem(keyValueMap);

// 结构化获取
const userStructure: Record<string, string> = {
    username: 'name',
    userAge: 'age'
};
const user = store.getItem(userStructure);
// user 类型: Record<string, string | null>
```

### 方法重载详解

#### setItem 方法重载

```typescript
// 推荐: 显式导入
import store from 'local-storage-js';

// 重载 1: 单个键值对
store.setItem('key', 'value');
store.setItem('user', { name: '张三' });

// 重载 2: 数组键 + 值
store.setItem(['k1', 'k2'], ['v1', 'v2']);
store.setItem(['k1', 'k2'], 'sameValue');
store.setItem(['k1', 'k2'], ['v1', 'v2'], true); // 深度遍历

// 重载 3: 对象键值映射
store.setItem({ key1: 'value1', key2: 'value2' });
store.setItem({ key1: 'value1', key2: 'value2' }, null, true); // 深度遍历
```

#### getItem 方法重载

```typescript
// 推荐: 显式导入
import store from 'local-storage-js';

// 重载 1: 单个键
const value: string | null = store.getItem('key');

// 重载 2: 数组键
const values: (string | null)[] = store.getItem(['k1', 'k2', 'k3']);

// 重载 3: 结构化获取
const structure = { alias1: 'key1', alias2: 'key2' };
const result: Record<string, string | null> = store.getItem(structure);
```

#### removeItem 方法重载

```typescript
// 推荐: 显式导入
import store from 'local-storage-js';

// 重载 1: 单个键
store.removeItem('key');

// 重载 2: 数组键
store.removeItem(['key1', 'key2', 'key3']);

// 重载 3: 对象键（忽略值）
store.removeItem({ key1: 'ignored', key2: 'ignored' });
```

## 类型安全最佳实践

### 1. 使用类型断言进行类型转换

```typescript
// 推荐: 显式导入
import store from 'local-storage-js';

interface UserConfig {
    theme: 'light' | 'dark';
    language: string;
}

// 存储
const config: UserConfig = { theme: 'dark', language: 'zh-CN' };
store.setItem('config', config);

// 获取并类型转换
const rawConfig = store.getItem('config');
if (rawConfig) {
    const parsedConfig = JSON.parse(rawConfig) as UserConfig;
    console.log(parsedConfig.theme); // 类型安全
}
```

### 2. 创建类型安全的包装函数

```typescript
// 推荐: 显式导入
import store from 'local-storage-js';

function setTypedItem<T>(key: string, value: T): void {
    store.setItem(key, value);
}

function getTypedItem<T>(key: string): T | null {
    const raw = store.getItem(key);
    if (raw === null) return null;
    try {
        return JSON.parse(raw) as T;
    } catch {
        return raw as unknown as T;
    }
}

// 使用
interface Settings {
    notifications: boolean;
    autoSave: boolean;
}

setTypedItem<Settings>('settings', { notifications: true, autoSave: false });
const settings = getTypedItem<Settings>('settings');
```

### 3. 利用联合类型处理多种情况

```typescript
// 推荐: 显式导入
import store from 'local-storage-js';

type StorageKey = 'user' | 'config' | 'preferences';
type StorageValue<K extends StorageKey> = 
    K extends 'user' ? { name: string; id: number } :
    K extends 'config' ? { theme: string; lang: string } :
    K extends 'preferences' ? boolean[] :
    never;

function typedStore<K extends StorageKey>(
    key: K, 
    value: StorageValue<K>
): void {
    store.setItem(key, value);
}

// 类型安全的使用
typedStore('user', { name: '张三', id: 123 }); // ✅ 正确
typedStore('config', { theme: 'dark', lang: 'zh' }); // ✅ 正确
// typedStore('user', { theme: 'dark' }); // ❌ 类型错误
```

## 与 IDE 集成

### VS Code 智能提示

库提供完整的类型定义，VS Code 会自动提供：

- 方法签名提示
- 参数类型检查
- 返回值类型推断
- 错误波浪线标记

### TypeScript 编译器集成

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

在严格模式下，编译器会：
- 检查 null 值处理
- 验证参数类型匹配
- 推断正确的返回类型

## 常见类型错误及解决方案

### 1. null 值处理

```typescript
// 推荐: 显式导入
import store from 'local-storage-js';

// ❌ 可能的 null 值错误
const name = store.getItem('name');
console.log(name.toUpperCase()); // 类型错误

// ✅ 正确的 null 值处理
const name = store.getItem('name');
if (name !== null) {
    console.log(name.toUpperCase()); // 类型安全
}

// ✅ 使用可选链操作符
const name = store.getItem('name');
console.log(name?.toUpperCase());
```

### 2. 数组类型匹配

```typescript
// 推荐: 显式导入
import store from 'local-storage-js';

// ❌ 类型不匹配
const keys: string[] = ['k1', 'k2'];
const values: number[] = [1, 2];
store.setItem(keys, values); // 类型检查会通过，但要注意序列化

// ✅ 明确类型意图
const keys: string[] = ['k1', 'k2'];
const values: (string | number)[] = [1, 2];
store.setItem(keys, values);
```

### 3. 泛型使用

```typescript
// 推荐: 显式导入
import store from 'local-storage-js';

// ❌ 缺少类型信息
const data = store.getItem({ user: 'userData' });
// data 类型: Record<string, string | null>

// ✅ 使用泛型指定更精确的类型
interface UserData {
    user: string;
}
const data = store.getItem<UserData>({ user: 'userData' });
// data 类型: UserData
```

## 高级类型技巧

### 条件类型

```typescript
type GetItemReturnType<T> = 
    T extends string ? string | null :
    T extends string[] ? (string | null)[] :
    T extends Record<string, string> ? Record<string, string | null> :
    never;
```

### 映射类型

```typescript
type StorageSchema = {
    user: { name: string; age: number };
    settings: { theme: string; lang: string };
    cache: string[];
};

type StorageKeys = keyof StorageSchema;
type StorageValue<K extends StorageKeys> = StorageSchema[K];
```

这些类型定义确保了在使用 localStorage 增强库时的完全类型安全性。