export class RepositoryTools {
    atomGitService;
    constructor(atomGitService) {
        this.atomGitService = atomGitService;
    }
    getTools() {
        return [
            {
                name: 'get_repository',
                description: 'Get detailed information about a specific repository',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: 'The owner of the repository (username or organization)'
                        },
                        repo: {
                            type: 'string',
                            description: 'The name of the repository'
                        }
                    },
                    required: ['owner', 'repo']
                }
            },
            {
                name: 'get_repository_tree',
                description: 'Get the directory tree structure of a repository',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: 'The owner of the repository'
                        },
                        repo: {
                            type: 'string',
                            description: 'The name of the repository'
                        },
                        sha: {
                            type: 'string',
                            description: 'The SHA or branch name (defaults to main)',
                            required: false
                        }
                    },
                    required: ['owner', 'repo']
                }
            },
            {
                name: 'search_repositories',
                description: 'Search for repositories on AtomGit',
                inputSchema: {
                    type: 'object',
                    properties: {
                        query: {
                            type: 'string',
                            description: 'Search query for repositories'
                        },
                        page: {
                            type: 'number',
                            description: 'Page number for pagination (default: 1)',
                            default: 1
                        },
                        perPage: {
                            type: 'number',
                            description: 'Number of results per page (default: 30)',
                            default: 30
                        }
                    },
                    required: ['query']
                }
            },
            {
                name: 'search_users',
                description: 'Search for users on AtomGit',
                inputSchema: {
                    type: 'object',
                    properties: {
                        query: {
                            type: 'string',
                            description: 'Search query for users'
                        },
                        page: {
                            type: 'number',
                            description: 'Page number for pagination (default: 1)',
                            default: 1
                        },
                        perPage: {
                            type: 'number',
                            description: 'Number of results per page (default: 30)',
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
            case 'get_repository':
                return await this.atomGitService.getRepository(args.owner, args.repo);
            case 'get_repository_tree':
                return await this.atomGitService.getRepositoryTree(args.owner, args.repo, args.sha);
            case 'search_repositories':
                return await this.atomGitService.searchRepositories(args.query, args.page, args.perPage);
            case 'search_users':
                return await this.atomGitService.searchUsers(args.query, args.page, args.perPage);
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
}
//# sourceMappingURL=RepositoryTools.js.map