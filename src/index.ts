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
import { LabelsMilestonesTools } from './tools/LabelsMilestonesTools.js';
import { CommitAdvancedTools } from './tools/CommitAdvancedTools.js';
import { MemberManagementTools } from './tools/MemberManagementTools.js';
import { SearchAdvancedTools } from './tools/SearchAdvancedTools.js';
import { UserAdvancedTools } from './tools/UserAdvancedTools.js';
import { ReleaseAdvancedTools } from './tools/ReleaseAdvancedTools.js';

// Load environment variables
config();

const ATOMGIT_API_BASE_URL = process.env.ATOMGIT_API_BASE_URL || 'https://api.atomgit.com';
const ATOMGIT_TOKEN = process.env.ATOMGIT_TOKEN;

class AtomGitMCPServer {
  private server: Server;
  private atomGitService: AtomGitService;
  private branchTools: BranchTools;
  private issuesTools: IssuesTools;
  private pullRequestTools: PullRequestTools;
  private userTools: UserTools;
  private repositoryTools: RepositoryTools;
  private repositoryContentTools: RepositoryContentTools;
  private repositoryManagementTools: RepositoryManagementTools;
  private commitTools: CommitTools;
  private tagTools: TagTools;
  private repositorySettingsTools: RepositorySettingsTools;
  private repositoryAdvancedTools: RepositoryAdvancedTools;
  private repositoryManagementAdvancedTools: RepositoryManagementAdvancedTools;
  private labelsMilestonesTools: LabelsMilestonesTools;
  private commitAdvancedTools: CommitAdvancedTools;
  private memberManagementTools: MemberManagementTools;
  private searchAdvancedTools: SearchAdvancedTools;
  private userAdvancedTools: UserAdvancedTools;
  private releaseAdvancedTools: ReleaseAdvancedTools;

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
    this.labelsMilestonesTools = new LabelsMilestonesTools(this.atomGitService);
    this.commitAdvancedTools = new CommitAdvancedTools(this.atomGitService);
    this.memberManagementTools = new MemberManagementTools(this.atomGitService);
    this.searchAdvancedTools = new SearchAdvancedTools(this.atomGitService);
    this.userAdvancedTools = new UserAdvancedTools(this.atomGitService);
    this.releaseAdvancedTools = new ReleaseAdvancedTools(this.atomGitService);

    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const allTools: Tool[] = [
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
        ...this.labelsMilestonesTools.getTools(),
        ...this.commitAdvancedTools.getTools(),
        ...this.memberManagementTools.getTools(),
        ...this.searchAdvancedTools.getTools(),
        ...this.userAdvancedTools.getTools(),
        ...this.releaseAdvancedTools.getTools(),
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
          this.labelsMilestonesTools,
          this.commitAdvancedTools,
          this.memberManagementTools,
          this.searchAdvancedTools,
          this.userAdvancedTools,
          this.releaseAdvancedTools,
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