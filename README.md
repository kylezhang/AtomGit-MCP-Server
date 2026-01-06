# AtomGit MCP Server

AtomGit MCP Server - Model Context Protocol server for AtomGit code hosting platform

## 🛠️ 已实现工具

根据 AtomGit 官方 API 分类，我们已实现以下 **20 个工具**：

### 📂 Repositories (仓库管理)

| 工具名称 | 功能描述 | 测试状态 | 需要认证 |
|----------|----------|----------|----------|
| `get_repository` | 获取特定仓库信息 | ✅ 已测试 | 🌐 不需要 |
| `get_repository_tree` | 获取仓库目录树 | ✅ 已测试 | 🌐 不需要 |
| `search_repositories` | 搜索仓库 | ✅ 已测试 | 🔑 需要认证 |
| `create_repository` | 创建新仓库 | ✅ 已测试 | 🔑 需要认证 |

### 👤 Users (用户管理)

| 工具名称 | 功能描述 | 测试状态 | 需要认证 |
|----------|----------|----------|----------|
| `get_current_user` | 获取当前用户信息 | ✅ 已测试 | 🔑 需要认证 |
| `get_user` | 获取特定用户信息 | ❌ 404错误 | 🌐 不需要 |
| `get_user_repos` | 获取用户仓库列表 | ❌ 400错误 | 🌐 不需要 |
| `get_current_user_repos` | 获取当前用户仓库 | ✅ 已测试 | 🔑 需要认证 |
| `get_user_starred_repos` | 获取用户收藏仓库 | ❌ 404错误 | 🌐 不需要 |
| `get_current_user_starred_repos` | 获取当前用户收藏 | ✅ 已测试 | 🔑 需要认证 |
| `search_users` | 搜索用户 | ✅ 已测试 | 🔑 需要认证 |

### 🌿 Branch (分支管理)

| 工具名称 | 功能描述 | 测试状态 | 需要认证 |
|----------|----------|----------|----------|
| `get_repository_branches` | 获取仓库所有分支 | ✅ 已测试 | 🌐 不需要 |

### 🐛 Issues (问题管理)

| 工具名称 | 功能描述 | 测试状态 | 需要认证 |
|----------|----------|----------|----------|
| `get_repository_issues` | 获取仓库问题列表 | ✅ 已测试 | 🌐 不需要 |
| `create_repository_issue` | 创建新问题 | ✅ 已测试 | 🔑 需要认证 |
| `get_repository_issue` | 获取特定问题详情 | ✅ 已测试 | 🌐 不需要 |

### 🔀 Pull Requests (拉取请求管理)

| 工具名称 | 功能描述 | 测试状态 | 需要认证 |
|----------|----------|----------|----------|
| `get_repository_pulls` | 获取仓库 PR 列表 | ✅ 已测试 | 🌐 不需要 |
| `get_repository_pull` | 获取特定 PR 详情 | ✅ 已测试 | 🌐 不需要 |

### 📝 Commit (提交管理)

| 工具名称 | 功能描述 | 测试状态 | 需要认证 |
|----------|----------|----------|----------|
| `get_repository_commits` | 获取仓库提交历史 | ✅ 已测试 | 🌐 不需要 |
| `get_repository_commit` | 获取特定提交详情 | ✅ 已测试 | 🌐 不需要 |

### 🏷️ Tag (标签管理)

| 工具名称 | 功能描述 | 测试状态 | 需要认证 |
|----------|----------|----------|----------|
| `get_repository_tags` | 获取仓库标签列表 | ✅ 已测试 | 🌐 不需要 |

### 📊 实现统计

- **总工具数**: 20个
- **已测试成功**: 17个 (85%)
- **测试失败**: 3个 (15%)
- **需要认证**: 8个工具
- **无需认证**: 12个工具

### ⚠️ 测试失败的说明

部分工具测试失败可能的原因：
1. **API路径变化**: AtomGit API 可能已经更新
2. **用户不存在**: 测试用的用户名 (`GitCode`) 可能有变化
3. **权限限制**: 某些公共API可能有特殊要求

### 🎯 核心功能

✅ **完全可用的分类**:
- Repositories (4/4 工具正常)
- Issues (3/3 工具正常)  
- Pull Requests (2/2 工具正常)
- Commit (2/2 工具正常)
- Tag (1/1 工具正常)
- Branch (1/1 工具正常)

⚠️ **部分问题的分类**:
- Users (4/7 工具正常，但核心功能可用)

## 安装和配置

### 1. 克隆项目

```bash
git clone <repository-url>
cd AtomGit-MCP-Server
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制环境变量模板：

```bash
cp .env.example .env
```

编辑 `.env` 文件，添加你的 AtomGit 个人访问令牌：

```env
ATOMGIT_API_BASE_URL=https://api.atomgit.com
ATOMGIT_TOKEN=your_personal_access_token_here
```

**如何获取个人访问令牌：**

1. 访问 [AtomGit Token 设置页面](https://atomgit.com/setting/token-classic)
2. 点击 "Generate new token"
3. 选择适当的权限范围
4. 复制生成的令牌到 `.env` 文件中

### 4. 构建项目

```bash
npm run build
```

## 使用方法

### 作为 MCP 服务器运行

```bash
npm start
```

### 开发模式

```bash
npm run dev
```

### 测试

运行测试脚本：

```bash
npm test
```

或者手动运行测试：

```bash
node test.mjs
```

## 在 Claude Desktop 中配置

在你的 Claude Desktop 配置文件中添加：

```json
{
  "mcpServers": {
    "atomgit": {
      "command": "node",
      "args": ["path/to/AtomGit-MCP-Server/dist/index.js"],
      "env": {
        "ATOMGIT_TOKEN": "your_personal_access_token_here"
      }
    }
  }
}
```

## 🚀 快速开始

### 1. 环境配置
```bash
cp .env.example .env
# 编辑 .env 文件，添加你的 AtomGit 个人访问令牌
```

### 2. 构建项目
```bash
npm run build
```

### 3. 测试功能
```bash
# 运行全面测试（推荐）
npm run test:auth

# 或运行基础测试
npm test

# 或测试 MCP 服务器
npm run test:mcp
```

### 4. 启动服务器
```bash
npm start
```

## 🧪 测试命令

- `npm test` - 基础功能测试
- `npm run test:auth` - **全面认证测试**（推荐）
- `npm run test:mcp` - MCP 服务器功能测试
- `npm run test-comprehensive` - 详细分类测试

## ❌ 故障排除

### 常见问题

1. **认证失败 (401/403)**
   - 检查 `.env` 文件中的 `ATOMGIT_TOKEN`
   - 确保令牌具有足够权限
   - 访问 [AtomGit Token 设置](https://atomgit.com/setting/token-classic)

2. **API路径变化**
   - 部分用户相关工具可能因API更新而失效
   - 核心功能（仓库、分支、问题、PR、提交、标签）完全可用

3. **网络问题**
   - 检查网络连接
   - 考虑API速率限制（默认50/分钟）

## 错误处理

大多数 API 端点需要认证。如果没有提供令牌或令牌无效，将会收到 401 或 403 错误。请确保：

1. 在 `.env` 文件中正确设置了 `ATOMGIT_TOKEN`
2. 令牌具有足够的权限范围
3. 令牌没有过期

## 开发

### 项目结构

```
src/
├── services/          # API 服务层
│   └── AtomGitService.ts
├── tools/            # MCP 工具类
│   ├── BranchTools.ts
│   ├── CommitTools.ts
│   ├── IssuesTools.ts
│   ├── PullRequestTools.ts
│   ├── RepositoryManagementTools.ts
│   ├── RepositoryTools.ts
│   ├── TagTools.ts
│   └── UserTools.ts
├── types/            # TypeScript 类型定义
│   └── index.ts
└── index.ts          # 主入口文件
```

### 构建命令

- `npm run build` - 构建 TypeScript 代码
- `npm run dev` - 开发模式运行
- `npm run start` - 生产模式运行
- `npm run typecheck` - 类型检查
- `npm test` - 基础功能测试
- `npm run test:auth` - **全面认证测试**（推荐）
- `npm run test:mcp` - MCP 服务器功能测试
- `npm run test-comprehensive` - 详细分类测试
- `npm run clean` - 清理构建文件

## 许可证

MIT License

## 贡献

欢迎提交 Pull Request 和 Issue！

## 相关链接

## 📋 工具快速参考

| 分类 | 工具数量 | 可用性 |
|------|----------|----------|
| 📂 Repositories | 4/4 | ✅ 100% |
| 🌿 Branch | 1/1 | ✅ 100% |
| 🐛 Issues | 3/3 | ✅ 100% |
| 🔀 Pull Requests | 2/2 | ✅ 100% |
| 📝 Commit | 2/2 | ✅ 100% |
| 🏷️ Tag | 1/1 | ✅ 100% |
| 👤 Users | 4/7 | ⚠️ 57% |
| 🔍 Search | 2/2 | ✅ 100% |

## 🎯 核心功能状态

✅ **完全可用**: 仓库、分支、问题、PR、提交、标签、搜索
⚠️ **部分可用**: 用户管理（核心功能可用）

**总体可用性**: 85% (17/20 工具正常工作)

## 🔗 相关链接

- [AtomGit 官方文档](https://docs.atomgit.com/)
- [AtomGit API 文档](https://docs.atomgit.com/docs/apis/)
- [Model Context Protocol 文档](https://modelcontextprotocol.io/)
- [获取个人访问令牌](https://atomgit.com/setting/token-classic)
