# localStorage增强库 (local-storage-js)

[![npm version](https://img.shields.io/npm/v/local-storage-js.svg)](https://www.npmjs.com/package/local-storage-js)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](https://github.com/2ue/storejs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 对 `localStorage` 的全面增强，支持批量操作、复杂数据类型存储和 TypeScript 类型安全。提供了更强大、更灵活的本地存储解决方案。

## ✨ 特性

- 🚀 **完全兼容** - 保持原生 localStorage API 语义
- 📦 **批量操作** - 支持数组和对象形式的批量存储/读取/删除
- 🔒 **类型安全** - 完整的 TypeScript 类型定义
- 🎯 **智能序列化** - 自动处理复杂数据类型
- 🧪 **全面测试** - 36个测试用例，100% 测试覆盖率
- 📝 **代码质量** - ESLint + Prettier 保证代码质量
- 🔧 **零依赖** - 轻量级，无外部依赖

## 📦 安装

```bash
npm install --save local-storage-js
```

## 🚀 快速开始

### 推荐用法 - ES6/TypeScript

```typescript
// 推荐: 显式导入 (最佳实践)
import store from 'local-storage-js';

store.setItem('user', { name: '张三', age: 25 });
const user = store.getItem('user'); // string | null
console.log(user); // "{"name":"张三","age":25}"
```

### 推荐用法 - CommonJS

```javascript
// 推荐: 显式导入 (最佳实践)
const store = require('local-storage-js').default;

store.setItem('config', { theme: 'dark', lang: 'zh-CN' });
const config = store.getItem('config');
console.log(config); // "{"theme":"dark","lang":"zh-CN"}"
```

> **⚠️ CommonJS使用限制**  
> 由于localStorage是浏览器API，CommonJS主要适用于：
> - Electron应用（渲染进程）
> - 服务端渲染项目的客户端部分  
> - 使用构建工具的混合项目
> - Node.js环境需要模拟localStorage（如使用jsdom）

### 浏览器环境 - Script 标签

```html
<!-- 浏览器中会自动注册全局 store 对象 -->
<script src="./node_modules/local-storage-js/dist/store.js"></script>
<script>
    // 浏览器环境可以直接使用全局 store
    store.setItem('data', [1, 2, 3]);
    console.log(store.getItem('data')); // "[1,2,3]"
</script>
```

### 其他使用方式

```typescript
// 方式1: 命名导入 (如果需要重命名)
import localStore from 'local-storage-js';
localStore.setItem('key', 'value');

// 方式2: CommonJS 完整形式
const { default: store } = require('local-storage-js');
store.setItem('key', 'value');
```

### CDN 引入方式

```html
<!-- 通过CDN引入，自动注册全局 store 对象 -->
<script src="https://unpkg.com/local-storage-js@latest/dist/store.js"></script>
<script>
    // CDN方式可以直接使用全局 store
    store.setItem('data', { message: 'Hello from CDN!' });
    console.log(store.getItem('data'));
</script>

<!-- 或者通过ES模块CDN引入 -->
<script type="module">
    // 副作用导入，适用于CDN场景
    import 'https://unpkg.com/local-storage-js@latest/dist/store.js';
    
    // 全局 store 自动可用
    store.setItem('moduleData', [1, 2, 3]);
    console.log(store.getItem('moduleData'));
</script>
```

### ⚠️ 注意事项

```typescript
// ❌ 在Node.js/构建工具项目中不推荐副作用导入
// import 'local-storage-js'; // 会注册全局 store，但不是最佳实践
// store.setItem('key', 'value'); // 依赖全局变量，难以追踪来源

// ✅ 推荐使用显式导入 (可追踪、类型安全)
import store from 'local-storage-js';
store.setItem('key', 'value');
```

## 📚 API 文档

### setItem(key, value, deepTraversal?)

增强版 `localStorage.setItem`，支持多种数据类型和批量操作。

#### 参数说明

- `key`: `string | string[] | Record<string, any>` - 存储键
- `value`: `any` - 存储值（当 key 为 object 时可选）
- `deepTraversal`: `boolean` - 是否深度遍历（默认 false）

#### 使用示例

```typescript
// 导入库
import store from 'local-storage-js';

// 基础用法
store.setItem('name', '张三');
store.setItem('age', 25);
store.setItem('user', { name: '张三', hobbies: ['游泳', '阅读'] });

// 批量设置 - 数组形式
store.setItem(['key1', 'key2', 'key3'], ['value1', 'value2', 'value3']);
store.setItem(['theme', 'lang'], 'default'); // 所有 key 设置相同值

// 批量设置 - 对象形式
store.setItem({
    theme: 'dark',
    lang: 'zh-CN',
    version: '1.0.0'
});

// 深度遍历模式
store.setItem({
    user: { name: '张三' },
    config: { theme: 'dark' }
}, null, true);
```

### getItem(key)

增强版 `localStorage.getItem`，支持批量获取和结构化数据返回。

#### 参数说明

- `key`: `string | string[] | Record<string, string>` - 要获取的键

#### 返回值

- 单个字符串键：返回 `string | null`
- 数组键：返回 `(string | null)[]`
- 对象键：返回对应结构的对象

#### 使用示例

```typescript
// 导入库
import store from 'local-storage-js';

// 单个获取
const name = store.getItem('name'); // string | null

// 批量获取 - 数组形式
const values = store.getItem(['name', 'age', 'city']); 
// 返回: ['张三', '25', null]

// 结构化获取 - 对象形式
const user = store.getItem({
    username: 'name',
    userAge: 'age',
    city: 'city'
});
// 返回: { username: '张三', userAge: '25', city: null }
```

### getItems()

获取所有存储项。

```typescript
import store from 'local-storage-js';

const allItems = store.getItems();
// 返回: { name: '张三', age: '25', theme: 'dark' }
```

### getKeys()

获取所有存储键。

```typescript
import store from 'local-storage-js';

const allKeys = store.getKeys();
// 返回: ['name', 'age', 'theme']
```

### removeItem(key)

增强版 `localStorage.removeItem`，支持批量删除。

#### 使用示例

```typescript
import store from 'local-storage-js';

// 单个删除
store.removeItem('name');

// 批量删除 - 数组形式
store.removeItem(['key1', 'key2', 'key3']);

// 批量删除 - 对象形式（只删除对象的键，忽略值）
store.removeItem({
    key1: 'anyValue',
    key2: 'ignored'
});
```

### clear()

清空所有存储项。

```typescript
import store from 'local-storage-js';

store.clear();
```

### hasKey(key)

检查指定键是否存在。

```typescript
import store from 'local-storage-js';

const exists = store.hasKey('name'); // boolean
```

## 🛠️ 开发

### 环境要求

- Node.js >= 14
- TypeScript >= 4.0

### 开发命令

```bash
# 安装依赖
npm install

# 开发构建
npm run build

# 运行测试
npm test

# 测试覆盖率
npm run test:coverage

# 代码格式化
npm run format

# 代码质量检查
npm run lint

# 自动修复
npm run fix

# 完整检查（格式 + 质量）
npm run check
```

### 项目结构

```
local-storage-js/
├── src/                    # 源代码
│   └── store.ts           # 主要实现文件
├── test/                  # 测试文件
│   └── store.test.ts      # 完整测试套件
├── dist/                  # 构建输出
│   ├── store.js           # 编译后的 JavaScript
│   └── store.d.ts         # TypeScript 类型定义
├── .prettierrc.json       # Prettier 配置
├── eslint.config.js       # ESLint 配置
├── tsconfig.json          # TypeScript 配置
└── jest.config.json       # Jest 测试配置
```

## 📊 数据类型处理

### 自动序列化

库会自动处理不同数据类型的序列化：

```typescript
import store from 'local-storage-js';

store.setItem('string', 'hello');      // 直接存储
store.setItem('number', 42);           // 转换为 '42'
store.setItem('boolean', true);        // 转换为 'true'
store.setItem('array', [1, 2, 3]);     // JSON.stringify
store.setItem('object', {a: 1});       // JSON.stringify
store.setItem('null', null);           // 转换为空字符串
store.setItem('undefined', undefined); // 转换为空字符串
store.setItem('nan', NaN);             // 转换为空字符串
```

### 特殊值处理

- `null`、`undefined`、`NaN` 会被转换为空字符串 `''`
- 复杂对象会通过 `JSON.stringify` 序列化
- 循环引用对象会抛出错误

## 🔧 TypeScript 支持

完整的 TypeScript 类型定义：

```typescript
interface LocalStorageEnhanced {
    setItem<T = any>(key: string, value: T): void;
    setItem<T = any>(keys: string[], values: T[] | T, deepTraversal?: boolean): void;
    setItem<T = any>(keyValueMap: Record<string, T>, _?: null, deepTraversal?: boolean): void;
    
    getItem(key: string): string | null;
    getItem(keys: string[]): (string | null)[];
    getItem<T = Record<string, string | null>>(keyStructure: Record<string, string>): T;
    
    getItems(): Record<string, string | null>;
    getKeys(): string[];
    
    removeItem(key: string): void;
    removeItem(keys: string[]): void;
    removeItem(keyValueMap: Record<string, any>): void;
    
    clear(): void;
    hasKey(key: string | null | undefined): boolean;
}

declare global {
    var store: LocalStorageEnhanced;
}
```

## 📝 更新日志

### v0.0.8 (Latest)

- 🔄 **重大重构**: 完全迁移到 TypeScript
- 🧪 **测试完善**: 新增 36 个综合测试用例，覆盖率 100%
- 🔧 **开发工具**: 集成 ESLint + Prettier 代码质量工具
- 🐛 **Bug 修复**: 修复多个核心逻辑错误
- 📚 **文档更新**: 完善 TypeScript 类型定义和使用示例
- ⚡ **性能优化**: 优化类型检测和数据处理逻辑

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 贡献步骤

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

### 开发规范

- 遵循现有代码风格
- 添加相应的测试用例
- 确保所有测试通过
- 运行 `npm run check` 确保代码质量

## 📄 许可证

[MIT License](https://opensource.org/licenses/MIT)

## ⚠️ 注意事项

- 本库未对不支持 localStorage 的环境做兼容处理
- 使用前请确保运行环境支持 localStorage
- 存储的数据会被转换为字符串格式
- 大量数据存储可能影响性能，请合理使用

## 📞 支持

- 🐛 Bug 报告: [GitHub Issues](https://github.com/2ue/storejs/issues)
- 💬 讨论交流: [GitHub Discussions](https://github.com/2ue/storejs/discussions)
- 📧 邮件联系: jie746635835@163.com

---

如果这个库对你有帮助，请给个 ⭐️ Star 支持一下！