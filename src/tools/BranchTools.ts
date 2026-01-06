import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { AtomGitService } from '../services/AtomGitService.js';

export class BranchTools {
  constructor(private atomGitService: AtomGitService) {}

  getTools(): Tool[] {
    return [
      {
        name: 'get_repository_branches',
        description: 'Get all branches in a repository',
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
            }
          },
          required: ['owner', 'repo']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'get_repository_branches':
        return await this.atomGitService.getRepositoryBranches(args.owner, args.repo);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}