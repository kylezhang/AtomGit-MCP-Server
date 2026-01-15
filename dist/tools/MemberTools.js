export class MemberTools {
    memberService;
    constructor(memberService) {
        this.memberService = memberService;
    }
    getTools() {
        return [
            {
                name: 'add_repository_collaborator',
                description: '添加项目成员或更新项目成员权限',
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
                        username: {
                            type: 'string',
                            description: '用户名'
                        },
                        permission: {
                            type: 'string',
                            description: '权限级别（read, write, admin）'
                        }
                    },
                    required: ['owner', 'repo', 'username', 'permission']
                }
            },
            {
                name: 'remove_repository_collaborator',
                description: '移除项目成员',
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
                        username: {
                            type: 'string',
                            description: '用户名'
                        }
                    },
                    required: ['owner', 'repo', 'username']
                }
            },
            {
                name: 'get_repository_collaborators',
                description: '获取仓库的所有成员',
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
                name: 'check_repository_collaborator',
                description: '判断用户是否为仓库成员',
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
                        username: {
                            type: 'string',
                            description: '用户名'
                        }
                    },
                    required: ['owner', 'repo', 'username']
                }
            },
            {
                name: 'get_repository_collaborator_permission',
                description: '查看仓库成员的权限',
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
                        username: {
                            type: 'string',
                            description: '用户名'
                        }
                    },
                    required: ['owner', 'repo', 'username']
                }
            },
            {
                name: 'get_self_collaborator_permission',
                description: '查看当前成员仓库的权限点',
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
            }
        ];
    }
    async callTool(name, args) {
        switch (name) {
            case 'add_repository_collaborator':
                return await this.memberService.addRepositoryCollaborator(args.owner, args.repo, args.username, {
                    permission: args.permission
                });
            case 'remove_repository_collaborator':
                return await this.memberService.removeRepositoryCollaborator(args.owner, args.repo, args.username);
            case 'get_repository_collaborators':
                return await this.memberService.getRepositoryCollaborators(args.owner, args.repo);
            case 'check_repository_collaborator':
                return await this.memberService.isRepositoryCollaborator(args.owner, args.repo, args.username);
            case 'get_repository_collaborator_permission':
                return await this.memberService.getRepositoryCollaboratorPermission(args.owner, args.repo, args.username);
            case 'get_self_collaborator_permission':
                return await this.memberService.getRepositoryCollaboratorSelfPermission(args.owner, args.repo);
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
}
//# sourceMappingURL=MemberTools.js.map