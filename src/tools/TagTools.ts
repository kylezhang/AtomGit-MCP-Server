import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { AtomGitService } from '../services/AtomGitService.js';

export class TagTools {
  constructor(private atomGitService: AtomGitService) {}

  getTools(): Tool[] {
    return [
      {
        name: 'get_repository_tags',
        description: 'Get all tags in a repository',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: 'The owner of repository (username or organization)'
            },
            repo: {
              type: 'string',
              description: 'The name of the repository'
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
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'get_repository_tags':
        return await this.atomGitService.getRepositoryTags(
          args.owner, 
          args.repo, 
          args.page, 
          args.perPage
        );
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}