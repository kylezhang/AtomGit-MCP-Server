import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { AtomGitService } from '../services/AtomGitService.js';

export class CommitTools {
  constructor(private atomGitService: AtomGitService) {}

  getTools(): Tool[] {
    return [
      {
        name: 'get_repository_commits',
        description: 'Get all commits in a repository',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: 'The owner of the repository (username or organization)'
            },
            repo: {
              type: 'string',
              description: 'The name of the repository'
            },
            sha: {
              type: 'string',
              description: 'SHA or branch to start listing commits from (optional)'
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
        name: 'get_repository_commit',
        description: 'Get a specific commit in a repository',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: 'The owner of the repository (username or organization)'
            },
            repo: {
              type: 'string',
              description: 'The name of the repository'
            },
            sha: {
              type: 'string',
              description: 'The SHA of the commit'
            }
          },
          required: ['owner', 'repo', 'sha']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'get_repository_commits':
        return await this.atomGitService.getRepositoryCommits(
          args.owner, 
          args.repo, 
          args.sha, 
          args.page, 
          args.perPage
        );
      
      case 'get_repository_commit':
        return await this.atomGitService.getRepositoryCommit(args.owner, args.repo, args.sha);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}