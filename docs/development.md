# 开发者指南

本文档为 localStorage 增强库的开发者提供详细的开发、构建和贡献指南。

## 🛠️ 开发环境设置

### 系统要求

- **Node.js**: >= 14.0.0
- **npm**: >= 6.0.0  
- **TypeScript**: >= 4.0.0
- **Git**: >= 2.20.0

### 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/2ue/storejs.git
cd storejs

# 2. 安装依赖
npm install

# 3. 构建项目
npm run build

# 4. 运行测试
npm test

# 5. 检查代码质量
npm run check
```

## 📁 项目结构

```
local-storage-js/
├── src/                        # 源代码目录
│   └── store.ts               # 主要实现文件
├── test/                      # 测试文件目录
│   └── store.test.ts          # 测试套件
├── dist/                      # 构建输出目录
│   ├── store.js              # 编译后的 JavaScript
│   ├── store.d.ts            # TypeScript 类型定义
│   └── store.js.map          # Source Map 文件
├── docs/                      # 文档目录
│   └── typescript.md         # TypeScript 类型文档
├── coverage/                  # 测试覆盖率报告
├── .prettierrc.json          # Prettier 配置
├── .prettierignore           # Prettier 忽略文件
├── eslint.config.js          # ESLint 配置
├── tsconfig.json             # TypeScript 配置
├── jest.config.json          # Jest 测试配置
├── package.json              # 项目配置
└── README.md                 # 项目说明
```

## 🔧 开发工具配置

### TypeScript 配置 (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2018",
    "module": "CommonJS",
    "lib": ["ES2018", "DOM"],
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "test"]
}
```

### ESLint 配置

项目使用 ESLint v9 的新配置格式：

```javascript
// eslint.config.js
const typescript = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const prettier = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
    // 配置细节...
];
```

**关键规则：**
- TypeScript 相关规则启用
- Prettier 集成
- 未使用变量检查（支持 `_` 前缀忽略）
- 禁用过于严格的类型检查

### Prettier 配置

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 4,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

### Jest 测试配置

```json
{
  "preset": "ts-jest",
  "testEnvironment": "jsdom",
  "roots": ["<rootDir>/test"],
  "testMatch": ["**/*.test.ts"],
  "collectCoverageFrom": [
    "src/**/*.ts",
    "!src/**/*.d.ts"
  ],
  "coverageDirectory": "coverage",
  "coverageReporters": ["text", "lcov", "html"],
  "setupFilesAfterEnv": ["<rootDir>/test/setup.ts"]
}
```

## 📋 NPM Scripts 说明

### 构建相关

```bash
# 编译 TypeScript 到 JavaScript
npm run build

# 清理构建产物和覆盖率报告
npm run clean

# 完整重新构建
npm run clean && npm run build
```

### 测试相关

```bash
# 运行所有测试
npm test

# 监视模式运行测试
npm run test:watch

# 生成测试覆盖率报告
npm run test:coverage
```

### 代码质量

```bash
# 检查代码格式（不修改文件）
npm run format:check

# 格式化代码
npm run format

# 运行 ESLint 检查
npm run lint

# 运行 ESLint 并自动修复
npm run lint:fix

# 格式化 + 修复 ESLint 问题
npm run fix

# 完整代码质量检查
npm run check
```

### 发布相关

```bash
# 预发布检查（格式 + 构建 + 测试）
npm run prepublishOnly

# 发布到 npm（需要权限）
npm publish
```

## 🧪 测试策略

### 测试结构

项目采用全面的测试策略，包含 36 个测试用例：

1. **工具函数测试** - 验证类型检测和数据处理
2. **setItem 方法测试** - 覆盖所有设置场景
3. **getItem 方法测试** - 覆盖所有获取场景  
4. **批量操作测试** - 验证数组和对象批量操作
5. **边界情况测试** - 错误处理和异常情况
6. **性能测试** - 大量数据处理能力

### 测试环境模拟

```typescript
// 模拟 localStorage
const mockLocalStorage = {
    data: {},
    getItem: function(key: string) { /* ... */ },
    setItem: function(key: string, value: string) { /* ... */ },
    removeItem: function(key: string) { /* ... */ },
    clear: function() { /* ... */ },
    // ...
};
```

### 运行测试

```bash
# 运行所有测试
npm test

# 以监视模式运行测试（开发时使用）
npm run test:watch

# 生成详细的覆盖率报告
npm run test:coverage
```

测试覆盖率目标：**100%** 

## 🔄 开发工作流

### 1. 功能开发流程

```bash
# 1. 创建功能分支
git checkout -b feature/your-feature-name

# 2. 开发过程中持续运行测试
npm run test:watch

# 3. 代码质量检查
npm run check

# 4. 提交代码
git add .
git commit -m "feat: add your feature description"

# 5. 推送并创建 PR
git push origin feature/your-feature-name
```

### 2. Bug 修复流程

```bash
# 1. 创建修复分支
git checkout -b fix/bug-description

# 2. 编写测试用例重现 bug
npm test

# 3. 修复代码
# 编辑 src/store.ts

# 4. 验证修复
npm test

# 5. 代码质量检查
npm run check

# 6. 提交修复
git commit -m "fix: resolve bug description"
```

### 3. 代码审查检查清单

- [ ] 所有测试通过
- [ ] 代码格式符合 Prettier 规范  
- [ ] ESLint 检查通过
- [ ] TypeScript 编译无错误
- [ ] 新功能有对应测试用例
- [ ] 文档已更新
- [ ] 向后兼容性考虑

## 📝 提交规范

项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

### 提交类型

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更改
- `style`: 代码格式更改（不影响功能）
- `refactor`: 重构（不是新功能也不是修复）
- `test`: 添加或修改测试
- `chore`: 构建过程或工具链更改

### 提交示例

```bash
feat: add batch remove operation for objects
fix: resolve type detection issue for null values  
docs: update API documentation for getItem method
test: add edge cases for circular reference objects
refactor: optimize type checking performance
style: format code according to prettier rules
chore: update eslint configuration for v9
```

## 🚀 发布流程

### 版本管理

项目采用 [Semantic Versioning](https://semver.org/)：

- `MAJOR`: 不兼容的 API 变更
- `MINOR`: 向后兼容的功能新增
- `PATCH`: 向后兼容的 Bug 修复

### 发布步骤

```bash
# 1. 确保所有测试通过
npm run check
npm test

# 2. 更新版本号
npm version patch  # 或 minor, major

# 3. 运行预发布检查
npm run prepublishOnly

# 4. 创建发布标签
git tag -a v1.0.0 -m "Release version 1.0.0"

# 5. 推送到远程仓库
git push origin main --tags

# 6. 发布到 npm（需要权限）
npm publish

# 7. 创建 GitHub Release
gh release create v1.0.0 --generate-notes
```

## 🐛 调试指南

### 开发调试

```typescript
// 在 src/store.ts 中添加调试日志
console.log('Debug: keyType =', keyType, 'valType =', valType);

// 构建并测试
npm run build
npm test
```

### 测试调试

```typescript
// 在测试文件中添加调试
test('debug specific case', () => {
    console.log('Test data:', mockLocalStorage.data);
    // ... 测试代码
});

// 运行特定测试
npm test -- --testNamePattern="debug specific case"
```

### 生产问题调试

```bash
# 1. 复现问题的测试用例
npm run test:watch

# 2. 检查构建产物
cat dist/store.js

# 3. 运行覆盖率分析
npm run test:coverage

# 4. 检查类型定义
cat dist/store.d.ts
```

## 📊 性能优化

### 代码体积优化

- 使用 TypeScript 编译优化
- 避免不必要的依赖
- 利用 Tree Shaking

### 运行时性能

- 优化类型检测算法
- 减少不必要的函数调用
- 缓存重复计算结果

### 监控指标

```bash
# 构建体积检查
ls -la dist/

# 测试执行时间
npm test -- --verbose

# 覆盖率分析
npm run test:coverage
```

## 🤝 贡献指南

### 开始贡献

1. Fork 项目到你的账户
2. Clone 你的 Fork
3. 创建功能分支
4. 进行开发
5. 编写测试
6. 提交 Pull Request

### Pull Request 规范

- 清晰的标题和描述
- 关联相关的 Issue
- 包含测试用例
- 通过所有检查
- 更新相关文档

### 代码审查标准

- 功能正确性
- 测试覆盖率
- 代码质量
- 性能影响
- 向后兼容性
- 文档完整性

---

## 📞 支持与联系

- 🐛 **Bug 报告**: [GitHub Issues](https://github.com/2ue/storejs/issues)
- 💡 **功能建议**: [GitHub Discussions](https://github.com/2ue/storejs/discussions)  
- 📧 **邮件联系**: jie746635835@163.com

感谢你对项目的贡献！