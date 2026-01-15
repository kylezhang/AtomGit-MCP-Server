import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { OrganizationService } from '../services/OrganizationService.js';

export class OrganizationTools {
  private organizationService: OrganizationService;

  constructor(organizationService: OrganizationService) {
    this.organizationService = organizationService;
  }

  getTools(): Tool[] {
    return [

      {
        name: 'get_organization',
        description: '获取一个组织信息',
        inputSchema: {
          type: 'object',
          properties: {
            org: {
              type: 'string',
              description: '组织名'
            }
          },
          required: ['org']
        }
      },
      {
        name: 'create_organization_repository',
        description: '为组织创建仓库',
        inputSchema: {
          type: 'object',
          properties: {
            org: {
              type: 'string',
              description: '组织名'
            },
            repoData: {
              type: 'object',
              description: '仓库创建数据（包含name、description、private等）'
            }
          },
          required: ['org', 'repoData']
        }
      },
      {
        name: 'get_organization_repositories',
        description: '获取组织项目列表',
        inputSchema: {
          type: 'object',
          properties: {
            org: {
              type: 'string',
              description: '组织名'
            },
            page: {
              type: 'number',
              description: '页码 (可选)'
            },
            perPage: {
              type: 'number',
              description: '每页数量 (可选)'
            }
          },
          required: ['org']
        }
      },
      {
        name: 'get_user_organizations',
        description: '列出用户所属的组织',
        inputSchema: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: '用户名'
            },
            page: {
              type: 'number',
              description: '页码 (可选)'
            },
            perPage: {
              type: 'number',
              description: '每页数量 (可选)'
            }
          },
          required: ['username']
        }
      },
      {
        name: 'get_current_user_organizations',
        description: '列出授权用户所属的组织',
        inputSchema: {
          type: 'object',
          properties: {
            page: {
              type: 'number',
              description: '页码 (可选)'
            },
            perPage: {
              type: 'number',
              description: '每页数量 (可选)'
            }
          },
          required: []
        }
      },
      {
        name: 'get_organization_member',
        description: '获取组织成员详情',
        inputSchema: {
          type: 'object',
          properties: {
            org: {
              type: 'string',
              description: '组织名'
            },
            username: {
              type: 'string',
              description: '用户名'
            }
          },
          required: ['org', 'username']
        }
      },
      {
        name: 'update_organization',
        description: '更新授权用户所管理的组织资料',
        inputSchema: {
          type: 'object',
          properties: {
            org: {
              type: 'string',
              description: '组织名'
            },
            updateData: {
              type: 'object',
              description: '组织更新数据'
            }
          },
          required: ['org', 'updateData']
        }
      },
      {
        name: 'get_enterprise_member',
        description: '获取企业的一个成员',
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
        description: '修改企业成员权限',
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
        name: 'get_current_user_organization_membership',
        description: '获取授权用户在一个组织的成员资料',
        inputSchema: {
          type: 'object',
          properties: {
            org: {
              type: 'string',
              description: '组织名'
            }
          },
          required: ['org']
        }
      },
      {
        name: 'leave_organization',
        description: '退出一个组织',
        inputSchema: {
          type: 'object',
          properties: {
            org: {
              type: 'string',
              description: '组织名'
            }
          },
          required: ['org']
        }
      },
      {
        name: 'get_organization_members',
        description: '列出一个组织的所有成员',
        inputSchema: {
          type: 'object',
          properties: {
            org: {
              type: 'string',
              description: '组织名'
            },
            page: {
              type: 'number',
              description: '页码 (可选)'
            },
            perPage: {
              type: 'number',
              description: '每页数量 (可选)'
            }
          },
          required: ['org']
        }
      },
      {
        name: 'get_enterprise_members',
        description: '列出企业的所有成员',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise: {
              type: 'string',
              description: '企业名'
            },
            page: {
              type: 'number',
              description: '页码 (可选)'
            },
            perPage: {
              type: 'number',
              description: '每页数量 (可选)'
            }
          },
          required: ['enterprise']
        }
      },
      {
        name: 'remove_organization_member',
        description: '移除授权用户所管理组织中的成员',
        inputSchema: {
          type: 'object',
          properties: {
            org: {
              type: 'string',
              description: '组织名'
            },
            username: {
              type: 'string',
              description: '要移除的用户名'
            }
          },
          required: ['org', 'username']
        }
      },
      {
        name: 'invite_organization_member',
        description: '邀请组织成员',
        inputSchema: {
          type: 'object',
          properties: {
            org: {
              type: 'string',
              description: '组织名'
            },
            username: {
              type: 'string',
              description: '要邀请的用户名'
            },
            memberData: {
              type: 'object',
              description: '成员数据和权限'
            }
          },
          required: ['org', 'username', 'memberData']
        }
      },
      {
        name: 'get_organization_followers',
        description: '列出指定组织的所有关注者',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: '组织名'
            },
            page: {
              type: 'number',
              description: '页码 (可选)'
            },
            perPage: {
              type: 'number',
              description: '每页数量 (可选)'
            }
          },
          required: ['owner']
        }
      },
      {
        name: 'get_organization_issue_extend_settings',
        description: '获取 issue 扩展配置',
        inputSchema: {
          type: 'object',
          properties: {
            org: {
              type: 'string',
              description: '组织名'
            }
          },
          required: ['org']
        }
      },
      {
        name: 'get_organization_customized_roles',
        description: '获取组织自定义角色',
        inputSchema: {
          type: 'object',
          properties: {
            org: {
              type: 'string',
              description: '组织名'
            }
          },
          required: ['org']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'get_organization':
        return await this.organizationService.getOrganization(args.org);
 
      case 'create_organization_repository':
        return await this.organizationService.createOrganizationRepository(args.org, args.repoData);
       
      case 'get_organization_repositories':
        return await this.organizationService.getOrganizationRepositories(args.org, args.page, args.perPage);
       
      case 'get_user_organizations':
        return await this.organizationService.getUserOrganizations(args.username, args.page, args.perPage);
       
      case 'get_current_user_organizations':
        return await this.organizationService.getCurrentUserOrganizations(args.page, args.perPage);
       
      case 'get_organization_member':
        return await this.organizationService.getOrganizationMember(args.org, args.username);
        
      case 'get_organization_members':
        return await this.organizationService.getOrganizationMembers(args.org, args.page, args.perPage);
        
      case 'invite_organization_member':
        return await this.organizationService.inviteOrganizationMember(args.org, args.username, args.memberData);
        
      case 'remove_organization_member':
        return await this.organizationService.removeOrganizationMember(args.org, args.username);
        
      case 'get_enterprise_member':
        return await this.organizationService.getEnterpriseMember(args.enterprise, args.username);
        
      case 'update_enterprise_member':
        return await this.organizationService.updateEnterpriseMember(args.enterprise, args.username, args.memberData);
        
      case 'get_current_user_organization_membership':
        return await this.organizationService.getCurrentUserOrganizationMembership(args.org);
        
      case 'leave_organization':
        return await this.organizationService.leaveOrganization(args.org);
        
      case 'get_enterprise_members':
        return await this.organizationService.getEnterpriseMembers(args.enterprise, args.page, args.perPage);
        
      case 'get_organization_followers':
        return await this.organizationService.getOrganizationFollowers(args.owner, args.page, args.perPage);
        
      case 'get_organization_issue_extend_settings':
        return await this.organizationService.getOrganizationIssueExtendSettings(args.org);
        
      case 'get_organization_customized_roles':
        return await this.organizationService.getOrganizationCustomizedRoles(args.org);
       
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}