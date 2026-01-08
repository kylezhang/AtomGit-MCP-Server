import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { AtomGitService } from '../services/AtomGitService.js';

export class RepositoryManagementAdvancedTools {
  private atomGitService: AtomGitService;

  constructor(atomGitService: AtomGitService) {
    this.atomGitService = atomGitService;
  }

  getTools(): Tool[] {
    return [
      {
        name: 'update_repository_info',
        description: '更新仓库信息',
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
            updateData: {
              type: 'object',
              description: '要更新的仓库信息'
            }
          },
          required: ['owner', 'repo', 'updateData']
        }
      },
      {
        name: 'delete_repository',
        description: '删除仓库',
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
            }
          },
          required: ['owner', 'repo']
        }
      },
      {
        name: 'fork_repository',
        description: 'Fork仓库',
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
            forkData: {
              type: 'object',
              description: 'Fork配置信息（可选）'
            }
          },
          required: ['owner', 'repo']
        }
      },
      {
        name: 'archive_repository',
        description: '归档仓库',
        inputSchema: {
          type: 'object',
          properties: {
            org: {
              type: 'string',
              description: '组织名'
            },
            repo: {
              type: 'string',
              description: '仓库名称'
            },
            archiveData: {
              type: 'object',
              description: '归档配置'
            }
          },
          required: ['org', 'repo', 'archiveData']
        }
      },
      {
        name: 'transfer_repository',
        description: '转移仓库',
        inputSchema: {
          type: 'object',
          properties: {
            org: {
              type: 'string',
              description: '组织名'
            },
            repo: {
              type: 'string',
              description: '仓库名称'
            },
            transferData: {
              type: 'object',
              description: '转移配置'
            }
          },
          required: ['org', 'repo', 'transferData']
        }
      },
      {
        name: 'update_repository_module_setting',
        description: '更新仓库模块设置',
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
            moduleData: {
              type: 'object',
              description: '模块设置信息'
            }
          },
          required: ['owner', 'repo', 'moduleData']
        }
      },
      {
        name: 'update_repository_reviewer',
        description: '更新仓库代码审查设置',
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
            reviewerData: {
              type: 'object',
              description: '代码审查设置'
            }
          },
          required: ['owner', 'repo', 'reviewerData']
        }
      },
      {
        name: 'get_repository_transition',
        description: '获取仓库权限模式',
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
            }
          },
          required: ['owner', 'repo']
        }
      },
      {
        name: 'update_repository_transition',
        description: '更新仓库权限模式',
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
            transitionData: {
              type: 'object',
              description: '权限模式配置'
            }
          },
          required: ['owner', 'repo', 'transitionData']
        }
      },
      {
        name: 'get_repository_customized_roles',
        description: '获取仓库自定义角色',
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
            }
          },
          required: ['owner', 'repo']
        }
      },
      {
        name: 'update_repository_member_role',
        description: '更新仓库成员角色',
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
            username: {
              type: 'string',
              description: '用户名'
            },
            roleData: {
              type: 'object',
              description: '角色配置'
            }
          },
          required: ['owner', 'repo', 'username', 'roleData']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'update_repository_info':
        return await this.atomGitService.updateRepository(args.owner, args.repo, args.updateData);
      
      case 'delete_repository':
        return await this.atomGitService.deleteRepository(args.owner, args.repo);
      
      case 'fork_repository':
        return await this.atomGitService.forkRepository(args.owner, args.repo, args.forkData);
      
      case 'archive_repository':
        return await this.atomGitService.archiveRepository(args.org, args.repo, args.archiveData);
      
      case 'transfer_repository':
        return await this.atomGitService.transferRepository(args.org, args.repo, args.transferData);
      
      case 'update_repository_module_setting':
        return await this.atomGitService.updateRepositoryModuleSetting(args.owner, args.repo, args.moduleData);
      
      case 'update_repository_reviewer':
        return await this.atomGitService.updateRepositoryReviewer(args.owner, args.repo, args.reviewerData);
      
      case 'get_repository_transition':
        return await this.atomGitService.getRepositoryTransition(args.owner, args.repo);
      
      case 'update_repository_transition':
        return await this.atomGitService.updateRepositoryTransition(args.owner, args.repo, args.transitionData);
      
      case 'get_repository_customized_roles':
        return await this.atomGitService.getRepositoryCustomizedRoles(args.owner, args.repo);
      
      case 'update_repository_member_role':
        return await this.atomGitService.updateRepositoryMemberRole(args.owner, args.repo, args.username, args.roleData);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}