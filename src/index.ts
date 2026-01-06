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