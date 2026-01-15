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
            id: {
              type: 'string',
              description: '看板ID'
            }
          },
          required: ['owner', 'id']
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
            id: {
              type: 'string',
              description: '看板ID'
            }
          },
          required: ['owner', 'id']
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
            id: {
              type: 'string',
              description: '看板ID'
            }
          },
          required: ['owner', 'id']
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
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'get_organization_kanbans':
        return await this.dashboardService.getOrganizationKanbanList(args.owner);
      
      case 'create_organization_kanban':
        return await this.dashboardService.createOrganizationKanban(args.owner, args.kanbanData);
      
      case 'get_organization_kanban':
        return await this.dashboardService.getOrganizationKanban(args.owner, args.id);
      
      case 'update_organization_kanban':
        return await this.dashboardService.updateOrganizationKanban(args.owner, args.id, args.kanbanData);
      
      case 'delete_organization_kanban':
        return await this.dashboardService.deleteOrganizationKanban(args.owner, args.id);
      
      case 'get_organization_kanban_content':
        return await this.dashboardService.getOrganizationKanbanContent(args.owner, args.id);
      
      case 'update_organization_kanban_content':
        return await this.dashboardService.updateOrganizationKanbanContent(args.owner, args.id, args.contentData);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}