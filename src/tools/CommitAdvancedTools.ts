import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { AtomGitService } from '../services/AtomGitService.js';

export class CommitAdvancedTools {
  private atomGitService: AtomGitService;

  constructor(atomGitService: AtomGitService) {
    this.atomGitService = atomGitService;
  }

  getTools(): Tool[] {
    return [
      {
        name: 'get_repository_commit_comments',
        description: '获取提交的评论列表',
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
            sha: {
              type: 'string',
              description: '提交的SHA值'
            },
            page: {
              type: 'number',
              description: '页码',
              default: 1
            },
            perPage: {
              type: 'number',
              description: '每页数量',
              default: 30
            }
          },
          required: ['owner', 'repo', 'sha']
        }
      },
      {
        name: 'create_repository_commit_comment',
        description: '为提交创建评论',
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
            sha: {
              type: 'string',
              description: '提交的SHA值'
            },
            commentData: {
              type: 'object',
              description: '评论数据（包含body、line、path等）'
            }
          },
          required: ['owner', 'repo', 'sha', 'commentData']
        }
      },
      {
        name: 'get_repository_commit_diff',
        description: '获取提交的差异信息',
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
            sha: {
              type: 'string',
              description: '提交的SHA值'
            }
          },
          required: ['owner', 'repo', 'sha']
        }
      },
      {
        name: 'compare_repository_commits',
        description: '比较两个提交之间的差异',
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
            base: {
              type: 'string',
              description: '基础分支或SHA'
            },
            head: {
              type: 'string',
              description: '比较分支或SHA'
            }
          },
          required: ['owner', 'repo', 'base', 'head']
        }
      },
      {
        name: 'get_repository_commit_patch',
        description: '获取提交的补丁文件',
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
            sha: {
              type: 'string',
              description: '提交的SHA值'
            }
          },
          required: ['owner', 'repo', 'sha']
        }
      },
      {
        name: 'get_repository_commit_stats',
        description: '获取提交的代码统计信息',
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
            sha: {
              type: 'string',
              description: '提交的SHA值（可选，不提供则获取仓库整体统计）'
            }
          },
          required: ['owner', 'repo']
        }
      },
      {
        name: 'get_repository_commit_statuses',
        description: '获取提交的状态信息',
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
            sha: {
              type: 'string',
              description: '提交的SHA值'
            }
          },
          required: ['owner', 'repo', 'sha']
        }
      },
      {
        name: 'create_repository_commit_status',
        description: '为提交创建状态',
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
            sha: {
              type: 'string',
              description: '提交的SHA值'
            },
            statusData: {
              type: 'object',
              description: '状态数据（包含state、target_url、description等）'
            }
          },
          required: ['owner', 'repo', 'sha', 'statusData']
        }
      },
      {
        name: 'get_repository_commit_comment',
        description: '获取特定提交评论',
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
            commentId: {
              type: 'number',
              description: '评论ID'
            }
          },
          required: ['owner', 'repo', 'commentId']
        }
      },
      {
        name: 'update_repository_commit_comment',
        description: '更新提交评论',
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
            commentId: {
              type: 'number',
              description: '评论ID'
            },
            commentData: {
              type: 'object',
              description: '更新的评论数据（通常包含body）'
            }
          },
          required: ['owner', 'repo', 'commentId', 'commentData']
        }
      },
      {
        name: 'delete_repository_commit_comment',
        description: '删除提交评论',
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
            commentId: {
              type: 'number',
              description: '评论ID'
            }
          },
          required: ['owner', 'repo', 'commentId']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'get_repository_commit_comments':
        return await this.atomGitService.getRepositoryCommitComments(
          args.owner, 
          args.repo, 
          args.sha, 
          args.page, 
          args.perPage
        );
      
      case 'create_repository_commit_comment':
        return await this.atomGitService.createRepositoryCommitComment(args.owner, args.repo, args.sha, args.commentData);
      
      case 'get_repository_commit_diff':
        return await this.atomGitService.getRepositoryCommitDiff(args.owner, args.repo, args.sha);
      
      case 'compare_repository_commits':
        return await this.atomGitService.compareRepositoryCommits(args.owner, args.repo, args.base, args.head);
      
      case 'get_repository_commit_patch':
        return await this.atomGitService.getRepositoryCommitPatch(args.owner, args.repo, args.sha);
      
      case 'get_repository_commit_stats':
        return await this.atomGitService.getRepositoryCommitStats(args.owner, args.repo, args.sha);
      
      case 'get_repository_commit_statuses':
        return await this.atomGitService.getRepositoryCommitStatuses(args.owner, args.repo, args.sha);
      
      case 'create_repository_commit_status':
        return await this.atomGitService.createRepositoryCommitStatus(args.owner, args.repo, args.sha, args.statusData);
      
      case 'get_repository_commit_comment':
        return await this.atomGitService.getRepositoryCommitComment(args.owner, args.repo, args.commentId);
      
      case 'update_repository_commit_comment':
        return await this.atomGitService.updateRepositoryCommitComment(args.owner, args.repo, args.commentId, args.commentData);
      
      case 'delete_repository_commit_comment':
        return await this.atomGitService.deleteRepositoryCommitComment(args.owner, args.repo, args.commentId);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}