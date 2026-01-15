export class ReleaseTools {
    releaseService;
    constructor(releaseService) {
        this.releaseService = releaseService;
    }
    getTools() {
        return [
            {
                name: 'create_repository_release',
                description: '创建仓库Release',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: '仓库所有者'
                        },
                        repo: {
                            type: 'string',
                            description: '仓库名称'
                        },
                        tagName: {
                            type: 'string',
                            description: '标签名称'
                        },
                        name: {
                            type: 'string',
                            description: '发布名称'
                        },
                        body: {
                            type: 'string',
                            description: '发布说明'
                        },
                        draft: {
                            type: 'boolean',
                            description: '是否为草稿'
                        },
                        prerelease: {
                            type: 'boolean',
                            description: '是否为预发布'
                        }
                    },
                    required: ['owner', 'repo', 'tagName']
                }
            },
            {
                name: 'update_repository_release',
                description: '更新仓库Release',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: '仓库所有者'
                        },
                        repo: {
                            type: 'string',
                            description: '仓库名称'
                        },
                        tagName: {
                            type: 'string',
                            description: '标签名称'
                        },
                        name: {
                            type: 'string',
                            description: '发布名称'
                        },
                        body: {
                            type: 'string',
                            description: '发布说明'
                        },
                        draft: {
                            type: 'boolean',
                            description: '是否为草稿'
                        },
                        prerelease: {
                            type: 'boolean',
                            description: '是否为预发布'
                        }
                    },
                    required: ['owner', 'repo', 'tagName']
                }
            },
            {
                name: 'get_repository_releases',
                description: '获取仓库的所有Releases',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: '仓库所有者'
                        },
                        repo: {
                            type: 'string',
                            description: '仓库名称'
                        },
                        page: {
                            type: 'number',
                            description: '页码，默认为1',
                            default: 1
                        },
                        perPage: {
                            type: 'number',
                            description: '每页结果数，默认为30',
                            default: 30
                        }
                    },
                    required: ['owner', 'repo']
                }
            },
            {
                name: 'get_repository_release',
                description: '获取仓库的单个Releases',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: '仓库所有者'
                        },
                        repo: {
                            type: 'string',
                            description: '仓库名称'
                        },
                        tag: {
                            type: 'string',
                            description: '标签名称'
                        }
                    },
                    required: ['owner', 'repo', 'tag']
                }
            },
            {
                name: 'get_latest_release',
                description: '获取仓库的最后更新的Release',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: '仓库所有者'
                        },
                        repo: {
                            type: 'string',
                            description: '仓库名称'
                        }
                    },
                    required: ['owner', 'repo']
                }
            },
            {
                name: 'get_release_by_tag',
                description: '根据Tag名称获取仓库的Release',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: '仓库所有者'
                        },
                        repo: {
                            type: 'string',
                            description: '仓库名称'
                        },
                        tag: {
                            type: 'string',
                            description: '标签名称'
                        }
                    },
                    required: ['owner', 'repo', 'tag']
                }
            },
            {
                name: 'download_release_asset',
                description: '下载仓库release附件',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: '仓库所有者'
                        },
                        repo: {
                            type: 'string',
                            description: '仓库名称'
                        },
                        fileName: {
                            type: 'string',
                            description: '文件名'
                        }
                    },
                    required: ['owner', 'repo', 'fileName']
                }
            },
            {
                name: 'get_release_upload_url',
                description: 'Get release asset upload URL',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: 'The owner of repository'
                        },
                        repo: {
                            type: 'string',
                            description: 'The name of repository'
                        },
                        tag: {
                            type: 'string',
                            description: 'The tag name'
                        }
                    },
                    required: ['owner', 'repo', 'tag']
                }
            }
        ];
    }
    async callTool(name, args) {
        switch (name) {
            case 'create_repository_release':
                return await this.releaseService.createRelease(args.owner, args.repo, {
                    tag_name: args.tagName,
                    name: args.name,
                    body: args.body,
                    draft: args.draft,
                    prerelease: args.prerelease
                });
            case 'update_repository_release':
                return await this.releaseService.updateRelease(args.owner, args.repo, args.tagName, {
                    name: args.name,
                    body: args.body,
                    draft: args.draft,
                    prerelease: args.prerelease
                });
            case 'get_repository_releases':
                return await this.releaseService.getReleases(args.owner, args.repo, args.page, args.perPage);
            case 'get_repository_release':
                return await this.releaseService.getRelease(args.owner, args.repo, args.tag);
            case 'get_latest_release':
                return await this.releaseService.getLatestRelease(args.owner, args.repo);
            case 'get_release_by_tag':
                return await this.releaseService.getReleaseByTag(args.owner, args.repo, args.tag);
            case 'download_release_asset':
                return await this.releaseService.downloadReleaseAsset(args.owner, args.repo, args.fileName);
            case 'get_release_upload_url':
                return await this.releaseService.getReleaseUploadUrl(args.owner, args.repo, args.tag);
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
}
//# sourceMappingURL=ReleaseTools.js.map