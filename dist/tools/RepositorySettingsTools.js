export class RepositorySettingsTools {
    atomGitService;
    constructor(atomGitService) {
        this.atomGitService = atomGitService;
    }
    getTools() {
        return [
            {
                name: 'get_repository_settings',
                description: '获取仓库设置信息',
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
                name: 'update_repository_settings',
                description: '更新仓库设置',
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
                        settings: {
                            type: 'object',
                            description: '仓库设置信息'
                        }
                    },
                    required: ['owner', 'repo', 'settings']
                }
            },
            {
                name: 'get_repository_pull_request_settings',
                description: '获取仓库Pull Request设置',
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
                name: 'update_repository_pull_request_settings',
                description: '更新仓库Pull Request设置',
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
                        settings: {
                            type: 'object',
                            description: 'PR设置信息'
                        }
                    },
                    required: ['owner', 'repo', 'settings']
                }
            },
            {
                name: 'get_repository_push_config',
                description: '获取仓库推送规则配置',
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
                name: 'set_repository_push_config',
                description: '设置仓库推送规则',
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
                        config: {
                            type: 'object',
                            description: '推送规则配置'
                        }
                    },
                    required: ['owner', 'repo', 'config']
                }
            }
        ];
    }
    async callTool(name, args) {
        switch (name) {
            case 'get_repository_settings':
                return await this.atomGitService.getRepositorySettings(args.owner, args.repo);
            case 'update_repository_settings':
                return await this.atomGitService.updateRepositorySettings(args.owner, args.repo, args.settings);
            case 'get_repository_pull_request_settings':
                return await this.atomGitService.getRepositoryPullRequestSettings(args.owner, args.repo);
            case 'update_repository_pull_request_settings':
                return await this.atomGitService.updateRepositoryPullRequestSettings(args.owner, args.repo, args.settings);
            case 'get_repository_push_config':
                return await this.atomGitService.getRepositoryPushConfig(args.owner, args.repo);
            case 'set_repository_push_config':
                return await this.atomGitService.setRepositoryPushConfig(args.owner, args.repo, args.config);
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
}
//# sourceMappingURL=RepositorySettingsTools.js.map