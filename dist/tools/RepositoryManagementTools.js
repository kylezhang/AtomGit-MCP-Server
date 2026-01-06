export class RepositoryManagementTools {
    atomGitService;
    constructor(atomGitService) {
        this.atomGitService = atomGitService;
    }
    getTools() {
        return [
            {
                name: 'create_repository',
                description: 'Create a new repository',
                inputSchema: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'The name of the repository'
                        },
                        description: {
                            type: 'string',
                            description: 'The description of the repository (optional)'
                        },
                        private: {
                            type: 'boolean',
                            description: 'Whether the repository should be private (default: false)'
                        },
                        autoInit: {
                            type: 'boolean',
                            description: 'Whether to initialize with README (default: false)'
                        },
                        gitignoreTemplate: {
                            type: 'string',
                            description: 'Gitignore template to use (optional)'
                        },
                        licenseTemplate: {
                            type: 'string',
                            description: 'License template to use (optional)'
                        },
                        readme: {
                            type: 'string',
                            description: 'README content (optional)'
                        },
                        defaultBranch: {
                            type: 'string',
                            description: 'Default branch name (optional)'
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
                    auto_init: args.autoInit,
                    gitignore_template: args.gitignoreTemplate,
                    license_template: args.licenseTemplate,
                    readme: args.readme,
                    default_branch: args.defaultBranch
                };
                return await this.atomGitService.createRepository(repoData);
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
}
//# sourceMappingURL=RepositoryManagementTools.js.map