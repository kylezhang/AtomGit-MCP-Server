# AtomGit MCP Server

AtomGit MCP Server - Model Context Protocol server for AtomGit code hosting platform

## 功能特性

这个 MCP 服务器为 AtomGit 代码托管平台提供了完整的 API 访问能力，支持以下功能：

### 仓库管理
- 获取仓库信息
- 搜索仓库
- 获取仓库目录树
- 创建新仓库

### 用户管理
- 获取当前用户信息
- 获取指定用户信息
- 获取用户仓库列表
- 获取用户收藏的仓库
- 搜索用户

### 分支管理
- 获取仓库所有分支

### 问题管理
- 获取仓库问题列表
- 创建新问题
- 获取特定问题详情

### 拉取请求管理
- 获取仓库 PR 列表
- 获取特定 PR 详情

### 提交管理
- 获取仓库提交历史
- 获取特定提交详情

### 标签管理
- 获取仓库标签列表

### 发布管理
- 创建发布
- 获取发布列表
- 获取特定发布详情

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

## 可用工具

### 仓库相关

- `get_repository` - 获取特定仓库信息
- `get_repository_tree` - 获取仓库目录树
- `search_repositories` - 搜索仓库
- `create_repository` - 创建新仓库

### 用户相关

- `get_current_user` - 获取当前用户信息
- `get_user` - 获取特定用户信息
- `get_user_repos` - 获取用户仓库列表
- `get_current_user_repos` - 获取当前用户仓库列表
- `get_user_starred_repos` - 获取用户收藏的仓库
- `get_current_user_starred_repos` - 获取当前用户收藏的仓库
- `search_users` - 搜索用户

### 分支相关

- `get_repository_branches` - 获取仓库所有分支

### 问题相关

- `get_repository_issues` - 获取仓库问题列表
- `create_repository_issue` - 创建新问题
- `get_repository_issue` - 获取特定问题详情

### 拉取请求相关

- `get_repository_pulls` - 获取仓库 PR 列表
- `get_repository_pull` - 获取特定 PR 详情

### 提交相关

- `get_repository_commits` - 获取仓库提交历史
- `get_repository_commit` - 获取特定提交详情

### 标签相关

- `get_repository_tags` - 获取仓库标签列表

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
- `npm run lint` - 代码检查
- `npm run typecheck` - 类型检查

## 许可证

MIT License

## 贡献

欢迎提交 Pull Request 和 Issue！

## 相关链接

- [AtomGit 官方文档](https://docs.atomgit.com/)
- [AtomGit API 文档](https://docs.atomgit.com/docs/apis/)
- [Model Context Protocol 文档](https://modelcontextprotocol.io/)
