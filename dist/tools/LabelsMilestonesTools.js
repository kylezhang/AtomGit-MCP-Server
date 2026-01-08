export class LabelsMilestonesTools {
    atomGitService;
    constructor(atomGitService) {
        this.atomGitService = atomGitService;
    }
    getTools() {
        return [
            {
                name: 'get_repository_labels',
                description: '获取仓库标签列表',
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
                name: 'create_repository_label',
                description: '创建仓库标签',
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
                        labelData: {
                            type: 'object',
                            description: '标签数据（包含name、color、description等）'
                        }
                    },
                    required: ['owner', 'repo', 'labelData']
                }
            },
            {
                name: 'update_repository_label',
                description: '更新仓库标签',
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
                        name: {
                            type: 'string',
                            description: '原标签名称'
                        },
                        labelData: {
                            type: 'object',
                            description: '更新的标签数据'
                        }
                    },
                    required: ['owner', 'repo', 'name', 'labelData']
                }
            },
            {
                name: 'delete_repository_label',
                description: '删除仓库标签',
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
                        name: {
                            type: 'string',
                            description: '要删除的标签名称'
                        }
                    },
                    required: ['owner', 'repo', 'name']
                }
            },
            {
                name: 'get_repository_milestones',
                description: '获取仓库里程碑列表',
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
                        state: {
                            type: 'string',
                            enum: ['open', 'closed', 'all'],
                            description: '里程碑状态',
                            default: 'open'
                        },
                        page: {
                            type: 'number',
                            description: '页码',
                            default: 1
                        },
                        perPage: {
                            type: 'number',
                            description: '每页数量',
                            default: 30
                        }
                    },
                    required: ['owner', 'repo']
                }
            },
            {
                name: 'create_repository_milestone',
                description: '创建仓库里程碑',
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
                        milestoneData: {
                            type: 'object',
                            description: '里程碑数据（包含title、description、due_on等）'
                        }
                    },
                    required: ['owner', 'repo', 'milestoneData']
                }
            },
            {
                name: 'get_repository_milestone',
                description: '获取特定里程碑详情',
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
                        number: {
                            type: 'number',
                            description: '里程碑编号'
                        }
                    },
                    required: ['owner', 'repo', 'number']
                }
            },
            {
                name: 'update_repository_milestone',
                description: '更新仓库里程碑',
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
                        number: {
                            type: 'number',
                            description: '里程碑编号'
                        },
                        milestoneData: {
                            type: 'object',
                            description: '更新的里程碑数据'
                        }
                    },
                    required: ['owner', 'repo', 'number', 'milestoneData']
                }
            },
            {
                name: 'delete_repository_milestone',
                description: '删除仓库里程碑',
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
                        number: {
                            type: 'number',
                            description: '里程碑编号'
                        }
                    },
                    required: ['owner', 'repo', 'number']
                }
            }
        ];
    }
    async callTool(name, args) {
        switch (name) {
            case 'get_repository_labels':
                return await this.atomGitService.getRepositoryLabels(args.owner, args.repo);
            case 'create_repository_label':
                return await this.atomGitService.createRepositoryLabel(args.owner, args.repo, args.labelData);
            case 'update_repository_label':
                return await this.atomGitService.updateRepositoryLabel(args.owner, args.repo, args.name, args.labelData);
            case 'delete_repository_label':
                return await this.atomGitService.deleteRepositoryLabel(args.owner, args.repo, args.name);
            case 'get_repository_milestones':
                return await this.atomGitService.getRepositoryMilestones(args.owner, args.repo, args.state, args.page, args.perPage);
            case 'create_repository_milestone':
                return await this.atomGitService.createRepositoryMilestone(args.owner, args.repo, args.milestoneData);
            case 'get_repository_milestone':
                return await this.atomGitService.getRepositoryMilestone(args.owner, args.repo, args.number);
            case 'update_repository_milestone':
                return await this.atomGitService.updateRepositoryMilestone(args.owner, args.repo, args.number, args.milestoneData);
            case 'delete_repository_milestone':
                return await this.atomGitService.deleteRepositoryMilestone(args.owner, args.repo, args.number);
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
}
//# sourceMappingURL=LabelsMilestonesTools.js.map