export class WebhooksTools {
    atomGitService;
    constructor(atomGitService) {
        this.atomGitService = atomGitService;
    }
    getTools() {
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
                        webhookData: {
                            type: 'object',
                            description: 'Webhook配置数据（包含name、url、events、active等）'
                        }
                    },
                    required: ['owner', 'repo', 'webhookData']
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
                            type: 'number',
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
                            type: 'number',
                            description: 'Webhook ID'
                        },
                        webhookData: {
                            type: 'object',
                            description: '更新的Webhook配置数据'
                        }
                    },
                    required: ['owner', 'repo', 'id', 'webhookData']
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
                            type: 'number',
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
                            type: 'number',
                            description: 'Webhook ID'
                        }
                    },
                    required: ['owner', 'repo', 'id']
                }
            }
        ];
    }
    async callTool(name, args) {
        switch (name) {
            case 'get_repository_webhooks':
                return await this.atomGitService.getRepositoryWebhooks(args.owner, args.repo);
            case 'create_repository_webhook':
                return await this.atomGitService.createRepositoryWebhook(args.owner, args.repo, args.webhookData);
            case 'get_repository_webhook':
                return await this.atomGitService.getRepositoryWebhook(args.owner, args.repo, args.id);
            case 'update_repository_webhook':
                return await this.atomGitService.updateRepositoryWebhook(args.owner, args.repo, args.id, args.webhookData);
            case 'delete_repository_webhook':
                return await this.atomGitService.deleteRepositoryWebhook(args.owner, args.repo, args.id);
            case 'test_repository_webhook':
                return await this.atomGitService.testRepositoryWebhook(args.owner, args.repo, args.id);
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
}
//# sourceMappingURL=WebhooksTools.js.map