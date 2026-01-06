import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { AtomGitService } from '../services/AtomGitService.js';

export class PullRequestTools {
  constructor(private atomGitService: AtomGitService) {}

  getTools(): Tool[] {
    return [
      {
        name: 'get_repository_pulls',
        description: 'Get all pull requests in a repository',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: 'The owner of the repository'
            },
            repo: {
              type: 'string',
              description: 'The name of the repository'
            },
            state: {
              type: 'string',
              description: 'State of pull requests to return (open, closed, all)',
              enum: ['open', 'closed', 'all'],
              default: 'open'
            },
            page: {
              type: 'number',
              description: 'Page number for pagination',
              default: 1
            },
            perPage: {
              type: 'number',
              description: 'Number of results per page',
              default: 30
            }
          },
          required: ['owner', 'repo']
        }
      },
      {
        name: 'get_repository_pull',
        description: 'Get a specific pull request in a repository',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: 'The owner of the repository'
            },
            repo: {
              type: 'string',
              description: 'The name of the repository'
            },
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
            }
          },
          required: ['owner', 'repo', 'pullNumber']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'get_repository_pulls':
        return await this.atomGitService.getRepositoryPulls(
          args.owner, 
          args.repo, 
          args.state, 
          args.page, 
          args.perPage
        );
      
      case 'get_repository_pull':
        return await this.atomGitService.getRepositoryPull(args.owner, args.repo, args.pullNumber);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}