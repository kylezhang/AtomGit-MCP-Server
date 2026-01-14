import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { AtomGitService } from '../services/AtomGitService.js';

export class ReleaseTools {
  constructor(private atomGitService: AtomGitService) {}

  getTools(): Tool[] {
    return [
      {
        name: 'create_repository_release',
        description: '创建仓库Release',
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
            tagName: {
              type: 'string',
              description: '标签名称'
            },
            name: {
              type: 'string',
              description: '发布名称'
            },
            body: {
              type: 'string',
              description: '发布说明'
            },
            draft: {
              type: 'boolean',
              description: '是否为草稿'
            },
            prerelease: {
              type: 'boolean',
              description: '是否为预发布'
            }
          },
          required: ['owner', 'repo', 'tagName']
        }
      },
      {
        name: 'update_repository_release',
        description: '更新仓库Release',
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
            tagName: {
              type: 'string',
              description: '标签名称'
            },
            name: {
              type: 'string',
              description: '发布名称'
            },
            body: {
              type: 'string',
              description: '发布说明'
            },
            draft: {
              type: 'boolean',
              description: '是否为草稿'
            },
            prerelease: {
              type: 'boolean',
              description: '是否为预发布'
            }
          },
          required: ['owner', 'repo', 'tagName']
        }
      },
      {
        name: 'get_repository_releases',
        description: '获取仓库的所有Releases',
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
              type: 'number',
              description: '页码，默认为1',
              default: 1
            },
            perPage: {
              type: 'number',
              description: '每页结果数，默认为30',
              default: 30
            }
          },
          required: ['owner', 'repo']
        }
      },
      {
        name: 'get_repository_release',
        description: '获取仓库的单个Releases',
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
            tag: {
              type: 'string',
              description: '标签名称'
            }
          },
          required: ['owner', 'repo', 'tag']
        }
      },
      {
        name: 'get_latest_release',
        description: '获取仓库的最后更新的Release',
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
            }
          },
          required: ['owner', 'repo']
        }
      },
      {
        name: 'get_release_by_tag',
        description: '根据Tag名称获取仓库的Release',
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
            tag: {
              type: 'string',
              description: '标签名称'
            }
          },
          required: ['owner', 'repo', 'tag']
        }
      },
      {
        name: 'download_release_asset',
        description: '下载仓库release附件',
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
            fileName: {
              type: 'string',
              description: '文件名'
            }
          },
          required: ['owner', 'repo', 'fileName']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'create_repository_release':
        return await this.atomGitService.createRelease(args.owner, args.repo, {
          tag_name: args.tagName,
          name: args.name,
          body: args.body,
          draft: args.draft,
          prerelease: args.prerelease
        });
      
      case 'update_repository_release':
        return await this.atomGitService.updateRelease(args.owner, args.repo, args.tagName, {
          name: args.name,
          body: args.body,
          draft: args.draft,
          prerelease: args.prerelease
        });
      
      case 'get_repository_releases':
        return await this.atomGitService.getRepositoryReleases(args.owner, args.repo, args.page, args.perPage);
      
      case 'get_repository_release':
        return await this.atomGitService.getRepositoryRelease(args.owner, args.repo, args.tag);
      
      case 'get_latest_release':
        return await this.atomGitService.getLatestRelease(args.owner, args.repo);
      
      case 'get_release_by_tag':
        return await this.atomGitService.getRepositoryRelease(args.owner, args.repo, args.tag);
      
      case 'download_release_asset':
        return await this.atomGitService.uploadReleaseAsset(args.owner, args.repo, args.tag, args.assetData);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}