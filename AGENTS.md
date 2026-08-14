# AtomGit MCP Server — Developer Guide

**Status:** Maintained — single entry point covering architecture, coding standards, and the full change-to-release process.
Release mechanics (bump, tag) live in [RELEASE.md](./RELEASE.md).

## 1. Project Overview
AtomGit MCP Server is a Model Context Protocol (MCP) server implementation that provides AI assistants with access to the AtomGit code hosting platform.

Current public surface:
- **286 public tools**
- **18 tool categories**
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
  - Verb prefixes: `get_* / create_* / update_* / replace_*`. Do not introduce variants such as `list_*`.
  - Dangerous operations must use safety-controlled prefixes: `delete_ / remove_ / leave_ / archive_ / transfer_`. These are filtered by `ToolSafetyPolicy` unless dangerous tools are explicitly enabled.
  - Tool descriptions should stay compatible with bilingual map generation.
- **Services**
  - Use camelCase service method names such as `getRepositoryTree`.

### Pagination & Auto-Pagination (mandatory for list tools)
- List tools must plug into the pagination system: schema exposes `page` / `perPage` via `paginationProperties` (from `src/schemas/common.ts`, which includes `autoPaginateSchemaProperties`), and the `callTool` branch wires up `autoPaginate`.
- The `autoPaginate` fetcher **must return a plain array**. If the API responds with an envelope (`{total_count, xxx}` or `{data: [...]}`), unwrap it inside the fetcher (e.g. `data?.workflows ?? []`). Returning the envelope crashes with a TypeError as soon as `autoPaginate: true` is requested.
- Reuse existing building blocks before writing new ones. Shared schema fragments live in `src/schemas/common.ts` (`repoPathProperties`, `paginationProperties` — which already spreads `autoPaginateSchemaProperties` from `src/core/PaginationHelper.ts`, `stringOrNumberSchema`), plus `buildParams`, `BaseService`. List tools that need `page` / `perPage` should spread `paginationProperties` or `autoPaginateSchemaProperties` directly instead of re-declaring them inline.

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

## 4. Feature Development Workflow (Scenario A)

```
Requirement/bug → Issue (label at creation) → Preflight API testing → Implementation
              → Verification (build + E2E) → PR (gate checklist) → Review (no self-merge)
              → Merge → Release
```

### 4.1 Issue Registration
- Every change starts from an Issue.
  - Feature: goal, involved API endpoints, expected tool names.
  - Bug: symptoms, root-cause analysis, **live reproduction evidence** (raw curl or tool-call transcript).
- **Label the Issue at creation**: `bug` / `feature` / `documentation`. An unlabeled Issue means the workflow has not started.

### 4.2 Sync the Official Baseline
- Run `npm run api:sync`
- Run `npm run api:check`
- Use the result to identify which public APIs are missing, duplicated, or should be removed.

### 4.3 Preflight API Testing (mandatory for features)
Before writing any code, verify every new endpoint with curl. Never guess from documentation:
- Method and full path — mind singular/plural differences (CLA config is `PUT /cla`, not `/clas`).
- Parameter names and formats: array vs string, base64 or not, query vs body.
- **Response envelope shape**: bare array vs `{total_count, xxx}` vs `{data: [...]}`.
- Whether list endpoints support pagination parameters.
- API version prefix — Actions APIs live under `/api/v8`, most others under `/api/v5`.
- Archive the test scripts and conclusions as preflight evidence for the PR description.

### 4.4 Implementation
- Extend `BaseService` in `src/services/`.
- Add or update the corresponding tool in `src/tools/`; define the input schema with JSON Schema.
- Preserve the request shape, parameter names, required fields, and types expected by the official docs.
- Update `src/types/` when explicit request payload types are needed.
- Follow section 3: pagination system, naming conventions, building-block reuse.
- Register new tools in `src/index.ts` (service instantiation + `registerTools`).

### 4.5 Rebuild Generated Artifacts and Audit Contracts
- Run `npm run api:map`
- Run `npm run api:audit`
- Run `npm run api:check` again to confirm final coverage.

### 4.6 Verification
- Run `npm run typecheck`
- Run `npm run build`
- **E2E is mandatory**: call every new tool against the local build over real MCP stdio.
  - Public tool names carry the `atomgit_` prefix.
  - Cover both the happy path and error paths (invalid arguments, error passthrough).
  - Verify safe-mode tool counts (registered + skipped = total).
- Review the final `git diff`.

### 4.7 PR Gate Checklist (all items required before review)
- [ ] Linked Issue exists and carries a label
- [ ] PR title format: `feat/fix(scope): English description fixes #N`
- [ ] PR body contains: linked Issue, change summary, preflight/reproduction evidence, deviations from conventions (if any)
- [ ] **PR carries the label matching its Issue** (historically the most frequently missed item)
- [ ] Pagination and building-block reuse checked against section 3
- [ ] build + E2E passed
- [ ] Branch pushed to origin (AtomGit)

### 4.8 Review (Iron Rule)
- After submitting the PR, **wait for explicit maintainer approval before merging. Never self-merge.**
- After addressing review comments, wait for confirmation again.

### 4.9 Merge & Release
Execute per [RELEASE.md](./RELEASE.md):
1. Merge the PR; confirm/add the PR label.
2. Bump the version (commit `chore(release): X.Y.Z — summary (#N)`).
3. **Tag deduplication**: local `git tag -l` + remote `git ls-remote --tags` (v2.2.0 incident rule: tags are only created, never deleted).
4. Push main and tag to origin (AtomGit).
5. Create the AtomGit Release (changes grouped by category, with `(#N)` references).
6. Close the linked Issue with a minimal comment: "Fixed in vX.Y.Z (commit hash)".
7. **E2E acceptance**: verify the real version of the running process → call the changed tools against the published version → clean up test fixtures.

## 5. External PR Review Workflow (Scenario B)

```
PR received → Formal check (Issue/labels/description) → Code review → Local verification
            → Review comments → Contributor updates → Loop until pass → Gate checklist
            → Maintainer approves & merges → Release assessment → Release
```

### 5.1 Formal Check
- Is the PR linked to an Issue? If not, ask the contributor to create one, or create it on their behalf.
- Are Issue/PR labels complete? Add missing ones.
- Does the description include motivation, change summary, and test evidence? Request more if insufficient.

### 5.2 Code Review Focus
- **Naming conventions**: `get_* / create_* / update_* / replace_*`.
- **Schema completeness**: required fields, types, descriptions.
- **List tools**: plugged into the pagination system? Does the autoPaginate fetcher return an array (not an envelope)?
- **Reuse**: no reinvented wheels (PaginationHelper, shared schema building blocks, etc.).
- **Parameter mapping**: field-by-field cross-check against the official API docs; any doubt must be settled by live curl testing (historical lessons: label array format, missing URL segment in updateIssue, refs field name in create_tag — three bugs of the same family).
- **Safety**: dangerous operations behind safety prefixes; no injection risks.

### 5.3 Local Verification (mandatory — never review by diff alone)
- Check out the contributor's branch → `npm run build` → call the new/changed tools over real MCP stdio.
- Verify both happy path and error paths.

### 5.4 Review Comments and Loop
- Submit concrete comments on the PR: problem + suggested fix (cite line numbers).
- After the contributor updates, re-run 5.2–5.3 until pass.

### 5.5 Merge & Release
- Gate checklist (4.7) satisfied + maintainer approval → merge.
- Assess release timing: a single PR may ship alone, or several PRs may be batched into one release.
- Release execution follows 4.9.

## 6. Derived Scenarios

- **C. Hotfix**: same as Scenario A, with differences: branch `fix/xxx`, commit prefix `fix(scope):`, release as `patch`. Live reproduction evidence and E2E acceptance are never skippable (lesson: version drift once left the running server stuck on an old release — typecheck/build passing does not guarantee the published package is correct).
- **D. Release failure recovery**: never reuse version numbers, never delete tags — ship the next version. See RELEASE.md "Failure retry".
- **E. No-release changes**: repo-internal documentation or local development aids that do not ship in the npm package need no release. Criteria in RELEASE.md.

## 7. Historical Bug Patterns (check before coding)

| Pattern | Instance | Defense |
|---|---|---|
| Parameter name/format mismatch with API | label array format, missing URL segment in updateIssue, refs field name in create_tag | Preflight curl testing; never guess from docs |
| Envelope not unwrapped | get_repository_actions_runs autoPaginate crash (Issue #15) | Fetcher must return an array |
| Path singular/plural | CLA config is PUT /cla, not /clas | Test both paths live |
| Misleading error messages | validate endpoint body field is actually base64_content | Controlled-experiment verification |
| API version prefix | Actions APIs live under /api/v8, not /api/v5 | Trust the service's live-tested path |
| Version drift | server once stayed on 2.4.1 for a long time | Verify the running process version after release |
| Missing labels | Issue/PR created without labels | Enforced via the 4.7 gate checklist |

## 8. Iron Rules

1. Tags are only created, never deleted (v2.2.0 incident).
2. Never self-merge a PR — explicit review approval is required.
3. High-risk operations that mutate remote state (pushing tags, pushing RELEASE docs, force-style commands) require maintainer confirmation first.
4. Label Issues/PRs at creation; unlabeled means the workflow has not started.

## 9. Workflow

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

## 10. Automation Workflow

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

## 11. Reference
- [RELEASE.md](./RELEASE.md): release runbook — version bump, tag deduplication, acceptance, failure recovery
- [API to Tool Mapping](docs/api_tool_map.md): generated source of truth for public tool-to-doc mapping
- [Synced API Definitions](docs/apis_url.json): filtered official documentation inventory
