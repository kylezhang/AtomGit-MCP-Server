import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ClaService } from '../services/ClaService.js';
import { repoPathProperties } from '../schemas/common.js';

export class ClaTools {
  private claService: ClaService;

  constructor(claService: ClaService) {
    this.claService = claService;
  }

  getTools(): Tool[] {
    return [
      {
        name: 'get_repository_clas',
        description: '获取仓库已配置的 CLA（贡献者许可协议）列表',
        inputSchema: {
          type: 'object',
          properties: {
            ...repoPathProperties
          },
          required: ['owner', 'repo']
        }
      },
      {
        name: 'configure_repository_cla',
        description: '为仓库配置 CLA 协议。传入 cla_id 设置指定协议；不传或传空则清空仓库的 CLA 配置。cla_id 需由用户提供（来自 AtomGit CLA 协议目录，当前目录接口未开放）。',
        inputSchema: {
          type: 'object',
          properties: {
            ...repoPathProperties,
            claId: {
              type: 'string',
              description: 'CLA 协议 ID；留空则清空仓库当前 CLA 配置'
            }
          },
          required: ['owner', 'repo']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'get_repository_clas': {
        const result = await this.claService.getRepositoryClas(args.owner, args.repo);
        return result?.data ?? [];
      }
      case 'configure_repository_cla':
        return await this.claService.configureRepositoryCla(args.owner, args.repo, args.claId);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}
