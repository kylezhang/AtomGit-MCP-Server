import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { CommitService } from '../services/CommitService.js';

export class CommitTools {
  constructor(private commitService: CommitService) {}

  getTools(): Tool[] {
    return [
      {
        name: 'get_repository_commits',
        description: 'Get all commits in a repository',
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
            },
            sha: {
              type: 'string',
              description: 'SHA or branch to start listing commits from (optional)'
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
        name: 'get_repository_commit',
        description: 'Get a specific commit in a repository',
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
            sha: {
              type: 'string',
              description: 'The SHA of commit'
            }
          },
          required: ['owner', 'repo', 'sha']
        }
      },
      {
        name: 'compare_repository_commits',
        description: 'Compare two commits in a repository',
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
            base: {
              type: 'string',
              description: 'The base commit SHA or branch name'
            },
            head: {
              type: 'string',
              description: 'The head commit SHA or branch name'
            }
          },
          required: ['owner', 'repo', 'base', 'head']
        }
      },
      {
        name: 'create_repository_commit_comment',
        description: 'Create a comment on a specific commit',
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
            sha: {
              type: 'string',
              description: 'The SHA of commit'
            },
            body: {
              type: 'string',
              description: 'The comment content'
            }
          },
          required: ['owner', 'repo', 'sha', 'body']
        }
      },
      {
        name: 'delete_repository_commit_comment',
        description: 'Delete a commit comment',
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
            id: {
              type: 'number',
              description: 'The ID of the comment to delete'
            }
          },
          required: ['owner', 'repo', 'id']
        }
      },
      {
        name: 'get_repository_commit_comment',
        description: 'Get a specific commit comment',
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
            id: {
              type: 'number',
              description: 'The ID of the comment'
            }
          },
          required: ['owner', 'repo', 'id']
        }
      },
      {
        name: 'update_repository_commit_comment',
        description: 'Update a commit comment',
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
            id: {
              type: 'number',
              description: 'The ID of the comment to update'
            },
            body: {
              type: 'string',
              description: 'The updated comment content'
            }
          },
          required: ['owner', 'repo', 'id', 'body']
        }
      },
      {
        name: 'get_repository_commit_comments',
        description: 'Get all commit comments for a repository',
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
        name: 'get_repository_commit_statistics',
        description: 'Get code contribution statistics for a repository',
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
            sha: {
              type: 'string',
              description: 'SHA or branch to get statistics for (optional)'
            }
          },
          required: ['owner', 'repo']
        }
      },
      {
        name: 'get_repository_commit_ref_comments',
        description: 'Get comments for a specific commit reference',
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
            ref: {
              type: 'string',
              description: 'The commit reference (SHA or branch)'
            }
          },
          required: ['owner', 'repo', 'ref']
        }
      },
      {
        name: 'get_repository_commit_diff',
        description: 'Get the diff for a specific commit',
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
            sha: {
              type: 'string',
              description: 'The SHA of commit'
            }
          },
          required: ['owner', 'repo', 'sha']
        }
      },
      {
        name: 'get_repository_commit_patch',
        description: 'Get the patch for a specific commit',
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
            sha: {
              type: 'string',
              description: 'The SHA of commit'
            }
          },
          required: ['owner', 'repo', 'sha']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    const id = args.id ?? args.commentId;

    switch (name) {
      case 'get_repository_commits':
        return await this.commitService.getRepositoryCommits(
          args.owner, 
          args.repo, 
          args.sha, 
          args.page, 
          args.perPage
        );
      
      case 'get_repository_commit':
        return await this.commitService.getRepositoryCommit(args.owner, args.repo, args.sha);
      
      case 'compare_repository_commits':
        return await this.commitService.compareRepositoryCommits(args.owner, args.repo, args.base, args.head);
      
      case 'create_repository_commit_comment':
        return await this.commitService.createRepositoryCommitComment(args.owner, args.repo, args.sha, { body: args.body });
      
      case 'delete_repository_commit_comment':
        return await this.commitService.deleteRepositoryCommitComment(args.owner, args.repo, id);
      
      case 'get_repository_commit_comment':
        return await this.commitService.getRepositoryCommitComment(args.owner, args.repo, id);
      
      case 'update_repository_commit_comment':
        return await this.commitService.updateRepositoryCommitComment(args.owner, args.repo, id, { body: args.body });
      
      case 'get_repository_commit_comments':
        return await this.commitService.getRepositoryCommitComments(args.owner, args.repo, args.page, args.perPage);
      
      case 'get_repository_commit_statistics':
        return await this.commitService.getRepositoryCommitStatistics(args.owner, args.repo, args.sha);
      
      case 'get_repository_commit_ref_comments':
        return await this.commitService.getRepositoryCommitRefComments(args.owner, args.repo, args.ref);
      
      case 'get_repository_commit_diff':
        return await this.commitService.getRepositoryCommitDiff(args.owner, args.repo, args.sha);
      
      case 'get_repository_commit_patch':
        return await this.commitService.getRepositoryCommitPatch(args.owner, args.repo, args.sha);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}
