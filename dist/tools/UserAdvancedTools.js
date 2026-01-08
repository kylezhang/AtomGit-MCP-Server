export class UserAdvancedTools {
    atomGitService;
    constructor(atomGitService) {
        this.atomGitService = atomGitService;
    }
    getTools() {
        return [
            {
                name: 'get_user_followers',
                description: '获取用户关注者列表',
                inputSchema: {
                    type: 'object',
                    properties: {
                        username: {
                            type: 'string',
                            description: '用户名'
                        }
                    },
                    required: ['username']
                }
            },
            {
                name: 'get_user_following',
                description: '获取用户正在关注的人列表',
                inputSchema: {
                    type: 'object',
                    properties: {
                        username: {
                            type: 'string',
                            description: '用户名'
                        }
                    },
                    required: ['username']
                }
            },
            {
                name: 'follow_user',
                description: '关注用户',
                inputSchema: {
                    type: 'object',
                    properties: {
                        username: {
                            type: 'string',
                            description: '要关注的用户名'
                        }
                    },
                    required: ['username']
                }
            },
            {
                name: 'unfollow_user',
                description: '取消关注用户',
                inputSchema: {
                    type: 'object',
                    properties: {
                        username: {
                            type: 'string',
                            description: '要取消关注的用户名'
                        }
                    },
                    required: ['username']
                }
            },
            {
                name: 'get_current_user_followers',
                description: '获取当前用户的关注者列表',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            },
            {
                name: 'get_current_user_following',
                description: '获取当前用户正在关注的人列表',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            },
            {
                name: 'get_user_organizations',
                description: '获取用户的组织列表',
                inputSchema: {
                    type: 'object',
                    properties: {
                        username: {
                            type: 'string',
                            description: '用户名'
                        }
                    },
                    required: ['username']
                }
            },
            {
                name: 'get_current_user_organizations',
                description: '获取当前用户的组织列表',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            }
        ];
    }
    async callTool(name, args) {
        switch (name) {
            case 'get_user_followers':
                return await this.atomGitService.getUserFollowers(args.username);
            case 'get_user_following':
                return await this.atomGitService.getUserFollowing(args.username);
            case 'follow_user':
                return await this.atomGitService.followUser(args.username);
            case 'unfollow_user':
                return await this.atomGitService.unfollowUser(args.username);
            case 'get_current_user_followers':
                return await this.atomGitService.getCurrentUserFollowers();
            case 'get_current_user_following':
                return await this.atomGitService.getCurrentUserFollowing();
            case 'get_user_organizations':
                return await this.atomGitService.getUserOrganizations(args.username);
            case 'get_current_user_organizations':
                return await this.atomGitService.getCurrentUserOrganizations();
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
}
//# sourceMappingURL=UserAdvancedTools.js.map