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