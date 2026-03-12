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
        name: 'create_organization_kanban',
        description: '创建组织看板',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: '组织名'
            },
            kanbanData: {
              type: 'object',
              description: '看板数据（包含name、description等）'
            }
          },
          required: ['owner', 'kanbanData']
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
        name: 'update_organization_kanban',
        description: '更新组织看板',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: '组织名'
            },
            id: {
              type: 'string',
              description: '看板ID'
            },
            kanbanData: {
              type: 'object',
              description: '更新的看板数据'
            }
          },
          required: ['owner', 'id', 'kanbanData']
        }
      },
      {
        name: 'delete_organization_kanban',
        description: '删除组织看板',
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
        name: 'update_organization_kanban_content',
        description: '更新看板内容',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: '组织名'
            },
            id: {
              type: 'string',
              description: '看板ID'
            },
            contentData: {
              type: 'object',
              description: '看板内容数据'
            }
          },
          required: ['owner', 'id', 'contentData']
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
      
      case 'create_organization_kanban':
        return await this.dashboardService.createOrganizationKanban(args.owner, args.kanbanData);
      
      case 'get_organization_kanban':
        return await this.dashboardService.getOrganizationKanban(args.owner, kanbanId);
      
      case 'update_organization_kanban':
        return await this.dashboardService.updateOrganizationKanban(args.owner, args.id, args.kanbanData);
      
      case 'delete_organization_kanban':
        return await this.dashboardService.deleteOrganizationKanban(args.owner, args.id);
      
      case 'get_organization_kanban_content':
        return await this.dashboardService.getOrganizationKanbanContent(args.owner, kanbanId);
      
      case 'update_organization_kanban_content':
        return await this.dashboardService.updateOrganizationKanbanContent(args.owner, args.id, args.contentData);

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
