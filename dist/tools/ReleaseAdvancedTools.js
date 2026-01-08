export class ReleaseAdvancedTools {
    atomGitService;
    constructor(atomGitService) {
        this.atomGitService = atomGitService;
    }
    getTools() {
        return [
            {
                name: 'update_release',
                description: '更新发布版本',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: '仓库所有者用户名或组织名'
                        },
                        repo: {
                            type: 'string',
                            description: '仓库名称'
                        },
                        tag: {
                            type: 'string',
                            description: '版本标签'
                        },
                        releaseData: {
                            type: 'object',
                            description: '更新的发布数据（包含tag_name、name、body等）'
                        }
                    },
                    required: ['owner', 'repo', 'tag', 'releaseData']
                }
            },
            {
                name: 'delete_release',
                description: '删除发布版本',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: '仓库所有者用户名或组织名'
                        },
                        repo: {
                            type: 'string',
                            description: '仓库名称'
                        },
                        tag: {
                            type: 'string',
                            description: '版本标签'
                        }
                    },
                    required: ['owner', 'repo', 'tag']
                }
            },
            {
                name: 'get_release_assets',
                description: '获取发布版本的附件列表',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: '仓库所有者用户名或组织名'
                        },
                        repo: {
                            type: 'string',
                            description: '仓库名称'
                        },
                        tag: {
                            type: 'string',
                            description: '版本标签'
                        }
                    },
                    required: ['owner', 'repo', 'tag']
                }
            },
            {
                name: 'upload_release_asset',
                description: '上传发布版本附件',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: '仓库所有者用户名或组织名'
                        },
                        repo: {
                            type: 'string',
                            description: '仓库名称'
                        },
                        tag: {
                            type: 'string',
                            description: '版本标签'
                        },
                        assetData: {
                            type: 'object',
                            description: '附件数据（包含name、data等）'
                        }
                    },
                    required: ['owner', 'repo', 'tag', 'assetData']
                }
            },
            {
                name: 'get_release_asset',
                description: '获取特定发布附件信息',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: '仓库所有者用户名或组织名'
                        },
                        repo: {
                            type: 'string',
                            description: '仓库名称'
                        },
                        assetId: {
                            type: 'number',
                            description: '附件ID'
                        }
                    },
                    required: ['owner', 'repo', 'assetId']
                }
            },
            {
                name: 'update_release_asset',
                description: '更新发布版本附件',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: '仓库所有者用户名或组织名'
                        },
                        repo: {
                            type: 'string',
                            description: '仓库名称'
                        },
                        assetId: {
                            type: 'number',
                            description: '附件ID'
                        },
                        assetData: {
                            type: 'object',
                            description: '更新的附件数据'
                        }
                    },
                    required: ['owner', 'repo', 'assetId', 'assetData']
                }
            },
            {
                name: 'delete_release_asset',
                description: '删除发布版本附件',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: {
                            type: 'string',
                            description: '仓库所有者用户名或组织名'
                        },
                        repo: {
                            type: 'string',
                            description: '仓库名称'
                        },
                        assetId: {
                            type: 'number',
                            description: '附件ID'
                        }
                    },
                    required: ['owner', 'repo', 'assetId']
                }
            }
        ];
    }
    async callTool(name, args) {
        switch (name) {
            case 'update_release':
                return await this.atomGitService.updateRelease(args.owner, args.repo, args.tag, args.releaseData);
            case 'delete_release':
                return await this.atomGitService.deleteRelease(args.owner, args.repo, args.tag);
            case 'get_release_assets':
                return await this.atomGitService.getReleaseAssets(args.owner, args.repo, args.tag);
            case 'upload_release_asset':
                return await this.atomGitService.uploadReleaseAsset(args.owner, args.repo, args.tag, args.assetData);
            case 'get_release_asset':
                return await this.atomGitService.getReleaseAsset(args.owner, args.repo, args.assetId);
            case 'update_release_asset':
                return await this.atomGitService.updateReleaseAsset(args.owner, args.repo, args.assetId, args.assetData);
            case 'delete_release_asset':
                return await this.atomGitService.deleteReleaseAsset(args.owner, args.repo, args.assetId);
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
}
//# sourceMappingURL=ReleaseAdvancedTools.js.map