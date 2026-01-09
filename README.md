# AtomGit MCP Server

## 🎯 项目概述
AtomGit MCP Server 是一个基于 Model Context Protocol 的服务器，允许 AI 助手直接与 AtomGit 平台进行交互。它提供了 **246 个工具**，涵盖了仓库管理、用户管理、分支管理、提交管理、标签管理、问题管理、Pull Request 管理、仓库设置、高级仓库功能、标签里程碑管理、高级提交管理、成员管理、搜索功能、高级用户功能、高级发布功能、组织管理、Webhook管理、企业功能、看板管理、AI Hub功能等全面功能。

### ✨ 主要特性

- 🚀 **完整的功能覆盖** - 支持 AtomGit 平台所有核心功能
- 🔐 **安全认证** - 基于 Token 的认证机制，确保数据安全  
- 🛠️ **MCP 协议** - 完全符合 Model Context Protocol 标准
- 📝 **TypeScript 编写** - 类型安全，易于维护和扩展
- 🎯 **91.2% 测试成功率** - 经过全面测试，稳定可靠

---

## 👥 如何使用

🛠️ 在 AI 工具中配置使用

### 🔑 获取认证令牌
  
  1. 访问 [AtomGit Token 设置页面](https://atomgit.com/setting/token-classic)
  2. 点击"生成令牌"按钮
  3. 选择必要的权限范围（建议选择完全权限以获得最佳体验）

可以这样优化，表达更规范、也更便于技术人员快速理解与操作：

---

### 配置 JSON

**注意事项（Windows 路径）：**
在 Windows 操作系统中，`args` 参数内的文件路径需使用反斜杠 `\`，并进行转义处理。
例如，将
`"path/to/AtomGit-MCP-Server/dist/index.js"`
替换为：
`"path\\AtomGit-MCP-Server\\dist\\index.js"`

```json
{
  "mcpServers": {
    "atomgit": {
      "command": "node",
      "args": ["path\\AtomGit-MCP-Server\\dist\\index.js"],
      "env": {
        "ATOMGIT_TOKEN": "your_personal_access_token_here"
      }
    }
  }
}
```

---

## 🛠️ 已实现工具

根据 [AtomGit 官方 API](https://docs.atomgit.com/docs/apis/)，已实现 **246 个工具**，测试成功率 **91.2%**。

详细的完整工具列表请参考：[📖 README_additional_sections.md](./README_additional_sections.md)

---

## 👨‍💻 开发贡献

### 📝 贡献指南

1. **Fork 项目**并创建功能分支
2. **开发新功能**遵循现有代码风格
3. **添加测试**确保功能正常工作
4. **运行类型检查** `npm run typecheck`
5. **提交 Pull Request**
   
### 🚀 快速开始

```bash
# 1. Fork 并克隆项目
git clone https://atomgit.com/your-username/AtomGit-MCP-Server.git
cd AtomGit-MCP-Server

# 2. 安装依赖
npm install

# 3. 创建功能分支
git checkout -b feature/your-feature-name

# 4. 构建项目
npm run build
```

### 🛠️ 开发命令

```bash
npm run build        # 构建 TypeScript 代码
npm run typecheck    # 类型检查
npm run dev          # 开发模式运行
npm start           # 生产模式运行
npm test            # 运行基础测试
npm run test:auth   # 运行认证测试（推荐）
npm run test:mcp    # 运行 MCP 服务器测试
```

### 📂 项目结构

```
AtomGit-MCP-Server/
├── src/
│   ├── services/    # API 服务层
│   ├── tools/       # MCP 工具类
│   └── types/       # TypeScript 类型定义
├── dist/            # 编译输出
├── tests/           # 测试脚本
├── scripts/         # 脚本目录
├── docs/            # 项目文档
├── AGENTS.md        # Agent 工作指南
└── README.md        # 项目说明
```

---

## 📄 许可证

Apache License 2.0 - 详见 [LICENSE](./LICENSE) 文件

---

## 📞 支持与联系

- 📧 **技术支持**: [GitHub Issues](https://github.com/your-repo/AtomGit-MCP-Server/issues)
- 📧 **功能请求**: [GitHub Discussions](https://github.com/your-repo/AtomGit-MCP-Server/discussions)

---

## 🌟 致谢

感谢所有为这个项目做出贡献的开发者和用户。正是因为你们的支持，AtomGit MCP Server 才能够不断改进和完善。