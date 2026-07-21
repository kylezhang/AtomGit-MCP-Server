import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { WebhooksService } from '../services/WebhooksService.js';
import { autoPaginate } from '../core/PaginationHelper.js';

export class WebhooksTools {
  private webhooksService: WebhooksService;

  constructor(webhooksService: WebhooksService) {
    this.webhooksService = webhooksService;
  }

  getTools(): Tool[] {
    return [
      {
        name: 'get_repository_webhooks',
        description: '获取仓库Webhook列表',
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
          required: ['owner', 'repo']
        }
      },
      {
        name: 'create_repository_webhook',
        description: '创建仓库Webhook',
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
            url: { type: 'string', description: '远程 HTTP URL' },
            encryption_type: { type: 'number', description: '加密类型。0 密码，1 签名密钥' },
            password: { type: 'string', description: '请求密码' },
            push_events: { type: 'boolean', description: '是否触发 Push 事件' },
            tag_push_events: { type: 'boolean', description: '是否触发 Tag Push 事件' },
            issues_events: { type: 'boolean', description: '是否触发 Issue 事件' },
            note_events: { type: 'boolean', description: '是否触发评论事件' },
            merge_requests_events: { type: 'boolean', description: '是否触发 Merge Request 事件' }
          },
          required: ['owner', 'repo', 'url']
        }
      },
      {
        name: 'get_repository_webhook',
        description: '获取特定仓库Webhook',
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
            id: {
              type: 'string',
              description: 'Webhook ID'
            }
          },
          required: ['owner', 'repo', 'id']
        }
      },
      {
        name: 'update_repository_webhook',
        description: '更新仓库Webhook',
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
            id: {
              type: 'string',
              description: 'Webhook ID'
            },
            url: { type: 'string', description: '远程 HTTP URL' },
            encryption_type: { type: 'number', description: '加密类型。0 密码，1 签名密钥' },
            password: { type: 'string', description: '请求密码' },
            push_events: { type: 'boolean', description: '是否触发 Push 事件' },
            tag_push_events: { type: 'boolean', description: '是否触发 Tag Push 事件' },
            issues_events: { type: 'boolean', description: '是否触发 Issue 事件' },
            note_events: { type: 'boolean', description: '是否触发评论事件' },
            merge_requests_events: { type: 'boolean', description: '是否触发 Merge Request 事件' }
          },
          required: ['owner', 'repo', 'id', 'url']
        }
      },
      {
        name: 'delete_repository_webhook',
        description: '删除仓库Webhook',
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
            id: {
              type: 'string',
              description: 'Webhook ID'
            }
          },
          required: ['owner', 'repo', 'id']
        }
      },
      {
        name: 'test_repository_webhook',
        description: '测试仓库Webhook',
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
            id: {
              type: 'string',
              description: 'Webhook ID'
            }
          },
          required: ['owner', 'repo', 'id']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'get_repository_webhooks':
        if (args.autoPaginate) {
          return autoPaginate(
            (page, perPage) => this.webhooksService.getRepositoryWebhooks(args.owner, args.repo, page, perPage),
            { page: args.page, perPage: args.perPage, autoPaginate: true, maxPages: args.maxPages }
          );
        }
        return await this.webhooksService.getRepositoryWebhooks(args.owner, args.repo, args.page, args.perPage);
      
      case 'create_repository_webhook':
        return await this.webhooksService.createRepositoryWebhook(args.owner, args.repo, {
          url: args.url,
          encryption_type: args.encryption_type,
          password: args.password,
          push_events: args.push_events,
          tag_push_events: args.tag_push_events,
          issues_events: args.issues_events,
          note_events: args.note_events,
          merge_requests_events: args.merge_requests_events
        });
      
      case 'get_repository_webhook':
        return await this.webhooksService.getRepositoryWebhook(args.owner, args.repo, args.id);
      
      case 'update_repository_webhook':
        return await this.webhooksService.updateRepositoryWebhook(args.owner, args.repo, args.id, {
          url: args.url,
          encryption_type: args.encryption_type,
          password: args.password,
          push_events: args.push_events,
          tag_push_events: args.tag_push_events,
          issues_events: args.issues_events,
          note_events: args.note_events,
          merge_requests_events: args.merge_requests_events
        });
      
      case 'delete_repository_webhook':
        return await this.webhooksService.deleteRepositoryWebhook(args.owner, args.repo, args.id);
      
      case 'test_repository_webhook':
        return await this.webhooksService.testRepositoryWebhook(args.owner, args.repo, args.id);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}
