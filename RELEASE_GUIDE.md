# 发布流程使用指南

## 🚀 如何发布新版本

### 1. 准备发布

确保所有更改已提交并推送到主分支：

```bash
git add .
git commit -m "feat: 添加新功能或修复bug"
git push origin master
```

### 2. 创建版本标签

根据 [语义化版本](https://semver.org/lang/zh-CN/) 规范创建标签：

```bash
# 补丁版本 (bug修复)
git tag v0.0.9

# 次要版本 (新功能)
git tag v0.1.0

# 主要版本 (破坏性更改)
git tag v1.0.0
```

### 3. 推送标签触发发布

```bash
git push origin v0.0.9
```

推送标签后，GitHub Actions 将自动：
1. ✅ 运行所有测试
2. ✅ 执行代码质量检查
3. ✅ 构建项目
4. ✅ 发布到 NPM
5. ✅ 创建 GitHub Release
6. ✅ 上传覆盖率报告

## 📋 发布前检查清单

在创建标签前，请确保：

- [ ] 所有测试通过 (`npm test`)
- [ ] 代码格式正确 (`npm run format:check`)
- [ ] 没有 ESLint 错误 (`npm run lint`)
- [ ] TypeScript 编译成功 (`npm run typecheck`)
- [ ] 版本号已更新 (package.json)
- [ ] README.md 已更新
- [ ] 变更日志已记录

## 🔧 本地测试发布

在正式发布前，可以本地测试：

```bash
# 清理并检查
npm run clean
npm run check

# 构建
npm run build

# 测试
npm test

# 模拟发布 (不会真正发布)
npm pack
```

## 🛠️ 环境变量配置

在 GitHub 仓库设置中配置以下 Secrets：

- `NPM_TOKEN`: NPM 发布令牌
- `CODECOV_TOKEN`: Codecov 上传令牌 (可选)

## 📊 发布后检查

发布成功后，验证：

1. 📦 [NPM 包](https://www.npmjs.com/package/local-storage-js) 已更新
2. 🎉 GitHub Release 已创建
3. 📈 覆盖率报告已上传
4. 🔗 所有链接正常工作

## 🐛 故障排除

### 发布失败怎么办？

1. 检查 GitHub Actions 日志
2. 确认 NPM_TOKEN 有效
3. 验证包名没有冲突
4. 检查版本号格式

### 常见问题

**Q: NPM 发布权限被拒绝**  
A: 确保 NPM_TOKEN 有发布权限，且包名没有被占用

**Q: GitHub Release 创建失败**  
A: 检查 GITHUB_TOKEN 权限，确保仓库设置允许创建 Release

**Q: 测试在 CI 中失败但本地通过**  
A: 可能是环境差异，检查 Node.js 版本和依赖版本