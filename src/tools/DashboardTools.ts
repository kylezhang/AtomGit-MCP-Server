import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { DashboardService } from '../services/DashboardService.js';
import { autoPaginate, autoPaginateSchemaProperties } from '../core/PaginationHelper.js';

const stringOrNumberSchema = (description: string, defaultValue?: number) => ({
  oneOf: [
    { type: 'string' },
    { type: 'number' }
  ],
  description,
  ...(defaultValue !== undefined ? { default: defaultValue } : {})
});

export class DashboardTools {
  private dashboardService: DashboardService;

  constructor(dashboardService: DashboardService) {
    this.dashboardService = dashboardService;
  }

  getTools(): Tool[] {
    return [
      {
        name: 'get_organization_kanbans',
        description: '获取组织看板列表',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: '组织名'
            },
            status: {
              type: 'number',
              description: '看板状态'
            },
            sort: {
              type: 'string',
              description: '排序字段'
            },
            visibility: {
              type: 'number',
              description: '可见性'
            },
            search: {
              type: 'string',
              description: '搜索关键字'
            },
            page: {
              ...stringOrNumberSchema('页码')
            },
            perPage: {
              ...stringOrNumberSchema('每页数量')
            },
            ...autoPaginateSchemaProperties,
          },
          required: ['owner']
        }
      },
      {
        name: 'get_organization_kanban',
        description: '获取特定看板详情',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: '组织名'
            },
            kanban_id: {
              type: 'string',
              description: '看板ID'
            }
          },
          required: ['owner', 'kanban_id']
        }
      },
      {
        name: 'add_org_kanban_item',
        description: '添加Issue或者Pull Request到看板',
        inputSchema: {
          type: 'object',
          properties: {
            owner: { type: 'string', description: '组织名' },
            kanban_id: { type: 'string', description: '看板ID' },
            repo: { type: 'string', description: '仓库名' },
            issue_iids: {
              type: 'array',
              description: '要添加到看板的 Issue IID 列表',
              items: { type: 'number' }
            },
            pr_iids: {
              type: 'array',
              description: '要添加到看板的 Pull Request IID 列表',
              items: { type: 'number' }
            }
          },
          required: ['owner', 'kanban_id', 'repo', 'issue_iids', 'pr_iids']
        }
      },
      {
        name: 'delete_org_kanban_remove_item',
        description: '删除看板关联的Issue或者Pull Request',
        inputSchema: {
          type: 'object',
          properties: {
            owner: { type: 'string', description: '组织名' },
            kanban_id: { type: 'string', description: '看板ID' },
            itemData: { type: 'object', description: 'Item data to remove' }
          },
          required: ['owner', 'kanban_id']
        }
      },
      {
        name: 'update_org_kanban_state',
        description: '修改看板状态',
        inputSchema: {
          type: 'object',
          properties: {
            owner: { type: 'string', description: '组织名' },
            kanban_id: { type: 'string', description: '看板ID' },
            state: {
              type: 'string',
              description: '看板状态',
              enum: ['archived', 'active']
            }
          },
          required: ['owner', 'kanban_id', 'state']
        }
      },
      {
        name: 'update_org_kanban_repo_item',
        description: '更新Issue或者Pull Request关联的看板',
        inputSchema: {
          type: 'object',
          properties: {
            owner: { type: 'string', description: '组织名' },
            repo: { type: 'string', description: '仓库名' },
            type: { type: 'string', description: '类型 (issue/pull)' },
            iid: { ...stringOrNumberSchema('Issue/PR ID') },
            kanban_id: { type: 'string', description: '新的看板ID' }
          },
          required: ['owner', 'repo', 'type', 'iid', 'kanban_id']
        }
      },
      {
        name: 'get_org_kanban_item_list',
        description: '查询看板内容列表',
        inputSchema: {
          type: 'object',
          properties: {
            owner: { type: 'string', description: '组织名' },
            kanban_id: { type: 'string', description: '看板ID' },
            repo: { type: 'string', description: '仓库路径' },
            source_type: { type: 'string', description: '来源类型' },
            source_status: { type: 'string', description: '来源状态' },
            title: { type: 'string', description: '标题关键字' },
            source_iids: { type: 'string', description: '来源 IID，多个用逗号分隔' },
            page: { ...stringOrNumberSchema('页码') },
            perPage: { ...stringOrNumberSchema('每页数量') },
            ...autoPaginateSchemaProperties,
          },
          required: ['owner', 'kanban_id']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    const kanbanId = args.kanban_id ?? args.kanbanId ?? args.id;

    switch (name) {
      case 'get_organization_kanbans':
        if (args.autoPaginate) {
          return autoPaginate(
            (page, perPage) => this.dashboardService.getOrganizationKanbanList(args.owner, args.status, args.sort, args.visibility, args.search, page, perPage),
            { page: args.page, perPage: args.perPage, autoPaginate: true, maxPages: args.maxPages }
          );
        }
        return await this.dashboardService.getOrganizationKanbanList(
          args.owner,
          args.status,
          args.sort,
          args.visibility,
          args.search,
          args.page,
          args.perPage
        );
      
      case 'get_organization_kanban':
        return await this.dashboardService.getOrganizationKanban(args.owner, kanbanId);

      case 'add_org_kanban_item':
        return await this.dashboardService.addKanbanItem(args.owner, kanbanId, {
          repo: args.repo,
          issue_iids: args.issue_iids,
          pr_iids: args.pr_iids
        });

      case 'delete_org_kanban_remove_item':
        return await this.dashboardService.removeKanbanItem(args.owner, kanbanId, args.itemData);

      case 'update_org_kanban_state':
        return await this.dashboardService.updateKanbanState(args.owner, kanbanId, { state: args.state });

      case 'update_org_kanban_repo_item':
        return await this.dashboardService.updateKanbanItem(args.owner, args.repo, args.type, args.iid, {
          kanban_id: kanbanId
        });

      case 'get_org_kanban_item_list':
        if (args.autoPaginate) {
          return autoPaginate(
            (page, perPage) => this.dashboardService.getKanbanItemList(args.owner, kanbanId, args.repo, args.source_type, args.source_status, args.title, args.source_iids, page, perPage),
            { page: args.page, perPage: args.perPage, autoPaginate: true, maxPages: args.maxPages }
          );
        }
        return await this.dashboardService.getKanbanItemList(
          args.owner,
          kanbanId,
          args.repo,
          args.source_type,
          args.source_status,
          args.title,
          args.source_iids,
          args.page,
          args.perPage
        );
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}
