import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { EnterpriseService } from '../services/EnterpriseService.js';

export class EnterpriseTools {
  private enterpriseService: EnterpriseService;

  constructor(enterpriseService: EnterpriseService) {
    this.enterpriseService = enterpriseService;
  }

  getTools(): Tool[] {
    return [
      {
        name: 'get_enterprise_member_v8',
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
        name: 'get_enterprise_members_v8',
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
        name: 'invite_enterprise_member_v8',
        description: '邀请企业成员',
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
              description: '邀请数据'
            }
          },
          required: ['enterprise', 'username', 'memberData']
        }
      },
      {
        name: 'delete_enterprise_members_v8',
        description: '删除企业成员',
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
        name: 'update_enterprise_member_v8',
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
        name: 'get_organization_enterprise_v8',
        description: '获取组织关联的企业',
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
        name: 'get_enterprise_customized_roles_v8',
        description: '获取企业自定义角色',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise: {
              type: 'string',
              description: '企业名'
            },
            enterprise_id: {
              type: 'string',
              description: '企业ID'
            }
          },
          required: ['enterprise', 'enterprise_id']
        }
      },
      {
        name: 'create_enterprise_milestone_v8',
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
              description: '里程碑数据'
            }
          },
          required: ['enterprise', 'milestoneData']
        }
      },
      {
        name: 'update_enterprise_milestone_v8',
        description: '修改企业里程碑',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise: {
              type: 'string',
              description: '企业名'
            },
            milestone_id: {
              type: 'string',
              description: '里程碑ID'
            },
            milestoneData: {
              type: 'object',
              description: '里程碑更新数据'
            }
          },
          required: ['enterprise', 'milestone_id', 'milestoneData']
        }
      },
      {
        name: 'get_enterprise_milestone_v8',
        description: '获取企业里程碑详情',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise: {
              type: 'string',
              description: '企业名'
            },
            milestone_id: {
              type: 'string',
              description: '里程碑ID'
            }
          },
          required: ['enterprise', 'milestone_id']
        }
      },
      {
        name: 'delete_enterprise_milestone_v8',
        description: '删除企业里程碑',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise: {
              type: 'string',
              description: '企业名'
            },
            milestone_id: {
              type: 'string',
              description: '里程碑ID'
            }
          },
          required: ['enterprise', 'milestone_id']
        }
      },
      {
        name: 'get_enterprise_milestones_v8',
        description: '获取企业里程碑列表',
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
        name: 'get_enterprise_projects_v8',
        description: '获取企业里程碑可以关联的项目列表',
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
        name: 'get_enterprise_issue_extend_fields_v8',
        description: '获取企业Issue自定义字段列表',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise: {
              type: 'string',
              description: '企业名'
            },
            enterprise_id: {
              type: 'string',
              description: '企业ID'
            }
          },
          required: ['enterprise', 'enterprise_id']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'get_enterprise_member_v8':
        return await this.enterpriseService.getEnterpriseMemberV8(args.enterprise, args.username);
      
      case 'get_enterprise_members_v8':
        return await this.enterpriseService.getEnterpriseMembersV8(args.enterprise, args.page, args.perPage);
      
      case 'invite_enterprise_member_v8':
        return await this.enterpriseService.inviteEnterpriseMember(args.enterprise, args.username, args.memberData);
      
      case 'delete_enterprise_members_v8':
        return await this.enterpriseService.deleteEnterpriseMembers(args.enterprise, args.usernames ?? [args.username]);
      
      case 'update_enterprise_member_v8':
        return await this.enterpriseService.updateEnterpriseMemberV8(args.enterprise, args.username, args.memberData);
      
      case 'get_organization_enterprise_v8':
        return await this.enterpriseService.getOrganizationEnterprise(args.org);
      
      case 'get_enterprise_customized_roles_v8':
        return await this.enterpriseService.getEnterpriseCustomizedRoles(args.enterprise, args.enterprise_id ?? args.enterpriseId);
      
      case 'create_enterprise_milestone_v8':
        return await this.enterpriseService.createEnterpriseMilestone(args.enterprise, args.milestoneData);
      
      case 'update_enterprise_milestone_v8':
        return await this.enterpriseService.updateEnterpriseMilestone(
          args.enterprise,
          args.milestone_id ?? args.milestoneId,
          args.milestoneData,
        );
      
      case 'get_enterprise_milestone_v8':
        return await this.enterpriseService.getEnterpriseMilestone(
          args.enterprise,
          args.milestone_id ?? args.milestoneId,
        );
      
      case 'delete_enterprise_milestone_v8':
        return await this.enterpriseService.deleteEnterpriseMilestone(
          args.enterprise,
          args.milestone_id ?? args.milestoneId,
        );
      
      case 'get_enterprise_milestones_v8':
        return await this.enterpriseService.getEnterpriseMilestones(args.enterprise, args.page, args.perPage);
      
      case 'get_enterprise_projects_v8':
        return await this.enterpriseService.getEnterpriseProjects(args.enterprise, args.page, args.perPage);
      
      case 'get_enterprise_issue_extend_fields_v8':
        return await this.enterpriseService.getEnterpriseIssueExtendFields(args.enterprise, args.enterprise_id ?? args.enterprisesId);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}
