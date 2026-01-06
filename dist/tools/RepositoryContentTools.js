export class RepositoryContentTools {
    atomGitService;
    constructor(atomGitService) {
        this.atomGitService = atomGitService;
    }
    getTools() {
        return [
            {
                name: 'get_repository_content',
                description: 'Get repository content at a specific path',
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
                        path: {
                            type: 'string',
                            description: 'The content path',
                            default: ''
                        },
                        ref: {
                            type: 'string',
                            description: 'The name of the commit/branch/tag (optional)'
                        }
                    },
                    required: ['owner', 'repo']
                }
            },
            {
                name: 'create_repository_file',
                description: 'Create a new file in the repository',
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
                        path: {
                            type: 'string',
                            description: 'The path to the file'
                        },
                        content: {
                            type: 'string',
                            description: 'The file content (base64 encoded if binary)'
                        },
                        message: {
                            type: 'string',
                            description: 'The commit message'
                        },
                        branch: {
                            type: 'string',
                            description: 'The branch name (optional, defaults to main branch)'
                        },
                        encoding: {
                            type: 'string',
                            description: 'The encoding of the content (text or base64)',
                            enum: ['text', 'base64'],
                            default: 'text'
                        }
                    },
                    required: ['owner', 'repo', 'path', 'content', 'message']
                }
            },
            {
                name: 'update_repository_file',
                description: 'Update an existing file in the repository',
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
                        path: {
                            type: 'string',
                            description: 'The path to the file'
                        },
                        content: {
                            type: 'string',
                            description: 'The new file content (base64 encoded if binary)'
                        },
                        message: {
                            type: 'string',
                            description: 'The commit message'
                        },
                        sha: {
                            type: 'string',
                            description: 'The blob SHA of the file being replaced'
                        },
                        branch: {
                            type: 'string',
                            description: 'The branch name (optional, defaults to main branch)'
                        },
                        encoding: {
                            type: 'string',
                            description: 'The encoding of the content (text or base64)',
                            enum: ['text', 'base64'],
                            default: 'text'
                        }
                    },
                    required: ['owner', 'repo', 'path', 'content', 'message', 'sha']
                }
            },
            {
                name: 'delete_repository_file',
                description: 'Delete a file from the repository',
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
                        path: {
                            type: 'string',
                            description: 'The path to the file'
                        },
                        message: {
                            type: 'string',
                            description: 'The commit message'
                        },
                        sha: {
                            type: 'string',
                            description: 'The blob SHA of the file being deleted'
                        },
                        branch: {
                            type: 'string',
                            description: 'The branch name (optional, defaults to main branch)'
                        }
                    },
                    required: ['owner', 'repo', 'path', 'message', 'sha']
                }
            },
            {
                name: 'get_repository_file_list',
                description: 'Get the list of files in a repository',
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
                        path: {
                            type: 'string',
                            description: 'The path to list files from',
                            default: ''
                        },
                        ref: {
                            type: 'string',
                            description: 'The name of the commit/branch/tag (optional)'
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
                name: 'get_repository_file_blob',
                description: 'Get the blob content of a file',
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
                            description: 'The SHA of the blob'
                        }
                    },
                    required: ['owner', 'repo', 'sha']
                }
            },
            {
                name: 'upload_repository_image',
                description: 'Upload an image to the repository',
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
                        file: {
                            type: 'string',
                            description: 'The image file data (base64 encoded)'
                        },
                        filename: {
                            type: 'string',
                            description: 'The filename for the uploaded image'
                        }
                    },
                    required: ['owner', 'repo', 'file', 'filename']
                }
            },
            {
                name: 'upload_repository_file',
                description: 'Upload a file to the repository',
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
                        file: {
                            type: 'string',
                            description: 'The file data (base64 encoded)'
                        },
                        filename: {
                            type: 'string',
                            description: 'The filename for the uploaded file'
                        }
                    },
                    required: ['owner', 'repo', 'file', 'filename']
                }
            }
        ];
    }
    async callTool(name, args) {
        switch (name) {
            case 'get_repository_content':
                return await this.atomGitService.getRepositoryContent(args.owner, args.repo, args.path, args.ref);
            case 'create_repository_file':
                return await this.atomGitService.createRepositoryFile(args.owner, args.repo, {
                    path: args.path,
                    content: args.content,
                    message: args.message,
                    branch: args.branch,
                    encoding: args.encoding
                });
            case 'update_repository_file':
                return await this.atomGitService.updateRepositoryFile(args.owner, args.repo, {
                    path: args.path,
                    content: args.content,
                    message: args.message,
                    sha: args.sha,
                    branch: args.branch,
                    encoding: args.encoding
                });
            case 'delete_repository_file':
                return await this.atomGitService.deleteRepositoryFile(args.owner, args.repo, {
                    path: args.path,
                    message: args.message,
                    sha: args.sha,
                    branch: args.branch
                });
            case 'get_repository_file_list':
                return await this.atomGitService.getRepositoryFileList(args.owner, args.repo, args.path, args.ref, args.page, args.perPage);
            case 'get_repository_file_blob':
                return await this.atomGitService.getRepositoryFileBlob(args.owner, args.repo, args.sha);
            case 'upload_repository_image':
                return await this.atomGitService.uploadRepositoryImage(args.owner, args.repo, args.file, args.filename);
            case 'upload_repository_file':
                return await this.atomGitService.uploadRepositoryFile(args.owner, args.repo, args.file, args.filename);
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
}
//# sourceMappingURL=RepositoryContentTools.js.map