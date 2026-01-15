# Services Layer - API Client Architecture

**Generated:** 2025-01-15
**Role:** AtomGit API service implementations

## OVERVIEW
Service layer provides typed API clients for all AtomGit platform endpoints, extending BaseService with dual authentication.

## STRUCTURE
```
src/services/
├── BaseService.ts           # Base class with Axios client and auth headers
├── AtomGitService.ts        # Legacy monolithic service (to be refactored)
├── AIHubService.ts          # AI Hub functionality
├── BranchService.ts         # Branch management
├── CommitService.ts         # Commit operations
├── DashboardService.ts       # Dashboard data
├── EnterpriseService.ts     # Enterprise features
├── IssuesService.ts         # Issue tracking
├── LabelsService.ts         # Label management
├── MemberService.ts         # Member operations
├── MilestoneService.ts      # Milestone tracking
├── OauthService.ts         # OAuth authentication
├── OrganizationService.ts   # Organization management
├── PullRequestService.ts    # Pull Request operations
├── ReleaseService.ts        # Release management
├── RepositoriesService.ts   # Repository operations
├── SearchService.ts         # Search functionality
├── TagService.ts           # Tag management
├── UserService.ts          # User operations
└── WebhooksService.ts      # Webhook management
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Base pattern | `BaseService.ts` | Dual auth, API version headers |
| Repository ops | `RepositoriesService.ts` | Core repository CRUD |
| PR workflows | `PullRequestService.ts` | Pull request lifecycle |
| Authentication | `OauthService.ts` | OAuth token handling |
| Search patterns | `SearchService.ts` | Query building logic |

## CONVENTIONS
### Service Implementation Pattern
```typescript
export class XyzService extends BaseService {
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

### Required Elements
- **Inheritance**: All services extend BaseService
- **Constructor**: Must accept `AtomGitConfig` and call `super(config)`
- **Error Handling**: All async methods wrapped in try/catch
- **Return Types**: Explicit TypeScript return types
- **Method Naming**: camelCase, descriptive action verbs

## ANTI-PATTERNS
- **FORBIDDEN**: Cross-service calls (each service handles one category only)
- **FORBIDDEN**: Hardcoded endpoints (use BaseService client methods)
- **FORBIDDEN**: Missing error handling in async methods
- **FORBIDDEN**: Returning `response` instead of `response.data`
- **FORBIDDEN**: Using `any` type for parameters or returns