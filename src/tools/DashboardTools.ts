import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { DashboardService } from '../services/DashboardService.js';

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
            }
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
        name: 'get_organization_kanban_content',
        description: '获取看板内容',
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
            itemData: { type: 'object', description: 'Item data' }
          },
          required: ['owner', 'kanban_id', 'itemData']
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
          required: ['owner', 'kanban_id', 'itemData']
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
            stateData: { type: 'object', description: 'State data' }
          },
          required: ['owner', 'kanban_id', 'stateData']
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
            iid: { type: 'number', description: 'Issue/PR ID' },
            newData: { type: 'object', description: 'Update data' }
          },
          required: ['owner', 'repo', 'type', 'iid', 'newData']
        }
      },
      {
        name: 'get_org_kanban_item_list',
        description: '查询看板内容列表',
        inputSchema: {
          type: 'object',
          properties: {
            owner: { type: 'string', description: '组织名' },
            kanban_id: { type: 'string', description: '看板ID' }
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
        return await this.dashboardService.getOrganizationKanbanList(args.owner);
      
      case 'get_organization_kanban':
        return await this.dashboardService.getOrganizationKanban(args.owner, kanbanId);
      
      case 'get_organization_kanban_content':
        return await this.dashboardService.getOrganizationKanbanContent(args.owner, kanbanId);

      case 'add_org_kanban_item':
        return await this.dashboardService.addKanbanItem(args.owner, kanbanId, args.itemData);

      case 'delete_org_kanban_remove_item':
        return await this.dashboardService.removeKanbanItem(args.owner, kanbanId, args.itemData);

      case 'update_org_kanban_state':
        return await this.dashboardService.updateKanbanState(args.owner, kanbanId, args.stateData);

      case 'update_org_kanban_repo_item':
        return await this.dashboardService.updateKanbanItem(args.owner, args.repo, args.type, args.iid, args.newData);

      case 'get_org_kanban_item_list':
        return await this.dashboardService.getKanbanItemList(args.owner, kanbanId);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}
