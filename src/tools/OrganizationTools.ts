import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { OrganizationService } from '../services/OrganizationService.js';
import { autoPaginate, autoPaginateSchemaProperties } from '../core/PaginationHelper.js';

const stringOrNumberSchema = (description: string, defaultValue?: number) => ({
  oneOf: [
    { type: 'string' },
    { type: 'number' }
  ],
  description,
  ...(defaultValue !== undefined ? { default: defaultValue } : {})
});

export class OrganizationTools {
  private organizationService: OrganizationService;

  constructor(organizationService: OrganizationService) {
    this.organizationService = organizationService;
  }

  getTools(): Tool[] {
    return [
      {
        name: 'create_organization',
        description: '创建组织',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: '组织名称，默认等于 path' },
            path: { type: 'string', description: '组织路径' },
            visibility: {
              type: 'string',
              description: '可见性',
              enum: ['public', 'private']
            },
            description: { type: 'string', description: '组织描述' }
          },
          required: ['path']
        }
      },
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
            name: { type: 'string', description: '仓库名称' },
            description: { type: 'string', description: '仓库描述' },
            homepage: { type: 'string', description: '主页' },
            has_issues: { type: 'boolean', description: '是否启用 Issue' },
            has_wiki: { type: 'boolean', description: '是否启用 Wiki' },
            can_comment: { type: 'boolean', description: '是否允许评论' },
            public: { type: 'number', description: '开源类型。0 私有，1 外部开源，2 内部开源' },
            private: { type: 'boolean', description: '是否私有仓库' },
            auto_init: { type: 'boolean', description: '是否初始化 README' },
            gitignore_template: { type: 'string', description: 'Git Ignore 模板' },
            license_template: { type: 'string', description: 'License 模板' },
            path: { type: 'string', description: '仓库路径' },
            default_branch: { type: 'string', description: '默认分支名称' },
            import_url: { type: 'string', description: '导入仓库的 Git 地址' },
            project_template: { type: 'string', description: '模板项目 path' },
            repository_type: {
              type: 'string',
              description: '仓库类型',
              enum: ['code', 'model', 'dataset', 'space']
            }
          },
          required: ['org', 'name']
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
            type: {
              type: 'string',
              description: '仓库类型过滤'
            },
            repo_type: {
              type: 'string',
              description: '仓库分类过滤'
            },
            page: {
              type: 'number',
              description: '页码 (可选)'
            },
            perPage: {
              type: 'number',
              description: '每页数量 (可选)'
            },
            ...autoPaginateSchemaProperties,
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
              ...stringOrNumberSchema('页码 (可选)')
            },
            perPage: {
              ...stringOrNumberSchema('每页数量 (可选)')
            },
            ...autoPaginateSchemaProperties,
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
              ...stringOrNumberSchema('页码 (可选)')
            },
            perPage: {
              ...stringOrNumberSchema('每页数量 (可选)')
            },
            admin: {
              type: 'boolean',
              description: '仅返回管理员组织'
            },
            ...autoPaginateSchemaProperties,
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
            name: { type: 'string', description: '组织名称' },
            email: { type: 'string', description: '组织公开邮箱' },
            location: { type: 'string', description: '组织所在地' },
            description: { type: 'string', description: '组织简介' },
            html_url: { type: 'string', description: '组织站点' }
          },
          required: ['org']
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
            role: { type: 'string', description: '成员角色' },
            role_id: { type: 'string', description: '自定义角色 ID' }
          },
          required: ['enterprise', 'username', 'role']
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
            },
            role: {
              type: 'string',
              description: '成员角色过滤'
            },
            ...autoPaginateSchemaProperties,
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
            org: {
              type: 'string',
              description: '组织名过滤'
            },
            page: {
              type: 'number',
              description: '页码 (可选)'
            },
            perPage: {
              type: 'number',
              description: '每页数量 (可选)'
            },
            role: {
              type: 'string',
              description: '成员角色过滤'
            },
            ...autoPaginateSchemaProperties,
          },
          required: ['enterprise', 'org']
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
            permission: {
              type: 'string',
              description: '成员权限'
            },
            role_id: {
              type: 'string',
              description: '自定义角色 ID'
            }
          },
          required: ['org', 'username']
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
            },
            ...autoPaginateSchemaProperties,
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
      },
      {
        name: 'get_organization_discussions',
        description: '获取组织讨论列表',
        inputSchema: {
          type: 'object',
          properties: {
            org: {
              type: 'string',
              description: '组织path'
            },
            page: stringOrNumberSchema('当前的页码'),
            perPage: stringOrNumberSchema('每页的数量，最大为 100，默认 20'),
            sort: {
              type: 'string',
              description: '排序字段 created 或 comment_size'
            },
            direction: {
              type: 'string',
              description: '排序方向 asc 或 desc'
            },
            search: {
              type: 'string',
              description: '根据标题和描述搜索'
            }
          },
          required: ['org']
        }
      },
      {
        name: 'get_organization_discussion',
        description: '获取组织讨论详情',
        inputSchema: {
          type: 'object',
          properties: {
            org: {
              type: 'string',
              description: '组织path'
            },
            number: {
              type: 'string',
              description: '讨论的编号'
            }
          },
          required: ['org', 'number']
        }
      },
      {
        name: 'get_organization_discussion_comments',
        description: '获取组织讨论评论列表',
        inputSchema: {
          type: 'object',
          properties: {
            org: {
              type: 'string',
              description: '组织path'
            },
            number: {
              type: 'string',
              description: '讨论的编号'
            }
          },
          required: ['org', 'number']
        }
      },
      {
        name: 'get_organization_discussion_comment_replies',
        description: '获取组织讨论评论回复列表',
        inputSchema: {
          type: 'object',
          properties: {
            org: {
              type: 'string',
              description: '组织path'
            },
            number: {
              type: 'string',
              description: '讨论的编号'
            },
            commentId: {
              type: 'string',
              description: '评论id'
            }
          },
          required: ['org', 'number', 'commentId']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'create_organization':
        return await this.organizationService.createOrganization({
          name: args.name,
          path: args.path,
          visibility: args.visibility,
          description: args.description
        });

      case 'get_organization':
        return await this.organizationService.getOrganization(args.org);
 
      case 'create_organization_repository':
        return await this.organizationService.createOrganizationRepository(args.org, {
          name: args.name,
          description: args.description,
          homepage: args.homepage,
          has_issues: args.has_issues,
          has_wiki: args.has_wiki,
          can_comment: args.can_comment,
          public: args.public,
          private: args.private,
          auto_init: args.auto_init,
          gitignore_template: args.gitignore_template,
          license_template: args.license_template,
          path: args.path,
          default_branch: args.default_branch,
          import_url: args.import_url,
          project_template: args.project_template,
          repository_type: args.repository_type
        });
       
      case 'get_organization_repositories':
        if (args.autoPaginate) {
          return autoPaginate(
            (page, perPage) => this.organizationService.getOrganizationRepositories(args.org, page, perPage, args.type, args.repo_type ?? args.repoType),
            { page: args.page, perPage: args.perPage, autoPaginate: true, maxPages: args.maxPages }
          );
        }
        return await this.organizationService.getOrganizationRepositories(args.org, args.page, args.perPage, args.type, args.repo_type ?? args.repoType);
      
      case 'get_user_organizations':
        if (args.autoPaginate) {
          return autoPaginate(
            (page, perPage) => this.organizationService.getUserOrganizations(args.username, page, perPage),
            { page: args.page, perPage: args.perPage, autoPaginate: true, maxPages: args.maxPages }
          );
        }
        return await this.organizationService.getUserOrganizations(args.username, args.page, args.perPage);
      
      case 'get_current_user_organizations':
        if (args.autoPaginate) {
          return autoPaginate(
            (page, perPage) => this.organizationService.getCurrentUserOrganizations(page, perPage, args.admin),
            { page: args.page, perPage: args.perPage, autoPaginate: true, maxPages: args.maxPages }
          );
        }
        return await this.organizationService.getCurrentUserOrganizations(args.page, args.perPage, args.admin);
       
      case 'update_organization':
        return await this.organizationService.updateOrganization(args.org, {
          name: args.name,
          email: args.email,
          location: args.location,
          description: args.description,
          html_url: args.html_url
        });

      case 'get_organization_member':
        return await this.organizationService.getOrganizationMember(args.org, args.username);
        
      case 'get_organization_members':
        if (args.autoPaginate) {
          return autoPaginate(
            (page, perPage) => this.organizationService.getOrganizationMembers(args.org, page, perPage, args.role),
            { page: args.page, perPage: args.perPage, autoPaginate: true, maxPages: args.maxPages }
          );
        }
        return await this.organizationService.getOrganizationMembers(args.org, args.page, args.perPage, args.role);
      
      case 'invite_organization_member':
        return await this.organizationService.inviteOrganizationMember(args.org, args.username, {
          permission: args.permission ?? args.memberData?.permission,
          role_id: args.role_id ?? args.roleId ?? args.memberData?.role_id
        });
        
      case 'remove_organization_member':
        return await this.organizationService.removeOrganizationMember(args.org, args.username);
        
      case 'get_enterprise_member':
        return await this.organizationService.getEnterpriseMember(args.enterprise, args.username);
        
      case 'update_enterprise_member':
        return await this.organizationService.updateEnterpriseMember(args.enterprise, args.username, {
          role: args.role,
          role_id: args.role_id
        });
        
      case 'get_current_user_organization_membership':
        return await this.organizationService.getCurrentUserOrganizationMembership(args.org);
        
      case 'leave_organization':
        return await this.organizationService.leaveOrganization(args.org);
        
      case 'get_enterprise_members':
        if (args.autoPaginate) {
          return autoPaginate(
            (page, perPage) => this.organizationService.getEnterpriseMembers(args.enterprise, page, perPage, args.org, args.role),
            { page: args.page, perPage: args.perPage, autoPaginate: true, maxPages: args.maxPages }
          );
        }
        return await this.organizationService.getEnterpriseMembers(args.enterprise, args.page, args.perPage, args.org, args.role);
        
      case 'get_organization_followers':
        if (args.autoPaginate) {
          return autoPaginate(
            (page, perPage) => this.organizationService.getOrganizationFollowers(args.owner, page, perPage),
            { page: args.page, perPage: args.perPage, autoPaginate: true, maxPages: args.maxPages }
          );
        }
        return await this.organizationService.getOrganizationFollowers(args.owner, args.page, args.perPage);
        
      case 'get_organization_issue_extend_settings':
        return await this.organizationService.getOrganizationIssueExtendSettings(args.org);
        
      case 'get_organization_customized_roles':
        return await this.organizationService.getOrganizationCustomizedRoles(args.org);

      case 'get_organization_discussions':
        return await this.organizationService.getOrganizationDiscussions(args.org, {
          page: args.page,
          per_page: args.perPage,
          sort: args.sort,
          direction: args.direction,
          search: args.search
        });

      case 'get_organization_discussion':
        return await this.organizationService.getOrganizationDiscussion(args.org, args.number);

      case 'get_organization_discussion_comments':
        return await this.organizationService.getOrganizationDiscussionComments(args.org, args.number);

      case 'get_organization_discussion_comment_replies':
        return await this.organizationService.getOrganizationDiscussionCommentReplies(
          args.org,
          args.number,
          args.comment_id ?? args.commentId
        );
       
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}
