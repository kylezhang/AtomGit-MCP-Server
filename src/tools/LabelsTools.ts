import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { LabelsService } from '../services/LabelsService.js';
import { autoPaginate } from '../core/PaginationHelper.js';

const stringOrNumberSchema = (description: string, defaultValue?: number) => ({
  oneOf: [
    { type: 'string' },
    { type: 'number' }
  ],
  description,
  ...(defaultValue !== undefined ? { default: defaultValue } : {})
});

export class LabelsTools {
  constructor(private labelsService: LabelsService) {}

  getTools(): Tool[] {
    return [
      {
        name: 'get_repository_labels',
        description: '获取仓库所有任务标签',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: '仓库所有者'
            },
            repo: {
              type: 'string',
              description: '仓库名称'
            },
            page: {
              ...stringOrNumberSchema('页码', 1)
            },
            perPage: {
              ...stringOrNumberSchema('每页数量', 30)
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
          required: ['owner', 'repo']
        }
      },
      {
        name: 'create_repository_label',
        description: '创建仓库任务标签',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: '仓库所有者'
            },
            repo: {
              type: 'string',
              description: '仓库名称'
            },
            name: {
              type: 'string',
              description: '标签名称'
            },
            color: {
              type: 'string',
              description: '标签颜色'
            },
            description: {
              type: 'string',
              description: '标签描述'
            }
          },
          required: ['owner', 'repo']
        }
      },
      {
        name: 'update_repository_label',
        description: '更新一个仓库的任务标签',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: '仓库所有者'
            },
            repo: {
              type: 'string',
              description: '仓库名称'
            },
            original_name: {
              type: 'string',
              description: '原标签名称'
            },
            name: {
              type: 'string',
              description: '新标签名称'
            },
            color: {
              type: 'string',
              description: '标签颜色'
            },
            description: {
              type: 'string',
              description: '标签描述'
            }
          },
          required: ['owner', 'repo', 'original_name']
        }
      },
      {
        name: 'delete_repository_label',
        description: '删除一个仓库任务标签',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: '仓库所有者'
            },
            repo: {
              type: 'string',
              description: '仓库名称'
            },
            name: {
              type: 'string',
              description: '标签名称'
            }
          },
          required: ['owner', 'repo', 'name']
        }
      },
      {
        name: 'replace_all_repository_labels',
        description: '替换所有仓库标签',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: '仓库所有者'
            },
            repo: {
              type: 'string',
              description: '仓库名称'
            },
            labels: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: '标签名称'
                  },
                  color: {
                    type: 'string',
                    description: '标签颜色'
                  }
                }
              }
            }
          },
          required: ['owner', 'repo']
        }
      },
      {
        name: 'get_enterprise_labels',
        description: '获取企业所有的标签',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise: {
              type: 'string',
              description: '企业名称'
            },
            page: {
              ...stringOrNumberSchema('页码', 1)
            },
            perPage: {
              ...stringOrNumberSchema('每页数量', 30)
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
        name: 'get_labels_list',
        description: '获取标签列表',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise: {
              type: 'string',
              description: '企业ID'
            },
            search: {
              type: 'string',
              description: '搜索关键字'
            },
            direction: {
              type: 'string',
              description: '排序方向'
            },
            page: {
              ...stringOrNumberSchema('页码', 1)
            },
            perPage: {
              ...stringOrNumberSchema('每页数量', 30)
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
        name: 'replace_repository_issue_all_labels',
        description: 'Replace all labels for an issue',
        inputSchema: {
          type: 'object',
          properties: {
            owner: {
              type: 'string',
              description: 'The owner of repository'
            },
            repo: {
              type: 'string',
              description: 'The name of repository'
            },
            number: stringOrNumberSchema('The issue number'),
            labels: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of label names'
            }
          },
          required: ['owner', 'repo', 'number']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'get_repository_labels':
        if (args.autoPaginate) {
          return autoPaginate(
            (page, perPage) => this.labelsService.getRepositoryLabels(args.owner, args.repo, { page, perPage }),
            { page: args.page, perPage: args.perPage, autoPaginate: true, maxPages: args.maxPages }
          );
        }
        return await this.labelsService.getRepositoryLabels(args.owner, args.repo, {
          page: args.page,
          perPage: args.perPage
        });
      
      case 'create_repository_label':
        return await this.labelsService.createRepositoryLabel(args.owner, args.repo, {
          name: args.name,
          color: args.color,
          description: args.description
        });
      
      case 'update_repository_label':
        return await this.labelsService.updateRepositoryLabel(args.owner, args.repo, args.original_name ?? args.originalName, {
          name: args.name,
          color: args.color,
          description: args.description
        });
      
      case 'delete_repository_label':
        return await this.labelsService.deleteRepositoryLabel(args.owner, args.repo, args.name);
      
      case 'replace_all_repository_labels':
        return await this.labelsService.replaceRepositoryProjectLabels(args.owner, args.repo, args.labels);
      
      case 'get_enterprise_labels':
        if (args.autoPaginate) {
          return autoPaginate(
            (page, perPage) => this.labelsService.getEnterpriseLabels(args.enterprise, { page, perPage }),
            { page: args.page, perPage: args.perPage, autoPaginate: true, maxPages: args.maxPages }
          );
        }
        return await this.labelsService.getEnterpriseLabels(args.enterprise, {
          page: args.page,
          perPage: args.perPage
        });
      
      case 'get_labels_list':
        if (args.autoPaginate) {
          return autoPaginate(
            (page, perPage) => this.labelsService.getEnterpriseLabelsV8(args.enterprise, { page, perPage, search: args.search, direction: args.direction }),
            { page: args.page, perPage: args.perPage, autoPaginate: true, maxPages: args.maxPages }
          );
        }
        return await this.labelsService.getEnterpriseLabelsV8(args.enterprise, {
          search: args.search,
          direction: args.direction,
          page: args.page,
          perPage: args.perPage
        });

      case 'replace_repository_issue_all_labels':
        return await this.labelsService.replaceRepositoryIssueAllLabels(args.owner, args.repo, args.number ?? args.issueNumber, args.labels);

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}
