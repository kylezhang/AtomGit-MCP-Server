export class RepositoryManagementTools {
    atomGitService;
    constructor(atomGitService) {
        this.atomGitService = atomGitService;
    }
    getTools() {
        return [
            {
                name: 'create_repository',
                description: 'Create a new repository under the authenticated user',
                inputSchema: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'The name of the repository'
                        },
                        description: {
                            type: 'string',
                            description: 'A short description of the repository'
                        },
                        private: {
                            type: 'boolean',
                            description: 'Whether the repository should be private',
                            default: false
                        },
                        auto_init: {
                            type: 'boolean',
                            description: 'Whether to initialize the repository with a README',
                            default: true
                        },
                        readme: {
                            type: 'string',
                            description: 'README content (if auto_init is true)'
                        },
                        default_branch: {
                            type: 'string',
                            description: 'Default branch name',
                            default: 'main'
                        }
                    },
                    required: ['name']
                }
            }
        ];
    }
    async callTool(name, args) {
        switch (name) {
            case 'create_repository':
                const repoData = {
                    name: args.name,
                    description: args.description,
                    private: args.private,
                    auto_init: args.auto_init !== undefined ? args.auto_init : true,
                    readme: args.readme,
                    default_branch: args.default_branch || 'main'
                };
                return await this.atomGitService.createRepository(repoData);
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
}
//# sourceMappingURL=RepositoryManagementTools.js.map