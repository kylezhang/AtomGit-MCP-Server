# AtomGit MCP Server

![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)
![Tools](https://img.shields.io/badge/tools-248-orange.svg)

**AtomGit MCP Server** 是一个基于 [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) 的服务器实现，允许 AI 助手（如 Claude Desktop、Cursor 等）直接与 [AtomGit](https://atomgit.com/) 代码托管平台进行交互。

它提供了 **248 个工具**，覆盖了 AtomGit 平台公开的 APIs，让 AI 能够协助你完成仓库管理、代码检索、Issue 追踪、PR 评审等全流程开发任务。

## 主要特性

*   🚀 **全面覆盖**：实现了 18 个分类共 248 个工具，涵盖仓库、用户、分支、标签、Issue、Pull Request、成员管理等。
*   🔐 **安全认证**：基于 AtomGit Personal Access Token (PAT) 进行认证，支持权限细粒度控制。
*   🛠️ **标准协议**：完全兼容 Model Context Protocol 规范，可无缝集成到支持 MCP 的客户端中。
*   ⚡ **类型安全**：全项目采用 TypeScript 编写，提供完整的类型定义和参数校验。

## 功能列表

目前支持以下核心功能模块（共 18 个分类）：

*   **仓库管理 (Repositories)**：创建/删除/查询仓库、Fork、Star、Watch、文件操作
*   **分支与标签 (Branch & Tag)**：创建/删除分支、标签管理、受保护分支
*   **提交与发布 (Commit & Release)**：获取提交历史、版本发布管理
*   **合并请求 (Pull Request)**：创建/查询/合并 PR、代码评审、Diff 获取
*   **工单管理 (Issues)**：Issue 增删改查、评论管理、指派与状态
*   **项目规划 (Milestone & Labels)**：里程碑管理、标签管理
*   **看板管理 (Dashboard)**：组织看板、工作项管理 (Kanban)
*   **用户与组织 (User & Organization)**：个人信息、SSH 密钥、组织成员管理
*   **企业管理 (Enterprise)**：企业级资源管理
*   **成员管理 (Member)**：仓库/组织成员权限管理
*   **搜索服务 (Search)**：代码、仓库、用户搜索
*   **Webhooks**：仓库 Webhook 的增删改查
*   **AI 模型 (AIHub)**：AIHub 模型列表与交互
*   **认证 (OAuth)**：OAuth 授权流程支持

## 快速开始

### 前置要求

*   [Node.js](https://nodejs.org/) (版本 >= 18)
*   [AtomGit 账号](https://atomgit.com/)

### 1. 获取 Access Token

1.  登录 AtomGit。
2.  访问 [设置 -> 访问令牌](https://atomgit.com/setting/token-classic)。
3.  点击"生成新令牌"。
4.  **建议权限**：为了获得完整体验，建议勾选所有权限（`repo`, `user`, `admin:org` 等）。
5.  复制生成的 Token，妥善保存。

### 2. 安装与构建

```bash
# 克隆项目
git clone https://atomgit.com/zkxw2008/AtomGit-MCP-Server.git
cd AtomGit-MCP-Server

# 安装依赖
npm install

# 构建项目 (生成 dist 目录)
npm run build
```

### 3. 配置 AtomGit MCP Server 到 Claude Desktop 为例

找到 Claude Desktop 的配置文件：
*   **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
*   **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

根据你的操作系统添加以下配置：

#### Windows 配置示例

> ⚠️ **注意**：Windows 路径中的反斜杠 `\` 需要转义为 `\\`。请确保 `command` 指向正确的 `node.exe` 路径（如果未在 PATH 中）。

```json
{
  "mcpServers": {
    "atomgit": {
      "command": "node",
      "args": [
        "D:\\path\\to\\AtomGit-MCP-Server\\dist\\index.js"
      ],
      "env": {
        "ATOMGIT_TOKEN": "你的_ATOMGIT_TOKEN"
      }
    }
  }
}
```

#### macOS / Linux 配置示例

```json
{
  "mcpServers": {
    "atomgit": {
      "command": "node",
      "args": [
        "/path/to/AtomGit-MCP-Server/dist/index.js"
      ],
      "env": {
        "ATOMGIT_TOKEN": "你的_ATOMGIT_TOKEN"
      }
    }
  }
}
```

配置完成后，**重启 Claude Desktop** 即可生效。

## 开发指南

如果你想参与开发或调试本项目：

### 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发模式运行（使用 `tsx` 直接运行源码） |
| `npm run build` | 编译 TypeScript 代码到 `dist/` 目录 |
| `npm run typecheck` | 运行 TypeScript 类型检查 |
| `npm run test` | 运行基础工具验证脚本 |
| `npm run api:check` | 检查 API 覆盖率 |
| `npm run api:scaffold` | 生成新工具代码 (直接注入到文件中) |
| `npm run api:map` | 更新 API 映射文档 |

### 项目结构

```
AtomGit-MCP-Server/
├── src/
│   ├── services/    # API 服务层 (封装 Axios 请求)
│   ├── tools/       # MCP 工具层 (定义 Tool Schema 和处理逻辑)
│   ├── types/       # TypeScript 类型定义
│   └── index.ts     # 程序入口 (MCP Server 实例)
├── dist/            # 编译后的产物
├── scripts/         # 辅助脚本 (自动化代码生成与文档更新)
└── docs/            # 文档 (包含详细的 API 映射表)
```

## 常见问题 (FAQ)

**Q1: Claude 显示 "Tool not loaded" 或找不到工具？**
*   **A**: 这通常是客户端缓存导致的。尝试重启 Claude Desktop。如果仍然存在，请检查 `claude_desktop_config.json` 中的路径是否正确，以及 `dist/index.js` 是否存在（是否执行了 `npm run build`）。

**Q2: 调用工具返回 "404 Not Found"？**
*   **A**: 请检查你输入的 `owner`（用户名/组织名）和 `repo`（仓库名）是否正确。注意：AtomGit 的 URL 通常区分大小写。如果是新建仓库相关的操作，请确保上级命名空间存在。

**Q3: 遇到 "invalid_union" 或 "Protocol Error"？**
*   **A**: 请确保你使用的是最新版本的代码。我们在最新版本中修复了 MCP 协议响应格式的问题。

**Q4: Windows 下无法启动？**
*   **A**: Windows 下 `node` 命令可能不在环境变量中，或者路径解析有问题。尝试在 `command` 字段中使用 `node.exe` 的绝对路径（如 `C:\\Program Files\\nodejs\\node.exe`）。

## 📄 许可证

本项目采用 [Apache License 2.0](LICENSE) 许可证。
