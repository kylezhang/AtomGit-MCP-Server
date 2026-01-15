export class MilestoneTools {
    milestoneService;
    constructor(milestoneService) {
        this.milestoneService = milestoneService;
    }
    getTools() {
        return [
            {
                name: 'get_repository_milestones',
                description: '获取仓库所有里程碑',
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
                        state: {
                            type: 'string',
                            description: '状态（open, closed, all）',
                            enum: ['open', 'closed', 'all'],
                            default: 'open'
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
                name: 'create_repository_milestone',
                description: '创建仓库里程碑',
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
                        title: {
                            type: 'string',
                            description: '里程碑标题'
                        },
                        description: {
                            type: 'string',
                            description: '里程碑描述'
                        },
                        state: {
                            type: 'string',
                            description: '状态（open, closed）',
                            enum: ['open', 'closed'],
                            default: 'open'
                        },
                        dueOn: {
                            type: 'string',
                            description: '截止日期'
                        }
                    },
                    required: ['owner', 'repo', 'title']
                }
            },
            {
                name: 'get_repository_milestone',
                description: '获取仓库单个里程碑',
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
                        number: {
                            type: 'number',
                            description: '里程碑编号'
                        }
                    },
                    required: ['owner', 'repo', 'number']
                }
            },
            {
                name: 'delete_repository_milestone',
                description: '删除仓库单个里程碑',
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
                            description: '仓库所有者'
                        },
                        repo: {
                            type: 'string',
                            description: '仓库名称'
                        },
                        number: {
                            type: 'number',
                            description: '里程碑编号'
                        },
                        title: {
                            type: 'string',
                            description: '里程碑标题'
                        },
                        description: {
                            type: 'string',
                            description: '里程碑描述'
                        },
                        state: {
                            type: 'string',
                            description: '状态（open, closed）',
                            enum: ['open', 'closed']
                        },
                        dueOn: {
                            type: 'string',
                            description: '截止日期'
                        }
                    },
                    required: ['owner', 'repo', 'number']
                }
            }
        ];
    }
    async callTool(name, args) {
        switch (name) {
            case 'get_repository_milestones':
                return await this.milestoneService.getRepositoryMilestones(args.owner, args.repo, args.state, args.page, args.perPage);
            case 'create_repository_milestone':
                return await this.milestoneService.createRepositoryMilestone(args.owner, args.repo, {
                    title: args.title,
                    description: args.description,
                    state: args.state,
                    due_on: args.dueOn
                });
            case 'get_repository_milestone':
                return await this.milestoneService.getRepositoryMilestone(args.owner, args.repo, args.number);
            case 'delete_repository_milestone':
                return await this.milestoneService.deleteRepositoryMilestone(args.owner, args.repo, args.number);
            case 'update_repository_milestone':
                return await this.milestoneService.updateRepositoryMilestone(args.owner, args.repo, args.number, {
                    title: args.title,
                    description: args.description,
                    state: args.state,
                    due_on: args.dueOn
                });
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
}
//# sourceMappingURL=MilestoneTools.js.map