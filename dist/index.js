#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { config } from 'dotenv';
import { AtomGitService } from './services/AtomGitService.js';
import { BranchTools } from './tools/BranchTools.js';
import { IssuesTools } from './tools/IssuesTools.js';
import { PullRequestTools } from './tools/PullRequestTools.js';
import { UserTools } from './tools/UserTools.js';
import { RepositoryTools } from './tools/RepositoryTools.js';
import { RepositoryContentTools } from './tools/RepositoryContentTools.js';
import { RepositoryManagementTools } from './tools/RepositoryManagementTools.js';
import { CommitTools } from './tools/CommitTools.js';
import { TagTools } from './tools/TagTools.js';
import { RepositorySettingsTools } from './tools/RepositorySettingsTools.js';
import { RepositoryAdvancedTools } from './tools/RepositoryAdvancedTools.js';
import { RepositoryManagementAdvancedTools } from './tools/RepositoryManagementAdvancedTools.js';
// Load environment variables
config();
const ATOMGIT_API_BASE_URL = process.env.ATOMGIT_API_BASE_URL || 'https://api.atomgit.com';
const ATOMGIT_TOKEN = process.env.ATOMGIT_TOKEN;
class AtomGitMCPServer {
    server;
    atomGitService;
    branchTools;
    issuesTools;
    pullRequestTools;
    userTools;
    repositoryTools;
    repositoryContentTools;
    repositoryManagementTools;
    commitTools;
    tagTools;
    repositorySettingsTools;
    repositoryAdvancedTools;
    repositoryManagementAdvancedTools;
    constructor() {
        this.server = new Server({
            name: 'atomgit-mcp-server',
            version: '1.0.0',
        }, {
            capabilities: {
                tools: {},
            },
        });
        const config = {
            apiBaseUrl: ATOMGIT_API_BASE_URL,
        };
        if (ATOMGIT_TOKEN) {
            config.token = ATOMGIT_TOKEN;
        }
        this.atomGitService = new AtomGitService(config);
        this.branchTools = new BranchTools(this.atomGitService);
        this.issuesTools = new IssuesTools(this.atomGitService);
        this.pullRequestTools = new PullRequestTools(this.atomGitService);
        this.userTools = new UserTools(this.atomGitService);
        this.repositoryTools = new RepositoryTools(this.atomGitService);
        this.repositoryContentTools = new RepositoryContentTools(this.atomGitService);
        this.repositoryManagementTools = new RepositoryManagementTools(this.atomGitService);
        this.commitTools = new CommitTools(this.atomGitService);
        this.tagTools = new TagTools(this.atomGitService);
        this.repositorySettingsTools = new RepositorySettingsTools(this.atomGitService);
        this.repositoryAdvancedTools = new RepositoryAdvancedTools(this.atomGitService);
        this.repositoryManagementAdvancedTools = new RepositoryManagementAdvancedTools(this.atomGitService);
        this.setupHandlers();
    }
    setupHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            const allTools = [
                ...this.branchTools.getTools(),
                ...this.issuesTools.getTools(),
                ...this.pullRequestTools.getTools(),
                ...this.userTools.getTools(),
                ...this.repositoryTools.getTools(),
                ...this.repositoryContentTools.getTools(),
                ...this.repositoryManagementTools.getTools(),
                ...this.commitTools.getTools(),
                ...this.tagTools.getTools(),
                ...this.repositorySettingsTools.getTools(),
                ...this.repositoryAdvancedTools.getTools(),
                ...this.repositoryManagementAdvancedTools.getTools(),
            ];
            return { tools: allTools };
        });
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            try {
                // Try to handle with each tool class
                const toolClasses = [
                    this.branchTools,
                    this.issuesTools,
                    this.pullRequestTools,
                    this.userTools,
                    this.repositoryTools,
                    this.repositoryContentTools,
                    this.repositoryManagementTools,
                    this.commitTools,
                    this.tagTools,
                    this.repositorySettingsTools,
                    this.repositoryAdvancedTools,
                    this.repositoryManagementAdvancedTools,
                ];
                for (const toolClass of toolClasses) {
                    try {
                        const result = await toolClass.callTool(name, args);
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
                        if (error.message === `Unknown tool: ${name}`) {
                            continue; // Try next tool class
                        }
                        throw error; // Re-throw other errors
                    }
                }
                throw new Error(`Unknown tool: ${name}`);
            }
            catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                error: error.message,
                            }),
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
const server = new AtomGitMCPServer();
server.run().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map