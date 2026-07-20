import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { MemberService } from '../services/MemberService.js';
import { autoPaginate } from '../core/PaginationHelper.js';

export class MemberTools {
  constructor(private memberService: MemberService) {}

  getTools(): Tool[] {
    return [
      {
        name: 'add_repository_collaborator',
        description: '添加项目成员或更新项目成员权限',
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
            username: {
              type: 'string',
              description: '用户名'
            },
            permission: {
              type: 'string',
              description: '权限级别（read, write, admin）'
            }
          },
          required: ['owner', 'repo', 'username']
        }
      },
      {
        name: 'remove_repository_collaborator',
        description: '移除项目成员',
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
            username: {
              type: 'string',
              description: '用户名'
            }
          },
          required: ['owner', 'repo', 'username']
        }
      },
      {
        name: 'get_repository_collaborators',
        description: '获取仓库的所有成员',
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
            page: {
              type: 'number',
              description: '页码'
            },
            perPage: {
              type: 'number',
              description: '每页数量'
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
          required: ['owner', 'repo']
        }
      },
      {
        name: 'check_repository_collaborator',
        description: '判断用户是否为仓库成员',
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
            username: {
              type: 'string',
              description: '用户名'
            }
          },
          required: ['owner', 'repo', 'username']
        }
      },
      {
        name: 'get_repository_collaborator_permission',
        description: '查看仓库成员的权限',
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
            username: {
              type: 'string',
              description: '用户名'
            }
          },
          required: ['owner', 'repo', 'username']
        }
      },
      {
        name: 'get_self_collaborator_permission',
        description: '查看当前成员仓库的权限点',
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
            }
          },
          required: ['owner', 'repo']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'add_repository_collaborator':
        return await this.memberService.addRepositoryCollaborator(args.owner, args.repo, args.username, {
          permission: args.permission
        });
      
      case 'remove_repository_collaborator':
        return await this.memberService.removeRepositoryCollaborator(args.owner, args.repo, args.username);
      
      case 'get_repository_collaborators':
        if (args.autoPaginate) {
          return autoPaginate(
            (page, perPage) => this.memberService.getRepositoryCollaborators(args.owner, args.repo, page, perPage),
            { page: args.page, perPage: args.perPage, autoPaginate: true, maxPages: args.maxPages }
          );
        }
        return await this.memberService.getRepositoryCollaborators(args.owner, args.repo, args.page, args.perPage);
      
      case 'check_repository_collaborator':
        return await this.memberService.isRepositoryCollaborator(args.owner, args.repo, args.username);
      
      case 'get_repository_collaborator_permission':
        return await this.memberService.getRepositoryCollaboratorPermission(args.owner, args.repo, args.username);
      
      case 'get_self_collaborator_permission':
        return await this.memberService.getRepositoryCollaboratorSelfPermission(args.owner, args.repo);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}
