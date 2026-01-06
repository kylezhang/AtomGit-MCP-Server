export class PullRequestTools {
    atomGitService;
    constructor(atomGitService) {
        this.atomGitService = atomGitService;
    }
    getTools() {
        return [
            {
                name: 'get_repository_pulls',
                description: 'Get all pull requests in a repository',
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
                            description: 'State of pull requests to return (open, closed, all)',
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
                name: 'get_repository_pull',
                description: 'Get a specific pull request in a repository',
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
                        pullNumber: {
                            type: 'number',
                            description: 'The number of pull request'
                        }
                    },
                    required: ['owner', 'repo', 'pullNumber']
                }
            },
            {
                name: 'create_repository_pull',
                description: 'Create a new pull request in a repository',
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
                            description: 'The title of the pull request'
                        },
                        head: {
                            type: 'string',
                            description: 'The name of the branch where your changes are implemented'
                        },
                        base: {
                            type: 'string',
                            description: 'The name of the branch you want the changes pulled into'
                        },
                        body: {
                            type: 'string',
                            description: 'The contents of the pull request',
                            default: ''
                        },
                        draft: {
                            type: 'boolean',
                            description: 'Indicates whether the pull request is a draft',
                            default: false
                        },
                        maintainer_can_modify: {
                            type: 'boolean',
                            description: 'Indicates whether maintainers can modify the pull request',
                            default: true
                        }
                    },
                    required: ['owner', 'repo', 'title', 'head', 'base']
                }
            },
            {
                name: 'merge_repository_pull',
                description: 'Merge a pull request',
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
                        pullNumber: {
                            type: 'number',
                            description: 'The number of pull request'
                        },
                        commit_title: {
                            type: 'string',
                            description: 'Title for the automatic commit message'
                        },
                        commit_message: {
                            type: 'string',
                            description: 'Extra detail to append to automatic commit message',
                            default: ''
                        },
                        merge_method: {
                            type: 'string',
                            description: 'Merge method to use (merge, squash, rebase)',
                            enum: ['merge', 'squash', 'rebase'],
                            default: 'merge'
                        }
                    },
                    required: ['owner', 'repo', 'pullNumber']
                }
            },
            {
                name: 'get_repository_pull_merge_status',
                description: 'Check if a pull request can be merged',
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
                        pullNumber: {
                            type: 'number',
                            description: 'The number of pull request'
                        }
                    },
                    required: ['owner', 'repo', 'pullNumber']
                }
            },
            {
                name: 'get_repository_pull_issues',
                description: 'Get issues associated with a pull request',
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
                        pullNumber: {
                            type: 'number',
                            description: 'The number of pull request'
                        }
                    },
                    required: ['owner', 'repo', 'pullNumber']
                }
            },
            {
                name: 'create_repository_pull_comment',
                description: 'Create a comment on a pull request',
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
                        pullNumber: {
                            type: 'number',
                            description: 'The number of pull request'
                        },
                        body: {
                            type: 'string',
                            description: 'The text of the comment'
                        },
                        commit_id: {
                            type: 'string',
                            description: 'The SHA of the commit to comment on'
                        },
                        path: {
                            type: 'string',
                            description: 'The relative path to the file being commented on'
                        },
                        position: {
                            type: 'number',
                            description: 'The line index in the diff to comment on'
                        }
                    },
                    required: ['owner', 'repo', 'pullNumber', 'body']
                }
            },
            {
                name: 'get_repository_pull_comments',
                description: 'Get all comments on a pull request',
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
                        pullNumber: {
                            type: 'number',
                            description: 'The number of pull request'
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
                    required: ['owner', 'repo', 'pullNumber']
                }
            },
            {
                name: 'get_repository_pull_files',
                description: 'Get files changed in a pull request',
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
                        pullNumber: {
                            type: 'number',
                            description: 'The number of pull request'
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
                    required: ['owner', 'repo', 'pullNumber']
                }
            },
            {
                name: 'update_repository_pull',
                description: 'Update a pull request',
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
                        pullNumber: {
                            type: 'number',
                            description: 'The number of pull request'
                        },
                        title: {
                            type: 'string',
                            description: 'The title of the pull request'
                        },
                        body: {
                            type: 'string',
                            description: 'The contents of the pull request'
                        },
                        state: {
                            type: 'string',
                            description: 'State of the pull request (open, closed)',
                            enum: ['open', 'closed']
                        },
                        base: {
                            type: 'string',
                            description: 'The name of the branch you want the changes pulled into'
                        },
                        maintainer_can_modify: {
                            type: 'boolean',
                            description: 'Indicates whether maintainers can modify the pull request'
                        }
                    },
                    required: ['owner', 'repo', 'pullNumber']
                }
            },
            {
                name: 'get_repository_pull_commits',
                description: 'Get commits in a pull request',
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
                        pullNumber: {
                            type: 'number',
                            description: 'The number of pull request'
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
                    required: ['owner', 'repo', 'pullNumber']
                }
            },
            {
                name: 'create_repository_pull_label',
                description: 'Create a label for a pull request',
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
                        pullNumber: {
                            type: 'number',
                            description: 'The number of pull request'
                        },
                        labels: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Array of label names to add'
                        }
                    },
                    required: ['owner', 'repo', 'pullNumber', 'labels']
                }
            },
            {
                name: 'get_repository_pull_labels',
                description: 'Get labels for a pull request',
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
                        pullNumber: {
                            type: 'number',
                            description: 'The number of pull request'
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
                    required: ['owner', 'repo', 'pullNumber']
                }
            },
            {
                name: 'replace_repository_pull_labels',
                description: 'Replace all labels for a pull request',
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
                        pullNumber: {
                            type: 'number',
                            description: 'The number of pull request'
                        },
                        labels: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Array of label names to set'
                        }
                    },
                    required: ['owner', 'repo', 'pullNumber', 'labels']
                }
            },
            {
                name: 'delete_repository_pull_label',
                description: 'Delete a label from a pull request',
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
                        pullNumber: {
                            type: 'number',
                            description: 'The number of pull request'
                        },
                        name: {
                            type: 'string',
                            description: 'The name of the label to delete'
                        }
                    },
                    required: ['owner', 'repo', 'pullNumber', 'name']
                }
            },
            {
                name: 'process_repository_pull_test',
                description: 'Process pull request test',
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
                        pullNumber: {
                            type: 'number',
                            description: 'The number of pull request'
                        },
                        action: {
                            type: 'string',
                            description: 'Test action (approve, reject, reset)',
                            enum: ['approve', 'reject', 'reset']
                        },
                        comment: {
                            type: 'string',
                            description: 'Optional comment for the test action'
                        }
                    },
                    required: ['owner', 'repo', 'pullNumber', 'action']
                }
            },
            {
                name: 'process_repository_pull_review',
                description: 'Process pull request review',
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
                        pullNumber: {
                            type: 'number',
                            description: 'The number of pull request'
                        },
                        action: {
                            type: 'string',
                            description: 'Review action (approve, reject, reset)',
                            enum: ['approve', 'reject', 'reset']
                        },
                        comment: {
                            type: 'string',
                            description: 'Optional comment for the review action'
                        }
                    },
                    required: ['owner', 'repo', 'pullNumber', 'action']
                }
            },
            {
                name: 'get_repository_pull_operate_logs',
                description: 'Get pull request operation logs',
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
                        pullNumber: {
                            type: 'number',
                            description: 'The number of pull request'
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
                    required: ['owner', 'repo', 'pullNumber']
                }
            },
            {
                name: 'reset_repository_pull_testers',
                description: 'Reset pull request testers status',
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
                        pullNumber: {
                            type: 'number',
                            description: 'The number of pull request'
                        }
                    },
                    required: ['owner', 'repo', 'pullNumber']
                }
            },
            {
                name: 'assign_repository_pull_testers',
                description: 'Assign users to test pull request',
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
                        pullNumber: {
                            type: 'number',
                            description: 'The number of pull request'
                        },
                        testers: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Array of usernames to assign as testers'
                        }
                    },
                    required: ['owner', 'repo', 'pullNumber', 'testers']
                }
            },
            {
                name: 'remove_repository_pull_testers',
                description: 'Remove testers from pull request',
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
                        pullNumber: {
                            type: 'number',
                            description: 'The number of pull request'
                        },
                        testers: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Array of usernames to remove as testers'
                        }
                    },
                    required: ['owner', 'repo', 'pullNumber', 'testers']
                }
            },
            {
                name: 'get_repository_pull_tester_options',
                description: 'Get available testers for pull request',
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
                        pullNumber: {
                            type: 'number',
                            description: 'The number of pull request'
                        }
                    },
                    required: ['owner', 'repo', 'pullNumber']
                }
            },
            {
                name: 'reset_repository_pull_assignees',
                description: 'Reset pull request assignees status',
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
                        pullNumber: {
                            type: 'number',
                            description: 'The number of pull request'
                        }
                    },
                    required: ['owner', 'repo', 'pullNumber']
                }
            },
            {
                name: 'assign_repository_pull_assignees',
                description: 'Assign users to review pull request',
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
                        pullNumber: {
                            type: 'number',
                            description: 'The number of pull request'
                        },
                        assignees: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Array of usernames to assign as reviewers'
                        }
                    },
                    required: ['owner', 'repo', 'pullNumber', 'assignees']
                }
            },
            {
                name: 'remove_repository_pull_assignees',
                description: 'Remove assignees from pull request',
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
                        pullNumber: {
                            type: 'number',
                            description: 'The number of pull request'
                        },
                        assignees: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Array of usernames to remove as assignees'
                        }
                    },
                    required: ['owner', 'repo', 'pullNumber', 'assignees']
                }
            },
            {
                name: 'get_repository_pull_files_json',
                description: 'Get pull request file changes information',
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
                        pullNumber: {
                            type: 'number',
                            description: 'The number of pull request'
                        }
                    },
                    required: ['owner', 'repo', 'pullNumber']
                }
            },
            {
                name: 'get_repository_pull_file_content',
                description: 'Get file content from pull request',
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
                        head: {
                            type: 'string',
                            description: 'The head branch SHA'
                        },
                        sha: {
                            type: 'string',
                            description: 'The commit SHA'
                        },
                        name: {
                            type: 'string',
                            description: 'The file name'
                        }
                    },
                    required: ['owner', 'repo', 'head', 'sha', 'name']
                }
            },
            {
                name: 'link_repository_pull_issues',
                description: 'Link issues to pull request',
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
                        pullNumber: {
                            type: 'number',
                            description: 'The number of pull request'
                        },
                        issues: {
                            type: 'array',
                            items: {
                                type: 'number'
                            },
                            description: 'Array of issue numbers to link'
                        }
                    },
                    required: ['owner', 'repo', 'pullNumber', 'issues']
                }
            },
            {
                name: 'unlink_repository_pull_issues',
                description: 'Unlink issues from pull request',
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
                        pullNumber: {
                            type: 'number',
                            description: 'The number of pull request'
                        },
                        issues: {
                            type: 'array',
                            items: {
                                type: 'number'
                            },
                            description: 'Array of issue numbers to unlink'
                        }
                    },
                    required: ['owner', 'repo', 'pullNumber', 'issues']
                }
            },
            {
                name: 'assign_repository_pull_approval_reviewers',
                description: 'Assign users to approve pull request',
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
                        pullNumber: {
                            type: 'number',
                            description: 'The number of pull request'
                        },
                        reviewers: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Array of usernames to assign as approval reviewers'
                        }
                    },
                    required: ['owner', 'repo', 'pullNumber', 'reviewers']
                }
            },
            {
                name: 'remove_repository_pull_approval_reviewers',
                description: 'Remove approval reviewers from pull request',
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
                        pullNumber: {
                            type: 'number',
                            description: 'The number of pull request'
                        },
                        reviewers: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Array of usernames to remove as approval reviewers'
                        }
                    },
                    required: ['owner', 'repo', 'pullNumber', 'reviewers']
                }
            },
            {
                name: 'get_repository_pull_approval_reviewer_options',
                description: 'Get available approval reviewers for pull request',
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
                        pullNumber: {
                            type: 'number',
                            description: 'The number of pull request'
                        }
                    },
                    required: ['owner', 'repo', 'pullNumber']
                }
            }
        ];
    }
    async callTool(name, args) {
        switch (name) {
            case 'get_repository_pulls':
                return await this.atomGitService.getRepositoryPulls(args.owner, args.repo, args.state, args.page, args.perPage);
            case 'get_repository_pull':
                return await this.atomGitService.getRepositoryPull(args.owner, args.repo, args.pullNumber);
            case 'create_repository_pull':
                return await this.atomGitService.createRepositoryPull(args.owner, args.repo, {
                    title: args.title,
                    head: args.head,
                    base: args.base,
                    body: args.body,
                    draft: args.draft,
                    maintainer_can_modify: args.maintainer_can_modify
                });
            case 'merge_repository_pull':
                return await this.atomGitService.mergeRepositoryPull(args.owner, args.repo, args.pullNumber, {
                    commit_title: args.commit_title,
                    commit_message: args.commit_message,
                    merge_method: args.merge_method
                });
            case 'get_repository_pull_merge_status':
                return await this.atomGitService.getRepositoryPullMergeStatus(args.owner, args.repo, args.pullNumber);
            case 'get_repository_pull_issues':
                return await this.atomGitService.getRepositoryPullIssues(args.owner, args.repo, args.pullNumber);
            case 'create_repository_pull_comment':
                return await this.atomGitService.createRepositoryPullComment(args.owner, args.repo, args.pullNumber, {
                    body: args.body,
                    commit_id: args.commit_id,
                    path: args.path,
                    position: args.position
                });
            case 'get_repository_pull_comments':
                return await this.atomGitService.getRepositoryPullComments(args.owner, args.repo, args.pullNumber, args.page, args.perPage);
            case 'get_repository_pull_files':
                return await this.atomGitService.getRepositoryPullFiles(args.owner, args.repo, args.pullNumber, args.page, args.perPage);
            case 'update_repository_pull':
                return await this.atomGitService.updateRepositoryPull(args.owner, args.repo, args.pullNumber, {
                    title: args.title,
                    body: args.body,
                    state: args.state,
                    base: args.base,
                    maintainer_can_modify: args.maintainer_can_modify
                });
            case 'get_repository_pull_commits':
                return await this.atomGitService.getRepositoryPullCommits(args.owner, args.repo, args.pullNumber, args.page, args.perPage);
            case 'create_repository_pull_label':
                return await this.atomGitService.createRepositoryPullLabel(args.owner, args.repo, args.pullNumber, args.labels);
            case 'get_repository_pull_labels':
                return await this.atomGitService.getRepositoryPullLabels(args.owner, args.repo, args.pullNumber, args.page, args.perPage);
            case 'replace_repository_pull_labels':
                return await this.atomGitService.replaceRepositoryPullLabels(args.owner, args.repo, args.pullNumber, args.labels);
            case 'delete_repository_pull_label':
                return await this.atomGitService.deleteRepositoryPullLabel(args.owner, args.repo, args.pullNumber, args.name);
            case 'process_repository_pull_test':
                return await this.atomGitService.processRepositoryPullTest(args.owner, args.repo, args.pullNumber, {
                    action: args.action,
                    comment: args.comment
                });
            case 'process_repository_pull_review':
                return await this.atomGitService.processRepositoryPullReview(args.owner, args.repo, args.pullNumber, {
                    action: args.action,
                    comment: args.comment
                });
            case 'get_repository_pull_operate_logs':
                return await this.atomGitService.getRepositoryPullOperateLogs(args.owner, args.repo, args.pullNumber, args.page, args.perPage);
            case 'reset_repository_pull_testers':
                return await this.atomGitService.resetRepositoryPullTesters(args.owner, args.repo, args.pullNumber);
            case 'assign_repository_pull_testers':
                return await this.atomGitService.assignRepositoryPullTesters(args.owner, args.repo, args.pullNumber, args.testers);
            case 'remove_repository_pull_testers':
                return await this.atomGitService.removeRepositoryPullTesters(args.owner, args.repo, args.pullNumber, args.testers);
            case 'get_repository_pull_tester_options':
                return await this.atomGitService.getRepositoryPullTesterOptions(args.owner, args.repo, args.pullNumber);
            case 'reset_repository_pull_assignees':
                return await this.atomGitService.resetRepositoryPullAssignees(args.owner, args.repo, args.pullNumber);
            case 'assign_repository_pull_assignees':
                return await this.atomGitService.assignRepositoryPullAssignees(args.owner, args.repo, args.pullNumber, args.assignees);
            case 'remove_repository_pull_assignees':
                return await this.atomGitService.removeRepositoryPullAssignees(args.owner, args.repo, args.pullNumber, args.assignees);
            case 'get_repository_pull_files_json':
                return await this.atomGitService.getRepositoryPullFilesJson(args.owner, args.repo, args.pullNumber);
            case 'get_repository_pull_file_content':
                return await this.atomGitService.getRepositoryPullFileContent(args.owner, args.repo, args.head, args.sha, args.name);
            case 'link_repository_pull_issues':
                return await this.atomGitService.linkRepositoryPullIssues(args.owner, args.repo, args.pullNumber, args.issues);
            case 'unlink_repository_pull_issues':
                return await this.atomGitService.unlinkRepositoryPullIssues(args.owner, args.repo, args.pullNumber, args.issues);
            case 'assign_repository_pull_approval_reviewers':
                return await this.atomGitService.assignRepositoryPullApprovalReviewers(args.owner, args.repo, args.pullNumber, args.reviewers);
            case 'remove_repository_pull_approval_reviewers':
                return await this.atomGitService.removeRepositoryPullApprovalReviewers(args.owner, args.repo, args.pullNumber, args.reviewers);
            case 'get_repository_pull_approval_reviewer_options':
                return await this.atomGitService.getRepositoryPullApprovalReviewerOptions(args.owner, args.repo, args.pullNumber);
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
}
//# sourceMappingURL=PullRequestTools.js.map