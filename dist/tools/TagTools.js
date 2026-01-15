export class TagTools {
    tagService;
    constructor(tagService) {
        this.tagService = tagService;
    }
    getTools() {
        return [
            {
                name: 'get_repository_tags',
                description: 'List all tags in a repository',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: 'The owner of repository (username or organization)'
                        },
                        repo: {
                            type: 'string',
                            description: 'The name of repository'
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
                name: 'create_repository_tag',
                description: 'Create a tag for a repository',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: 'The owner of repository (username or organization)'
                        },
                        repo: {
                            type: 'string',
                            description: 'The name of repository'
                        },
                        tagName: {
                            type: 'string',
                            description: 'The name of the tag'
                        },
                        target: {
                            type: 'string',
                            description: 'The SHA of the commit this tag points to'
                        },
                        message: {
                            type: 'string',
                            description: 'Tag message'
                        }
                    },
                    required: ['owner', 'repo', 'tagName', 'target']
                }
            },
            {
                name: 'delete_repository_tag',
                description: 'Delete a tag from a repository',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: 'The owner of repository (username or organization)'
                        },
                        repo: {
                            type: 'string',
                            description: 'The name of repository'
                        },
                        tagName: {
                            type: 'string',
                            description: 'The name of the tag to delete'
                        }
                    },
                    required: ['owner', 'repo', 'tagName']
                }
            },
            {
                name: 'get_repository_protected_tags',
                description: 'List protected tags in a repository',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: 'The owner of repository (username or organization)'
                        },
                        repo: {
                            type: 'string',
                            description: 'The name of repository'
                        }
                    },
                    required: ['owner', 'repo']
                }
            },
            {
                name: 'create_repository_protected_tag',
                description: 'Create a protected tag in a repository',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: 'The owner of repository (username or organization)'
                        },
                        repo: {
                            type: 'string',
                            description: 'The name of repository'
                        },
                        tagName: {
                            type: 'string',
                            description: 'The name of the protected tag'
                        }
                    },
                    required: ['owner', 'repo', 'tagName']
                }
            },
            {
                name: 'update_repository_protected_tag',
                description: 'Update a protected tag in a repository',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: 'The owner of repository (username or organization)'
                        },
                        repo: {
                            type: 'string',
                            description: 'The name of repository'
                        },
                        tagName: {
                            type: 'string',
                            description: 'The name of the protected tag'
                        }
                    },
                    required: ['owner', 'repo', 'tagName']
                }
            },
            {
                name: 'delete_repository_protected_tag',
                description: 'Delete a protected tag from a repository',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: 'The owner of repository (username or organization)'
                        },
                        repo: {
                            type: 'string',
                            description: 'The name of repository'
                        },
                        tagName: {
                            type: 'string',
                            description: 'The name of the protected tag to delete'
                        }
                    },
                    required: ['owner', 'repo', 'tagName']
                }
            },
            {
                name: 'get_repository_protected_tag',
                description: 'Get details of a protected tag',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: 'The owner of repository (username or organization)'
                        },
                        repo: {
                            type: 'string',
                            description: 'The name of repository'
                        },
                        tagName: {
                            type: 'string',
                            description: 'The name of the protected tag'
                        }
                    },
                    required: ['owner', 'repo', 'tagName']
                }
            }
        ];
    }
    async callTool(name, args) {
        switch (name) {
            case 'get_repository_tags':
                return await this.tagService.getRepositoryTags(args.owner, args.repo, args.page, args.perPage);
            case 'create_repository_tag':
                return await this.tagService.createRepositoryTag(args.owner, args.repo, {
                    tag_name: args.tagName,
                    target: args.target,
                    message: args.message
                });
            case 'delete_repository_tag':
                return await this.tagService.deleteRepositoryTag(args.owner, args.repo, args.tagName);
            case 'get_repository_protected_tags':
                return await this.tagService.getRepositoryProtectedTags(args.owner, args.repo);
            case 'create_repository_protected_tag':
                return await this.tagService.createRepositoryProtectedTag(args.owner, args.repo, {
                    tag_name: args.tagName
                });
            case 'update_repository_protected_tag':
                return await this.tagService.updateRepositoryProtectedTag(args.owner, args.repo, {
                    tag_name: args.tagName
                });
            case 'delete_repository_protected_tag':
                return await this.tagService.deleteRepositoryProtectedTag(args.owner, args.repo, args.tagName);
            case 'get_repository_protected_tag':
                return await this.tagService.getRepositoryProtectedTag(args.owner, args.repo, args.tagName);
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
}
//# sourceMappingURL=TagTools.js.map