export class OauthTools {
    oauthService;
    constructor(oauthService) {
        this.oauthService = oauthService;
    }
    getTools() {
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
    async callTool(name, args) {
        switch (name) {
            case 'get_oauth_token':
                return await this.oauthService.getOauthToken(args.code, args.clientId, args.clientSecret);
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
}
//# sourceMappingURL=OauthTools.js.map