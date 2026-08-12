# Release Guide

本文档用于说明 `@atomgit.com/atomgit-mcp-server` 的日常发版流程。

## 发布前提

发布前请确认以下条件已经满足：

- 需要发布的代码已经提交到默认分支
- 已确认当前最新版本号（`npm view @atomgit.com/atomgit-mcp-server version`），新版本号不与已发布版本冲突

## 版本策略

按语义化版本规则发版：

- `patch`：兼容性的修复、文档更新、打包修复、CI 调整
- `minor`：兼容性新增功能
- `major`：不兼容变更

常用命令：

```bash
npm version patch
```

或：

```bash
npm version minor
npm version major
```

执行 `npm version` 后会同时：

- 更新 `package.json` 和 `package-lock.json`
- 生成对应的 Git tag，例如 `v1.0.4`

## 标准发布流程

标准发布流程如下：

```bash
git push origin main
git push origin --tags
```

更完整的推荐流程：

```bash
npm version patch
git push origin main
git push origin --tags
```

说明：

- 所有推送仅针对 AtomGit（origin）
- `git push` 用于推送版本提交
- `git push --tags` 用于推送发布标签
- 打 tag 后发布自动完成，无需其他操作

## 发布完成后的检查

发布成功后，建议执行以下检查：

```bash
npm view @atomgit.com/atomgit-mcp-server version
```

并确认：

- npm 上已出现新版本
- README 已同步到 npm 包页面
- `npx -y @atomgit.com/atomgit-mcp-server` 可正常启动

## 失败重试

如果 Git tag 已创建，但自动发布失败，不建议复用原版本号。

例如：

- `1.0.0` 已发布成功
- `1.0.1` 发布失败

此时建议直接发布下一个版本：

```bash
npm version patch
git push origin main
git push origin --tags
```

这样会生成例如 `1.0.2`，并继续自动发布。

不建议通过删除 tag 并重发同一版本来恢复发布，除非有明确的版本管理要求。

## 不需要发版的情况

以下变更通常不必单独发版：

- 仅修改仓库内部说明文档，且不影响使用者
- 仅修改本地开发辅助内容，不影响使用者

以下情况建议发布新版本：

- 用户可见功能发生变化
- MCP 工具、输入、输出或行为发生变化
- `npx` 使用方式、构建产物、依赖或打包结果发生变化
- 需要让使用者看到更新后的 README
- 修复影响实际使用的问题
