# AtomGit MCP Server - Developer Guidelines

**ROLE:** You are an expert TypeScript developer building the AtomGit MCP Server. You must strictly follow the file structure, coding standards, and implementation priorities defined below.

## 🚨 CRITICAL CONSTRAINTS (Read First)

1. **Environment Integrity (`.env`)**:
* **NEVER** modify, recreate, or delete the `.env` file.
* **NEVER** copy `.env.example` to `.env`.
* **ALWAYS** use the existing `.env` configuration provided by the user (Token, Repo Owner, etc.).

2. **Root Directory Hygiene**:
* **NEVER** create test scripts, debug scripts, or docs in the root directory.
* **ONLY** core config files (`package.json`, `tsconfig.json`, `README.md`, etc.) and `src/` are allowed in root.

---

## 📂 File Organization & Structure

### Directory Mandates

Follow this strict mapping for new files:

| File Type | Target Directory | Naming Pattern |
| --- | --- | --- |
| **Source Code** | `src/` | `*.ts` |
| **Tests** | `tests/` | `test-*.mjs` |
| **Debug Scripts** | `scripts/debug/` | `debug-*.mjs` |
| **Documentation** | `docs/` | `*_REPORT.md`, `*_SUMMARY.md` |

### Project Architecture (`src/`)

* `src/services/` - API service logic (e.g., `AtomGitService.ts`).
* `src/tools/` - MCP tool definitions & implementations.
* `src/types/` - TypeScript interfaces and types.

---

## 💻 Code Style & Standards

### TypeScript & Imports

* **Extension:** Use `.js` extension for all local imports (ESM requirement).
* **Strictness:** No implicit `any`. Use `exactOptionalPropertyTypes: true`.
* **Return Types:** Explicitly define return types. Avoid `any` or `unknown`.
* **MCP SDK:** Import types from `@modelcontextprotocol/sdk/types.js`.

### Naming Conventions

* **Classes:** PascalCase (`BranchTools`)
* **Methods:** camelCase (`createRepositoryIssue`)
* **Files:** PascalCase for classes (`AtomGitService.ts`)
* **Constants:** UPPER_SNAKE_CASE (`API_BASE_URL`)

### API & Error Handling

* **Wrappers:** All async API calls must be wrapped in `try/catch`.
* **Errors:** Throw meaningful errors with context. Log to `stderr` for debugging.
* **Tool Schema:** Every tool MUST have a `description` and `inputSchema` (with defaults for optional params).
* **Pattern:** Use `getTools()` and `callTool(name, args)` pattern. Throw error if tool name is unknown.

---

## 📖 Documentation (README.md) Editing

**Goal:** Maintain the manually optimized human-readable structure.

* **ALLOWED to Edit:** Only the `## 🛠️ 已实现工具` (Implemented Tools) section and its subsections (tables).
* **FORBIDDEN to Edit:** Project intro, `Features`, `Quick Start`, `Structure`, `License`, or the order of sections.

---

## 🚀 Implementation Plan & Workflow

**Strategy:** Prioritize "Core Repository Operations" (PRs, Files, Issues) before moving to "Collaboration" or "Enterprise" features.

### Development Loop (Repeat for each feature)

1. **Develop:** Implement Service method + MCP Tool.
2. **Test:** Create/Run unit & integration tests in `tests/` using **real** `.env` vars.
3. **Doc:** Update `README.md` tool list.
4. **Verify:** Ensure `npm run typecheck` and `npm test` pass.

### Priority Roadmap

1. **Priority 1: Core Ops** (PRs, File Content, Issues, Branches).
2. **Priority 2: Collaboration** (Labels, Milestones, Commits, Members, Search).
3. **Priority 3: Org & Enterprise** (Orgs, Releases, Webhooks, Ent. Features).
4. **Priority 4: Advanced** (Kanban, AI Hub, User Settings).

---

## 🛠️ Development Commands

* `npm run dev` - Start development mode
* `npm run build` - Build to `dist/`
* `npm run typecheck` - Verify types
* `npm run test:mcp` - Test MCP server functionality
* `npm run test:auth` - Run authenticated tests