# 开发流程 SOP

本文档定义 `@atomgit.com/atomgit-mcp-server` 的开发协作流程。发版机制（bump、tag、npm 发布）见 [RELEASE.md](./RELEASE.md)，本文档聚焦「代码从需求到合并」的全过程。

项目有两大类开发场景：

- **场景 A**：自研需求（新增工具、修复 bug）
- **场景 B**：审核外部贡献者提交的 PR

另有三个衍生场景：紧急修复（C）、发布失败恢复（D）、免发版变更（E），见文末。

---

## 场景 A：自研需求完整流程

```
需求/缺陷 → Issue（建标签） → 前置联调 → 开发（复用通用逻辑） → 自检（build + E2E）
        → PR（满足进入 review 门槛） → 等待审核（铁律，禁止自合） → 合并 → 发版
```

### A1. 需求登记（Issue）

- 创建 Issue，正文包含：
  - 需求类：目标、涉及的 API 端点清单、预期工具命名
  - 缺陷类：现象、根因分析、**实测复现证据**（curl 或工具调用原文）
- **建 Issue 时必须打标签**：缺陷 → `bug`；新功能 → `feature`；文档 → `documentation`
- 无标签视为流程未启动

### A2. 前置联调（feature 类必做）

在写代码之前，用 curl 把每个新端点实测一遍，禁止凭文档猜测：

- 方法与完整路径（注意单复数差异，如 CLA 配置是 `PUT /cla` 而非 `/clas`）
- 参数名与格式：数组还是字符串、是否要求 base64、query 还是 body
- **响应信封结构**：是裸数组还是 `{total_count, xxx}` / `{data: [...]}` 包裹
- 列表端点确认是否支持分页参数
- API 版本前缀核对（v5 / v8，Actions 系列走 `/api/v8`）
- 联调脚本与结论存档，作为 PR 正文的联调证据

### A3. 开发（复用通用逻辑）

- **列表类工具必须接入分页体系**：schema 含 `page`/`perPage` + `autoPaginateSchemaProperties`，callTool 分支接 `autoPaginate`
- **autoPaginate 的 fetcher 必须返回数组**：API 返回信封时先解包（正例 `get_repository_actions_workflows` 的 `data?.workflows ?? []`；反例见 Issue #15）
- 命名遵循现有惯例 `get_* / create_* / update_* / replace_*`，不引入 `list_*` 等变体
- 优先复用现有构件：`repoPathProperties`、`paginationProperties`、`stringOrNumberSchema`、`buildParams`、`BaseService`
- 危险操作类工具以 `delete_ / remove_ / leave_ / archive_ / transfer_` 前缀命名，受 ToolSafetyPolicy 安全模式管控
- 新工具必须在 `index.ts` 完成 Service 实例化 + `registerTools` 注册
- 同步更新 `docs/api_tool_map.md` 与 `docs/apis_url.json`

### A4. 提交前自检

- `npm run build`（tsc）通过
- **E2E 必做**：通过 MCP stdio 协议真实调用本地构建的每个新工具
  - 注意：对外工具名带 `atomgit_` 前缀
  - 覆盖正常路径 + 错误路径（非法入参、错误透传）
  - 验证 safe mode 工具计数（注册数 + 跳过数 = 总数）

### A5. PR 提交 —— 进入 review 的门槛清单

PR 进入 review 状态之前，以下各项必须全部完成：

- [ ] 关联 Issue 存在且已打标签
- [ ] PR 标题格式：`feat/fix(scope): 英文描述 fixes #N`
- [ ] PR 正文含：关联 Issue、变更内容、联调/复现证据、与惯例的偏离说明（如有）
- [ ] **PR 已打上与 Issue 匹配的标签**（历史高频遗漏项）
- [ ] 分页与通用逻辑复用已对照 A3 检查
- [ ] build + E2E 通过
- [ ] 双远端分支已推送（origin AtomGit + github 镜像）

### A6. Review 门槛（铁律）

- PR 提交后**必须等待维护者明确审核通过才能合并，严禁自行合并**
- 审核意见处理后需再次等待确认

### A7. 合并与发版

按 [RELEASE.md](./RELEASE.md) 执行：

1. 合并 PR，给 PR 补/确认标签
2. bump 版本（commit `chore(release): X.Y.Z — 中文摘要 (#N)`）
3. **tag 查重**：本地 `git tag -l` + 远端 `git ls-remote --tags`（v2.2.0 事故铁律：tag 只创建不删除）
4. 推送双远端（main 与 tag 都要推 origin + github）
5. GitHub Actions OIDC 自动发布 npm（绝不手动 publish）
6. 创建 AtomGit Release（中文正文，分类列变更，带 `(#N)`）
7. 关闭关联 Issue：极简评论「已在 vX.Y.Z 修复（commit hash）」
8. **E2E 验收**：核实运行进程真实版本 → 用发布版本真实调用本次变更的工具 → 清理测试现场

---

## 场景 B：外部 PR 审核流程

```
收到 PR → 形式检查（Issue/标签/描述） → 代码审查 → 本地实测 → 提审核意见
      → 贡献者更新 → 循环至通过 → 门槛清单 → 维护者批准合并 → 评估发版 → 发版
```

### B1. 形式检查

- PR 是否关联 Issue；没有则请贡献者补建，或代为补建
- Issue/PR 标签是否齐全，缺则补打
- 描述是否包含动机、变更内容、测试证据；不足则要求补充

### B2. 代码审查要点

- **命名惯例**：`get_* / create_* / update_* / replace_*`
- **schema 完整性**：required 字段、类型、描述
- **列表类**：是否接入分页体系；autoPaginate fetcher 是否返回数组（不是信封）
- **通用逻辑复用**：是否重复造轮子（PaginationHelper、公共 schema 构件等）
- **参数映射**：与官方 API 文档逐字段核对，有疑点必须 curl 实测（历史教训：label 数组格式、updateIssue URL 缺段、create_tag refs 字段名，三次同类 bug）
- **安全**：危险操作是否落入安全前缀管控；有无注入风险

### B3. 本地实测（必做，禁止只看 diff）

- checkout 贡献者分支 → `npm run build` → MCP stdio E2E 真实调用新增/修改的工具
- 正常路径 + 错误路径都要验证

### B4. 审核意见与循环

- 在 PR 上提交具体评论：指出问题 + 给出修改建议（引用行号）
- 贡献者更新后重新执行 B2–B3，直至通过

### B5. 合并与发版

- 满足 A5 门槛清单 + 维护者批准 → 合并
- 评估发版时机：单个 PR 可独立发版，也可等多个 PR 攒一次发版
- 发版执行同 A7

---

## 场景 C：紧急修复（hotfix）

流程同场景 A，差异点：

- 分支命名 `fix/xxx`，commit 前缀 `fix(scope):`
- 发版走 `patch`
- Issue 正文的实测复现证据不可省略
- E2E 验收不可省略（历史教训：版本漂移曾让 server 长期停在旧版本，typecheck/build 通过不等于用户拿到的包是好的）

## 场景 D：发布失败恢复

不复用版本号、不删除 tag，直接发布下一个版本。详见 [RELEASE.md](./RELEASE.md)「失败重试」。

## 场景 E：免发版变更

仅仓库内部文档、本地开发辅助等不进 npm 包的变更，无需发版。判定标准见 [RELEASE.md](./RELEASE.md)「不需要发布 npm 包的情况」。

---

## 历史 bug 模式速查（开发前对照）

| 模式 | 实例 | 防线 |
|---|---|---|
| 参数名/格式与 API 不符 | label 数组格式、updateIssue URL 缺段、create_tag refs 字段名 | 前置 curl 实测，禁止凭文档猜 |
| 信封未解包 | get_repository_actions_runs autoPaginate 崩溃（Issue #15） | fetcher 必须返回数组 |
| 路径单复数 | CLA 配置是 PUT /cla 而非 /clas | 两条路径都实测 |
| 报错文案误导 | validate 接口 body 字段实为 base64_content | 控制变量实验验证 |
| API 版本前缀 | Actions 系列走 /api/v8 而非 /api/v5 | 以 Service 实测路径为准 |
| 版本漂移 | server 曾长期停在 2.4.1 | 发版后核实运行进程真实版本 |
| 标签遗漏 | Issue/PR 建后无标签 | 列入 A5 门槛清单 |

## 铁律清单

1. tag 只创建不删除（v2.2.0 事故）
2. npm 绝不手动 publish，只走 GitHub Actions OIDC
3. PR 绝不自行合并，必须等审核通过
4. 改变远端状态的高危操作（推 tag、推 RELEASE 文档、force 类命令）先向维护者确认
5. 建 Issue/PR 即打标签，无标签不算进入流程
