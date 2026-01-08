import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { AtomGitService } from '../services/AtomGitService.js';

export class EnterpriseTools {
  private atomGitService: AtomGitService;

  constructor(atomGitService: AtomGitService) {
    this.atomGitService = atomGitService;
  }

  getTools(): Tool[] {
    return [
      {
        name: 'get_enterprise',
        description: '获取企业信息',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise: {
              type: 'string',
              description: '企业名'
            }
          },
          required: ['enterprise']
        }
      },
      {
        name: 'get_enterprise_members',
        description: '获取企业成员列表',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise: {
              type: 'string',
              description: '企业名'
            }
          },
          required: ['enterprise']
        }
      },
      {
        name: 'get_enterprise_member',
        description: '获取特定企业成员信息',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise: {
              type: 'string',
              description: '企业名'
            },
            username: {
              type: 'string',
              description: '用户名'
            }
          },
          required: ['enterprise', 'username']
        }
      },
      {
        name: 'update_enterprise_member',
        description: '更新企业成员信息',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise: {
              type: 'string',
              description: '企业名'
            },
            username: {
              type: 'string',
              description: '用户名'
            },
            memberData: {
              type: 'object',
              description: '成员更新数据'
            }
          },
          required: ['enterprise', 'username', 'memberData']
        }
      },
      {
        name: 'remove_enterprise_member',
        description: '移除企业成员',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise: {
              type: 'string',
              description: '企业名'
            },
            username: {
              type: 'string',
              description: '要移除的用户名'
            }
          },
          required: ['enterprise', 'username']
        }
      },
      {
        name: 'get_enterprise_roles',
        description: '获取企业角色列表',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise: {
              type: 'string',
              description: '企业名'
            }
          },
          required: ['enterprise']
        }
      },
      {
        name: 'create_enterprise_role',
        description: '创建企业角色',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise: {
              type: 'string',
              description: '企业名'
            },
            roleData: {
              type: 'object',
              description: '角色数据（包含name、description、permissions等）'
            }
          },
          required: ['enterprise', 'roleData']
        }
      },
      {
        name: 'update_enterprise_role',
        description: '更新企业角色',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise: {
              type: 'string',
              description: '企业名'
            },
            role: {
              type: 'string',
              description: '角色名'
            },
            roleData: {
              type: 'object',
              description: '角色更新数据'
            }
          },
          required: ['enterprise', 'role', 'roleData']
        }
      },
      {
        name: 'delete_enterprise_role',
        description: '删除企业角色',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise: {
              type: 'string',
              description: '企业名'
            },
            role: {
              type: 'string',
              description: '角色名'
            }
          },
          required: ['enterprise', 'role']
        }
      },
      {
        name: 'get_enterprise_milestones',
        description: '获取企业里程碑列表',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise: {
              type: 'string',
              description: '企业名'
            }
          },
          required: ['enterprise']
        }
      },
      {
        name: 'create_enterprise_milestone',
        description: '创建企业里程碑',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise: {
              type: 'string',
              description: '企业名'
            },
            milestoneData: {
              type: 'object',
              description: '里程碑数据（包含title、description、due_on等）'
            }
          },
          required: ['enterprise', 'milestoneData']
        }
      },
      {
        name: 'update_enterprise_milestone',
        description: '更新企业里程碑',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise: {
              type: 'string',
              description: '企业名'
            },
            milestone: {
              type: 'string',
              description: '里程碑ID或标题'
            },
            milestoneData: {
              type: 'object',
              description: '里程碑更新数据'
            }
          },
          required: ['enterprise', 'milestone', 'milestoneData']
        }
      },
      {
        name: 'delete_enterprise_milestone',
        description: '删除企业里程碑',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise: {
              type: 'string',
              description: '企业名'
            },
            milestone: {
              type: 'string',
              description: '里程碑ID或标题'
            }
          },
          required: ['enterprise', 'milestone']
        }
      },
      {
        name: 'get_enterprise_projects',
        description: '获取企业项目列表',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise: {
              type: 'string',
              description: '企业名'
            }
          },
          required: ['enterprise']
        }
      },
      {
        name: 'create_enterprise_project',
        description: '创建企业项目',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise: {
              type: 'string',
              description: '企业名'
            },
            projectData: {
              type: 'object',
              description: '项目数据（包含name、description等）'
            }
          },
          required: ['enterprise', 'projectData']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'get_enterprise':
        return await this.atomGitService.getEnterprise(args.enterprise);
      
      case 'get_enterprise_members':
        return await this.atomGitService.getEnterpriseMembers(args.enterprise);
      
      case 'get_enterprise_member':
        return await this.atomGitService.getEnterpriseMember(args.enterprise, args.username);
      
      case 'update_enterprise_member':
        return await this.atomGitService.updateEnterpriseMember(args.enterprise, args.username, args.memberData);
      
      case 'remove_enterprise_member':
        return await this.atomGitService.removeEnterpriseMember(args.enterprise, args.username);
      
      case 'get_enterprise_roles':
        return await this.atomGitService.getEnterpriseRoles(args.enterprise);
      
      case 'create_enterprise_role':
        return await this.atomGitService.createEnterpriseRole(args.enterprise, args.roleData);
      
      case 'update_enterprise_role':
        return await this.atomGitService.updateEnterpriseRole(args.enterprise, args.role, args.roleData);
      
      case 'delete_enterprise_role':
        return await this.atomGitService.deleteEnterpriseRole(args.enterprise, args.role);
      
      case 'get_enterprise_milestones':
        return await this.atomGitService.getEnterpriseMilestones(args.enterprise);
      
      case 'create_enterprise_milestone':
        return await this.atomGitService.createEnterpriseMilestone(args.enterprise, args.milestoneData);
      
      case 'update_enterprise_milestone':
        return await this.atomGitService.updateEnterpriseMilestone(args.enterprise, args.milestone, args.milestoneData);
      
      case 'delete_enterprise_milestone':
        return await this.atomGitService.deleteEnterpriseMilestone(args.enterprise, args.milestone);
      
      case 'get_enterprise_projects':
        return await this.atomGitService.getEnterpriseProjects(args.enterprise);
      
      case 'create_enterprise_project':
        return await this.atomGitService.createEnterpriseProject(args.enterprise, args.projectData);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}