# AtomGit MCP Server - Agent Guidelines

## Development Commands

- `npm run build` - Build TypeScript to `dist/`
- `npm run typecheck` - Type check without emitting files
- `npm run dev` - Start in development mode
- `npm start` - Start production server
- `npm test` - Run basic API tests
- `npm run test:auth` - Run authenticated tests
- `npm run test:mcp` - Test MCP server functionality

## File Organization Guidelines

**IMPORTANT**: Keep the project root directory clean and organized. Follow these strict rules:

### Files That MUST Stay in Root Directory
- `src/` - Source code directory
- `dist/` - Compiled JavaScript output
- `package.json` - Project configuration
- `package-lock.json` - Dependency lock file
- `tsconfig.json` - TypeScript configuration
- `.env.example` - Environment variable template
- `.gitignore` - Git ignore rules
- `README.md` - Main project documentation
- `LICENSE` - Project license
- `setup.sh` - Setup script
- `AGENTS.md` - This file (agent guidelines)

### Files That MUST Go to Subdirectories

1. **Test Scripts** → `tests/` directory
   - All `test-*.mjs` files
   - Example: `tests/test-auth.mjs`, `tests/test-comprehensive.mjs`

2. **Debug Scripts** → `scripts/debug/` directory
   - All `debug-*.mjs` files
   - Example: `scripts/debug/debug-api.mjs`, `scripts/debug/debug-user-api.mjs`

3. **Documentation Files** → `docs/` directory
   - All `*_REPORT.md` files
   - All `*_SUMMARY.md` files
   - All `*_ACHIEVEMENT.md` files
   - Example: `docs/PROJECT_STATUS.md`, `docs/TEST_REPORT.md`

### Rule Enforcement
- **NEVER** create test scripts, debug scripts, or documentation reports in the root directory
- **ALWAYS** organize files according to their purpose using the subdirectories above
- If you need to create a new test, place it in `tests/`
- If you need to create a debug script, place it in `scripts/debug/`
- If you need to create documentation, place it in `docs/`
- This keeps the root directory clean and focused on core project files

## Code Style Guidelines

### Imports
- Use `.js` extension for all imports (TypeScript ES modules)
- Import from `@modelcontextprotocol/sdk/types.js` for MCP types
- Group imports: external libs, then internal modules

### TypeScript
- Use strict TypeScript config with no implicit any
- Prefer exact optional properties (`exactOptionalPropertyTypes: true`)
- All API calls must have proper type annotations
- Return specific types, not `any` or `unknown`

### Naming Conventions
- Classes: PascalCase (`AtomGitService`, `BranchTools`)
- Methods: camelCase (`getRepository`, `createRepositoryIssue`)
- Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)
- Files: PascalCase for classes (`AtomGitService.ts`)

### Error Handling
- All async methods must wrap API calls in try/catch
- Return meaningful error messages with context
- Use descriptive names for caught errors
- Log errors to stderr for debugging

### API Design
- All MCP tools must include description and inputSchema
- Required parameters must be specified in schema
- Include default values for optional parameters
- Use descriptive parameter descriptions

### Tool Implementation
- Each tool class handles a specific domain (branches, issues, etc.)
- Use `getTools(): Tool[]` and `callTool(name, args): Promise<any>` pattern
- Throw `Error(\`Unknown tool: \${name}\`)` for unknown tool names
- Pass args directly to service methods without unnecessary transformation

### Project Structure
- `src/services/` - API service layer
- `src/tools/` - MCP tool implementations
- `src/types/` - TypeScript type definitions
- All TypeScript files must have `.ts` extension

## README.md Editing Guidelines

**IMPORTANT**: The README.md structure has been manually optimized for human readers. Follow these strict rules:

### Sections That CAN Be Updated

- `## 🛠️ 已实现工具` - This section can be updated to add/remove tools
- `### 📂 仓库管理` - Repository tools table
- `### 👤 用户管理` - User tools table
- `### 🌿 分支管理` - Branch tools table
- `### 📝 提交管理` - Commit tools table
- `### 🏷️ 标签管理` - Tag tools table
- `### 🐛 问题管理` - Issues tools table
- `### 🔀 Pull Requests 管理` - PR tools table

### Sections That MUST NOT Be Changed

- Project introduction and description
- `## ✨ 主要特性`
- `## 在相关工具中配置使用`
- `## 🚀 快速开发开始` (except for fixing obvious errors)
- `## 📂 项目结构`
- `## 📄 许可证`
- `## 🤝 贡献`
- Overall structure and section ordering

### Rule Enforcement

- **ONLY** update `## 🛠️ 已实现工具` section and its subsections
- **NEVER** change the overall structure of README.md
- **NEVER** add or remove sections outside the tools section
- **NEVER** reorder existing sections
- The structure has been carefully optimized for user experience

## AtomGit MCP Server Implementation Plan

**IMPORTANT**: This implementation plan outlines the systematic approach to completing the remaining AtomGit API integrations. Follow this plan strictly to avoid duplication and ensure comprehensive coverage.

### Current Status Overview
- **Implemented Tools**: 20 out of 215 total API endpoints (9.3%)
- **Remaining Endpoints**: 195 (90.7%)
- **Implementation Strategy**: Prioritized by user impact and development workflow

### Priority Implementation Strategy

#### Priority 1: Core Repository Operations (95 endpoints)
**Goal**: Complete daily development workflow essentials

1. **Pull Requests Full Management** (41 endpoints)
   - Create, merge, comment, review, label management
   - PR file viewing, issue linking, reviewer assignment
   - **Impact**: Dramatically improves code collaboration experience

2. **Repository File Content Management** (8 endpoints)
   - File create, update, delete, upload operations
   - File listing, blob retrieval, raw file access
   - **Impact**: Supports complete file operation workflows

3. **Issues Full Management** (24 endpoints)
   - Issue comments, labels, reactions, operation logs
   - Issue updates, branch linking, modification history
   - **Impact**: Completes issue tracking management

4. **Branch Advanced Management** (7 endpoints)
   - Branch create, delete, protection rules
   - Individual branch retrieval, protection rule management
   - **Impact**: Enhances branch management security

#### Priority 2: Collaboration Enhancement (37 endpoints)
**Goal**: Improve team collaboration efficiency

1. **Labels & Milestones Full Management** (13 endpoints)
   - Label create, delete, protection
   - Milestone CRUD operations
   - **Impact**: Completes version release management

2. **Commit Advanced Management** (9 endpoints)
   - Commit comments, diff viewing, patch retrieval
   - Commit comparison, code statistics
   - **Impact**: Enhances code review capabilities

3. **Repository Member Permission Management** (6 endpoints)
   - Member add, remove, permission viewing
   - Permission level management
   - **Impact**: Completes team permission control

4. **Search Functionality Completion** (1 endpoint)
   - Issues search
   - **Impact**: Improves content discovery

#### Priority 3: Organization & Enterprise Features (41 endpoints)
**Goal**: Support large teams and enterprise needs

1. **Organization Management** (17 endpoints)
   - Organization info, member management, repository creation
   - **Impact**: Supports organization-level management

2. **Release Management** (8 endpoints)
   - Release create, update, asset management
   - **Impact**: Completes version release workflow

3. **Webhooks Management** (6 endpoints)
   - Webhook CRUD operations, testing
   - **Impact**: Supports automation integration

4. **Enterprise Management** (10 endpoints)
   - Enterprise members, roles, milestone management
   - **Impact**: Supports enterprise-level features

#### Priority 4: Advanced Features (22 endpoints)
**Goal**: Provide value-added functionality

1. **Dashboard (Kanban) Management** (7 endpoints)
   - Kanban creation, content management, status updates
   - **Impact**: Project visualization management

2. **AI Hub Features** (7 endpoints)
   - Text generation, speech recognition, object detection
   - **Impact**: AI-enhanced development experience

3. **User Advanced Features** (8 endpoints)
   - User settings, SSH key management, notification management
   - **Impact**: Personalized user experience

### Implementation Workflow

#### Standard Process for Each Priority Level:
1. **Development Phase**: Implement API service methods and MCP tools
2. **Testing Phase**:
   - Unit tests for new functionality
   - Integration tests with real API calls
   - Use `.env` environment variables for real data testing
3. **Documentation Update**: Update README.md tool listings
4. **Code Commit**: Commit and push to remote repository
5. **Verification**: Ensure all tests pass
6. **Next Phase**: Repeat process for next priority

#### Testing Requirements:
- ✅ All new features must have corresponding tests
- ✅ Use real environment variables for API testing
- ✅ Ensure backward compatibility
- ✅ Comprehensive error handling
- ✅ TypeScript type checking passes

### Expected Outcomes

After completing all four priority levels:
- **Implementation Rate**: From 9.3% to 100%
- **Tool Count**: From 20 to 100+ tools
- **Coverage**: Complete AtomGit platform functionality
- **User Experience**: One-stop AtomGit operations for developers

### Rule Enforcement
- **STRICTLY FOLLOW** this priority order - do not implement features out of sequence
- **NEVER** duplicate existing functionality
- **ALWAYS** complete one priority level before starting the next
- **MANDATORY** testing and README updates before committing
- **REQUIRED** real API testing with environment variables before release