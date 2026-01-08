# AtomGit MCP Server

AtomGit MCP Server 是一个基于 Model Context Protocol 的服务器，允许 AI 助手直接与 AtomGit 平台进行交互。它提供了 **246 个工具**，涵盖了仓库管理、用户管理、分支管理、提交管理、标签管理、问题管理、Pull Request 管理、仓库设置、高级仓库功能、标签里程碑管理、高级提交管理、成员管理、搜索功能、高级用户功能、高级发布功能、组织管理、Webhook管理、企业功能、看板管理、AI Hub功能等全面功能。

## 🎯 项目概述

AtomGit MCP Server 是一个功能强大的工具集成，让开发者能够通过 AI 助手无缝访问 AtomGit 平台的所有核心功能。无论是日常的仓库操作、团队协作，还是高级的企业功能管理，这个工具集都能提供完整的支持。

### ✨ 主要特性

- 🚀 **完整的功能覆盖** - 支持 AtomGit 平台所有核心功能
- 🔐 **安全认证** - 基于 Token 的认证机制，确保数据安全  
- 🛠️ **MCP 协议** - 完全符合 Model Context Protocol 标准
- 📝 **TypeScript 编写** - 类型安全，易于维护和扩展
- 🎯 **91.2% 测试成功率** - 经过全面测试，稳定可靠

---

## 👥 面向使用者

### 🛠️ 在 AI 工具中配置使用

#### Claude Desktop 
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

#### Cursor
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

#### VS Code
通过 VS Code 的 MCP 扩展配置：
1. 安装支持 MCP 的 VS Code 扩展
2. 在设置中添加 MCP 服务器配置
3. 使用与 Claude Desktop 相同的配置格式

#### Tabby
```json
{
  "name": "atomgit",
  "command": "node",
  "args": ["path/to/AtomGit-MCP-Server/dist/index.js"],
  "env": {
    "ATOMGIT_TOKEN": "your_personal_access_token_here"
  }
}
```

#### Continue.dev
```json
{
  "tools": [
    {
      "name": "atomgit",
      "type": "mcp",
      "config": {
        "command": "node",
        "args": ["path/to/AtomGit-MCP-Server/dist/index.js"],
        "env": {
          "ATOMGIT_TOKEN": "your_personal_access_token_here"
        }
      }
    }
  ]
}
```

### 🔑 获取认证令牌

1. 访问 [AtomGit Token 设置页面](https://atomgit.com/setting/token-classic)
2. 点击"生成令牌"按钮
3. 选择必要的权限范围（建议选择完全权限以获得最佳体验）
4. 复制生成的令牌并安全保存

### 📋 环境变量配置

创建 `.env` 文件：
```env
ATOMGIT_TOKEN=your_personal_access_token_here
ATOMGIT_API_BASE_URL=https://api.atomgit.com
```

或在命令行设置：
```bash
# Linux/Mac
export ATOMGIT_TOKEN=your_token_here

# Windows PowerShell
$env:ATOMGIT_TOKEN="your_token_here"
```

---

## 🛠️ 已实现工具

根据 [AtomGit 官方 API](https://docs.atomgit.com/docs/apis/)，已实现 **246 个工具**，测试成功率 **91.2%**。

详细的完整工具列表请参考：[📖 README_additional_sections.md](./README_additional_sections.md)

### 📊 核心功能类别概览

| 功能类别 | 工具数量 | 测试状态 |
|----------|----------|----------|
| 👤 用户管理 | 11 个 | 100% 通过 |
| 📂 仓库管理 | 12 个 | 75% 通过 |
| 🌿 分支管理 | 8 个 | 100% 通过 |
| 🐛 问题管理 | 20 个 | 100% 通过 |
| 🔀 Pull Requests | 35 个 | 97% 通过 |
| 📝 提交管理 | 13 个 | 100% 通过 |
| 🏷️ 标签管理 | 2 个 | 100% 通过 |

### 🎯 测试状态说明

- ✅ **已测试** - API 功能测试通过，可正常使用
- ⏳ **已实现待测试** - 功能已实现，等待进一步测试
- ❌ **API问题** - API 端点存在问题，正在修复中

---

## 👨‍💻 面向开发者

### 🚀 快速开发开始

#### 1. 环境要求

- Node.js >= 18
- npm 或 yarn
- Git

#### 2. 安装步骤

```bash
# 克隆项目
git clone <repository-url>
cd AtomGit-MCP-Server

# 安装依赖
npm install

# 构建项目
npm run build
```

#### 3. 开发命令

```bash
# 构建 TypeScript 代码
npm run build

# 类型检查
npm run typecheck

# 开发模式运行（带热重载）
npm run dev

# 生产模式运行
npm start

# 清理构建文件
npm run clean
```

#### 4. 测试

```bash
# 运行认证测试（推荐）
npm run test:auth

# 运行基础功能测试
npm test

# 运行 MCP 服务器测试
npm run test:mcp

# 运行全面测试（推荐）
npm run test:comprehensive

# 运行所有工具测试
node tests/test-comprehensive-all.mjs
```

#### 5. 项目结构

```
AtomGit-MCP-Server/
├── src/                    # 源代码
│   ├── services/          # API 服务层
│   ├── tools/             # MCP 工具类
│   └── types/             # TypeScript 类型定义
├── dist/                   # 编译输出
├── tests/                  # 测试脚本
│   └── debug/            # 调试脚本
├── scripts/                # 脚本目录
├── docs/                   # 项目文档
├── .env.example            # 环境变量模板
├── AGENTS.md              # Agent 工作指南
├── package.json           # NPM 配置
├── README.md              # 项目说明
├── LICENSE                # MIT 许可证
└── tsconfig.json          # TypeScript 配置
```

---

## 🤝 面向贡献者

### 🌟 如何贡献

我们欢迎所有形式的贡献！无论是修复 Bug、添加新功能，还是改进文档，都非常感谢您的参与。

#### 🛠️ 开发新功能

1. **Fork 项目**
   ```bash
   git fork https://github.com/your-repo/AtomGit-MCP-Server.git
   cd AtomGit-MCP-Server
   git checkout -b feature/your-feature-name
   ```

2. **开发流程**
   ```bash
   # 安装依赖
   npm install
   
   # 创建新的工具类
   # 在 src/tools/ 目录下创建新的工具文件
   
   # 在 src/services/AtomGitService.ts 中添加对应的 API 方法
   
   # 更新 src/index.ts 注册新工具
   ```

3. **测试您的更改**
   ```bash
   # 运行现有测试
   npm test
   
   # 为新功能创建测试
   # 在 tests/ 目录下添加测试脚本
   
   # 运行类型检查
   npm run typecheck
   ```

4. **代码规范**
   - 使用 TypeScript 进行开发
   - 遵循现有的代码风格
   - 为新功能添加适当的错误处理
   - 更新相关文档

#### 📝 添加新工具指南

**工具类模板：**
```typescript
// src/tools/NewFeatureTools.ts
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { AtomGitService } from '../services/AtomGitService.js';

export class NewFeatureTools {
  constructor(private atomGitService: AtomGitService) {}

  getTools(): Tool[] {
    return [
      {
        name: 'new_tool_name',
        description: '工具的详细描述',
        inputSchema: {
          type: 'object',
          properties: {
            // 定义输入参数
          },
          required: ['param1'] // 必需参数
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    if (name === 'new_tool_name') {
      return await this.atomGitService.newApiMethod(args.param1, args.param2);
    }
    throw new Error(`Unknown tool: ${name}`);
  }
}
```

**服务层模板：**
```typescript
// src/services/AtomGitService.ts
async newApiMethod(param1: string, param2?: string): Promise<any> {
  const response = await this.client.get(`/api/v5/endpoint/${param1}`, {
    params: param2 ? { param2 } : undefined
  });
  return response.data;
}
```

#### 🐛 报告问题

- 使用 GitHub Issues 报告 Bug
- 提供详细的重现步骤
- 包含环境信息（Node.js 版本、操作系统等）
- 添加相关的错误日志

#### 📖 文档贡献

- 改进 API 文档
- 添加使用示例
- 翻译文档到其他语言
- 创建教程和最佳实践指南

#### 🧪 测试贡献

- 为新功能编写单元测试
- 添加集成测试
- 改进现有测试覆盖率
- 测试边界情况和错误处理

### 🎯 贡献指南

1. **小步提交** - 保持提交的原子性
2. **清晰的提交信息** - 使用描述性的提交消息
3. **向后兼容** - 确保更改不会破坏现有功能
4. **文档同步** - 代码更改必须伴随文档更新
5. **测试覆盖** - 新功能必须有相应测试

### 🏆 贡献者认可

所有贡献者都会在项目中得到认可：
- README 中的贡献者列表
- 发布说明中的感谢
- GitHub 上的贡献统计

---

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件

---

## 📞 支持与联系

- 📧 **技术支持**: [GitHub Issues](https://github.com/your-repo/AtomGit-MCP-Server/issues)
- 📧 **功能请求**: [GitHub Discussions](https://github.com/your-repo/AtomGit-MCP-Server/discussions)
- 📧 **安全问题**: 请通过私有渠道报告

---

## 🌟 致谢

感谢所有为这个项目做出贡献的开发者和用户。正是因为你们的支持，AtomGit MCP Server 才能够不断改进和完善。

**特别感谢 AtomGit 平台提供强大的 API 支持！**