export class LabelsTools {
    labelsService;
    constructor(labelsService) {
        this.labelsService = labelsService;
    }
    getTools() {
        return [
            {
                name: 'get_repository_labels',
                description: '获取仓库所有任务标签',
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
                name: 'create_repository_label',
                description: '创建仓库任务标签',
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
                        name: {
                            type: 'string',
                            description: '标签名称'
                        },
                        color: {
                            type: 'string',
                            description: '标签颜色'
                        },
                        description: {
                            type: 'string',
                            description: '标签描述'
                        }
                    },
                    required: ['owner', 'repo', 'name']
                }
            },
            {
                name: 'update_repository_label',
                description: '更新一个仓库的任务标签',
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
                        originalName: {
                            type: 'string',
                            description: '原标签名称'
                        },
                        name: {
                            type: 'string',
                            description: '新标签名称'
                        },
                        color: {
                            type: 'string',
                            description: '标签颜色'
                        },
                        description: {
                            type: 'string',
                            description: '标签描述'
                        }
                    },
                    required: ['owner', 'repo', 'originalName', 'name']
                }
            },
            {
                name: 'delete_repository_label',
                description: '删除一个仓库任务标签',
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
                        name: {
                            type: 'string',
                            description: '标签名称'
                        }
                    },
                    required: ['owner', 'repo', 'name']
                }
            },
            {
                name: 'replace_all_repository_labels',
                description: '替换所有仓库标签',
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
                        labels: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    name: {
                                        type: 'string',
                                        description: '标签名称'
                                    },
                                    color: {
                                        type: 'string',
                                        description: '标签颜色'
                                    }
                                }
                            }
                        }
                    },
                    required: ['owner', 'repo', 'labels']
                }
            },
            {
                name: 'get_enterprise_labels',
                description: '获取企业所有的标签',
                inputSchema: {
                    type: 'object',
                    properties: {
                        enterprise: {
                            type: 'string',
                            description: '企业名称'
                        }
                    },
                    required: ['enterprise']
                }
            },
            {
                name: 'get_enterprise_labels_v8',
                description: '获取标签列表',
                inputSchema: {
                    type: 'object',
                    properties: {
                        enterprise: {
                            type: 'string',
                            description: '企业ID'
                        }
                    },
                    required: ['enterprise']
                }
            },
            {
                name: 'replace_repository_issue_all_labels',
                description: 'Replace all labels for an issue',
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
                        issueNumber: {
                            type: 'number',
                            description: 'The issue number'
                        },
                        labels: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Array of label names'
                        }
                    },
                    required: ['owner', 'repo', 'issueNumber', 'labels']
                }
            },
            {
                name: 'delete_repository_all_issue_labels',
                description: 'Delete all labels for an issue',
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
                        issueNumber: {
                            type: 'number',
                            description: 'The issue number'
                        }
                    },
                    required: ['owner', 'repo', 'issueNumber']
                }
            }
        ];
    }
    async callTool(name, args) {
        switch (name) {
            case 'get_repository_labels':
                return await this.labelsService.getRepositoryLabels(args.owner, args.repo);
            case 'create_repository_label':
                return await this.labelsService.createRepositoryLabel(args.owner, args.repo, {
                    name: args.name,
                    color: args.color,
                    description: args.description
                });
            case 'update_repository_label':
                return await this.labelsService.updateRepositoryLabel(args.owner, args.repo, args.originalName, {
                    name: args.name,
                    color: args.color,
                    description: args.description
                });
            case 'delete_repository_label':
                return await this.labelsService.deleteRepositoryLabel(args.owner, args.repo, args.name);
            case 'replace_all_repository_labels':
                return await this.labelsService.replaceRepositoryProjectLabels(args.owner, args.repo, args.labels);
            case 'get_enterprise_labels':
                return await this.labelsService.getEnterpriseLabels(args.enterprise);
            case 'get_labels_list':
                return await this.labelsService.getEnterpriseLabelsV8(args.enterprise);
            case 'delete_repository_all_issue_labels':
                return await this.labelsService.deleteRepositoryIssueAllLabels(args.owner, args.repo, args.issueNumber);
            case 'replace_repository_issue_all_labels':
                return await this.labelsService.replaceRepositoryIssueAllLabels(args.owner, args.repo, args.issueNumber, args.labels);
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
}
//# sourceMappingURL=LabelsTools.js.map