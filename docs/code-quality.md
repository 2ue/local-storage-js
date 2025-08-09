# 代码质量工具配置说明

本文档详细说明了项目中使用的代码质量工具配置和使用方法。

## 🛠️ 工具概览

| 工具 | 版本 | 用途 | 配置文件 |
|------|------|------|----------|
| **ESLint** | 9.33.0 | 代码质量检查 | `eslint.config.js` |
| **Prettier** | 3.6.2 | 代码格式化 | `.prettierrc.json` |
| **TypeScript** | 5.9.2 | 类型检查 | `tsconfig.json` |
| **Jest** | 30.0.5 | 测试框架 | `jest.config.json` |

## 📝 ESLint 配置

### 配置文件结构

```javascript
// eslint.config.js - ESLint v9 新格式
const typescript = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const prettier = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
    {
        ignores: ['dist/**/*', 'coverage/**/*', 'node_modules/**/*', 'debug*.js'],
    },
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            parser: typescriptParser,
            globals: {
                console: 'readonly',
                window: 'readonly',
                // ... 更多全局变量
            }
        },
        plugins: {
            '@typescript-eslint': typescript,
            prettier: prettier,
        },
        rules: {
            // TypeScript 规则
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/explicit-function-return-type': 'off',
            
            // 通用规则
            'prefer-const': 'error',
            'no-var': 'error',
        },
    }
];
```

### 关键配置说明

#### 1. 文件匹配

```javascript
{
    files: ['src/**/*.ts'],        // 源代码文件
    files: ['test/**/*.ts'],       // 测试文件
    ignores: ['dist/**/*'],        // 忽略构建产物
}
```

#### 2. 语言配置

```javascript
languageOptions: {
    parser: typescriptParser,      // 使用 TypeScript 解析器
    parserOptions: {
        ecmaVersion: 'latest',     // 支持最新 JS 语法
        sourceType: 'module',      // 使用 ES 模块
    },
    globals: {
        console: 'readonly',       // 允许使用 console
        window: 'readonly',        // 浏览器环境
        // Jest 测试环境变量...
    }
}
```

#### 3. 规则配置

**TypeScript 规则:**
```javascript
'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
// 允许以 _ 开头的参数不使用

'@typescript-eslint/no-explicit-any': 'warn',
// 警告使用 any 类型（允许但不推荐）

'@typescript-eslint/no-this-alias': 'off',
// 允许 this 别名（const _this = this）
```

**代码质量规则:**
```javascript
'prefer-const': 'error',          // 强制使用 const
'no-var': 'error',               // 禁用 var
'no-console': 'off',             // 允许 console.log
```

### 运行命令

```bash
# 检查代码质量
npm run lint

# 自动修复可修复的问题
npm run lint:fix

# 检查特定文件
npx eslint src/store.ts

# 检查并显示规则名称
npx eslint --print-config src/store.ts
```

## 🎨 Prettier 配置

### 配置文件

```json
{
  "semi": true,                    // 使用分号
  "trailingComma": "es5",         // ES5 兼容的尾逗号
  "singleQuote": true,            // 使用单引号
  "printWidth": 100,              // 行宽限制 100 字符
  "tabWidth": 4,                  // 缩进 4 个空格
  "useTabs": false,               // 使用空格而非制表符
  "bracketSpacing": true,         // 对象字面量空格 { foo: bar }
  "bracketSameLine": false,       // JSX 标签换行
  "arrowParens": "avoid",         // 箭头函数参数括号
  "endOfLine": "lf"               // 使用 LF 换行符
}
```

### 忽略文件配置

```bash
# .prettierignore
dist/                             # 构建产物
coverage/                         # 覆盖率报告
node_modules/                     # 依赖包
*.js                             # JavaScript 文件（项目主要是 TS）
*.log                            # 日志文件
.DS_Store                        # macOS 系统文件
```

### 运行命令

```bash
# 格式化所有文件
npm run format

# 检查格式（不修改文件）
npm run format:check

# 格式化特定文件
npx prettier --write src/store.ts

# 检查特定文件格式
npx prettier --check src/store.ts
```

## 🔧 工具集成

### ESLint + Prettier 集成

为避免冲突，项目配置了 `eslint-config-prettier`：

```javascript
// ESLint 配置中
rules: {
    ...prettierConfig.rules,      // 禁用与 Prettier 冲突的规则
    'prettier/prettier': 'error', // 将 Prettier 规则作为 ESLint 错误
}
```

### VS Code 集成

推荐的 VS Code 设置：

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.includePackageJsonAutoImports": "on"
}
```

推荐的 VS Code 扩展：

- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)
- TypeScript Importer (`pmneo.tsimporter`)

## 🚀 自动化工作流

### Pre-commit 检查

```bash
# 完整代码质量检查
npm run check

# 等价于：
npm run format:check && npm run lint
```

### Pre-publish 检查

```bash
# package.json 中配置的预发布脚本
"prepublishOnly": "npm run clean && npm run check && npm run build && npm test"
```

执行顺序：
1. 清理旧文件
2. 检查代码格式
3. 运行 ESLint 检查
4. 构建项目
5. 运行所有测试

### 持续集成

```yaml
# GitHub Actions 示例
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run check    # 代码质量检查
      - run: npm run build    # 构建检查
      - run: npm test         # 测试检查
```

## 🔍 问题诊断和解决

### 常见 ESLint 错误

#### 1. 未使用的变量

```typescript
// ❌ 错误：'i' is declared but its value is never read
_util.map(keys, function (i: string | number, val: string) {
    res.push(_this.getItem(val));
});

// ✅ 修复：使用下划线前缀
_util.map(keys, function (_i: string | number, val: string) {
    res.push(_this.getItem(val));
});
```

#### 2. any 类型警告

```typescript
// ⚠️ 警告：Unexpected any. Specify a different type
function processData(data: any) { }

// ✅ 更好的做法：使用泛型或联合类型
function processData<T>(data: T) { }
function processData(data: string | number | object) { }
```

#### 3. 全局变量未定义

```typescript
// ❌ 错误：'window' is not defined
window.store = store;

// ✅ 修复：在 ESLint 配置中添加全局变量
globals: {
    window: 'readonly'
}
```

### 常见 Prettier 问题

#### 1. 行宽超限

```typescript
// ❌ 超过 100 字符
const veryLongVariableName = someFunction(parameter1, parameter2, parameter3, parameter4);

// ✅ 自动格式化为多行
const veryLongVariableName = someFunction(
    parameter1,
    parameter2,
    parameter3,
    parameter4
);
```

#### 2. 引号不一致

```typescript
// ❌ 混用引号
const str1 = "hello";
const str2 = 'world';

// ✅ 统一使用单引号
const str1 = 'hello';
const str2 = 'world';
```

### TypeScript 编译错误

#### 1. 类型不匹配

```typescript
// 推荐: 显式导入
import store from 'local-storage-js';

// ❌ 类型错误
const result: string = store.getItem('key'); // 返回 string | null

// ✅ 正确的类型处理
const result = store.getItem('key'); // 自动推断为 string | null
if (result !== null) {
    // 在这里 result 是 string 类型
}
```

#### 2. 严格模式错误

```typescript
// ❌ 严格空值检查错误
_store.setItem(key, value); // _store 可能为 null

// ✅ 使用非空断言或空值检查
_store!.setItem(key, value); // 非空断言
// 或
if (_store) {
    _store.setItem(key, value);
}
```

## 📊 代码质量指标

### ESLint 报告

```bash
# 运行完整检查
npm run lint

# 输出示例
/src/store.ts
  24:17  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  
✖ 38 problems (0 errors, 38 warnings)
```

**质量目标:**
- 🟢 **0 个错误** (errors)
- 🟡 **最小化警告** (warnings)

### Prettier 检查

```bash
# 格式检查
npm run format:check

# 输出示例
Checking formatting...
All matched files use Prettier code style!
```

**格式目标:**
- 🟢 **所有文件格式一致**
- 🟢 **无格式错误**

### 综合检查

```bash
# 运行完整检查
npm run check

# 成功输出示例
> format:check && lint
Checking formatting...
All matched files use Prettier code style!

✖ 38 problems (0 errors, 38 warnings)
```

**综合质量标准:**
- ✅ 格式检查通过
- ✅ 无 ESLint 错误
- ✅ TypeScript 编译通过
- ✅ 所有测试通过

## 🔧 自定义配置

### 添加新的 ESLint 规则

```javascript
// eslint.config.js
rules: {
    // 添加新规则
    'no-magic-numbers': ['warn', { ignore: [0, 1, -1] }],
    'max-lines-per-function': ['warn', { max: 50 }],
    
    // 覆盖默认规则
    '@typescript-eslint/no-explicit-any': 'error', // 提升为错误
}
```

### 自定义 Prettier 规则

```json
{
  "printWidth": 120,        // 增加行宽
  "tabWidth": 2,           // 减少缩进
  "semi": false,           // 不使用分号
  "trailingComma": "all"   // 所有地方使用尾逗号
}
```

### 添加项目特定规则

```javascript
// 针对特定文件的规则
{
    files: ['test/**/*.ts'],
    rules: {
        '@typescript-eslint/no-explicit-any': 'off', // 测试文件允许 any
        'max-lines-per-function': 'off',             // 测试函数可以很长
    }
}
```

## 📚 最佳实践

### 1. 代码提交前检查

```bash
# 提交前必须运行
npm run check
npm test

# 或者设置 Git Hook
# .git/hooks/pre-commit
#!/bin/sh
npm run check && npm test
```

### 2. 团队协作规范

- 🔄 **统一工具版本** - 使用 package.json 锁定版本
- 📏 **一致的配置** - 共享配置文件
- 🚫 **不跳过检查** - 不使用 `--no-verify` 提交
- 📝 **及时修复警告** - 不积累技术债务

### 3. 性能优化

```bash
# 缓存 ESLint 结果
npx eslint --cache src/

# 只检查变更文件
git diff --name-only --cached | xargs npx eslint
```

### 4. IDE 配置同步

创建 `.vscode/settings.json` 确保团队使用一致的 IDE 配置：

```json
{
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "eslint.validate": ["typescript"],
  "typescript.suggest.autoImports": true
}
```

---

## 🎯 总结

通过完善的代码质量工具链，项目实现了：

- ✅ **一致的代码风格** - Prettier 自动格式化
- ✅ **高质量代码** - ESLint 规则检查  
- ✅ **类型安全** - TypeScript 严格模式
- ✅ **自动化检查** - Git hooks 和 CI/CD 集成
- ✅ **团队协作** - 统一的开发环境配置

这些工具确保了代码库的长期维护性和高质量标准。