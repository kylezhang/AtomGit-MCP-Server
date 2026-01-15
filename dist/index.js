#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { config } from 'dotenv';
// Import all services
import { SearchService } from './services/SearchService.js';
import { OauthService } from './services/OauthService.js';
import { MilestoneService } from './services/MilestoneService.js';
import { MemberService } from './services/MemberService.js';
import { WebhooksService } from './services/WebhooksService.js';
import { BranchService } from './services/BranchService.js';
import { TagService } from './services/TagService.js';
import { DashboardService } from './services/DashboardService.js';
import { AIHubService } from './services/AIHubService.js';
import { ReleaseService } from './services/ReleaseService.js';
import { CommitService } from './services/CommitService.js';
import { LabelsService } from './services/LabelsService.js';
import { EnterpriseService } from './services/EnterpriseService.js';
import { OrganizationService } from './services/OrganizationService.js';
import { UserService } from './services/UserService.js';
import { IssuesService } from './services/IssuesService.js';
import { PullRequestService } from './services/PullRequestService.js';
import { RepositoriesService } from './services/RepositoriesService.js';
// Import 18 required category tools
import { RepositoriesTools } from './tools/RepositoriesTools.js';
import { BranchTools } from './tools/BranchTools.js';
import { IssuesTools } from './tools/IssuesTools.js';
import { SearchTools } from './tools/SearchTools.js';
import { PullRequestTools } from './tools/PullRequestTools.js';
import { CommitTools } from './tools/CommitTools.js';
import { TagTools } from './tools/TagTools.js';
import { LabelsTools } from './tools/LabelsTools.js';
import { MilestoneTools } from './tools/MilestoneTools.js';
import { UserTools } from './tools/UserTools.js';
import { OrganizationTools } from './tools/OrganizationTools.js';
import { WebhooksTools } from './tools/WebhooksTools.js';
import { MemberTools } from './tools/MemberTools.js';
import { ReleaseTools } from './tools/ReleaseTools.js';
import { EnterpriseTools } from './tools/EnterpriseTools.js';
import { DashboardTools } from './tools/DashboardTools.js';
import { OauthTools } from './tools/OauthTools.js';
import { AIHubTools } from './tools/AIHubTools.js';
import { ToolRegistry } from './core/ToolRegistry.js';
// Load environment variables
config();
const ATOMGIT_API_BASE_URL = process.env.ATOMGIT_API_BASE_URL || 'https://api.atomgit.com';
const ATOMGIT_TOKEN = process.env.ATOMGIT_TOKEN;
class AtomGitMCPServer {
    server;
    registry;
    constructor() {
        this.server = new Server({
            name: 'atomgit-mcp-server',
            version: '1.0.0',
        }, {
            capabilities: {
                tools: {},
            },
        });
        // Initialize registry
        this.registry = new ToolRegistry();
        const serviceConfig = {
            apiBaseUrl: ATOMGIT_API_BASE_URL,
            token: ATOMGIT_TOKEN,
        };
        // Register all tool classes to registry
        this.registry.registerTools(new RepositoriesTools(new RepositoriesService(serviceConfig)));
        this.registry.registerTools(new BranchTools(new BranchService(serviceConfig)));
        this.registry.registerTools(new IssuesTools(new IssuesService(serviceConfig)));
        this.registry.registerTools(new SearchTools(new SearchService(serviceConfig)));
        this.registry.registerTools(new PullRequestTools(new PullRequestService(serviceConfig)));
        this.registry.registerTools(new CommitTools(new CommitService(serviceConfig)));
        this.registry.registerTools(new TagTools(new TagService(serviceConfig)));
        this.registry.registerTools(new LabelsTools(new LabelsService(serviceConfig)));
        this.registry.registerTools(new MilestoneTools(new MilestoneService(serviceConfig)));
        this.registry.registerTools(new UserTools(new UserService(serviceConfig)));
        this.registry.registerTools(new OrganizationTools(new OrganizationService(serviceConfig)));
        this.registry.registerTools(new WebhooksTools(new WebhooksService(serviceConfig)));
        this.registry.registerTools(new MemberTools(new MemberService(serviceConfig)));
        this.registry.registerTools(new ReleaseTools(new ReleaseService(serviceConfig)));
        this.registry.registerTools(new EnterpriseTools(new EnterpriseService(serviceConfig)));
        this.registry.registerTools(new DashboardTools(new DashboardService(serviceConfig)));
        this.registry.registerTools(new OauthTools(new OauthService(serviceConfig)));
        this.registry.registerTools(new AIHubTools(new AIHubService(serviceConfig)));
        console.error(`✅ Registered ${this.registry.size} tools to registry`);
        this.setupHandlers();
    }
    setupHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: this.registry.getAllTools(),
            };
        });
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            try {
                const handler = this.registry.get(name);
                if (!handler) {
                    throw new Error(`Unknown tool: ${name}`);
                }
                return await handler.execute(args);
            }
            catch (error) {
                console.error(`Error in tool ${name}:`, error);
                throw error;
            }
        });
    }
    async start() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('AtomGit MCP Server running on stdio');
    }
}
new AtomGitMCPServer().start();
//# sourceMappingURL=index.js.map