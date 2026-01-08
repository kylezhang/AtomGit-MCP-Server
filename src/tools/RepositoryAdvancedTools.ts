import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { AtomGitService } from '../services/AtomGitService.js';

export class RepositoryAdvancedTools {
  private atomGitService: AtomGitService;

  constructor(atomGitService: AtomGitService) {
    this.atomGitService = atomGitService;
  }

  getTools(): Tool[] {
    return [
      {
        name: 'get_repository_languages',
        description: '获取仓库使用的编程语言统计',
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
            }
          },
          required: ['owner', 'repo']
        }
      },
      {
        name: 'get_repository_contributors',
        description: '获取仓库贡献者列表',
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
            }
          },
          required: ['owner', 'repo']
        }
      },
      {
        name: 'get_repository_contributors_statistic',
        description: '获取仓库贡献者统计信息',
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
            }
          },
          required: ['owner', 'repo']
        }
      },
      {
        name: 'get_repository_download_statistics',
        description: '获取仓库下载次数统计',
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
            }
          },
          required: ['owner', 'repo']
        }
      },
      {
        name: 'get_repository_events',
        description: '获取仓库动态事件',
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
            }
          },
          required: ['owner', 'repo']
        }
      },
      {
        name: 'get_repository_raw_file',
        description: '获取仓库原始文件内容',
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
            path: {
              type: 'string',
              description: '文件路径'
            }
          },
          required: ['owner', 'repo', 'path']
        }
      },
      {
        name: 'get_repository_subscribers',
        description: '获取订阅仓库的用户列表',
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
            }
          },
          required: ['owner', 'repo']
        }
      },
      {
        name: 'get_repository_stargazers',
        description: '获取Star仓库的用户列表',
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
            }
          },
          required: ['owner', 'repo']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'get_repository_languages':
        return await this.atomGitService.getRepositoryLanguages(args.owner, args.repo);
      
      case 'get_repository_contributors':
        return await this.atomGitService.getRepositoryContributors(args.owner, args.repo);
      
      case 'get_repository_contributors_statistic':
        return await this.atomGitService.getRepositoryContributorsStatistic(args.owner, args.repo);
      
      case 'get_repository_download_statistics':
        return await this.atomGitService.getRepositoryDownloadStatistics(args.owner, args.repo);
      
      case 'get_repository_events':
        return await this.atomGitService.getRepositoryEvents(args.owner, args.repo);
      
      case 'get_repository_raw_file':
        return await this.atomGitService.getRepositoryRawFile(args.owner, args.repo, args.path);
      
      case 'get_repository_subscribers':
        return await this.atomGitService.getRepositorySubscribers(args.owner, args.repo);
      
      case 'get_repository_stargazers':
        return await this.atomGitService.getRepositoryStargazers(args.owner, args.repo);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}