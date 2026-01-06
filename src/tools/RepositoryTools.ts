import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { AtomGitService } from '../services/AtomGitService.js';

export class RepositoryTools {
  constructor(private atomGitService: AtomGitService) {}

  getTools(): Tool[] {
    return [
      {
        name: 'get_repository',
        description: 'Get information about a specific repository',
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
      },
      {
        name: 'get_repository_tree',
        description: 'Get the directory tree of a repository',
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
              description: 'The SHA of the commit to get the tree for (optional, defaults to main branch)'
            }
          },
          required: ['owner', 'repo']
        }
      },
      {
        name: 'search_repositories',
        description: 'Search for repositories by query',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query'
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
          required: ['query']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'get_repository':
        return await this.atomGitService.getRepository(args.owner, args.repo);
      
      case 'get_repository_tree':
        return await this.atomGitService.getRepositoryTree(
          args.owner, 
          args.repo, 
          args.sha
        );
      
      case 'search_repositories':
        return await this.atomGitService.searchRepositories(
          args.query, 
          args.page, 
          args.perPage
        );
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}