import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { MilestoneService } from '../services/MilestoneService.js';
import { autoPaginate, autoPaginateSchemaProperties } from '../core/PaginationHelper.js';

export class MilestoneTools {
  constructor(private milestoneService: MilestoneService) {}

  getTools(): Tool[] {
    return [
      {
        name: 'get_repository_milestones',
        description: '获取仓库所有里程碑',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: '仓库所有者'
            },
            repo: {
              type: 'string',
              description: '仓库名称'
            },
            state: {
              type: 'string',
              description: '状态（open, closed, all）',
              enum: ['open', 'closed', 'all'],
              default: 'open'
            },
            sort: {
              type: 'string',
              description: '排序字段'
            },
            direction: {
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
          required: ['owner', 'repo']
        }
      },
      {
        name: 'create_repository_milestone',
        description: '创建仓库里程碑',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: '仓库所有者'
            },
            repo: {
              type: 'string',
              description: '仓库名称'
            },
            title: {
              type: 'string',
              description: '里程碑标题'
            },
            description: {
              type: 'string',
              description: '里程碑描述'
            },
            state: {
              type: 'string',
              description: '状态（open, closed）',
              enum: ['open', 'closed'],
              default: 'open'
            },
            due_on: {
              type: 'string',
              description: '截止日期'
            }
          },
          required: ['owner', 'repo', 'title', 'due_on']
        }
      },
      {
        name: 'get_repository_milestone',
        description: '获取仓库单个里程碑',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: '仓库所有者'
            },
            repo: {
              type: 'string',
              description: '仓库名称'
            },
            number: {
              type: 'number',
              description: '里程碑编号'
            }
          },
          required: ['owner', 'repo', 'number']
        }
      },
      {
        name: 'delete_repository_milestone',
        description: '删除仓库单个里程碑',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: '仓库所有者'
            },
            repo: {
              type: 'string',
              description: '仓库名称'
            },
            number: {
              type: 'number',
              description: '里程碑编号'
            }
          },
          required: ['owner', 'repo', 'number']
        }
      },
      {
        name: 'update_repository_milestone',
        description: '更新仓库里程碑',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: '仓库所有者'
            },
            repo: {
              type: 'string',
              description: '仓库名称'
            },
            number: {
              type: 'number',
              description: '里程碑编号'
            },
            title: {
              type: 'string',
              description: '里程碑标题'
            },
            description: {
              type: 'string',
              description: '里程碑描述'
            },
            state: {
              type: 'string',
              description: '状态（open, closed）',
              enum: ['open', 'closed']
            },
            due_on: {
              type: 'string',
              description: '截止日期'
            }
          },
          required: ['owner', 'repo', 'number', 'title', 'due_on']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'get_repository_milestones':
        if (args.autoPaginate) {
          return autoPaginate(
            (page, perPage) => this.milestoneService.getRepositoryMilestones(args.owner, args.repo, args.state, page, perPage, args.sort, args.direction),
            { page: args.page, perPage: args.perPage, autoPaginate: true, maxPages: args.maxPages }
          );
        }
        return await this.milestoneService.getRepositoryMilestones(
          args.owner, 
          args.repo, 
          args.state,
          args.page,
          args.perPage,
          args.sort,
          args.direction
        );
      
      case 'create_repository_milestone':
        return await this.milestoneService.createRepositoryMilestone(args.owner, args.repo, {
          title: args.title,
          description: args.description,
          state: args.state,
          due_on: args.due_on
        });
      
      case 'get_repository_milestone':
        return await this.milestoneService.getRepositoryMilestone(args.owner, args.repo, args.number);
      
      case 'delete_repository_milestone':
        return await this.milestoneService.deleteRepositoryMilestone(args.owner, args.repo, args.number);
      
      case 'update_repository_milestone':
        return await this.milestoneService.updateRepositoryMilestone(args.owner, args.repo, args.number, {
          title: args.title,
          description: args.description,
          state: args.state,
          due_on: args.due_on
        });
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}
