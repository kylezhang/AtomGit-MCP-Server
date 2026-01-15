export class BranchTools {
    branchService;
    constructor(branchService) {
        this.branchService = branchService;
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
            },
            {
                name: 'create_repository_branch',
                description: 'Create a new branch in a repository',
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
                        branch: {
                            type: 'string',
                            description: 'The name of the new branch'
                        },
                        sha: {
                            type: 'string',
                            description: 'The SHA of the commit to create the branch from (optional, defaults to main branch)'
                        }
                    },
                    required: ['owner', 'repo', 'branch']
                }
            },
            {
                name: 'delete_repository_branch',
                description: 'Delete a branch from a repository',
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
                        branch: {
                            type: 'string',
                            description: 'The name of the branch to delete'
                        }
                    },
                    required: ['owner', 'repo', 'branch']
                }
            },
            {
                name: 'get_repository_branch',
                description: 'Get a specific branch in a repository',
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
                        branch: {
                            type: 'string',
                            description: 'The name of the branch'
                        }
                    },
                    required: ['owner', 'repo', 'branch']
                }
            },
            {
                name: 'create_branch_protection_rule',
                description: 'Create a branch protection rule',
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
                        wildcard: {
                            type: 'string',
                            description: 'The branch name pattern (supports wildcards like "main", "feature/*")'
                        },
                        allow_force_push: {
                            type: 'boolean',
                            description: 'Allow force push to matching branches',
                            default: false
                        },
                        allow_deletion: {
                            type: 'boolean',
                            description: 'Allow deletion of matching branches',
                            default: false
                        },
                        required_status_checks: {
                            type: 'object',
                            description: 'Status check requirements',
                            properties: {
                                strict: {
                                    type: 'boolean',
                                    description: 'Require branches to be up to date before merging',
                                    default: false
                                },
                                contexts: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    description: 'Required status check contexts',
                                    default: []
                                }
                            }
                        },
                        required_pull_request_reviews: {
                            type: 'object',
                            description: 'Pull request review requirements',
                            properties: {
                                required_approving_review_count: {
                                    type: 'number',
                                    description: 'Number of approvals required',
                                    default: 1
                                },
                                dismiss_stale_reviews: {
                                    type: 'boolean',
                                    description: 'Dismiss stale pull request approvals when new commits are pushed',
                                    default: false
                                },
                                require_code_owner_reviews: {
                                    type: 'boolean',
                                    description: 'Require review from code owners',
                                    default: false
                                }
                            }
                        },
                        restrictions: {
                            type: 'object',
                            description: 'Branch restrictions',
                            properties: {
                                users: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    description: 'Users allowed to push to matching branches',
                                    default: []
                                },
                                teams: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    description: 'Teams allowed to push to matching branches',
                                    default: []
                                }
                            }
                        }
                    },
                    required: ['owner', 'repo', 'wildcard']
                }
            },
            {
                name: 'delete_branch_protection_rule',
                description: 'Delete a branch protection rule',
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
                        wildcard: {
                            type: 'string',
                            description: 'The branch name pattern to delete protection for'
                        }
                    },
                    required: ['owner', 'repo', 'wildcard']
                }
            },
            {
                name: 'get_branch_protection_rules',
                description: 'Get all branch protection rules in a repository',
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
                        }
                    },
                    required: ['owner', 'repo']
                }
            },
            {
                name: 'update_branch_protection_rule',
                description: 'Update a branch protection rule',
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
                        wildcard: {
                            type: 'string',
                            description: 'The branch name pattern to update'
                        },
                        allow_force_push: {
                            type: 'boolean',
                            description: 'Allow force push to matching branches'
                        },
                        allow_deletion: {
                            type: 'boolean',
                            description: 'Allow deletion of matching branches'
                        },
                        required_status_checks: {
                            type: 'object',
                            description: 'Status check requirements',
                            properties: {
                                strict: {
                                    type: 'boolean',
                                    description: 'Require branches to be up to date before merging'
                                },
                                contexts: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    description: 'Required status check contexts'
                                }
                            }
                        },
                        required_pull_request_reviews: {
                            type: 'object',
                            description: 'Pull request review requirements',
                            properties: {
                                required_approving_review_count: {
                                    type: 'number',
                                    description: 'Number of approvals required'
                                },
                                dismiss_stale_reviews: {
                                    type: 'boolean',
                                    description: 'Dismiss stale pull request approvals when new commits are pushed'
                                },
                                require_code_owner_reviews: {
                                    type: 'boolean',
                                    description: 'Require review from code owners'
                                }
                            }
                        },
                        restrictions: {
                            type: 'object',
                            description: 'Branch restrictions',
                            properties: {
                                users: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    description: 'Users allowed to push to matching branches'
                                },
                                teams: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    description: 'Teams allowed to push to matching branches'
                                }
                            }
                        }
                    },
                    required: ['owner', 'repo', 'wildcard']
                }
            }
        ];
    }
    async callTool(name, args) {
        switch (name) {
            case 'get_repository_branches':
                return await this.branchService.getRepositoryBranches(args.owner, args.repo);
            case 'create_repository_branch':
                return await this.branchService.createRepositoryBranch(args.owner, args.repo, args.branch, args.sha);
            case 'delete_repository_branch':
                return await this.branchService.deleteRepositoryBranch(args.owner, args.repo, args.branch);
            case 'get_repository_branch':
                return await this.branchService.getRepositoryBranch(args.owner, args.repo, args.branch);
            case 'create_branch_protection_rule':
                return await this.branchService.createBranchProtectionRule(args.owner, args.repo, {
                    wildcard: args.wildcard,
                    allow_force_push: args.allow_force_push,
                    allow_deletion: args.allow_deletion,
                    required_status_checks: args.required_status_checks,
                    required_pull_request_reviews: args.required_pull_request_reviews,
                    restrictions: args.restrictions
                });
            case 'delete_branch_protection_rule':
                return await this.branchService.deleteBranchProtectionRule(args.owner, args.repo, args.wildcard);
            case 'get_branch_protection_rules':
                return await this.branchService.getBranchProtectionRules(args.owner, args.repo);
            case 'update_branch_protection_rule':
                return await this.branchService.updateBranchProtectionRule(args.owner, args.repo, args.wildcard, {
                    allow_force_push: args.allow_force_push,
                    allow_deletion: args.allow_deletion,
                    required_status_checks: args.required_status_checks,
                    required_pull_request_reviews: args.required_pull_request_reviews,
                    restrictions: args.restrictions
                });
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
}
//# sourceMappingURL=BranchTools.js.map