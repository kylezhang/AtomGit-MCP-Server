export class UserTools {
    atomGitService;
    constructor(atomGitService) {
        this.atomGitService = atomGitService;
    }
    getTools() {
        return [
            {
                name: 'get_current_user',
                description: 'Get the current authenticated user information',
                inputSchema: {
                    type: 'object',
                    properties: {},
                }
            },
            {
                name: 'get_user',
                description: 'Get information about a specific user',
                inputSchema: {
                    type: 'object',
                    properties: {
                        username: {
                            type: 'string',
                            description: 'The username of the user'
                        }
                    },
                    required: ['username']
                }
            },
            {
                name: 'get_user_repos',
                description: 'Get all repositories for a specific user',
                inputSchema: {
                    type: 'object',
                    properties: {
                        username: {
                            type: 'string',
                            description: 'The username of the user'
                        }
                    },
                    required: ['username']
                }
            },
            {
                name: 'get_current_user_repos',
                description: 'Get all repositories for the current authenticated user',
                inputSchema: {
                    type: 'object',
                    properties: {},
                }
            },
            {
                name: 'get_user_starred_repos',
                description: 'Get all starred repositories for a specific user',
                inputSchema: {
                    type: 'object',
                    properties: {
                        username: {
                            type: 'string',
                            description: 'The username of the user'
                        }
                    },
                    required: ['username']
                }
            },
            {
                name: 'get_current_user_starred_repos',
                description: 'Get all starred repositories for the current authenticated user',
                inputSchema: {
                    type: 'object',
                    properties: {},
                }
            },
            {
                name: 'search_users',
                description: 'Search for users by query',
                inputSchema: {
                    type: 'object',
                    properties: {
                        query: {
                            type: 'string',
                            description: 'Search query'
                        },
                        page: {
                            type: 'number',
                            description: 'Page number for pagination',
                            default: 1
                        },
                        perPage: {
                            type: 'number',
                            description: 'Number of results per page',
                            default: 30
                        }
                    },
                    required: ['query']
                }
            }
        ];
    }
    async callTool(name, args) {
        switch (name) {
            case 'get_current_user':
                return await this.atomGitService.getCurrentUser();
            case 'get_user':
                return await this.atomGitService.getUser(args.username);
            case 'get_user_repos':
                return await this.atomGitService.getUserRepos(args.username);
            case 'get_current_user_repos':
                return await this.atomGitService.getCurrentUserRepos();
            case 'get_user_starred_repos':
                return await this.atomGitService.getUserStarredRepos(args.username);
            case 'get_current_user_starred_repos':
                return await this.atomGitService.getCurrentUserStarredRepos();
            case 'search_users':
                return await this.atomGitService.searchUsers(args.query, args.page, args.perPage);
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
}
//# sourceMappingURL=UserTools.js.map