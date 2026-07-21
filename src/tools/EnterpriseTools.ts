import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { EnterpriseService } from '../services/EnterpriseService.js';
import { autoPaginate } from '../core/PaginationHelper.js';

const stringOrNumberSchema = (description: string, defaultValue?: number) => ({
  oneOf: [
    { type: 'string' },
    { type: 'number' }
  ],
  description,
  ...(defaultValue !== undefined ? { default: defaultValue } : {})
});

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
            enterprise: stringOrNumberSchema('企业名'),
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
            enterprise: stringOrNumberSchema('企业名'),
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
          required: ['enterprise']
        }
      },
      {
        name: 'invite_enterprise_member_v8',
        description: '邀请企业成员',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise: stringOrNumberSchema('企业名'),
            username: {
              type: 'string',
              description: '用户名'
            },
            permission: { type: 'string', description: '成员权限' },
            role_id: { type: 'string', description: '自定义角色 ID' }
          },
          required: ['enterprise', 'username']
        }
      },
      {
        name: 'delete_enterprise_members_v8',
        description: '删除企业成员',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise: stringOrNumberSchema('企业名'),
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
            enterprise: stringOrNumberSchema('企业名'),
            username: {
              type: 'string',
              description: '用户名'
            },
            role: { type: 'string', description: '企业角色' },
            role_id: { type: 'string', description: '自定义角色 ID' }
          },
          required: ['enterprise', 'username', 'role']
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
          required: ['enterprise_id']
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
            title: { type: 'string', description: '名称' },
            description: { type: 'string', description: '描述' },
            start_date: { type: 'string', description: '开始时间，格式 YYYY-MM-DD' },
            due_date: { type: 'string', description: '截止时间，格式 YYYY-MM-DD' },
            projects: {
              type: 'array',
              description: '关联项目 ID 列表',
              items: { type: 'number' }
            }
          },
          required: ['enterprise', 'title']
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
            title: { type: 'string', description: '名称' },
            description: { type: 'string', description: '描述' },
            start_date: { type: 'string', description: '开始时间，格式 YYYY-MM-DD' },
            due_date: { type: 'string', description: '截止时间，格式 YYYY-MM-DD' },
            state_event: { type: 'string', description: '状态变更' },
            projects: {
              type: 'array',
              description: '关联项目 ID 列表',
              items: { type: 'number' }
            }
          },
          required: ['enterprise', 'milestone_id', 'title']
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
              ...stringOrNumberSchema('页码 (可选)')
            },
            perPage: {
              ...stringOrNumberSchema('每页数量 (可选)')
            },
            name: {
              type: 'string',
              description: '里程碑名称'
            },
            state: {
              type: 'string',
              description: '里程碑状态'
            },
            order_by: {
              type: 'string',
              description: '排序字段'
            },
            sort: {
              type: 'string',
              description: '排序方向'
            },
            autoPaginate: {
              type: 'boolean',
              description: '是否自动获取所有页（默认 false，设为 true 时自动获取全部数据）',
              default: false
            },
            maxPages: {
              ...stringOrNumberSchema('自动分页时的最大页数限制', 100)
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
            },
            group_name: {
              type: 'string',
              description: '项目组名称'
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
            },
            page: {
              ...stringOrNumberSchema('页码')
            },
            perPage: {
              ...stringOrNumberSchema('每页数量')
            },
            autoPaginate: {
              type: 'boolean',
              description: '是否自动获取所有页（默认 false，设为 true 时自动获取全部数据）',
              default: false
            },
            maxPages: {
              ...stringOrNumberSchema('自动分页时的最大页数限制', 100)
            }
          },
          required: ['enterprise_id']
        }
      },
      {
        name: 'get_enterprise_issues_v8',
        description: '获取企业Issue列表',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise_id: {
              type: 'string',
              description: '企业ID'
            },
            page: { type: 'number', description: '页码' },
            perPage: { type: 'number', description: '每页数量' },
            labels: { type: 'string', description: '标签，多个按英文逗号隔开' },
            autoPaginate: {
              type: 'boolean',
              description: '是否自动获取所有页（默认 false，设为 true 时自动获取全部数据）',
              default: false
            },
            maxPages: {
              oneOf: [{ type: 'string' }, { type: 'number' }],
              description: '自动分页时的最大页数限制（默认 100）',
              default: 100
            },
            sort: { type: 'string', description: '排序字段' },
            direction: { type: 'string', description: '排序方向' },
            since: { type: 'string', description: '起始更新时间' },
            assignees: {
              type: 'array',
              description: '负责人用户名',
              items: { type: 'string' }
            },
            milestone_ids: {
              type: 'array',
              description: '企业里程碑 ID 列表',
              items: { type: 'number' }
            },
            project_ids: {
              type: 'array',
              description: '项目 ID 列表',
              items: { type: 'number' }
            },
            create_at: { type: 'string', description: '任务创建日期' },
            created_before: { type: 'string', description: '任务创建截止时间' },
            search: { type: 'string', description: '标题搜索关键字' },
            issue_types: {
              type: 'array',
              description: 'Issue 自定义类型',
              items: { type: 'string' }
            },
            issue_states: {
              type: 'array',
              description: 'Issue 自定义状态',
              items: { type: 'string' }
            },
            custom_fields: {
              type: 'array',
              description: '自定义字段筛选',
              items: {
                type: 'object',
                properties: {
                  field_name: { type: 'string' },
                  values: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  operation: { type: 'string' }
                },
                required: ['operation']
              }
            }
          },
          required: ['enterprise_id']
        }
      },
      {
        name: 'create_enterprise_label_v8',
        description: '创建企业标签',
        inputSchema: {
          type: 'object',
          properties: {
            enterpriseId: {
              type: 'number',
              description: '企业id'
            },
            name: {
              type: 'string',
              description: '标签名称'
            },
            color: {
              type: 'string',
              description: "标签的颜色，以6位16进制表示，前面带有'#'号"
            },
            description: {
              type: 'string',
              description: '标签描述'
            }
          },
          required: ['enterpriseId', 'name', 'description']
        }
      },
      {
        name: 'update_enterprise_label_v8',
        description: '更新企业标签',
        inputSchema: {
          type: 'object',
          properties: {
            enterpriseId: {
              type: 'number',
              description: '企业id'
            },
            labelId: {
              type: 'string',
              description: '标签id'
            },
            name: {
              type: 'string',
              description: '标签名称'
            },
            color: {
              type: 'string',
              description: "标签的颜色，以6位16进制表示，前面带有'#'号"
            },
            description: {
              type: 'string',
              description: '标签描述'
            }
          },
          required: ['enterpriseId', 'labelId', 'name', 'description']
        }
      },
      {
        name: 'delete_enterprise_label_v8',
        description: '删除企业标签',
        inputSchema: {
          type: 'object',
          properties: {
            enterpriseId: {
              type: 'number',
              description: '企业id'
            },
            labelId: {
              type: 'string',
              description: '标签id'
            }
          },
          required: ['enterpriseId', 'labelId']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'get_enterprise_member_v8':
        return await this.enterpriseService.getEnterpriseMemberV8(args.enterprise, args.username);
      
      case 'get_enterprise_members_v8':
        if (args.autoPaginate) {
          return autoPaginate(
            (page, perPage) => this.enterpriseService.getEnterpriseMembersV8(args.enterprise, page, perPage, args.role),
            { page: args.page, perPage: args.perPage, autoPaginate: true, maxPages: args.maxPages }
          );
        }
        return await this.enterpriseService.getEnterpriseMembersV8(args.enterprise, args.page, args.perPage, args.role);
      
      case 'invite_enterprise_member_v8':
        return await this.enterpriseService.inviteEnterpriseMember(args.enterprise, args.username, {
          permission: args.permission,
          role_id: args.role_id
        });
      
      case 'delete_enterprise_members_v8':
        return await this.enterpriseService.deleteEnterpriseMembers(args.enterprise, args.usernames ?? [args.username]);
      
      case 'update_enterprise_member_v8':
        return await this.enterpriseService.updateEnterpriseMemberV8(args.enterprise, args.username, {
          role: args.role,
          role_id: args.role_id
        });
      
      case 'get_organization_enterprise_v8':
        return await this.enterpriseService.getOrganizationEnterprise(args.org);
      
      case 'get_enterprise_customized_roles_v8':
        return await this.enterpriseService.getEnterpriseCustomizedRoles(args.enterprise_id ?? args.enterpriseId);
      
      case 'create_enterprise_milestone_v8':
        return await this.enterpriseService.createEnterpriseMilestone(args.enterprise, {
          title: args.title,
          description: args.description,
          start_date: args.start_date,
          due_date: args.due_date,
          projects: args.projects
        });
      
      case 'update_enterprise_milestone_v8':
        return await this.enterpriseService.updateEnterpriseMilestone(
          args.enterprise,
          args.milestone_id ?? args.milestoneId,
          {
            title: args.title,
            description: args.description,
            start_date: args.start_date,
            due_date: args.due_date,
            state_event: args.state_event,
            projects: args.projects
          },
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
        if (args.autoPaginate) {
          return autoPaginate(
            (page, perPage) => this.enterpriseService.getEnterpriseMilestones(args.enterprise, page, perPage, args.name, args.state, args.order_by, args.sort),
            { page: args.page, perPage: args.perPage, autoPaginate: true, maxPages: args.maxPages }
          );
        }
        return await this.enterpriseService.getEnterpriseMilestones(
          args.enterprise,
          args.page,
          args.perPage,
          args.name,
          args.state,
          args.order_by,
          args.sort
        );
      
      case 'get_enterprise_projects_v8':
        if (args.autoPaginate) {
          return autoPaginate(
            (page, perPage) => this.enterpriseService.getEnterpriseProjects(args.enterprise, page, perPage, args.group_name),
            { page: args.page, perPage: args.perPage, autoPaginate: true, maxPages: args.maxPages }
          );
        }
        return await this.enterpriseService.getEnterpriseProjects(args.enterprise, args.page, args.perPage, args.group_name);
      
      case 'get_enterprise_issue_extend_fields_v8':
        if (args.autoPaginate) {
          return autoPaginate(
            (page, perPage) => this.enterpriseService.getEnterpriseIssueExtendFields(args.enterprise_id ?? args.enterprisesId, page, perPage),
            { page: args.page, perPage: args.perPage, autoPaginate: true, maxPages: args.maxPages }
          );
        }
        return await this.enterpriseService.getEnterpriseIssueExtendFields(
          args.enterprise_id ?? args.enterprisesId,
          args.page,
          args.perPage
        );

      case 'get_enterprise_issues_v8':
        if (args.autoPaginate) {
          return autoPaginate(
            (page, perPage) => this.enterpriseService.getEnterpriseIssuesV8(args.enterprise_id ?? args.enterpriseId, { page, per_page: perPage, labels: args.labels, sort: args.sort, direction: args.direction, since: args.since, assignees: args.assignees, milestone_ids: args.milestone_ids, project_ids: args.project_ids, create_at: args.create_at, created_before: args.created_before, search: args.search, issue_types: args.issue_types, issue_states: args.issue_states, custom_fields: args.custom_fields }),
            { page: args.page, perPage: args.perPage, autoPaginate: true, maxPages: args.maxPages }
          );
        }
        return await this.enterpriseService.getEnterpriseIssuesV8(
          args.enterprise_id ?? args.enterpriseId,
          {
            page: args.page,
            per_page: args.perPage,
            labels: args.labels,
            sort: args.sort,
            direction: args.direction,
            since: args.since,
            assignees: args.assignees,
            milestone_ids: args.milestone_ids,
            project_ids: args.project_ids,
            create_at: args.create_at,
            created_before: args.created_before,
            search: args.search,
            issue_types: args.issue_types,
            issue_states: args.issue_states,
            custom_fields: args.custom_fields
          },
        );

      case 'create_enterprise_label_v8':
        return await this.enterpriseService.createEnterpriseLabel(args.enterprise_id ?? args.enterpriseId, {
          name: args.name,
          color: args.color,
          description: args.description
        });

      case 'update_enterprise_label_v8':
        return await this.enterpriseService.updateEnterpriseLabel(
          args.enterprise_id ?? args.enterpriseId,
          args.label_id ?? args.labelId,
          {
            name: args.name,
            color: args.color,
            description: args.description
          }
        );

      case 'delete_enterprise_label_v8':
        return await this.enterpriseService.deleteEnterpriseLabel(
          args.enterprise_id ?? args.enterpriseId,
          args.label_id ?? args.labelId
        );
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}
