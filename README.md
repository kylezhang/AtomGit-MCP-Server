# AtomGit MCP Server

![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)
![Tools](https://img.shields.io/badge/tools-279-orange.svg)

`@atomgit.com/atomgit-mcp-server` 是一个基于 [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) 的服务器实现，用于将 AtomGit 平台能力接入支持 MCP 的客户端，例如 Claude Desktop、Cursor、Trae 等。

## 主要特性

- 全量 MCP 工具接入：覆盖 18 个功能分类，提供 279 个工具。
- 默认安全模式：危险工具默认隐藏，需要时可显式开启。
- 基于 Access Token 认证：使用 AtomGit Personal Access Token 访问平台 API。
- 标准 MCP 协议：兼容基于 stdio 的 MCP 客户端集成方式。
- TypeScript 实现：包含类型定义、参数校验和构建产物。

## 功能模块

- 仓库管理：仓库查询、创建、删除、Fork、Star、Watch、文件操作。
- 分支与标签：分支管理、标签管理、受保护分支相关能力。
- 提交与发布：提交历史查询、版本发布管理。
- 合并请求：Pull Request 查询、创建、合并、Diff、评审相关能力。
- 工单管理：Issue 查询、创建、更新、评论、指派和状态管理。
- 项目规划：Milestone 与 Label 管理。
- 看板管理：组织看板与工作项管理。
- 用户与组织：用户信息、SSH 密钥、组织成员相关能力。
- 企业与成员：企业级资源和成员权限管理。
- 搜索与 Webhook：代码搜索、仓库搜索、用户搜索，以及 Webhook 管理。
- AIHub：AIHub 模型相关能力。
- Actions：工作流运行、Job、Artifact、Runner 和 Runner Group 查询相关能力。

## 快速开始

### 前置要求

- [Node.js](https://nodejs.org/) `>= 18`
- [AtomGit](https://atomgit.com/) 账号
- AtomGit Personal Access Token

### 1. 获取 Access Token

1. 登录 AtomGit。
2. 打开 [设置 -> 访问令牌](https://atomgit.com/setting/token-classic)。
3. 创建新的 Personal Access Token。
4. 根据实际使用场景分配权限；如需完整体验，可授予常用仓库和组织相关权限。
5. 保存生成的 Token。

### 2. 通过 `npx` 运行

如采用 npm 包方式，可直接执行以下命令：

```bash
npx -y @atomgit.com/atomgit-mcp-server
```

运行前请先设置环境变量 `ATOMGIT_TOKEN`。默认安全模式下，`delete_*`、`remove_*`、`leave_*`、`archive_*`、`transfer_*` 这类危险工具不会暴露给 MCP 客户端。

### 3. 安全模式与危险工具开关

- 默认值：`ATOMGIT_ENABLE_DANGEROUS_TOOLS=false`
- 默认行为：危险工具不会出现在 `tools/list` 中，直接调用也会收到明确禁用提示
- 开启方式：设置 `ATOMGIT_ENABLE_DANGEROUS_TOOLS=true` 后重启服务
- 当前文档与 `docs/api_tool_map.md` 仍展示完整工具能力；运行时实际暴露的工具集合取决于该开关

例如，在临时 shell 中显式开启危险工具：

```bash
ATOMGIT_ENABLE_DANGEROUS_TOOLS=true npx -y @atomgit.com/atomgit-mcp-server
```

### 4. 在 Claude Desktop 中配置

Claude Desktop 配置文件位置：

- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

#### Windows 示例

Windows 环境建议将 `command` 设置为 `npx.cmd`：

```json
{
  "mcpServers": {
    "atomgit": {
      "command": "npx.cmd",
      "args": [
        "-y",
        "@atomgit.com/atomgit-mcp-server"
      ],
      "env": {
        "ATOMGIT_TOKEN": "你的_ATOMGIT_TOKEN",
        "ATOMGIT_ENABLE_DANGEROUS_TOOLS": "false"
      }
    }
  }
}
```

#### macOS / Linux 示例

```json
{
  "mcpServers": {
    "atomgit": {
      "command": "npx",
      "args": [
        "-y",
        "@atomgit.com/atomgit-mcp-server"
      ],
      "env": {
        "ATOMGIT_TOKEN": "你的_ATOMGIT_TOKEN",
        "ATOMGIT_ENABLE_DANGEROUS_TOOLS": "false"
      }
    }
  }
}
```

完成配置后，重启 Claude Desktop 使配置生效。

如需恢复当前全量行为，可把 `ATOMGIT_ENABLE_DANGEROUS_TOOLS` 改为 `"true"` 并重启客户端。

## 开发测试

如需参与开发、进行本地调试，或在 MCP 客户端中联调本地构建产物，可使用以下步骤：

```bash
git clone https://atomgit.com/zkxw2008/AtomGit-MCP-Server.git
cd AtomGit-MCP-Server
npm install
npm run build
node dist/index.js
```

本地运行前至少需要提供：

- `ATOMGIT_TOKEN`
- `ATOMGIT_ENABLE_DANGEROUS_TOOLS=false`

如需使用 `.env`，可先复制 `.env.example` 再填写；也可以直接通过 MCP 客户端或 shell 注入环境变量。

如需在 Claude Desktop 等 MCP 客户端中直接联调本地构建产物，可根据操作系统使用如下配置。

Windows 示例：

```json
{
  "mcpServers": {
    "atomgit-dev": {
      "command": "node.exe",
      "args": [
        "D:\\path\\to\\AtomGit-MCP-Server\\dist\\index.js"
      ],
      "env": {
        "ATOMGIT_TOKEN": "你的_ATOMGIT_TOKEN",
        "ATOMGIT_ENABLE_DANGEROUS_TOOLS": "false"
      }
    }
  }
}
```

说明：

- Windows 路径中的反斜杠 `\` 需要写成 `\\`
- 如果 `node.exe` 不在 `PATH` 中，可改为 Node.js 的绝对路径

macOS / Linux 示例：

```json
{
  "mcpServers": {
    "atomgit-dev": {
      "command": "node",
      "args": [
        "/path/to/AtomGit-MCP-Server/dist/index.js"
      ],
      "env": {
        "ATOMGIT_TOKEN": "你的_ATOMGIT_TOKEN",
        "ATOMGIT_ENABLE_DANGEROUS_TOOLS": "false"
      }
    }
  }
}
```

## 开发说明

维护规则、过滤例外和覆盖口径以 [AGENTS.md](./AGENTS.md) 为准；本节提供推荐的日常开发与同步顺序。

### 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 使用 `tsx` 直接运行源码 |
| `npm run build` | 编译 TypeScript 代码到 `dist/` |
| `npm run start` | 运行编译后的 `dist/index.js` |
| `npm run typecheck` | 执行 TypeScript 类型检查 |
| `npm run clean` | 清理 `dist/` 目录 |
| `npm run api:sync` | 更新 API 定义来源数据 |
| `npm run api:map` | 生成 API 与工具映射文档 |
| `npm run api:check` | 检查 API 覆盖情况 |
| `npm run api:audit` | 审计 tools / services 的参数与类型是否和官网文档一致 |
| `npm run api:scaffold` | 为指定 API 生成工具和服务代码 |

### 维护流程

当需要同步 AtomGit 官网 API、补齐缺口或校准参数类型时，推荐按下面顺序执行：

```mermaid
flowchart TD
    A["同步官方文档<br/>npm run api:sync"] --> B["检查当前覆盖缺口<br/>npm run api:check"]
    B --> C["实现或移除 tools / services"]
    C --> D["重建映射文档<br/>npm run api:map"]
    D --> E["校验 schema 与 service 参数<br/>npm run api:audit"]
    E --> F["再次复核覆盖结果<br/>npm run api:check"]
    F --> G["类型检查<br/>npm run typecheck"]
    G --> H["构建验证<br/>npm run build"]
    H --> I["Review git diff"]
```

简要说明：

1. `api:sync` 用来同步并过滤 AtomGit 官网文档，得到当前允许纳入项目的 API 基线。
2. `api:check` 应先跑一次，目的是先确认“项目缺了什么”或“项目多了什么”。
3. 实现阶段只改 `src/services/`、`src/tools/`、必要的 `src/types/`，保持请求形状与官网文档一致。
4. `api:map` 在实现后再跑，用于重建 [docs/api_tool_map.md](./docs/api_tool_map.md)。
5. `api:audit` 用于检查参数名、必填项、字段类型和 service 签名是否与官网文档一致。
6. 最后再跑 `api:check`、`typecheck`、`build`，并检查最终 `git diff`。

补充说明：

- `api:check` 是 canonical 覆盖统计，关注的是“去重后的官方 API 是否全部覆盖”。
- `docs/apis_url.json`、`docs/api_tool_map.md`、公开 tools 数量需要保持一致。
- `api:scaffold` 适合生成基础骨架，但分类命名与现有模块不完全一致时，仍应以手工实现和 review 为准。

### 项目结构

```text
AtomGit-MCP-Server/
├── src/
│   ├── core/        # 核心基础设施
│   ├── services/    # API 服务层
│   ├── tools/       # MCP 工具层
│   ├── types/       # 类型定义
│   └── index.ts     # 服务入口
├── scripts/         # 辅助脚本
├── docs/            # 文档与 API 映射
└── dist/            # 编译产物
```

## 相关链接

- npm: [@atomgit.com/atomgit-mcp-server](https://www.npmjs.com/package/@atomgit.com/atomgit-mcp-server)
- AtomGit Repository: [zkxw2008/AtomGit-MCP-Server](https://atomgit.com/zkxw2008/AtomGit-MCP-Server)
- GitHub Mirror: [kylezhang/AtomGit-MCP-Server](https://github.com/kylezhang/AtomGit-MCP-Server)
- Release Guide: [RELEASE.md](./RELEASE.md)

## 许可证

本项目采用 Apache 2.0 License。
