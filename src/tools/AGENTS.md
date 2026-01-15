# Tools Layer - MCP Protocol Interface

**Generated:** 2025-01-15
**Role:** Model Context Protocol tool definitions

## OVERVIEW
Tool layer converts AtomGit service methods into MCP-compliant tools with standardized schemas and routing.

## STRUCTURE
```
src/tools/
├── AIHubTools.ts           # AI Hub functionality
├── BranchTools.ts          # Branch management
├── CommitTools.ts          # Commit operations
├── DashboardTools.ts        # Dashboard data
├── EnterpriseTools.ts      # Enterprise features
├── IssuesTools.ts          # Issue tracking
├── LabelsTools.ts          # Label management
├── MemberTools.ts          # Member operations
├── MilestoneTools.ts       # Milestone tracking
├── OauthTools.ts          # OAuth authentication
├── OrganizationTools.ts    # Organization management
├── PullRequestTools.ts     # Pull Request operations
├── ReleaseTools.ts         # Release management
├── RepositoriesTools.ts    # Repository operations
├── SearchTools.ts          # Search functionality
├── TagTools.ts            # Tag management
├── UserTools.ts           # User operations
├── WebhooksTools.ts       # Webhook management
└── PullRequestTools.ts.backup  # Backup file (to be removed)
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Tool pattern | `BranchTools.ts` | Complete implementation example |
| Schema building | Any tool file | inputSchema with validation |
| Service mapping | Constructor injection | Tools receive corresponding service |
| Error handling | `callTool()` method | Unknown tool name routing |

## CONVENTIONS
### MCP Tool Implementation Pattern
```typescript
export class XyzTools {
  constructor(private xyzService: XyzService) {}
  
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
        return await this.xyzService.methodName(args);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}
```

### Required Elements
- **Constructor**: Injects corresponding service class
- **getTools()**: Returns array of Tool definitions
- **callTool()**: Routes tool names to service methods
- **Schema**: Every tool needs `description` and `inputSchema`
- **Parameter mapping**: Tool args MUST match service method signatures

## ANTI-PATTERNS
- **FORBIDDEN**: Tools that don't map to service methods
- **FORBIDDEN**: Missing `description` or `inputSchema`
- **FORBIDDEN**: Service parameter mismatches
- **FORBIDDEN**: Hardcoded tool names in switch cases
- **FORBIDDEN**: Backup files in repository (`*.backup`)