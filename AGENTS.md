# AtomGit MCP Server - Developer Guide

**Generated:** 2026-03-07
**Status:** Active

## 1. Project Overview
AtomGit MCP Server is a Model Context Protocol (MCP) server implementation that provides AI assistants with access to the AtomGit code hosting platform. It exposes over 240+ tools covering the full range of AtomGit API capabilities.

**Key Technologies:**
- **Language:** TypeScript (ESM)
- **Protocol:** Model Context Protocol (MCP) SDK
- **Runtime:** Node.js >= 18

## 2. Core Architecture

### Directory Structure
```
AtomGit-MCP-Server/
├── src/
│   ├── core/           # Core infrastructure
│   │   └── ToolRegistry.ts  # Central tool registration (handles 'atomgit:' prefix)
│   ├── services/       # API Service Layer (HTTP Clients)
│   ├── tools/          # MCP Tool Layer (Schema Definitions)
│   ├── types/          # TypeScript Interfaces
│   └── index.ts        # Application Entry Point
├── scripts/            # Maintenance Scripts
│   ├── generate_map.ts # Documentation generator
│   └── update_apis.ts  # API JSON updater
├── docs/               # Documentation
│   └── api_tool_map.md # Detailed API vs Tool Mapping
├── dist/               # Compiled Output
└── package.json        # Project Configuration
```

### Data Flow
1.  **MCP Client** (e.g., Claude Desktop) sends a tool call request (e.g., `atomgit:get_repository_tree`).
2.  **ToolRegistry** routes the request to the appropriate `Tool` class.
3.  **Tool Layer** (`src/tools/*.ts`) validates parameters and calls the Service layer.
4.  **Service Layer** (`src/services/*.ts`) executes the HTTP request to AtomGit API (`/api/v5/...`).
5.  **AtomGit API** processes the request and returns data.

## 3. Development Standards

### Naming Conventions
- **Tools**: Must match the underlying API function.
  - *Internal Name*: `get_repository_tree`
  - *Public Name*: `atomgit:get_repository_tree` (Automatically prefixed by `ToolRegistry`)
  - *Description*: **MUST** be in Chinese in the generated documentation (`docs/api_tool_map.md`). The generator script extracts these from `docs/apis_url.json`.
- **Services**: CamelCase method names (e.g., `getRepositoryTree`).

### Documentation Standards
- **API Tool Map**: Keep `docs/api_tool_map.md` updated using `scripts/generate_map.ts`.
  - Tool Name: Link to source file in `src/tools/`.
  - Service Method: Link to source file in `src/services/`.
  - API Endpoint: **MUST** be a Markdown link to the official AtomGit documentation URL.
    - Source of URLs: `docs/apis_url.json`.
    - Use `scripts/update_apis.ts` to automatically update `docs/apis_url.json` from the official website.
    - Use `scripts/generate_map.ts` to automatically match endpoints and generate links.


### Adding a New Feature
1.  **Service Implementation**:
    - Extend `BaseService` in `src/services/`.
    - Implement the API call using `this.client.get/post`.
    - Add proper error handling.
2.  **Tool Implementation**:
    - Create/Update corresponding file in `src/tools/`.
    - Define `InputSchema` using JSON Schema.
    - Map the tool name to the service method in `callTool()`.

### Service Pattern Example
```typescript
// src/services/ExampleService.ts
export class ExampleService extends BaseService {
  async getData(id: string) {
    const response = await this.client.get(`/api/v5/data/${id}`);
    return response.data;
  }
}
```

### Tool Pattern Example
```typescript
// src/tools/ExampleTools.ts
export class ExampleTools {
  constructor(private service: ExampleService) {}

  getTools(): Tool[] {
    return [{
      name: "get_data", // Will become atomgit:get_data
      description: "Get data by ID",
      inputSchema: {
        type: "object",
        properties: {
          id: { type: "string" }
        },
        required: ["id"]
      }
    }];
  }
}
```

## 4. Workflow

### Setup
1.  Copy `.env.example` to `.env`.
2.  Configure your `ATOMGIT_TOKEN`.

### Build & Run
```bash
# Install dependencies
npm install

# Development mode (hot reload)
npm run dev

# Build for production
npm run build

# Clean build artifacts
npm run clean
```

### Verification
- **Unit Testing**: (Tests are currently being refactored)
- **Manual Verification**: Use `npm run dev` and connect via an MCP inspector or client.

## 5. Reference
- [API to Tool Mapping](docs/api_tool_map.md): Detailed list of available tools and their corresponding API endpoints.
