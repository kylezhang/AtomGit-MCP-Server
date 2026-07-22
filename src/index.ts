#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
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
import { ResourceProvider } from './core/ResourceProvider.js';
import { PromptProvider } from './core/PromptProvider.js';

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
  private resourceProvider: ResourceProvider;
  private promptProvider: PromptProvider;

  constructor() {
    this.server = new Server(
      {
        name: 'atomgit-mcp-server',
        version: SERVER_VERSION,
      },
      {
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
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

    // Create service instances once for reuse
    const reposService = new RepositoriesService(serviceConfig);
    const branchService = new BranchService(serviceConfig);
    const issuesService = new IssuesService(serviceConfig);
    const searchService = new SearchService(serviceConfig);
    const pullRequestService = new PullRequestService(serviceConfig);
    const commitService = new CommitService(serviceConfig);
    const tagService = new TagService(serviceConfig);
    const labelsService = new LabelsService(serviceConfig);
    const milestoneService = new MilestoneService(serviceConfig);
    const userService = new UserService(serviceConfig);
    const organizationService = new OrganizationService(serviceConfig);
    const webhooksService = new WebhooksService(serviceConfig);
    const memberService = new MemberService(serviceConfig);
    const releaseService = new ReleaseService(serviceConfig);
    const enterpriseService = new EnterpriseService(serviceConfig);
    const dashboardService = new DashboardService(serviceConfig);
    const aiHubService = new AIHubService(serviceConfig);
    const actionsService = new ActionsService(serviceConfig);

    // Register all tool classes to registry
    this.registry.registerTools(new RepositoriesTools(reposService));
    this.registry.registerTools(new BranchTools(branchService));
    this.registry.registerTools(new IssuesTools(issuesService));
    this.registry.registerTools(new SearchTools(searchService));
    this.registry.registerTools(new PullRequestTools(pullRequestService));
    this.registry.registerTools(new CommitTools(commitService));
    this.registry.registerTools(new TagTools(tagService));
    this.registry.registerTools(new LabelsTools(labelsService));
    this.registry.registerTools(new MilestoneTools(milestoneService));
    this.registry.registerTools(new UserTools(userService));
    this.registry.registerTools(new OrganizationTools(organizationService));
    this.registry.registerTools(new WebhooksTools(webhooksService));
    this.registry.registerTools(new MemberTools(memberService));
    this.registry.registerTools(new ReleaseTools(releaseService));
    this.registry.registerTools(new EnterpriseTools(enterpriseService));
    this.registry.registerTools(new DashboardTools(dashboardService));
    this.registry.registerTools(new AIHubTools(aiHubService));
    this.registry.registerTools(new ActionsTools(actionsService));

    // Initialize resource and prompt providers (reuse existing service instances)
    this.resourceProvider = new ResourceProvider(
      reposService,
      issuesService,
      pullRequestService,
      commitService,
      userService
    );
    this.promptProvider = new PromptProvider();

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

    // Resource handlers
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: this.resourceProvider.listResources(),
      };
    });

    this.server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => {
      return {
        resourceTemplates: this.resourceProvider.listResourceTemplates(),
      };
    });

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      try {
        const content = await this.resourceProvider.readResource(request.params.uri);
        return {
          contents: [content],
        };
      } catch (error) {
        console.error('Error reading resource:', error);
        throw new Error(`Resource read error: ${error instanceof Error ? error.message : String(error)}`);
      }
    });

    // Prompt handlers
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      return {
        prompts: this.promptProvider.listPrompts(),
      };
    });

    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      try {
        const result = this.promptProvider.getPrompt(request.params.name, request.params.arguments ?? {});
        return {
          description: result.description,
          messages: result.messages,
        };
      } catch (error) {
        console.error('Error getting prompt:', error);
        throw new Error(`Prompt error: ${error instanceof Error ? error.message : String(error)}`);
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
