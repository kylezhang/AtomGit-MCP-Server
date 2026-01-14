#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { config } from 'dotenv';
import { AtomGitService } from './services/AtomGitService.js';

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

// Load environment variables
config();

const ATOMGIT_API_BASE_URL = process.env.ATOMGIT_API_BASE_URL || 'https://api.atomgit.com';
const ATOMGIT_TOKEN = process.env.ATOMGIT_TOKEN;

class AtomGitMCPServer {
  private server: Server;
  private atomGitService: AtomGitService;

  // 18 category tool instances
  private repositoriesTools: RepositoriesTools;
  private branchTools: BranchTools;
  private issuesTools: IssuesTools;
  private searchTools: SearchTools;
  private pullRequestTools: PullRequestTools;
  private commitTools: CommitTools;
  private tagTools: TagTools;
  private labelsTools: LabelsTools;
  private milestoneTools: MilestoneTools;
  private userTools: UserTools;
  private organizationTools: OrganizationTools;
  private webhooksTools: WebhooksTools;
  private memberTools: MemberTools;
  private releaseTools: ReleaseTools;
  private enterpriseTools: EnterpriseTools;
  private dashboardTools: DashboardTools;
  private oauthTools: OauthTools;
  private aiHubTools: AIHubTools;

  constructor() {
    this.server = new Server(
      {
        name: 'atomgit-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    const config: any = {
      apiBaseUrl: ATOMGIT_API_BASE_URL,
    };
    
    if (ATOMGIT_TOKEN) {
      config.token = ATOMGIT_TOKEN;
    }

    this.atomGitService = new AtomGitService(config);

    // Initialize 18 tool categories
    this.repositoriesTools = new RepositoriesTools(this.atomGitService);
    this.branchTools = new BranchTools(this.atomGitService);
    this.issuesTools = new IssuesTools(this.atomGitService);
    this.searchTools = new SearchTools(this.atomGitService);
    this.pullRequestTools = new PullRequestTools(this.atomGitService);
    this.commitTools = new CommitTools(this.atomGitService);
    this.tagTools = new TagTools(this.atomGitService);
    this.labelsTools = new LabelsTools(this.atomGitService);
    this.milestoneTools = new MilestoneTools(this.atomGitService);
    this.userTools = new UserTools(this.atomGitService);
    this.organizationTools = new OrganizationTools(this.atomGitService);
    this.webhooksTools = new WebhooksTools(this.atomGitService);
    this.memberTools = new MemberTools(this.atomGitService);
    this.releaseTools = new ReleaseTools(this.atomGitService);
    this.enterpriseTools = new EnterpriseTools(this.atomGitService);
    this.dashboardTools = new DashboardTools(this.atomGitService);
    this.oauthTools = new OauthTools(this.atomGitService);
    this.aiHubTools = new AIHubTools(this.atomGitService);

    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const allTools: Tool[] = [
        // 18 categories: 240 total endpoints
        ...this.repositoriesTools.getTools(),
        ...this.branchTools.getTools(),
        ...this.issuesTools.getTools(),
        ...this.searchTools.getTools(),
        ...this.pullRequestTools.getTools(),
        ...this.commitTools.getTools(),
        ...this.tagTools.getTools(),
        ...this.labelsTools.getTools(),
        ...this.milestoneTools.getTools(),
        ...this.userTools.getTools(),
        ...this.organizationTools.getTools(),
        ...this.webhooksTools.getTools(),
        ...this.memberTools.getTools(),
        ...this.releaseTools.getTools(),
        ...this.enterpriseTools.getTools(),
        ...this.dashboardTools.getTools(),
        ...this.oauthTools.getTools(),
        ...this.aiHubTools.getTools(),
      ];
      
      return { tools: allTools };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        // Try to handle with each tool class
        const toolClasses = [
          this.repositoriesTools,
          this.branchTools,
          this.issuesTools,
          this.searchTools,
          this.pullRequestTools,
          this.commitTools,
          this.tagTools,
          this.labelsTools,
          this.milestoneTools,
          this.userTools,
          this.organizationTools,
          this.webhooksTools,
          this.memberTools,
          this.releaseTools,
          this.enterpriseTools,
          this.dashboardTools,
          this.oauthTools,
          this.aiHubTools,
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
          } catch (error) {
            if ((error as Error).message === `Unknown tool: ${name}`) {
              continue; // Try next tool class
            }
            throw error; // Re-throw other errors
          }
        }

        throw new Error(`Unknown tool: ${name}`);
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: (error as Error).message,
              }),
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run(): Promise<void> {
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