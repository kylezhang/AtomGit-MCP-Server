# Release Guide

本文档用于说明 `@atomgit.com/atomgit-mcp-server` 的日常发版流程。

当前发布链路：

- 源码仓库：AtomGit
- GitHub Mirror：`kylezhang/AtomGit-MCP-Server`
- npm 包：`@atomgit.com/atomgit-mcp-server`
- 自动发布方式：GitHub Actions + npm Trusted Publishing

## 发布前提

发布前请确认以下条件已经满足：

- 需要发布的代码已经提交到默认分支
- GitHub mirror 已同步最新代码
- npm 包已配置 Trusted Publishing
- GitHub Actions 工作流文件存在：`.github/workflows/publish.yml`

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
git push
git push --tags
```

更完整的推荐流程：

```bash
npm version patch
git push
git push --tags
```

说明：

- `git push` 用于推送版本提交
- `git push --tags` 用于推送发布标签
- GitHub Actions 会在收到 `v*` 标签后自动执行发布

## 自动发布工作流

当前发布工作流位于：

- `.github/workflows/publish.yml`

工作流会执行以下步骤：

1. 检出仓库代码
2. 配置 Node.js 与 npm registry
3. 校验 Git tag 与 `package.json` 版本一致
4. 安装依赖
5. 执行 `npm run typecheck`
6. 执行 `npm run build`
7. 执行 `npm pack --dry-run`
8. 执行 `npm publish --provenance`

发布状态可在以下页面查看：

- GitHub Actions: <https://github.com/kylezhang/AtomGit-MCP-Server/actions>
- npm package: <https://www.npmjs.com/package/@atomgit.com/atomgit-mcp-server>

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
- `1.0.1` 对应的 GitHub Actions 发布失败

此时建议直接发布下一个版本：

```bash
npm version patch
git push
git push --tags
```

这样会生成例如 `1.0.2`，并继续自动发布。

不建议通过删除 tag 并重发同一版本来恢复发布，除非有明确的版本管理要求。

## 不需要发布 npm 包的情况

以下变更通常不必单独发布 npm 新版本：

- 仅修改仓库内部说明文档，且这些文档不会进入 npm 包
- 仅修改本地开发辅助内容，不影响 npm 包使用者

以下情况建议发布新版本：

- 用户可见功能发生变化
- MCP 工具、输入、输出或行为发生变化
- `npx` 使用方式、构建产物、依赖或打包结果发生变化
- 需要让 npm 页面同步新的 README 内容
- 修复影响实际使用的问题

## 安全建议

当前推荐使用：

- npm Trusted Publishing
- Publishing access 选择最严格选项：
  `Require two-factor authentication and disallow tokens`

这样可以：

- 保留 GitHub Actions 自动发布能力
- 禁止传统 token 发布
- 降低凭据泄露风险
