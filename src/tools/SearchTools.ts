import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { SearchService } from '../services/SearchService.js';
import { autoPaginate } from '../core/PaginationHelper.js';

export class SearchTools {
  constructor(private searchService: SearchService) {}

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
            q: {
              type: 'string',
              description: '搜索查询字符串'
            },
            sort: {
              type: 'string',
              description: '排序字段'
            },
            order: {
              type: 'string',
              description: '排序方向'
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
            },
            autoPaginate: {
              type: 'boolean',
              description: '是否自动获取所有页（默认 false，设为 true 时自动获取全部数据）',
              default: false
            },
            maxPages: {
              oneOf: [{ type: 'string' }, { type: 'number' }],
              description: '自动分页时的最大页数限制（默认 100）',
              default: 100
            }
          },
          required: ['q']
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
            q: {
              type: 'string',
              description: '搜索查询字符串'
            },
            sort: {
              type: 'string',
              description: '排序字段'
            },
            order: {
              type: 'string',
              description: '排序方向'
            },
            repo: {
              type: 'string',
              description: '仓库范围'
            },
            state: {
              type: 'string',
              description: 'Issue 状态'
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
            },
            autoPaginate: {
              type: 'boolean',
              description: '是否自动获取所有页（默认 false，设为 true 时自动获取全部数据）',
              default: false
            },
            maxPages: {
              oneOf: [{ type: 'string' }, { type: 'number' }],
              description: '自动分页时的最大页数限制（默认 100）',
              default: 100
            }
          },
          required: ['q']
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
            q: {
              type: 'string',
              description: '搜索查询字符串'
            },
            sort: {
              type: 'string',
              description: '排序字段'
            },
            order: {
              type: 'string',
              description: '排序方向'
            },
            owner: {
              type: 'string',
              description: '仓库所有者'
            },
            fork: {
              type: 'string',
              description: 'Fork 过滤'
            },
            language: {
              type: 'string',
              description: '语言过滤'
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
            },
            autoPaginate: {
              type: 'boolean',
              description: '是否自动获取所有页（默认 false，设为 true 时自动获取全部数据）',
              default: false
            },
            maxPages: {
              oneOf: [{ type: 'string' }, { type: 'number' }],
              description: '自动分页时的最大页数限制（默认 100）',
              default: 100
            }
          },
          required: ['q']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'search_users':
        if (args.autoPaginate) {
          return autoPaginate(
            (page, perPage) => this.searchService.searchUsers({ q: args.q ?? args.query, sort: args.sort, order: args.order, page, perPage }),
            { page: args.page, perPage: args.perPage, autoPaginate: true, maxPages: args.maxPages }
          );
        }
        return await this.searchService.searchUsers({
          q: args.q ?? args.query,
          sort: args.sort,
          order: args.order,
          page: args.page,
          perPage: args.perPage
        });
      
      case 'search_issues':
        if (args.autoPaginate) {
          return autoPaginate(
            (page, perPage) => this.searchService.searchIssues({ q: args.q ?? args.query, sort: args.sort, order: args.order, repo: args.repo, state: args.state, page, perPage }),
            { page: args.page, perPage: args.perPage, autoPaginate: true, maxPages: args.maxPages }
          );
        }
        return await this.searchService.searchIssues({
          q: args.q ?? args.query,
          sort: args.sort,
          order: args.order,
          repo: args.repo,
          state: args.state,
          page: args.page,
          perPage: args.perPage
        });
      
      case 'search_repositories':
        if (args.autoPaginate) {
          return autoPaginate(
            (page, perPage) => this.searchService.searchRepositories({ q: args.q ?? args.query, sort: args.sort, order: args.order, owner: args.owner, fork: args.fork, language: args.language, page, perPage }),
            { page: args.page, perPage: args.perPage, autoPaginate: true, maxPages: args.maxPages }
          );
        }
        return await this.searchService.searchRepositories({
          q: args.q ?? args.query,
          sort: args.sort,
          order: args.order,
          owner: args.owner,
          fork: args.fork,
          language: args.language,
          page: args.page,
          perPage: args.perPage
        });
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}
