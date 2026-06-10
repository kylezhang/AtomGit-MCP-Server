#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { config } from 'dotenv';
import { AxiosError } from 'axios';

// Import all services
import { SearchService } from './services/SearchService.js';
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
import { ActionsService } from './services/ActionsService.js';

// Import all category tools
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
import { AIHubTools } from './tools/AIHubTools.js';
import { ActionsTools } from './tools/ActionsTools.js';
import { ToolRegistry } from './core/ToolRegistry.js';
import { ToolSafetyPolicy } from './core/ToolSafetyPolicy.js';

// Load environment variables
config();

const API_BASE_URL = 'https://api.atomgit.com';
const ATOMGIT_TOKEN = process.env.ATOMGIT_TOKEN;
const ATOMGIT_ENABLE_DANGEROUS_TOOLS = parseBooleanEnv(process.env.ATOMGIT_ENABLE_DANGEROUS_TOOLS);
const SERVER_VERSION = getServerVersion();

if (!ATOMGIT_TOKEN) {
  console.error('Warning: ATOMGIT_TOKEN environment variable is not set. Many API calls will fail.');
}

function parseBooleanEnv(value: string | undefined): boolean {
  if (!value) {
    return false;
  }

  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}

function getServerVersion(): string {
  try {
    const packageJsonUrl = new URL('../package.json', import.meta.url);
    const packageJson = JSON.parse(readFileSync(packageJsonUrl, 'utf8')) as { version?: string };
    return packageJson.version ?? '1.0.0';
  } catch {
    return '1.0.0';
  }
}

class AtomGitMCPServer {
  private server: Server;
  private registry: ToolRegistry;
  private safetyPolicy: ToolSafetyPolicy;

  constructor() {
    this.server = new Server(
      {
        name: 'atomgit-mcp-server',
        version: SERVER_VERSION,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize registry
    this.safetyPolicy = new ToolSafetyPolicy({
      allowDangerousTools: ATOMGIT_ENABLE_DANGEROUS_TOOLS,
    });
    this.registry = new ToolRegistry(this.safetyPolicy);

    const serviceConfig: any = {
      apiBaseUrl: API_BASE_URL,
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
    this.registry.registerTools(new AIHubTools(new AIHubService(serviceConfig)));
    this.registry.registerTools(new ActionsTools(new ActionsService(serviceConfig)));

    console.error(
      `✅ Safe mode: ${ATOMGIT_ENABLE_DANGEROUS_TOOLS ? 'disabled' : 'enabled'}, ${this.registry.size} tools registered, ${this.registry.blockedSize} dangerous tools skipped`
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: this.registry.getAllTools(),
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        if (this.registry.isBlocked(name)) {
          throw new Error(this.safetyPolicy.getBlockedToolMessage(name));
        }

        const handler = this.registry.get(name);
        if (!handler) {
          throw new Error(`Unknown tool: ${name}`);
        }
        const result = await handler.execute(args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2) ?? 'null',
            },
          ],
        };
      } catch (error) {
        console.error(`Error in tool ${name}:`, error);
        
        if (error instanceof AxiosError) {
          return {
            isError: true,
            content: [
              {
                type: 'text',
                text: `AtomGit API Error: ${error.response?.status} ${error.response?.statusText}\n${JSON.stringify(error.response?.data || error.message, null, 2)}`
              }
            ]
          };
        }

        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Tool Execution Error: ${error instanceof Error ? error.message : String(error)}`
            }
          ]
        };
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
