#!/usr/bin/env node
import { config } from 'dotenv';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { AtomGitService } from './services/AtomGitService.js';
import { UserTools } from './tools/UserTools.js';
import { RepositoryTools } from './tools/RepositoryTools.js';
import { RepositoryManagementTools } from './tools/RepositoryManagementTools.js';
// Load environment variables
config();
class AtomGitMCPServer {
    server;
    atomGitService;
    userTools;
    repositoryTools;
    repositoryManagementTools;
    constructor() {
        // Initialize AtomGit service with configuration
        const apiBaseUrl = process.env.ATOMGIT_API_BASE_URL || 'https://api.atomgit.com';
        const token = process.env.ATOMGIT_TOKEN;
        this.atomGitService = new AtomGitService({
            apiBaseUrl,
            token
        });
        this.userTools = new UserTools(this.atomGitService);
        this.repositoryTools = new RepositoryTools(this.atomGitService);
        this.repositoryManagementTools = new RepositoryManagementTools(this.atomGitService);
        this.server = new Server({
            name: 'atomgit-mcp',
            version: '1.0.0',
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.setupToolHandlers();
    }
    setupToolHandlers() {
        // List available tools
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            const userTools = this.userTools.getTools();
            const repositoryTools = this.repositoryTools.getTools();
            const repositoryManagementTools = this.repositoryManagementTools.getTools();
            return {
                tools: [...userTools, ...repositoryTools, ...repositoryManagementTools],
            };
        });
        // Handle tool calls
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            try {
                let result;
                const userToolNames = this.userTools.getTools().map(tool => tool.name);
                const repositoryToolNames = this.repositoryTools.getTools().map(tool => tool.name);
                const repositoryManagementToolNames = this.repositoryManagementTools.getTools().map(tool => tool.name);
                // Route to appropriate tool handler
                if (userToolNames.includes(name)) {
                    result = await this.userTools.callTool(name, args);
                }
                else if (repositoryToolNames.includes(name)) {
                    result = await this.repositoryTools.callTool(name, args);
                }
                else if (repositoryManagementToolNames.includes(name)) {
                    result = await this.repositoryManagementTools.callTool(name, args);
                }
                else {
                    throw new Error(`Unknown tool: ${name}`);
                }
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Error: ${errorMessage}`,
                        },
                    ],
                    isError: true,
                };
            }
        });
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('AtomGit MCP server running on stdio');
    }
}
// Start the server
const server = new AtomGitMCPServer();
server.run().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map