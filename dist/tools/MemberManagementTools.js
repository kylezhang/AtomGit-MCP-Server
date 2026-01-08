export class MemberManagementTools {
    atomGitService;
    constructor(atomGitService) {
        this.atomGitService = atomGitService;
    }
    getTools() {
        return [
            {
                name: 'get_repository_collaborators',
                description: '获取仓库协作者列表',
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
                name: 'add_repository_collaborator',
                description: '添加仓库协作者',
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
                        username: {
                            type: 'string',
                            description: '要添加的用户名'
                        },
                        collaboratorData: {
                            type: 'object',
                            description: '协作者权限配置（包含permission等）'
                        }
                    },
                    required: ['owner', 'repo', 'username', 'collaboratorData']
                }
            },
            {
                name: 'remove_repository_collaborator',
                description: '移除仓库协作者',
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
                        username: {
                            type: 'string',
                            description: '要移除的用户名'
                        }
                    },
                    required: ['owner', 'repo', 'username']
                }
            },
            {
                name: 'get_repository_collaborator',
                description: '获取特定协作者信息',
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
                        username: {
                            type: 'string',
                            description: '协作者用户名'
                        }
                    },
                    required: ['owner', 'repo', 'username']
                }
            }
        ];
    }
    async callTool(name, args) {
        switch (name) {
            case 'get_repository_collaborators':
                return await this.atomGitService.getRepositoryCollaborators(args.owner, args.repo);
            case 'add_repository_collaborator':
                return await this.atomGitService.addRepositoryCollaborator(args.owner, args.repo, args.username, args.collaboratorData);
            case 'remove_repository_collaborator':
                return await this.atomGitService.removeRepositoryCollaborator(args.owner, args.repo, args.username);
            case 'get_repository_collaborator':
                return await this.atomGitService.getRepositoryCollaborator(args.owner, args.repo, args.username);
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
}
//# sourceMappingURL=MemberManagementTools.js.map