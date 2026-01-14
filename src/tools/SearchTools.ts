import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { AtomGitService } from '../services/AtomGitService.js';

export class SearchTools {
  constructor(private atomGitService: AtomGitService) {}

  getTools(): Tool[] {
    return [
      {
        name: 'search_users',
        description: '搜索用户',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: '搜索查询字符串'
            },
            page: {
              type: 'number',
              description: '页码，默认为1',
              default: 1
            },
            perPage: {
              type: 'number',
              description: '每页结果数，默认为30',
              default: 30
            }
          },
          required: ['query']
        }
      },
      {
        name: 'search_issues',
        description: '搜索 Issues',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: '搜索查询字符串'
            },
            page: {
              type: 'number',
              description: '页码，默认为1',
              default: 1
            },
            perPage: {
              type: 'number',
              description: '每页结果数，默认为30',
              default: 30
            }
          },
          required: ['query']
        }
      },
      {
        name: 'search_repositories',
        description: '搜索仓库',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: '搜索查询字符串'
            },
            page: {
              type: 'number',
              description: '页码，默认为1',
              default: 1
            },
            perPage: {
              type: 'number',
              description: '每页结果数，默认为30',
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
      case 'search_users':
        return await this.atomGitService.searchUsers(
          args.query,
          args.page,
          args.perPage
        );
      
      case 'search_issues':
        return await this.atomGitService.searchIssues(
          args.query,
          args.page,
          args.perPage
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