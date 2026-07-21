import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ReleaseService } from '../services/ReleaseService.js';
import { autoPaginate, autoPaginateSchemaProperties } from '../core/PaginationHelper.js';

export class ReleaseTools {
  constructor(private releaseService: ReleaseService) {}

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
            tag: {
              type: 'string',
              description: '标签名称'
            },
            tag_name: {
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
            },
            target_commitish: {
              type: 'string',
              description: '目标提交 SHA 或分支'
            },
            release_status: {
              type: 'string',
              description: 'Release状态。pre（预发布版本），latest（最新版本）'
            }
          },
          required: ['owner', 'repo', 'tag_name', 'name', 'body']
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
            tag: {
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
            },
            release_status: {
              type: 'string',
              description: 'Release状态。pre（预发布版本），latest（最新版本）'
            }
          },
          required: ['owner', 'repo', 'tag', 'name', 'body']
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
            },
            direction: {
              type: 'string',
              description: '排序方向'
            },
            ...autoPaginateSchemaProperties,
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
            },
            temp_download_url: {
              type: 'string',
              description: '是否返回临时下载地址'
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
            },
            type: {
              type: 'string',
              description: '类型。updated（最后更新的），latest（最新的）'
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
            tag: {
              type: 'string',
              description: 'Release 标签名'
            },
            file_name: {
              type: 'string',
              description: '文件名'
            }
          },
          required: ['owner', 'repo', 'tag', 'file_name']
        }
      },
      {
        name: 'get_release_upload_url',
        description: 'Get release asset upload URL',
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
            tag: {
              type: 'string',
              description: 'The tag name'
            },
            file_name: {
              type: 'string',
              description: 'The file name'
            }
          },
          required: ['owner', 'repo', 'tag', 'file_name']
        }
      },
      {
        name: 'delete_release_attachment',
        description: '删除Release附件',
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
              description: 'Release 标签名'
            },
            attach_file_id: {
              type: 'string',
              description: '附件ID'
            }
          },
          required: ['owner', 'repo', 'tag', 'attach_file_id']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'create_repository_release':
        return await this.releaseService.createRelease(args.owner, args.repo, {
          tag_name: args.tag_name ?? args.tag ?? args.tagName,
          target_commitish: args.target_commitish ?? args.targetCommitish,
          name: args.name,
          body: args.body,
          draft: args.draft,
          prerelease: args.prerelease,
          release_status: args.release_status ?? args.releaseStatus
        });
      
      case 'update_repository_release':
        return await this.releaseService.updateRelease(args.owner, args.repo, args.tag ?? args.tagName, {
          name: args.name,
          body: args.body,
          draft: args.draft,
          prerelease: args.prerelease,
          release_status: args.release_status ?? args.releaseStatus
        });
      
      case 'get_repository_releases':
        if (args.autoPaginate) {
          return autoPaginate(
            (page, perPage) => this.releaseService.getReleases(args.owner, args.repo, page, perPage, args.direction),
            { page: args.page, perPage: args.perPage, autoPaginate: true, maxPages: args.maxPages }
          );
        }
        return await this.releaseService.getReleases(args.owner, args.repo, args.page, args.perPage, args.direction);
      
      case 'get_repository_release':
        return await this.releaseService.getRelease(args.owner, args.repo, args.tag, args.temp_download_url ?? args.tempDownloadUrl);
      
      case 'get_latest_release':
        return await this.releaseService.getLatestRelease(args.owner, args.repo, args.type);
      
      case 'get_release_by_tag':
        return await this.releaseService.getReleaseByTag(args.owner, args.repo, args.tag);
      
      case 'download_release_asset':
        return await this.releaseService.downloadReleaseAsset(
          args.owner,
          args.repo,
          args.tag,
          args.file_name ?? args.fileName,
        );

      case 'get_release_upload_url':
        return await this.releaseService.getReleaseUploadUrl(args.owner, args.repo, args.tag, args.file_name ?? args.fileName);

      case 'delete_release_attachment':
        return await this.releaseService.deleteReleaseAttachment(
          args.owner,
          args.repo,
          args.tag,
          args.attach_file_id ?? args.attachFileId
        );

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}
