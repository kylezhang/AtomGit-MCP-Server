import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { AtomGitService } from '../services/AtomGitService.js';

export class IssuesTools {
  constructor(private atomGitService: AtomGitService) {}

  getTools(): Tool[] {
    return [
      {
        name: 'get_repository_issues',
        description: 'Get all issues in a repository',
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
              description: 'State of issues to return (open, closed, all)',
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
        name: 'create_repository_issue',
        description: 'Create an issue in a repository',
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
              description: 'The title of the issue'
            },
            body: {
              type: 'string',
              description: 'The body content of the issue'
            },
            assignees: {
              type: 'array',
              description: 'Array of usernames to assign',
              items: {
                type: 'string'
              }
            },
            milestone: {
              type: 'number',
              description: 'Milestone number to associate with the issue'
            },
            labels: {
              type: 'array',
              description: 'Array of label names to add',
              items: {
                type: 'string'
              }
            }
          },
          required: ['owner', 'repo', 'title']
        }
      },
      {
        name: 'get_repository_issue',
        description: 'Get a specific issue in a repository',
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
            issueNumber: {
              type: 'number',
              description: 'The number of the issue'
            }
          },
          required: ['owner', 'repo', 'issueNumber']
        }
      },
      {
        name: 'update_repository_issue',
        description: 'Update an issue in a repository',
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
            issueNumber: {
              type: 'number',
              description: 'The number of the issue'
            },
            title: {
              type: 'string',
              description: 'The title of the issue'
            },
            body: {
              type: 'string',
              description: 'The body content of the issue'
            },
            state: {
              type: 'string',
              description: 'State of the issue (open, closed)',
              enum: ['open', 'closed']
            },
            assignees: {
              type: 'array',
              description: 'Array of usernames to assign',
              items: {
                type: 'string'
              }
            },
            milestone: {
              type: 'number',
              description: 'Milestone number to associate with the issue'
            },
            labels: {
              type: 'array',
              description: 'Array of label names',
              items: {
                type: 'string'
              }
            }
          },
          required: ['owner', 'repo', 'issueNumber']
        }
      },
      {
        name: 'get_repository_issue_comments',
        description: 'Get comments for a specific issue',
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
            issueNumber: {
              type: 'number',
              description: 'The number of the issue'
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
          required: ['owner', 'repo', 'issueNumber']
        }
      },
      {
        name: 'create_repository_issue_comment',
        description: 'Create a comment on an issue',
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
            issueNumber: {
              type: 'number',
              description: 'The number of the issue'
            },
            body: {
              type: 'string',
              description: 'The text of the comment'
            }
          },
          required: ['owner', 'repo', 'issueNumber', 'body']
        }
      },
      {
        name: 'get_repository_issue_comment',
        description: 'Get a specific comment on an issue',
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
            commentId: {
              type: 'number',
              description: 'The ID of the comment'
            }
          },
          required: ['owner', 'repo', 'commentId']
        }
      },
      {
        name: 'update_repository_issue_comment',
        description: 'Update a comment on an issue',
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
            commentId: {
              type: 'number',
              description: 'The ID of the comment'
            },
            body: {
              type: 'string',
              description: 'The updated text of the comment'
            }
          },
          required: ['owner', 'repo', 'commentId', 'body']
        }
      },
      {
        name: 'delete_repository_issue_comment',
        description: 'Delete a comment on an issue',
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
            commentId: {
              type: 'number',
              description: 'The ID of the comment'
            }
          },
          required: ['owner', 'repo', 'commentId']
        }
      },
      {
        name: 'create_repository_issue_label',
        description: 'Create labels for an issue',
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
            issueNumber: {
              type: 'number',
              description: 'The number of the issue'
            },
            labels: {
              type: 'array',
              description: 'Array of label names to add',
              items: {
                type: 'string'
              }
            }
          },
          required: ['owner', 'repo', 'issueNumber', 'labels']
        }
      },
      {
        name: 'replace_repository_issue_labels',
        description: 'Replace all labels for an issue',
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
            issueNumber: {
              type: 'number',
              description: 'The number of the issue'
            },
            labels: {
              type: 'array',
              description: 'Array of label names to set',
              items: {
                type: 'string'
              }
            }
          },
          required: ['owner', 'repo', 'issueNumber', 'labels']
        }
      },
      {
        name: 'delete_repository_issue_label',
        description: 'Delete a label from an issue',
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
            issueNumber: {
              type: 'number',
              description: 'The number of the issue'
            },
            name: {
              type: 'string',
              description: 'The name of the label to delete'
            }
          },
          required: ['owner', 'repo', 'issueNumber', 'name']
        }
      },
      {
        name: 'get_repository_issue_operate_logs',
        description: 'Get operation logs for an issue',
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
            issueNumber: {
              type: 'number',
              description: 'The number of the issue'
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
          required: ['owner', 'repo', 'issueNumber']
        }
      },
      {
        name: 'get_repository_issue_related_branches',
        description: 'Get branches related to an issue',
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
            issueNumber: {
              type: 'number',
              description: 'The number of the issue'
            }
          },
          required: ['owner', 'repo', 'issueNumber']
        }
      },
      {
        name: 'get_repository_issue_reactions',
        description: 'Get reactions for an issue',
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
            issueNumber: {
              type: 'number',
              description: 'The number of the issue'
            }
          },
          required: ['owner', 'repo', 'issueNumber']
        }
      },
      {
        name: 'get_repository_issue_comment_reactions',
        description: 'Get reactions for an issue comment',
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
            commentId: {
              type: 'number',
              description: 'The ID of the comment'
            }
          },
          required: ['owner', 'repo', 'commentId']
        }
      },
      {
        name: 'get_repository_issue_modify_history',
        description: 'Get modification history for an issue',
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
            issueNumber: {
              type: 'number',
              description: 'The number of the issue'
            }
          },
          required: ['owner', 'repo', 'issueNumber']
        }
      },
      {
        name: 'get_repository_issue_comment_modify_history',
        description: 'Get modification history for an issue comment',
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
            commentId: {
              type: 'number',
              description: 'The ID of the comment'
            }
          },
          required: ['owner', 'repo', 'commentId']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'get_repository_issues':
        return await this.atomGitService.getRepositoryIssues(
          args.owner, 
          args.repo, 
          args.state, 
          args.page, 
          args.perPage
        );
      
      case 'create_repository_issue':
        const issueData = {
          title: args.title,
          body: args.body,
          assignees: args.assignees,
          milestone: args.milestone,
          labels: args.labels
        };
        return await this.atomGitService.createRepositoryIssue(args.owner, args.repo, issueData);
      
      case 'get_repository_issue':
        return await this.atomGitService.getRepositoryIssue(args.owner, args.repo, args.issueNumber);

      case 'update_repository_issue':
        return await this.atomGitService.updateRepositoryIssue(args.owner, args.repo, args.issueNumber, {
          title: args.title,
          body: args.body,
          state: args.state,
          assignees: args.assignees,
          milestone: args.milestone,
          labels: args.labels
        });

      case 'get_repository_issue_comments':
        return await this.atomGitService.getRepositoryIssueComments(
          args.owner,
          args.repo,
          args.issueNumber,
          args.page,
          args.perPage
        );

      case 'create_repository_issue_comment':
        return await this.atomGitService.createRepositoryIssueComment(args.owner, args.repo, args.issueNumber, {
          body: args.body
        });

      case 'get_repository_issue_comment':
        return await this.atomGitService.getRepositoryIssueComment(args.owner, args.repo, args.commentId);

      case 'update_repository_issue_comment':
        return await this.atomGitService.updateRepositoryIssueComment(args.owner, args.repo, args.commentId, {
          body: args.body
        });

      case 'delete_repository_issue_comment':
        return await this.atomGitService.deleteRepositoryIssueComment(args.owner, args.repo, args.commentId);

      case 'create_repository_issue_label':
        return await this.atomGitService.createRepositoryIssueLabel(args.owner, args.repo, args.issueNumber, args.labels);

      case 'replace_repository_issue_labels':
        return await this.atomGitService.replaceRepositoryIssueLabels(args.owner, args.repo, args.issueNumber, args.labels);

      case 'delete_repository_issue_label':
        return await this.atomGitService.deleteRepositoryIssueLabel(args.owner, args.repo, args.issueNumber, args.name);

      case 'get_repository_issue_operate_logs':
        return await this.atomGitService.getRepositoryIssueOperateLogs(
          args.owner,
          args.repo,
          args.issueNumber,
          args.page,
          args.perPage
        );

      case 'get_repository_issue_related_branches':
        return await this.atomGitService.getRepositoryIssueRelatedBranches(args.owner, args.repo, args.issueNumber);

      case 'get_repository_issue_reactions':
        return await this.atomGitService.getRepositoryIssueReactions(args.owner, args.repo, args.issueNumber);

      case 'get_repository_issue_comment_reactions':
        return await this.atomGitService.getRepositoryIssueCommentReactions(args.owner, args.repo, args.commentId);

      case 'get_repository_issue_modify_history':
        return await this.atomGitService.getRepositoryIssueModifyHistory(args.owner, args.repo, args.issueNumber);

      case 'get_repository_issue_comment_modify_history':
        return await this.atomGitService.getRepositoryIssueCommentModifyHistory(args.owner, args.repo, args.commentId);

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}