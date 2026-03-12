# AtomGit MCP Server - Developer Guide

**Generated:** 2026-03-12
**Status:** Stable / Complete

## 1. Project Overview
AtomGit MCP Server is a Model Context Protocol (MCP) server implementation that provides AI assistants with access to the AtomGit code hosting platform. It exposes **248 tools** covering the full range of AtomGit API capabilities (excluding OAuth).

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
│   ├── generate_map.ts # Documentation generator (Bilingual support)
│   ├── update_apis.ts  # API JSON updater
│   ├── analyze_coverage.ts # API coverage analyzer
│   └── scaffold_tool.ts    # Code generator (Direct file injection)
├── docs/               # Documentation
│   ├── api_tool_map.md # Detailed API vs Tool Mapping
│   └── apis_url.json   # Source of Truth for API Definitions
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
  - *Description*: **MUST** be in Chinese in the generated documentation (`docs/api_tool_map.md`). The generator script extracts these from `docs/apis_url.json` and combines them with English descriptions from the code.
- **Services**: CamelCase method names (e.g., `getRepositoryTree`).

### Documentation Standards
- **API Tool Map**: Keep `docs/api_tool_map.md` updated using `scripts/generate_map.ts`.
  - **Tool Name**: Link to source file in `src/tools/`.
  - **Description**: Bilingual (Chinese from official docs + English from code).
  - **API Endpoint**: **MUST** be a Markdown link to the official AtomGit documentation URL.
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

## 6. Automation Workflow

The project includes several scripts to streamline the development process.

### Commands

| Command | Description |
|---------|-------------|
| `npm run api:sync` | Fetches the latest API definitions from the official documentation and updates `docs/apis_url.json`. |
| `npm run api:map` | Generates the `docs/api_tool_map.md` documentation based on implemented tools, with bilingual descriptions and official API links. |
| `npm run api:check` | Analyzes code coverage and lists APIs that have not yet been implemented (compares code against `docs/apis_url.json`). |
| `npm run api:scaffold -- "query"` | Generates boilerplate code for a specific API and **injects it directly** into the corresponding Service and Tool files. |

### Typical Workflow

1.  **Sync Official APIs**:
    ```bash
    npm run api:sync
    ```
2.  **Check Missing APIs**:
    ```bash
    npm run api:check
    ```
3.  **Scaffold New Tool**:
    This command will automatically find the matching API, generate the code, and write it to the correct `src/services/` and `src/tools/` files.
    ```bash
    npm run api:scaffold -- "branches/:name"
    ```
4.  **Verify & Refine**:
    - Check the modified files using `git diff`.
    - Ensure parameter types and logic are correct.
5.  **Update Documentation**:
    ```bash
    npm run api:map
    ```
