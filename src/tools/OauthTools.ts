import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { AtomGitService } from '../services/AtomGitService.js';

export class OauthTools {
  constructor(private atomGitService: AtomGitService) {}

  getTools(): Tool[] {
    return [
      {
        name: 'get_oauth_token',
        description: '获取或刷新授权 Token 接口',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: '授权码'
            },
            clientId: {
              type: 'string',
              description: '客户端ID'
            },
            clientSecret: {
              type: 'string',
              description: '客户端密钥'
            }
          },
          required: ['code', 'clientId', 'clientSecret']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'get_oauth_token':
        return await this.atomGitService.getOauthToken(
          args.code,
          args.clientId,
          args.clientSecret
        );
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}