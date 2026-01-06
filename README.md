# AtomGit MCP Server

AtomGit MCP Server 是一个基于 Model Context Protocol 的服务器，允许 AI 助手直接与 AtomGit 平台进行交互。它提供了 71 个工具，涵盖了仓库管理、用户管理、分支管理、提交管理、标签管理、问题管理和 Pull Request 管理等核心功能。

### ✨ 主要特性

- 🚀 **完整的功能覆盖** - 支持仓库、用户、分支、提交、标签、Issues 和 Pull Requests
- 🔐 **安全认证** - 基于 Token 的认证机制，确保数据安全
- 🛠️ **MCP 协议** - 完全符合 Model Context Protocol 标准
- 📝 **TypeScript 编写** - 类型安全，易于维护和扩展

## 在相关工具中配置使用

###  Claude Desktop 
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

###  Cursor
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

## 🛠️ 已实现工具

根据 [AtomGit 官方 API](https://docs.atomgit.com/docs/apis/)，已实现以下工具：

### 📂 仓库管理 (12 个工具)

| 工具名称 | 功能描述 | 测试状态 | 需要认证 |
|----------|----------|----------|----------|
| `get_repository` | 获取特定仓库信息 | ✅ 已测试 | 🔑 需要认证 |
| `get_repository_tree` | 获取仓库目录树 | ✅ 已测试 | 🔑 需要认证 |
| `search_repositories` | 搜索仓库 | ✅ 已测试 | 🔑 需要认证 |
| `list_repository_forks` | 列出仓库分叉 | ✅ 已测试 | 🔑 需要认证 |
| `get_repository_content` | 获取仓库路径内容 | ⏳ 待测试 | 🔑 需要认证 |
| `create_repository_file` | 创建仓库文件 | ⏳ 待测试 | 🔑 需要认证 |
| `update_repository_file` | 更新仓库文件 | ⏳ 待测试 | 🔑 需要认证 |
| `delete_repository_file` | 删除仓库文件 | ⏳ 待测试 | 🔑 需要认证 |
| `get_repository_file_list` | 获取仓库文件列表 | ⏳ 待测试 | 🔑 需要认证 |
| `get_repository_file_blob` | 获取文件Blob内容 | ⏳ 待测试 | 🔑 需要认证 |
| `upload_repository_image` | 上传仓库图片 | ⏳ 待测试 | 🔑 需要认证 |
| `upload_repository_file` | 上传仓库文件 | ⏳ 待测试 | 🔑 需要认证 |

### 👤 用户管理 (7 个工具)

| 工具名称 | 功能描述 | 测试状态 | 需要认证 |
|----------|----------|----------|----------|
| `get_current_user` | 获取当前用户信息 | ✅ 已测试 | 🔑 需要认证 |
| `get_user` | 获取特定用户信息 | ✅ 已测试 | 🔑 需要认证 |
| `get_user_repos` | 获取用户仓库列表 | ✅ 已测试 | 🔑 需要认证 |
| `get_current_user_repos` | 获取当前用户仓库 | ✅ 已测试 | 🔑 需要认证 |
| `get_user_starred_repos` | 获取用户收藏仓库 | ✅ 已测试 | 🔑 需要认证 |
| `get_current_user_starred_repos` | 获取当前用户收藏 | ✅ 已测试 | 🔑 需要认证 |
| `search_users` | 搜索用户 | ✅ 已测试 | 🔑 需要认证 |

### 🌿 分支管理 (1 个工具)

| 工具名称 | 功能描述 | 测试状态 | 需要认证 |
|----------|----------|----------|----------|
| `get_repository_branches` | 获取仓库所有分支 | ✅ 已测试 | 🔑 需要认证 |

### 📝 提交管理 (2 个工具)

| 工具名称 | 功能描述 | 测试状态 | 需要认证 |
|----------|----------|----------|----------|
| `get_repository_commits` | 获取仓库提交历史 | ✅ 已测试 | 🔑 需要认证 |
| `get_commit` | 获取特定提交详情 | ✅ 已测试 | 🔑 需要认证 |

### 🏷️ 标签管理 (1 个工具)

| 工具名称 | 功能描述 | 测试状态 | 需要认证 |
|----------|----------|----------|----------|
| `get_repository_tags` | 获取仓库标签列表 | ✅ 已测试 | 🔑 需要认证 |

### 🐛 问题管理 (19 个工具)

| 工具名称 | 功能描述 | 测试状态 | 需要认证 |
|----------|----------|----------|----------|
| `get_repository_issues` | 获取仓库问题列表 | ✅ 已测试 | 🔑 需要认证 |
| `get_repository_issue` | 获取特定问题详情 | ✅ 已测试 | 🔑 需要认证 |
| `create_repository_issue` | 创建新问题 | ✅ 已测试 | 🔑 需要认证 |
| `update_repository_issue` | 更新问题信息 | ⏳ 待测试 | 🔑 需要认证 |
| `get_repository_issue_comments` | 获取问题评论列表 | ⏳ 待测试 | 🔑 需要认证 |
| `create_repository_issue_comment` | 创建问题评论 | ⏳ 待测试 | 🔑 需要认证 |
| `get_repository_issue_comment` | 获取特定问题评论 | ⏳ 待测试 | 🔑 需要认证 |
| `update_repository_issue_comment` | 更新问题评论 | ⏳ 待测试 | 🔑 需要认证 |
| `delete_repository_issue_comment` | 删除问题评论 | ⏳ 待测试 | 🔑 需要认证 |
| `create_repository_issue_label` | 为问题添加标签 | ⏳ 待测试 | 🔑 需要认证 |
| `replace_repository_issue_labels` | 替换问题所有标签 | ⏳ 待测试 | 🔑 需要认证 |
| `delete_repository_issue_label` | 删除问题的标签 | ⏳ 待测试 | 🔑 需要认证 |
| `get_repository_issue_operate_logs` | 获取问题操作日志 | ⏳ 待测试 | 🔑 需要认证 |
| `get_repository_issue_related_branches` | 获取问题关联分支 | ⏳ 待测试 | 🔑 需要认证 |
| `get_repository_issue_reactions` | 获取问题的表态列表 | ⏳ 待测试 | 🔑 需要认证 |
| `get_repository_issue_comment_reactions` | 获取问题评论的表态列表 | ⏳ 待测试 | 🔑 需要认证 |
| `get_repository_issue_modify_history` | 获取问题的修改历史 | ⏳ 待测试 | 🔑 需要认证 |
| `get_repository_issue_comment_modify_history` | 获取问题评论的修改历史 | ⏳ 待测试 | 🔑 需要认证 |

### 🔀 Pull Requests 管理 (25 个工具)

| 工具名称 | 功能描述 | 测试状态 | 需要认证 |
|----------|----------|----------|----------|
| `get_repository_pulls` | 获取仓库 PR 列表 | ✅ 已测试 | 🔑 需要认证 |
| `get_repository_pull` | 获取特定 PR 详情 | ✅ 已测试 | 🔑 需要认证 |
| `create_repository_pull` | 创建新的 PR | ⏳ 待测试 | 🔑 需要认证 |
| `merge_repository_pull` | 合并 PR | ⏳ 待测试 | 🔑 需要认证 |
| `get_repository_pull_merge_status` | 检查 PR 是否可合并 | ⏳ 待测试 | 🔑 需要认证 |
| `get_repository_pull_issues` | 获取 PR 关联的 Issues | ⏳ 待测试 | 🔑 需要认证 |
| `create_repository_pull_comment` | 创建 PR 评论 | ⏳ 待测试 | 🔑 需要认证 |
| `get_repository_pull_comments` | 获取 PR 所有评论 | ⏳ 待测试 | 🔑 需要认证 |
| `get_repository_pull_files` | 获取 PR 变更的文件 | ⏳ 待测试 | 🔑 需要认证 |
| `update_repository_pull` | 更新 PR 信息 | ⏳ 待测试 | 🔑 需要认证 |
| `get_repository_pull_commits` | 获取 PR 的提交 | ⏳ 待测试 | 🔑 需要认证 |
| `create_repository_pull_label` | 为 PR 添加标签 | ⏳ 待测试 | 🔑 需要认证 |
| `get_repository_pull_labels` | 获取 PR 的标签 | ⏳ 待测试 | 🔑 需要认证 |
| `replace_repository_pull_labels` | 替换 PR 所有标签 | ⏳ 待测试 | 🔑 需要认证 |
| `delete_repository_pull_label` | 删除 PR 的标签 | ⏳ 待测试 | 🔑 需要认证 |
| `process_repository_pull_test` | 处理 PR 测试 | ⏳ 待测试 | 🔑 需要认证 |
| `process_repository_pull_review` | 处理 PR 审查 | ⏳ 待测试 | 🔑 需要认证 |
| `get_repository_pull_operate_logs` | 获取 PR 操作日志 | ⏳ 待测试 | 🔑 需要认证 |
| `reset_repository_pull_testers` | 重置 PR 测试者状态 | ⏳ 待测试 | 🔑 需要认证 |
| `assign_repository_pull_testers` | 指派用户测试 PR | ⏳ 待测试 | 🔑 需要认证 |
| `remove_repository_pull_testers` | 移除 PR 测试者 | ⏳ 待测试 | 🔑 需要认证 |
| `get_repository_pull_tester_options` | 获取可选的 PR 测试者 | ⏳ 待测试 | 🔑 需要认证 |
| `reset_repository_pull_assignees` | 重置 PR 审查者状态 | ⏳ 待测试 | 🔑 需要认证 |
| `assign_repository_pull_assignees` | 指派用户审查 PR | ⏳ 待测试 | 🔑 需要认证 |
| `remove_repository_pull_assignees` | 移除 PR 审查者 | ⏳ 待测试 | 🔑 需要认证 |
| `get_repository_pull_files_json` | 获取 PR 文件变更信息 | ⏳ 待测试 | 🔑 需要认证 |
| `get_repository_pull_file_content` | 获取 PR 中文件内容 | ⏳ 待测试 | 🔑 需要认证 |
| `link_repository_pull_issues` | 将 Issues 关联到 PR | ⏳ 待测试 | 🔑 需要认证 |
| `unlink_repository_pull_issues` | 取消 Issues 与 PR 的关联 | ⏳ 待测试 | 🔑 需要认证 |
| `assign_repository_pull_approval_reviewers` | 指派用户审批 PR | ⏳ 待测试 | 🔑 需要认证 |
| `remove_repository_pull_approval_reviewers` | 移除 PR 审批者 | ⏳ 待测试 | 🔑 需要认证 |
| `get_repository_pull_approval_reviewer_options` | 获取可选的 PR 审批者 | ⏳ 待测试 | 🔑 需要认证 |


## 🚀 快速开发开始

### 1. 环境要求

- Node.js >= 18
- npm 或 yarn

### 2. 安装

```bash
git clone <repository-url>
cd AtomGit-MCP-Server
npm install
```

### 3. 配置认证令牌

**重要**: AtomGit API 要求所有请求都需要认证令牌。

#### 获取个人访问令牌

1. 访问 [AtomGit Token 设置页面](https://atomgit.com/setting/token-classic)
2. 点击"生成令牌"按钮
3. 选择必要的权限范围
4. 复制生成的令牌

#### 配置环境变量

创建 `.env` 文件：

```env
ATOMGIT_TOKEN=your_personal_access_token_here
ATOMGIT_API_BASE_URL=https://api.atomgit.com
```

或者在命令行设置：

```bash
# Linux/Mac
export ATOMGIT_TOKEN=your_token_here

# Windows PowerShell
$env:ATOMGIT_TOKEN="your_token_here"
```


#### 4. 开发命令

```bash
# 构建 TypeScript 代码
npm run build

# 类型检查
npm run typecheck

# 开发模式运行
npm run dev

# 生产模式运行
npm start

# 清理构建文件
npm run clean
```

#### 5. 测试

运行测试脚本验证功能：

```bash
# 运行认证测试（推荐）
npm run test:auth

# 运行基础测试
npm test

# 运行 MCP 服务器测试
npm run test:mcp

# 运行详细分类测试
npm run test:comprehensive
```

## 📂 项目结构

```
AtomGit-MCP-Server/
├── src/                    # 源代码
│   ├── services/          # API 服务层
│   ├── tools/             # MCP 工具类
│   └── types/             # TypeScript 类型定义
├── dist/                   # 编译输出
├── tests/                  # 测试脚本
├── scripts/                # 脚本目录
│   └── debug/            # 调试脚本
├── docs/                   # 文档
├── .env.example            # 环境变量模板
├── .gitignore             # Git 忽略规则
├── AGENTS.md              # Agent 工作指南
├── package.json           # NPM 配置
├── README.md              # 项目说明
├── LICENSE                # MIT 许可证
└── tsconfig.json          # TypeScript 配置
```


## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Pull Request 和 Issue！