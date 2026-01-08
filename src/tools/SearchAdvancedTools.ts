import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { AtomGitService } from '../services/AtomGitService.js';

export class SearchAdvancedTools {
  private atomGitService: AtomGitService;

  constructor(atomGitService: AtomGitService) {
    this.atomGitService = atomGitService;
  }

  getTools(): Tool[] {
    return [
      {
        name: 'search_issues',
        description: '搜索仓库中的Issues',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: '仓库所有者用户名或组织名'
            },
            repo: {
              type: 'string',
              description: '仓库名称'
            },
            query: {
              type: 'string',
              description: '搜索关键词'
            },
            page: {
              type: 'number',
              description: '页码',
              default: 1
            },
            perPage: {
              type: 'number',
              description: '每页数量',
              default: 30
            }
          },
          required: ['owner', 'repo', 'query']
        }
      },
      {
        name: 'search_code',
        description: '搜索仓库中的代码',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: '仓库所有者用户名或组织名'
            },
            repo: {
              type: 'string',
              description: '仓库名称'
            },
            query: {
              type: 'string',
              description: '搜索关键词'
            },
            page: {
              type: 'number',
              description: '页码',
              default: 1
            },
            perPage: {
              type: 'number',
              description: '每页数量',
              default: 30
            }
          },
          required: ['owner', 'repo', 'query']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'search_issues':
        return await this.atomGitService.searchIssues(
          args.owner, 
          args.repo, 
          args.query, 
          args.page, 
          args.perPage
        );
      
      case 'search_code':
        return await this.atomGitService.searchCode(
          args.owner, 
          args.repo, 
          args.query, 
          args.page, 
          args.perPage
        );
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}