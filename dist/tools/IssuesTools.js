export class IssuesTools {
    atomGitService;
    constructor(atomGitService) {
        this.atomGitService = atomGitService;
    }
    getTools() {
        return [
            {
                name: 'get_repository_issues',
                description: 'Get all issues in a repository',
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
                        state: {
                            type: 'string',
                            description: 'State of issues to return (open, closed, all)',
                            enum: ['open', 'closed', 'all'],
                            default: 'open'
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
                    required: ['owner', 'repo']
                }
            },
            {
                name: 'create_repository_issue',
                description: 'Create an issue in a repository',
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
                        title: {
                            type: 'string',
                            description: 'The title of the issue'
                        },
                        body: {
                            type: 'string',
                            description: 'The body content of the issue'
                        },
                        assignees: {
                            type: 'array',
                            description: 'Array of usernames to assign',
                            items: {
                                type: 'string'
                            }
                        },
                        milestone: {
                            type: 'number',
                            description: 'Milestone number to associate with the issue'
                        },
                        labels: {
                            type: 'array',
                            description: 'Array of label names to add',
                            items: {
                                type: 'string'
                            }
                        }
                    },
                    required: ['owner', 'repo', 'title']
                }
            },
            {
                name: 'get_repository_issue',
                description: 'Get a specific issue in a repository',
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
                        issueNumber: {
                            type: 'number',
                            description: 'The number of the issue'
                        }
                    },
                    required: ['owner', 'repo', 'issueNumber']
                }
            }
        ];
    }
    async callTool(name, args) {
        switch (name) {
            case 'get_repository_issues':
                return await this.atomGitService.getRepositoryIssues(args.owner, args.repo, args.state, args.page, args.perPage);
            case 'create_repository_issue':
                const issueData = {
                    title: args.title,
                    body: args.body,
                    assignees: args.assignees,
                    milestone: args.milestone,
                    labels: args.labels
                };
                return await this.atomGitService.createRepositoryIssue(args.owner, args.repo, issueData);
            case 'get_repository_issue':
                return await this.atomGitService.getRepositoryIssue(args.owner, args.repo, args.issueNumber);
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
}
//# sourceMappingURL=IssuesTools.js.map