import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { SearchService } from '../services/SearchService.js';
import { autoPaginate, autoPaginateSchemaProperties } from '../core/PaginationHelper.js';
import { looseArrayOutputSchema } from '../schemas/common.js';

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
            ...autoPaginateSchemaProperties,
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
            ...autoPaginateSchemaProperties,
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
            ...autoPaginateSchemaProperties,
          },
          required: ['q']
        },
        outputSchema: looseArrayOutputSchema('JSON array of repository objects (search results)'),
      },
      {
        name: 'search',
        description: '通用搜索 (按类型搜索 repo/user/group/pullrequest/issue)',
        inputSchema: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              description: '搜索类型',
              enum: ['repo', 'user', 'group', 'pullrequest', 'issue']
            },
            query: {
              type: 'string',
              description: '搜索查询字符串'
            },
            q: {
              type: 'string',
              description: '搜索查询字符串'
            },
            repo_type: {
              type: 'string',
              description: '仓库类型：0 代码仓、1 模型仓、2 数据集仓',
              enum: ['0', '1', '2']
            },
            task: {
              type: 'string',
              description: '任务过滤'
            },
            library: {
              type: 'string',
              description: '库过滤'
            },
            min: {
              type: 'string',
              description: '参数规模下限，如 1B'
            },
            max: {
              type: 'string',
              description: '参数规模上限，如 7B'
            },
            sort: {
              type: 'string',
              description: '排序字段，如 created_at、updated_at、star、fork，默认最佳匹配'
            },
            order: {
              type: 'string',
              description: '排序顺序',
              enum: ['asc', 'desc']
            },
            page: {
              type: 'number',
              description: '页码，默认为1',
              default: 1
            },
            perPage: {
              type: 'number',
              description: '每页结果数，默认为10',
              default: 10
            },
            ...autoPaginateSchemaProperties,
          },
          required: ['type']
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
      
      case 'search':
        if (args.autoPaginate) {
          return autoPaginate(
            async (page, perPage) => {
              const data = await this.searchService.search({ type: args.type, q: args.q ?? args.query, repo_type: args.repo_type, task: args.task, library: args.library, min: args.min, max: args.max, sort: args.sort, order: args.order, page, perPage });
              return data?.content ?? [];
            },
            // autoPaginate's global default is 30; keep this tool's advertised 10
            { page: args.page, perPage: args.perPage ?? 10, autoPaginate: true, maxPages: args.maxPages }
          );
        }
        return await this.searchService.search({
          type: args.type,
          q: args.q ?? args.query,
          repo_type: args.repo_type,
          task: args.task,
          library: args.library,
          min: args.min,
          max: args.max,
          sort: args.sort,
          order: args.order,
          page: args.page,
          perPage: args.perPage
        });
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}
