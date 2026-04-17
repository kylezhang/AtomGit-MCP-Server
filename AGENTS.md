# AtomGit MCP Server - Developer Guide

**Generated:** 2026-03-21
**Status:** Stable / Maintained

## 1. Project Overview
AtomGit MCP Server is a Model Context Protocol (MCP) server implementation that provides AI assistants with access to the AtomGit code hosting platform.

Current public surface:
- **242 public tools**
- **17 tool categories**
- **Default safe mode enabled**: dangerous tools are hidden unless `ATOMGIT_ENABLE_DANGEROUS_TOOLS=true`

Important scope rules:
- Public tools, `docs/apis_url.json`, and `docs/api_tool_map.md` must stay aligned.
- OAuth documentation pages are intentionally filtered from `docs/apis_url.json` and must not be exposed as public MCP tools.
- The raw file content documentation page `get-owner-repo-raw-head-sha-name` is **not** filtered; it must remain mapped to the pull request file-content tool.

**Key Technologies:**
- **Language:** TypeScript (ESM)
- **Protocol:** Model Context Protocol (MCP) SDK
- **Runtime:** Node.js >= 18

## 2. Core Architecture

### Directory Structure
```
AtomGit-MCP-Server/
├── src/
│   ├── core/
│   │   ├── ToolRegistry.ts       # Central tool registration / atomgit_ prefix handling
│   │   └── ToolSafetyPolicy.ts   # Safe mode filtering and blocked-tool messaging
│   ├── services/                 # API Service Layer (HTTP clients)
│   ├── tools/                    # MCP Tool Layer (schema definitions)
│   ├── types/                    # TypeScript interfaces
│   └── index.ts                  # Application entry point
├── scripts/
│   ├── generate_map.ts           # API -> tool documentation generator
│   ├── update_apis.ts            # Official docs synchronizer
│   ├── analyze_coverage.ts       # API coverage analyzer
│   ├── audit_api_contracts.ts    # Tool / service contract auditor against official docs
│   └── scaffold_tool.ts          # Code generator / file injector
├── docs/
│   ├── api_tool_map.md           # Detailed API vs Tool mapping
│   └── apis_url.json             # Source of truth for synced official docs
├── dist/
└── package.json
```

### Data Flow
1. **MCP Client** sends a tool call such as `atomgit_get_repository_tree`.
2. **ToolRegistry** resolves the public `atomgit_` name to an internal tool.
3. **ToolSafetyPolicy** determines whether the tool is exposed or blocked by safe mode.
4. **Tool Layer** (`src/tools/*.ts`) validates parameters and calls the service layer.
5. **Service Layer** (`src/services/*.ts`) performs the AtomGit API request.
6. **AtomGit API** returns the result to the MCP server.

## 3. Development Standards

### Naming Conventions
- **Tools**
  - Internal name: `get_repository_tree`
  - Public name: `atomgit_get_repository_tree`
  - Tool descriptions should stay compatible with bilingual map generation.
- **Services**
  - Use camelCase service method names such as `getRepositoryTree`.

### Public Surface Rule
Keep these four layers aligned:
1. Official docs pages that are allowed into `docs/apis_url.json`
2. Implemented services in `src/services/`
3. Implemented public tools in `src/tools/`
4. Generated mapping in `docs/api_tool_map.md`

If an official page is intentionally filtered from `docs/apis_url.json`, the matching public tool/service should not remain exposed unless there is an explicit documented exception.

### Documentation Sync Rules
- `docs/apis_url.json` is the source of truth for official API doc coverage.
- `scripts/update_apis.ts` reads from `https://docs.atomgit.com/sitemap.xml`.
- The sitemap may still emit `docs.gitcode.com` URLs; the sync script must normalize them to `docs.atomgit.com` before fetching and storing.
- The sync script should keep the filtered documentation inventory canonically deduplicated so repeated doc pages do not inflate the public API baseline.
- The following pages are intentionally filtered and must stay out of `docs/apis_url.json`:
  - `https://docs.atomgit.com/docs/apis/get-oauth-authorize-client-id-client-id-redirect-uri-redirect-uri-response-type-code-scope-scope-state-state`
  - `https://docs.atomgit.com/docs/apis/post-oauth-token-grant-type-authorization-code-code-code-client-id-client-id-client-secret-client-secret`
  - `https://docs.atomgit.com/docs/apis/oauth`
  - `https://docs.atomgit.com/docs/apis/delete-api-v-5-org-owner-kanban-kanban-id-remove-item`
  - `https://docs.atomgit.com/docs/apis/put-api-v-5-org-owner-kanban-repo-repo-type-iid`
- The raw file content page below must **not** be filtered and must parse as a valid endpoint:
  - `https://docs.atomgit.com/docs/apis/get-owner-repo-raw-head-sha-name`
  - Expected endpoint path: `/:owner/:repo/raw/:head_sha/:name`

### Adding or Updating a Feature
1. **Sync the official baseline first**
   - Run `npm run api:sync`
   - Run `npm run api:check`
   - Use the result to identify which public APIs are missing, duplicated, or should be removed.
2. **Implement the code changes**
   - Extend `BaseService` in `src/services/`.
   - Add or update the corresponding tool in `src/tools/`.
   - Define the input schema with JSON Schema.
   - Preserve the request shape, parameter names, required fields, and types expected by the official docs.
   - Update `src/types/` when explicit request payload types are needed.
3. **Rebuild generated artifacts and audit contracts**
   - Run `npm run api:map`
   - Run `npm run api:audit`
   - Run `npm run api:check` again to confirm final coverage
4. **Validation**
   - Run `npm run typecheck`
   - Run `npm run build`
   - Review the final `git diff`

## 4. Workflow

### Setup
You can provide configuration in either of these ways:
1. Copy `.env.example` to `.env` and set `ATOMGIT_TOKEN`
2. Inject environment variables directly from the MCP client or shell

Useful variables:
- `ATOMGIT_TOKEN`
- `ATOMGIT_ENABLE_DANGEROUS_TOOLS`

### Build & Run
```bash
npm install
npm run dev
npm run build
npm run clean
```

### Verification
Primary checks:
- `npm run api:sync`
- `npm run api:check` (baseline gap check)
- `npm run api:map`
- `npm run api:audit`
- `npm run api:check` (final coverage confirmation)
- `npm run typecheck`
- `npm run build`

Notes:
- `api:check` uses canonical endpoint normalization and deduplication, so its total may be lower than the raw `docs/apis_url.json` count.
- `api:audit` checks tool schemas and service request signatures against the current AtomGit docs and should pass before merging API-surface changes.
- Safe mode changes runtime exposure, so the number returned by `tools/list` can be lower than the public tool definition count.

## 5. Reference
- [API to Tool Mapping](docs/api_tool_map.md): generated source of truth for public tool-to-doc mapping
- [Synced API Definitions](docs/apis_url.json): filtered official documentation inventory

## 6. Automation Workflow

### Commands

| Command | Description |
|---------|-------------|
| `npm run api:sync` | Sync official AtomGit documentation into `docs/apis_url.json` using the project's filtering and normalization rules. |
| `npm run api:check` | Compare implemented public tools against canonical synced APIs and report coverage. |
| `npm run api:map` | Generate `docs/api_tool_map.md` from implemented tools and synced docs. |
| `npm run api:audit` | Compare tool schemas and service request typing against the current AtomGit documentation contract. |
| `npm run api:scaffold -- "query"` | Generate boilerplate for a matched API and inject it into the relevant service and tool files. |

### Typical Workflow
1. Run `npm run api:sync`
2. Run `npm run api:check`
3. Implement or remove public tools to match the synced official API set
4. Run `npm run api:map`
5. Run `npm run api:audit`
6. Run `npm run api:check`
7. Run `npm run typecheck`
8. Run `npm run build`
9. Review the final `git diff`
