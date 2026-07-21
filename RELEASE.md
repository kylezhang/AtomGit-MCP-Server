# 发版流程

## 铁律
- **绝不删除远程 tag** — 任何情况下。
- **绝不删除远程分支** — 除非用户明确确认。
- **发版前必须问用户** — 展示变更内容，等确认再动。

## 标准流程

### 1. 发布前检查
```bash
# 确认当前状态
git log --oneline -5
git tag -l | sort -V
npm version --json | jq '.["atomgit-mcp-server"]'
```

### 2. 确认版本号
- 向用户展示上次版本号和新建议版本号
- 等用户确认后继续

### 3. 发版（全部通过 npm version 操作，不手动编辑）
```bash
npm version <major|minor|patch|X.Y.Z>  # 自动 commit + tag
git push origin main --tags
```

### 4. 创建 GitHub Release
- 通过 AtomGit Web 界面手动创建
- 或通过 API 创建（待实现）

## 回滚预案
如果打错 tag（未推送时）：
```bash
git tag -d vX.Y.Z        # 仅删本地 tag
npm version <正确的版本号>  # 重新执行
```

如果已推送，**不再删除**，使用 npm version bump 一个新版本即可。
