export class BranchTools {
    atomGitService;
    constructor(atomGitService) {
        this.atomGitService = atomGitService;
    }
    getTools() {
        return [
            {
                name: 'get_repository_branches',
                description: 'Get all branches in a repository',
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
            }
        ];
    }
    async callTool(name, args) {
        switch (name) {
            case 'get_repository_branches':
                return await this.atomGitService.getRepositoryBranches(args.owner, args.repo);
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
}
//# sourceMappingURL=BranchTools.js.map