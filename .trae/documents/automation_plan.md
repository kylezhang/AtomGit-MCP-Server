# AtomGit MCP Server 自动化工作流改进计划

## 目标
优化开发流程，实现从“获取 API”到“生成工具代码”再到“更新文档”的高度自动化。

## 现状分析
当前工作流：
1.  **获取 API**: `scripts/update_apis.ts` -> `docs/apis_url.json` (已自动化)
2.  **实现工具**: 手动编写 Service 和 Tool 代码 (完全手动)
3.  **更新文档**: `scripts/generate_map.ts` -> `docs/api_tool_map.md` (已自动化)

主要痛点：
- 无法直观看到哪些 API 尚未实现。
- 编写 Tool 和 Service 代码存在大量样板代码。
- 缺乏统一的命令入口。

## 实施计划

### 1. 统一命令入口 (package.json)
在 `package.json` 中添加便捷脚本，串联整个流程。

- `npm run api:sync`: 更新 API 定义 (执行 `scripts/update_apis.ts`)
- `npm run api:map`: 生成文档映射 (执行 `scripts/generate_map.ts`)
- `npm run api:check`: **[新增]** 检查 API 覆盖率，列出未实现的 API。
- `npm run api:scaffold`: **[新增]** 根据 API 定义生成工具代码模版。

### 2. 开发覆盖率分析脚本 (`scripts/analyze_coverage.ts`)
该脚本将对比 `docs/apis_url.json` (全量 API) 和 `src/tools/*.ts` (已实现工具)，输出开发进度报告。

**功能点：**
- 读取 `apis_url.json` 获取所有 API 端点。
- 扫描 `src/tools/` 获取已实现的工具。
- 匹配逻辑复用 `generate_map.ts` 的核心算法。
- **输出报告**：
    - 总体覆盖率 (例如: 240/300, 80%)。
    - 按分类列出未实现的 API 列表 (Method + URL + Description)。
    - 建议的工具名称 (根据 API 路径自动生成)。

### 3. 开发代码生成脚手架 (`scripts/scaffold_tool.ts`)
该脚本用于快速生成新工具的样板代码。

**功能点：**
- **输入**：接受 API 的 URL 或 路径部分匹配 (如 `npm run api:scaffold -- "GET /repos/{owner}/{repo}/issues"`)。
- **处理**：
    - 在 `apis_url.json` 中查找对应 API 元数据。
    - 自动生成 Tool 定义代码 (包含 InputSchema)。
    - 自动生成 Service 方法代码 (包含 `this.client.get/post` 调用)。
- **输出**：
    - 打印到控制台 (供复制粘贴)。
    - (进阶) 尝试自动追加到对应的 `src/tools/` 和 `src/services/` 文件中。

### 4. 完善文档
- 更新 `AGENTS.md` 或 `README.md`，说明新的自动化工作流。

## 执行步骤
1.  **配置 npm scripts**: 修改 `package.json`。
2.  **创建覆盖率脚本**: 实现 `scripts/analyze_coverage.ts`。
3.  **创建脚手架脚本**: 实现 `scripts/scaffold_tool.ts` (先实现基础版，打印代码)。
4.  **验证**: 运行一套完整流程，确保脚本协同工作。
