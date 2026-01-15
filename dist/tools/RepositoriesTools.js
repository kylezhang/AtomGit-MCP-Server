export class RepositoriesTools {
    service;
    constructor(service) {
        this.service = service;
    }
    getTools() {
        return [
            {
                name: 'get_repository_tree',
                description: '获取仓库目录Tree',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' },
                        sha: { type: 'string', description: 'commit SHA值，可选' }
                    },
                    required: ['owner', 'repo']
                }
            },
            {
                name: 'get_repository_content',
                description: '获取仓库具体路径下的内容',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' },
                        path: { type: 'string', description: '文件路径' },
                        ref: { type: 'string', description: '分支或tag名称，可选' }
                    },
                    required: ['owner', 'repo', 'path']
                }
            },
            {
                name: 'create_repository_file',
                description: '新建文件',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' },
                        path: { type: 'string', description: '文件路径' },
                        content: { type: 'string', description: '文件内容' },
                        message: { type: 'string', description: '提交信息' },
                        branch: { type: 'string', description: '分支名称' }
                    },
                    required: ['owner', 'repo', 'path', 'content', 'message', 'branch']
                }
            },
            {
                name: 'update_repository_file',
                description: '更新文件',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' },
                        path: { type: 'string', description: '文件路径' },
                        content: { type: 'string', description: '文件内容' },
                        message: { type: 'string', description: '提交信息' },
                        sha: { type: 'string', description: '文件SHA值' },
                        branch: { type: 'string', description: '分支名称' }
                    },
                    required: ['owner', 'repo', 'path', 'content', 'message', 'sha', 'branch']
                }
            },
            {
                name: 'delete_repository_file',
                description: '删除文件',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' },
                        path: { type: 'string', description: '文件路径' },
                        message: { type: 'string', description: '提交信息' },
                        sha: { type: 'string', description: '文件SHA值' },
                        branch: { type: 'string', description: '分支名称' }
                    },
                    required: ['owner', 'repo', 'path', 'message', 'sha', 'branch']
                }
            },
            {
                name: 'get_repository_file_list',
                description: '获取文件列表',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' },
                        path: { type: 'string', description: '路径，可选' },
                        ref: { type: 'string', description: '分支或tag名称，可选' },
                        page: { type: 'number', description: '页码，默认1' },
                        perPage: { type: 'number', description: '每页数量，默认30' }
                    },
                    required: ['owner', 'repo']
                }
            },
            {
                name: 'get_repository_blob',
                description: '获取文件Blob',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' },
                        sha: { type: 'string', description: 'Blob SHA值' }
                    },
                    required: ['owner', 'repo', 'sha']
                }
            },
            {
                name: 'get_repository_languages',
                description: '获取仓库的语言',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' }
                    },
                    required: ['owner', 'repo']
                }
            },
            {
                name: 'get_repository_contributors',
                description: '获取仓库贡献者',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' }
                    },
                    required: ['owner', 'repo']
                }
            },
            {
                name: 'set_repository_module_setting',
                description: '设置项目模块',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' },
                        moduleData: { type: 'object', description: '模块设置数据' }
                    },
                    required: ['owner', 'repo', 'moduleData']
                }
            },
            {
                name: 'update_repository',
                description: '更新仓库设置',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' },
                        updateData: { type: 'object', description: '更新数据' }
                    },
                    required: ['owner', 'repo', 'updateData']
                }
            },
            {
                name: 'delete_repository',
                description: '删除一个仓库',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' }
                    },
                    required: ['owner', 'repo']
                }
            },
            {
                name: 'update_repository_reviewer',
                description: '修改项目代码审查设置',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' },
                        reviewerData: { type: 'object', description: '审查设置数据' }
                    },
                    required: ['owner', 'repo', 'reviewerData']
                }
            },
            {
                name: 'archive_repository',
                description: '仓库归档',
                inputSchema: {
                    type: 'object',
                    properties: {
                        org: { type: 'string', description: '组织名称' },
                        repository: { type: 'string', description: '仓库名称' },
                        archiveData: { type: 'object', description: '归档数据' }
                    },
                    required: ['org', 'repository', 'archiveData']
                }
            },
            {
                name: 'transfer_repository_to_org',
                description: '转移仓',
                inputSchema: {
                    type: 'object',
                    properties: {
                        org: { type: 'string', description: '组织名称' },
                        repository: { type: 'string', description: '仓库名称' },
                        transferData: { type: 'object', description: '转移数据' }
                    },
                    required: ['org', 'repository', 'transferData']
                }
            },
            {
                name: 'get_repository_transition',
                description: '获取项目的权限模式',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' }
                    },
                    required: ['owner', 'repo']
                }
            },
            {
                name: 'update_repository_transition',
                description: '更新仓库的权限模式',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' },
                        transitionData: { type: 'object', description: '权限模式数据' }
                    },
                    required: ['owner', 'repo', 'transitionData']
                }
            },
            {
                name: 'set_repository_push_config',
                description: '设置项目推送规则',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' },
                        config: { type: 'object', description: '推送规则配置' }
                    },
                    required: ['owner', 'repo', 'config']
                }
            },
            {
                name: 'get_repository_push_config',
                description: '获取项目推送规则',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' }
                    },
                    required: ['owner', 'repo']
                }
            },
            {
                name: 'fork_repository',
                description: 'Fork一个仓库',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' },
                        forkData: { type: 'object', description: 'Fork数据，可选' }
                    },
                    required: ['owner', 'repo']
                }
            },
            {
                name: 'get_repository_forks',
                description: '查看仓库的Forks',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' },
                        page: { type: 'number', description: '页码，默认1' },
                        perPage: { type: 'number', description: '每页数量，默认30' }
                    },
                    required: ['owner', 'repo']
                }
            },
            {
                name: 'upload_repository_image',
                description: '上传图片',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' },
                        fileData: { type: 'string', description: '图片数据' },
                        filename: { type: 'string', description: '文件名' }
                    },
                    required: ['owner', 'repo', 'fileData', 'filename']
                }
            },
            {
                name: 'upload_repository_file',
                description: '上传文件',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' },
                        fileData: { type: 'string', description: '文件数据' },
                        filename: { type: 'string', description: '文件名' }
                    },
                    required: ['owner', 'repo', 'fileData', 'filename']
                }
            },
            {
                name: 'get_repository_subscribers',
                description: '列出 watch 了仓库的用户',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' }
                    },
                    required: ['owner', 'repo']
                }
            },
            {
                name: 'get_repository_stargazers',
                description: '列出 star 了仓库的用户',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' }
                    },
                    required: ['owner', 'repo']
                }
            },
            {
                name: 'update_repository_settings',
                description: '更新仓库设置',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' },
                        settings: { type: 'object', description: '仓库设置' }
                    },
                    required: ['owner', 'repo', 'settings']
                }
            },
            {
                name: 'get_repository_settings',
                description: '获取仓库设置',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' }
                    },
                    required: ['owner', 'repo']
                }
            },
            {
                name: 'get_repository_pull_request_settings',
                description: '获取 Pull Request设置',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' }
                    },
                    required: ['owner', 'repo']
                }
            },
            {
                name: 'update_repository_pull_request_settings',
                description: '更新 Pull Request设置',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' },
                        settings: { type: 'object', description: 'Pull Request设置' }
                    },
                    required: ['owner', 'repo', 'settings']
                }
            },
            {
                name: 'update_repository_member_role',
                description: '更新项目成员角色',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' },
                        username: { type: 'string', description: '用户名' },
                        roleData: { type: 'object', description: '角色数据' }
                    },
                    required: ['owner', 'repo', 'username', 'roleData']
                }
            },
            {
                name: 'transfer_repository',
                description: '仓库转移',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' },
                        transferData: { type: 'object', description: '转移数据' }
                    },
                    required: ['owner', 'repo', 'transferData']
                }
            },
            {
                name: 'get_repository_customized_roles',
                description: '获取项目自定义角色',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' }
                    },
                    required: ['owner', 'repo']
                }
            },
            {
                name: 'get_repository_download_statistics',
                description: '下载次数统计',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' }
                    },
                    required: ['owner', 'repo']
                }
            },
            {
                name: 'get_repository_raw_file',
                description: '获取 raw 文件',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' },
                        path: { type: 'string', description: '文件路径' }
                    },
                    required: ['owner', 'repo', 'path']
                }
            },
            {
                name: 'get_repository_contributors_statistic',
                description: '获取仓库贡献者统计信息',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' }
                    },
                    required: ['owner', 'repo']
                }
            },
            {
                name: 'get_repository_events',
                description: '获取仓库动态',
                inputSchema: {
                    type: 'object',
                    properties: {
                        owner: { type: 'string', description: '仓库所有者' },
                        repo: { type: 'string', description: '仓库名称' },
                        accessToken: { type: 'string', description: '访问令牌' }
                    },
                    required: ['owner', 'repo', 'accessToken']
                }
            }
        ];
    }
    async callTool(name, args) {
        switch (name) {
            case 'get_repository_tree':
                return await this.service.getRepositoryTree(args.owner, args.repo, args.sha);
            case 'get_repository_content':
                return await this.service.getRepositoryContent(args.owner, args.repo, args.path, args.ref);
            case 'create_repository_file':
                return await this.service.createRepositoryFile(args.owner, args.repo, {
                    path: args.path,
                    content: args.content,
                    message: args.message,
                    branch: args.branch
                });
            case 'update_repository_file':
                return await this.service.updateRepositoryFile(args.owner, args.repo, {
                    path: args.path,
                    content: args.content,
                    message: args.message,
                    sha: args.sha,
                    branch: args.branch
                });
            case 'delete_repository_file':
                return await this.service.deleteRepositoryFile(args.owner, args.repo, {
                    path: args.path,
                    message: args.message,
                    sha: args.sha,
                    branch: args.branch
                });
            case 'get_repository_file_list':
                return await this.service.getRepositoryFileList(args.owner, args.repo, args.path, args.ref, args.page, args.perPage);
            case 'get_repository_blob':
                return await this.service.getRepositoryFileBlob(args.owner, args.repo, args.sha);
            case 'get_repository_languages':
                return await this.service.getRepositoryLanguages(args.owner, args.repo);
            case 'get_repository_contributors':
                return await this.service.getRepositoryContributors(args.owner, args.repo);
            case 'set_repository_module_setting':
                return await this.service.setRepositoryModuleSetting(args.owner, args.repo, args.moduleData);
            case 'update_repository':
                return await this.service.updateRepositorySettings(args.owner, args.repo, args.updateData);
            case 'delete_repository':
                return await this.service.deleteRepository(args.owner, args.repo);
            case 'update_repository_reviewer':
                return await this.service.updateRepositoryReviewer(args.owner, args.repo, args.reviewerData);
            case 'archive_repository':
                return await this.service.archiveRepository(args.org, args.repository, args.archiveData);
            case 'transfer_repository_to_org':
                return await this.service.transferRepository(args.org, args.repository, args.transferData);
            case 'get_repository_transition':
                return await this.service.getRepositoryTransition(args.owner, args.repo);
            case 'update_repository_transition':
                return await this.service.updateRepositoryTransition(args.owner, args.repo, args.transitionData);
            case 'set_repository_push_config':
                return await this.service.setRepositoryPushConfig(args.owner, args.repo, args.config);
            case 'get_repository_push_config':
                return await this.service.getRepositoryPushConfig(args.owner, args.repo);
            case 'fork_repository':
                return await this.service.forkRepository(args.owner, args.repo, args.forkData);
            case 'get_repository_forks':
                return await this.service.getRepositoryForks(args.owner, args.repo, args.page, args.perPage);
            case 'upload_repository_image':
                return await this.service.uploadRepositoryImage(args.owner, args.repo, args.fileData, args.filename);
            case 'upload_repository_file':
                return await this.service.uploadRepositoryFile(args.owner, args.repo, args.fileData, args.filename);
            case 'get_repository_subscribers':
                return await this.service.getRepositorySubscribers(args.owner, args.repo);
            case 'get_repository_stargazers':
                return await this.service.getRepositoryStargazers(args.owner, args.repo);
            case 'update_repository_settings':
                return await this.service.updateRepositorySettings(args.owner, args.repo, args.settings);
            case 'get_repository_settings':
                return await this.service.getRepositoryRepoSettings(args.owner, args.repo);
            case 'get_repository_pull_request_settings':
                return await this.service.getRepositoryPullRequestSettings(args.owner, args.repo);
            case 'update_repository_pull_request_settings':
                return await this.service.updateRepositoryPullRequestSettings(args.owner, args.repo, args.settings);
            case 'update_repository_member_role':
                return await this.service.updateRepositoryMemberRole(args.owner, args.repo, args.username, args.roleData);
            case 'transfer_repository':
                return await this.service.transferRepository(args.owner, args.repo, args.transferData);
            case 'get_repository_customized_roles':
                return await this.service.getRepositoryCustomizedRoles(args.owner, args.repo);
            case 'get_repository_download_statistics':
                return await this.service.getRepositoryDownloadStatistics(args.owner, args.repo);
            case 'get_repository_raw_file':
                return await this.service.getRepositoryRawFile(args.owner, args.repo, args.path);
            case 'get_repository_contributors_statistic':
                return await this.service.getRepositoryContributorsStatistic(args.owner, args.repo);
            case 'get_repository_events':
                return await this.service.getRepositoryEvents(args.owner, args.repo, args.accessToken);
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
}
//# sourceMappingURL=RepositoriesTools.js.map