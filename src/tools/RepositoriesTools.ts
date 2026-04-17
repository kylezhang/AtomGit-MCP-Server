import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { RepositoriesService } from '../services/RepositoriesService.js';

export class RepositoriesTools {
  private service: RepositoriesService;

  constructor(service: RepositoriesService) {
    this.service = service;
  }

  getTools(): Tool[] {
    return [
      {
        name: 'get_repository_tree',
        description: '获取仓库目录Tree',
        inputSchema: {
          type: 'object',
          properties: {
            owner: { type: 'string', description: '仓库所有者' },
            repo: { type: 'string', description: '仓库名称' },
            sha: { type: 'string', description: 'commit SHA值' },
            page: { type: 'number', description: '页码' },
            perPage: { type: 'number', description: '每页数量' },
            recursive: { type: 'number', description: '是否递归获取子目录，1 表示递归' },
            file_path: { type: 'string', description: '文件路径过滤' }
          },
          required: ['owner', 'repo', 'sha']
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
            content: { type: 'string', description: '文件内容（明文传入，服务端会自动按 AtomGit API 要求编码为 base64）' },
            message: { type: 'string', description: '提交信息' },
            branch: { type: 'string', description: '分支名称' },
            'author[name]': { type: 'string', description: '提交作者姓名' },
            'author[email]': { type: 'string', description: '提交作者邮箱' }
          },
          required: ['owner', 'repo', 'path', 'content', 'message']
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
            content: { type: 'string', description: '文件内容（明文传入，服务端会自动按 AtomGit API 要求编码为 base64）' },
            message: { type: 'string', description: '提交信息' },
            sha: { type: 'string', description: '文件SHA值' },
            branch: { type: 'string', description: '分支名称' },
            'author[name]': { type: 'string', description: '提交作者姓名' },
            'author[email]': { type: 'string', description: '提交作者邮箱' }
          },
          required: ['owner', 'repo', 'path', 'content', 'message', 'sha']
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
          required: ['owner', 'repo', 'path', 'message', 'sha']
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
            ref_name: { type: 'string', description: '分支或标签名称' },
            file_name: { type: 'string', description: '文件名过滤' },
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
            repo: { type: 'string', description: '仓库名称' },
            type: { type: 'string', description: '贡献者类型过滤' }
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
            repo: { type: 'string', description: '仓库名称' },
            type: { type: 'string', description: '贡献者类型过滤' }
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
            moduleData: { type: 'object', description: '模块设置数据' },
            has_wiki: { type: 'boolean', description: '是否启用 Wiki' },
            has_issue: { type: 'boolean', description: '是否启用 Issue' },
            has_security: { type: 'boolean', description: '是否启用 Security' },
            has_merge_request: { type: 'boolean', description: '是否启用 Merge Request' },
            has_fork: { type: 'boolean', description: '是否允许 Fork' },
            has_analysis: { type: 'boolean', description: '是否启用 Analysis' },
            has_discussion: { type: 'boolean', description: '是否启用 Discussion' }
          },
          required: ['owner', 'repo']
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
            name: { type: 'string', description: '仓库名称' },
            description: { type: 'string', description: '仓库描述' },
            homepage: { type: 'string', description: '项目地址' },
            path: { type: 'string', description: '更新后的仓库路径' },
            private: { type: 'boolean', description: '是否私有仓库' },
            default_branch: { type: 'string', description: '默认分支' },
            lfs_enabled: { type: 'boolean', description: '是否启用 LFS' },
            tags: {
              type: 'array',
              description: '项目标签',
              items: { type: 'string' }
            }
          },
          required: ['owner', 'repo', 'name']
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
            assignees: { type: 'string', description: '审查人员用户名，多个用英文逗号分隔' },
            testers: { type: 'string', description: '测试人员用户名，多个用英文逗号分隔' },
            assignees_number: { type: 'number', description: '最少审查人数' },
            testers_number: { type: 'number', description: '最少测试人数' }
          },
          required: ['owner', 'repo']
        }
      },
      {
        name: 'archive_repository',
        description: '仓库归档',
        inputSchema: {
          type: 'object',
          properties: {
            org: { type: 'string', description: '组织名称' },
            repo: { type: 'string', description: '仓库名称' },
            status: { type: 'number', description: '仓库状态。0 开始，2 关闭' },
            password: { type: 'string', description: '用户密码' }
          },
          required: ['org', 'repo', 'status']
        }
      },
      {
        name: 'transfer_repository_to_org',
        description: '转移仓',
        inputSchema: {
          type: 'object',
          properties: {
            org: { type: 'string', description: '组织名称' },
            repo: { type: 'string', description: '仓库名称' },
            transfer_to: { type: 'string', description: '目标组织' },
            password: { type: 'string', description: '用户密码' }
          },
          required: ['org', 'repo', 'transfer_to', 'password']
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
            transitionData: { type: 'object', description: '权限模式数据' },
            mode: { type: 'number', description: '权限模式' }
          },
          required: ['owner', 'repo', 'mode']
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
            config: { type: 'object', description: '推送规则配置' },
            reject_not_signed_by_gpg: { type: 'boolean', description: '拒绝未签名提交' },
            commit_message_regex: { type: 'string', description: '提交信息正则' },
            max_file_size: { type: 'number', description: '最大文件大小' },
            skip_rule_for_owner: { type: 'boolean', description: '仓库所有者跳过规则' },
            deny_force_push: { type: 'boolean', description: '禁止强推' }
          },
          required: ['owner', 'repo']
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
            forkData: { type: 'object', description: 'Fork数据，可选' },
            organization: { type: 'string', description: '目标组织' },
            name: { type: 'string', description: 'Fork 后仓库名称' },
            path: { type: 'string', description: 'Fork 后仓库路径' }
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
            perPage: { type: 'number', description: '每页数量，默认30' },
            sort: { type: 'string', description: '排序字段' },
            created_after: { type: 'string', description: '创建时间起始' },
            created_before: { type: 'string', description: '创建时间截止' }
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
            filename: { type: 'string', description: '文件名' },
            body: { type: 'string', description: '图片内容' },
            file_name: { type: 'string', description: '文件名' }
          },
          required: ['owner', 'repo', 'body', 'file_name']
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
            filename: { type: 'string', description: '文件名' },
            file: { type: 'string', format: 'binary', description: '文件内容' }
          },
          required: ['owner', 'repo', 'file']
        }
      },
      {
        name: 'get_repository_subscribers',
        description: '列出 watch 了仓库的用户',
        inputSchema: {
          type: 'object',
          properties: {
            owner: { type: 'string', description: '仓库所有者' },
            repo: { type: 'string', description: '仓库名称' },
            page: { type: 'number', description: '页码' },
            perPage: { type: 'number', description: '每页数量' },
            watched_after: { type: 'string', description: '关注开始时间' },
            watched_before: { type: 'string', description: '关注截止时间' }
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
            repo: { type: 'string', description: '仓库名称' },
            page: { type: 'number', description: '页码' },
            perPage: { type: 'number', description: '每页数量' },
            starred_after: { type: 'string', description: 'Star 开始时间' },
            starred_before: { type: 'string', description: 'Star 截止时间' }
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
            disable_fork: { type: 'boolean', description: '禁止 Fork' },
            forbidden_developer_create_branch: { type: 'boolean', description: '禁止开发者创建分支' },
            forbidden_developer_create_tag: { type: 'boolean', description: '禁止开发者创建标签' },
            forbidden_committer_create_branch: { type: 'boolean', description: '禁止提交者创建分支' },
            forbidden_developer_create_branch_user_ids: {
              type: 'string',
              description: '禁止开发者创建分支的白名单用户 ID'
            },
            branch_name_regex: { type: 'string', description: '分支名称正则表达式' },
            tag_name_regex: { type: 'string', description: '标签名称正则表达式' },
            generate_pre_merge_ref: { type: 'boolean', description: '生成 Pre-Merge 引用' },
            rebase_disable_trigger_webhook: { type: 'boolean', description: 'MR rebase 不触发 Webhook' },
            open_gpg_verified: { type: 'boolean', description: '公开 GPG 公钥验证' },
            include_lfs_objects: { type: 'boolean', description: '压缩包下载包含 LFS 对象' }
          },
          required: ['owner', 'repo']
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
            approval_required_reviewers_enable: { type: 'boolean', description: '是否启用审批必需评审者' },
            approval_required_reviewers: { type: 'number', description: '需要的审批者数量' },
            only_allow_merge_if_all_discussions_are_resolved: {
              type: 'boolean',
              description: '全部讨论解决后才能合并'
            },
            only_allow_merge_if_pipeline_succeeds: {
              type: 'boolean',
              description: '仅流水线成功后允许合并'
            },
            disable_merge_by_self: { type: 'boolean', description: '禁止合并自己创建的 MR' },
            can_force_merge: { type: 'boolean', description: '允许管理员强制合并' },
            add_notes_after_merged: { type: 'boolean', description: '合并后继续允许评论' },
            mark_auto_merged_mr_as_closed: { type: 'boolean', description: '自动合并后标记为关闭' },
            can_reopen: { type: 'boolean', description: '允许重新打开已关闭 MR' },
            delete_source_branch_when_merged: { type: 'boolean', description: '合并后删除源分支' },
            disable_squash_merge: { type: 'boolean', description: '禁止 Squash 合并' },
            auto_squash_merge: { type: 'boolean', description: '默认开启 Squash 合并' },
            merge_method: { type: 'string', description: '合并模式' },
            squash_merge_with_no_merge_commit: { type: 'boolean', description: 'Squash 合并不产生 Merge 节点' },
            merged_commit_author: { type: 'string', description: 'Merge Commit 作者来源' },
            approval_required_approvers: { type: 'number', description: '需要审批的批准者数量' },
            approval_approver_ids: { type: 'string', description: '项目审查人 user_id，逗号分隔' },
            approval_tester_ids: { type: 'string', description: '项目测试人 user_id，逗号分隔' },
            approval_required_testers: { type: 'number', description: '测试最小通过人数' },
            is_check_cla: { type: 'boolean', description: '是否校验 CLA' },
            is_allow_lite_merge_request: { type: 'boolean', description: '是否启用轻量级 Pull Request' },
            lite_merge_request_prefix_title: { type: 'string', description: '轻量级 PR 标题前缀' },
            close_issue_when_mr_merged: { type: 'boolean', description: '默认合并后关闭关联 Issue' },
            forbidden_pr_related_issue_closed: { type: 'boolean', description: '禁用合并后关闭关联 Issue' }
          },
          required: ['owner', 'repo']
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
            permission: { type: 'string', description: '成员权限' },
            role_id: { type: 'string', description: '自定义角色 ID' }
          },
          required: ['owner', 'repo', 'username']
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
            transferData: { type: 'object', description: '转移数据' },
            new_owner: { type: 'string', description: '新的所有者' }
          },
          required: ['owner', 'repo', 'new_owner']
        }
      },
      {
        name: 'get_repository_customized_roles',
        description: '获取项目自定义角色',
        inputSchema: {
          type: 'object',
          properties: {
            owner: { type: 'string', description: '仓库所有者' },
            repo: { type: 'string', description: '仓库名称' },
            start_date: { type: 'string', description: '开始日期' },
            end_date: { type: 'string', description: '结束日期' },
            direction: { type: 'string', description: '排序方向' }
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
            repo: { type: 'string', description: '仓库名称' },
            start_date: { type: 'string', description: '开始日期' },
            end_date: { type: 'string', description: '结束日期' },
            direction: { type: 'string', description: '排序方向' }
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
            path: { type: 'string', description: '文件路径' },
            ref: { type: 'string', description: '分支或 tag 名称，可选' }
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
            repo: { type: 'string', description: '仓库名称' },
            author: { type: 'string', description: '作者过滤' },
            current_user: { type: 'boolean', description: '仅当前用户' },
            since: { type: 'string', description: '开始时间' },
            until: { type: 'string', description: '结束时间' },
            ref_name: { type: 'string', description: '分支名称' }
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
            filter: { type: 'string', description: '事件过滤' },
            author: { type: 'string', description: '作者过滤' },
            before: { type: 'string', description: '结束时间' },
            after: { type: 'string', description: '开始时间' },
            page: { type: 'number', description: '页码' },
            perPage: { type: 'number', description: '每页数量' }
          },
          required: ['owner', 'repo']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'get_repository_tree':
        return await this.service.getRepositoryTree(args.owner, args.repo, args.sha, {
          page: args.page,
          perPage: args.perPage,
          recursive: args.recursive,
          file_path: args.file_path ?? args.filePath
        });
      
      case 'get_repository_content':
        return await this.service.getRepositoryContent(args.owner, args.repo, args.path, args.ref);
      
      case 'create_repository_file':
        return await this.service.createRepositoryFile(args.owner, args.repo, {
          path: args.path,
          content: args.content,
          message: args.message,
          branch: args.branch,
          author: {
            name: args['author[name]'] ?? args.authorName,
            email: args['author[email]'] ?? args.authorEmail
          }
        });
      
      case 'update_repository_file':
        return await this.service.updateRepositoryFile(args.owner, args.repo, {
          path: args.path,
          content: args.content,
          message: args.message,
          sha: args.sha,
          branch: args.branch,
          author: {
            name: args['author[name]'] ?? args.authorName,
            email: args['author[email]'] ?? args.authorEmail
          }
        });
      
      case 'delete_repository_file':
        return await this.service.deleteRepositoryFile(args.owner, args.repo, {
          path: args.path,
          message: args.message,
          sha: args.sha,
          branch: args.branch
        });
      
      case 'get_repository_file_list':
        return await this.service.getRepositoryFileList(
          args.owner,
          args.repo,
          args.path,
          args.ref,
          args.page,
          args.perPage,
          args.ref_name ?? args.refName,
          args.file_name ?? args.fileName
        );
      
      case 'get_repository_blob':
        return await this.service.getRepositoryFileBlob(args.owner, args.repo, args.sha);
      
      case 'get_repository_languages':
        return await this.service.getRepositoryLanguages(args.owner, args.repo);
      
      case 'get_repository_contributors':
        return await this.service.getRepositoryContributors(args.owner, args.repo, args.type);
      
      case 'set_repository_module_setting':
        return await this.service.setRepositoryModuleSetting(args.owner, args.repo, {
          ...args.moduleData,
          has_wiki: args.has_wiki,
          has_issue: args.has_issue,
          has_security: args.has_security,
          has_merge_request: args.has_merge_request,
          has_fork: args.has_fork,
          has_analysis: args.has_analysis,
          has_discussion: args.has_discussion
        });
      
      case 'update_repository':
        return await this.service.updateRepositorySettings(args.owner, args.repo, {
          name: args.name,
          description: args.description,
          homepage: args.homepage,
          path: args.path,
          private: args.private,
          default_branch: args.default_branch,
          lfs_enabled: args.lfs_enabled,
          tags: args.tags
        });
      
      case 'delete_repository':
        return await this.service.deleteRepository(args.owner, args.repo);
      
      case 'update_repository_reviewer':
        return await this.service.updateRepositoryReviewer(args.owner, args.repo, {
          assignees: args.assignees,
          testers: args.testers,
          assignees_number: args.assignees_number,
          testers_number: args.testers_number
        });
      
      case 'archive_repository':
        return await this.service.archiveRepository(args.org, args.repo ?? args.repository, {
          status: args.status,
          password: args.password
        });
      
      case 'transfer_repository_to_org':
        return await this.service.transferRepositoryToOrg(args.org, args.repo ?? args.repository, {
          transfer_to: args.transfer_to,
          password: args.password
        });
      
      case 'get_repository_transition':
        return await this.service.getRepositoryTransition(args.owner, args.repo);
      
      case 'update_repository_transition':
        return await this.service.updateRepositoryTransition(args.owner, args.repo, {
          ...args.transitionData,
          mode: args.mode
        });
      
      case 'set_repository_push_config':
        return await this.service.setRepositoryPushConfig(args.owner, args.repo, {
          ...args.config,
          reject_not_signed_by_gpg: args.reject_not_signed_by_gpg,
          commit_message_regex: args.commit_message_regex,
          max_file_size: args.max_file_size,
          skip_rule_for_owner: args.skip_rule_for_owner,
          deny_force_push: args.deny_force_push
        });
      
      case 'get_repository_push_config':
        return await this.service.getRepositoryPushConfig(args.owner, args.repo);
      
      case 'fork_repository':
        return await this.service.forkRepository(args.owner, args.repo, {
          ...args.forkData,
          organization: args.organization,
          name: args.name,
          path: args.path
        });
      
      case 'get_repository_forks':
        return await this.service.getRepositoryForks(
          args.owner,
          args.repo,
          args.page,
          args.perPage,
          args.sort,
          args.created_after ?? args.createdAfter,
          args.created_before ?? args.createdBefore
        );
      
      case 'upload_repository_image':
        return await this.service.uploadRepositoryImage(args.owner, args.repo, {
          body: args.body ?? args.fileData,
          file_name: args.file_name ?? args.fileName ?? args.filename
        });
      
      case 'upload_repository_file':
        return await this.service.uploadRepositoryFile(args.owner, args.repo, {
          file: args.file ?? args.fileData
        });
      
      case 'get_repository_subscribers':
        return await this.service.getRepositorySubscribers(
          args.owner,
          args.repo,
          args.page,
          args.perPage,
          args.watched_after ?? args.watchedAfter,
          args.watched_before ?? args.watchedBefore
        );
      
      case 'get_repository_stargazers':
        return await this.service.getRepositoryStargazers(
          args.owner,
          args.repo,
          args.page,
          args.perPage,
          args.starred_after ?? args.starredAfter,
          args.starred_before ?? args.starredBefore
        );
      
      case 'update_repository_settings':
        return await this.service.updateRepositoryRepoSettings(args.owner, args.repo, {
          disable_fork: args.disable_fork,
          forbidden_developer_create_branch: args.forbidden_developer_create_branch,
          forbidden_developer_create_tag: args.forbidden_developer_create_tag,
          forbidden_committer_create_branch: args.forbidden_committer_create_branch,
          forbidden_developer_create_branch_user_ids: args.forbidden_developer_create_branch_user_ids,
          branch_name_regex: args.branch_name_regex,
          tag_name_regex: args.tag_name_regex,
          generate_pre_merge_ref: args.generate_pre_merge_ref,
          rebase_disable_trigger_webhook: args.rebase_disable_trigger_webhook,
          open_gpg_verified: args.open_gpg_verified,
          include_lfs_objects: args.include_lfs_objects
        });
      
      case 'get_repository_settings':
        return await this.service.getRepositoryRepoSettings(args.owner, args.repo);
      
      case 'get_repository_pull_request_settings':
        return await this.service.getRepositoryPullRequestSettings(args.owner, args.repo);
      
      case 'update_repository_pull_request_settings':
        return await this.service.updateRepositoryPullRequestSettings(args.owner, args.repo, {
          approval_required_reviewers_enable: args.approval_required_reviewers_enable,
          approval_required_reviewers: args.approval_required_reviewers,
          only_allow_merge_if_all_discussions_are_resolved: args.only_allow_merge_if_all_discussions_are_resolved,
          only_allow_merge_if_pipeline_succeeds: args.only_allow_merge_if_pipeline_succeeds,
          disable_merge_by_self: args.disable_merge_by_self,
          can_force_merge: args.can_force_merge,
          add_notes_after_merged: args.add_notes_after_merged,
          mark_auto_merged_mr_as_closed: args.mark_auto_merged_mr_as_closed,
          can_reopen: args.can_reopen,
          delete_source_branch_when_merged: args.delete_source_branch_when_merged,
          disable_squash_merge: args.disable_squash_merge,
          auto_squash_merge: args.auto_squash_merge,
          merge_method: args.merge_method,
          squash_merge_with_no_merge_commit: args.squash_merge_with_no_merge_commit,
          merged_commit_author: args.merged_commit_author,
          approval_required_approvers: args.approval_required_approvers,
          approval_approver_ids: args.approval_approver_ids,
          approval_tester_ids: args.approval_tester_ids,
          approval_required_testers: args.approval_required_testers,
          is_check_cla: args.is_check_cla,
          is_allow_lite_merge_request: args.is_allow_lite_merge_request,
          lite_merge_request_prefix_title: args.lite_merge_request_prefix_title,
          close_issue_when_mr_merged: args.close_issue_when_mr_merged,
          forbidden_pr_related_issue_closed: args.forbidden_pr_related_issue_closed
        });
      
      case 'update_repository_member_role':
        return await this.service.updateRepositoryMemberRole(args.owner, args.repo, args.username, {
          permission: args.permission,
          role_id: args.role_id
        });
      
      case 'transfer_repository':
        return await this.service.transferRepository(args.owner, args.repo, {
          ...args.transferData,
          new_owner: args.new_owner ?? args.newOwner
        });
      
      case 'get_repository_customized_roles':
        return await this.service.getRepositoryCustomizedRoles(args.owner, args.repo);
      
      case 'get_repository_download_statistics':
        return await this.service.getRepositoryDownloadStatistics(
          args.owner,
          args.repo,
          args.start_date ?? args.startDate,
          args.end_date ?? args.endDate,
          args.direction
        );
      
      case 'get_repository_raw_file':
        return await this.service.getRepositoryRawFile(args.owner, args.repo, args.path, args.ref);
      
      case 'get_repository_contributors_statistic':
        return await this.service.getRepositoryContributorsStatistic(args.owner, args.repo, {
          author: args.author,
          current_user: args.current_user ?? args.currentUser,
          since: args.since,
          until: args.until,
          ref_name: args.ref_name ?? args.refName
        });
      
      case 'get_repository_events':
        return await this.service.getRepositoryEvents(args.owner, args.repo, {
          filter: args.filter,
          author: args.author,
          before: args.before,
          after: args.after,
          page: args.page,
          perPage: args.perPage
        });
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}
