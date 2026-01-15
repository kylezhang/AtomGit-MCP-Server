# AtomGit MCP Server - Project Knowledge Base

**Generated:** 2025-01-15
**Commit:** Working Directory
**Branch:** Main Development

## OVERVIEW
AtomGit MCP Server provides 240+ tools for interacting with AtomGit platform via Model Context Protocol. Built with TypeScript, strict configuration, and comprehensive testing requirements.

## STRUCTURE
```
AtomGit-MCP-Server/
├── src/
│   ├── services/    # 19 API service classes (AtomGit API wrappers)
│   ├── tools/       # 19 MCP tool classes (MCP protocol interface)
│   ├── types/       # TypeScript interfaces for AtomGit API
│   └── index.ts     # Main entry point (334 lines, manual routing)
├── dist/            # Compiled output (80+ files)
├── docs/            # Task documentation & API extraction data
└── AGENTS.md        # Developer guidelines (this file)
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| API endpoints | `docs/api_endpoints_extracted.json` | Complete 240-endpoint specification |
| Service patterns | `src/services/BaseService.ts` | Base class with dual auth headers |
| MCP tool patterns | `src/tools/BranchTools.ts` | Example tool implementation |
| Environment config | `.env.example` | Token and API base URL template |
| Build scripts | `package.json` | ESM module with custom scripts |

## CODE MAP
| Symbol | Type | Location | Role |
|--------|------|----------|------|
| `BaseService` | Class | `src/services/BaseService.ts` | Base API client with auth |
| `AtomGitService` | Class | `src/services/AtomGitService.ts` | Original service (to be refactored) |
| `index.ts` | Entry | `src/index.ts` | Main MCP server setup |

## CONVENTIONS
### TypeScript Configuration
- **ESM only**: `type: "module"` in package.json
- **Strict mode**: `exactOptionalPropertyTypes: true`, `noUncheckedIndexedAccess: true`
- **Imports**: Use `.js` extension for local imports (ESM requirement)
- **Compilation**: Source → `dist/` with type declarations

### Project-Specific Rules
- **API headers**: Dual authorization (`Bearer` + `PRIVATE-TOKEN`) + custom `X-Api-Version: 2023-02-21`
- **File organization**: Strict mapping by file type (see AGENTS.md for details)
- **Tool count**: Exactly 240 MCP tools required (no more, no less)
- **Service pattern**: One Service class per API category (18 total)

### Anti-Patterns (THIS PROJECT)
- **NEVER** modify `.env` file (use existing config)
- **NEVER** create files in root directory except core config
- **NEVER** copy `.env.example` to `.env`
- **FORBIDDEN**: Backup files in repository (`*.backup`, `*.bak`)
- **FORBIDDEN**: Free interpretation of API specifications

## UNIQUE STYLES
### Service Layer Pattern
```typescript
export class CategoryService extends BaseService {
  constructor(config: AtomGitConfig) {
    super(config);
  }
  
  async methodName(params: Type): Promise<ReturnType> {
    try {
      const response = await this.client.get('/endpoint', { params });
      return response.data;
    } catch (error) {
      console.error('Error message:', error);
      throw error;
    }
  }
}
```

### MCP Tool Pattern
```typescript
export class CategoryTools {
  constructor(private categoryService: CategoryService) {}
  
  getTools(): Tool[] {
    return [{
      name: 'tool_name',
      description: '...',
      inputSchema: {
        type: 'object',
        properties: { /* ... */ },
        required: ['param1', 'param2']
      }
    }];
  }
  
  async callTool(name: string, args: any): Promise<any> {
    switch(name) {
      case 'tool_name':
        return await this.categoryService.methodName(args);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}
```

## COMMANDS
```bash
npm run dev          # Development mode with tsx
npm run build        # Compile TypeScript to dist/
npm run typecheck    # Type checking without emit
npm run test:auth    # Authenticated tests (recommended)
npm run test:mcp     # MCP server functionality tests
npm run clean        # Remove dist/ directory
```

## NOTES
- **Critical issue**: File named "nul" in root (Windows device name) - needs immediate removal
- **Missing directories**: `tests/` and `scripts/` referenced in package.json but don't exist
- **API specification**: `docs/api_endpoints_extracted.json` contains complete 240-endpoint definition
- **Service-Tool mapping**: Must maintain exact 1:1 correspondence between API categories and Service/Tool files
- **Parameter consistency**: Tool call parameters MUST match Service method signatures exactly