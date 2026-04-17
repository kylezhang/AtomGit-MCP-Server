import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { IssuesService } from '../services/IssuesService.js';

const stringOrNumberSchema = (description: string, defaultValue?: number) => ({
  oneOf: [
    { type: 'string' },
    { type: 'number' }
  ],
  description,
  ...(defaultValue !== undefined ? { default: defaultValue } : {})
});

const stringArraySchema = {
  type: 'array',
  items: {
    type: 'string'
  }
};

const stringOrArraySchema = (description: string) => ({
  oneOf: [
    { type: 'string' },
    stringArraySchema
  ],
  description
});

export class IssuesTools {
  constructor(private issuesService: IssuesService) { }

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
            labels: {
              type: 'string',
              description: 'Comma-separated label names'
            },
            sort: {
              type: 'string',
              description: 'Sort field'
            },
            direction: {
              type: 'string',
              description: 'Sort direction'
            },
            since: {
              type: 'string',
              description: 'Only return issues updated after this time'
            },
            created_at: {
              type: 'string',
              description: 'Filter by created_at time'
            },
            milestone: stringOrNumberSchema('Milestone number to filter by'),
            assignee: {
              type: 'string',
              description: 'Assignee username'
            },
            creator: {
              type: 'string',
              description: 'Creator username'
            },
            created_after: {
              type: 'string',
              description: 'Only return issues created after this time'
            },
            created_before: {
              type: 'string',
              description: 'Only return issues created before this time'
            },
            updated_after: {
              type: 'string',
              description: 'Only return issues updated after this time'
            },
            updated_before: {
              type: 'string',
              description: 'Only return issues updated before this time'
            },
            search: {
              type: 'string',
              description: 'Search keyword'
            },
            page: {
              ...stringOrNumberSchema('Page number for pagination', 1)
            },
            perPage: {
              ...stringOrNumberSchema('Number of results per page', 30)
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
            assignee: {
              type: 'string',
              description: 'Comma-separated usernames to assign'
            },
            assignees: {
              type: 'array',
              description: 'Legacy compatibility alias for assignee',
              items: {
                type: 'string'
              }
            },
            milestone: {
              type: 'number',
              description: 'Milestone number to associate with the issue'
            },
            labels: {
              description: 'Comma-separated label names. Also accepts an array for legacy compatibility.',
              oneOf: [
                {
                  type: 'string'
                },
                {
                  type: 'array',
                  items: {
                    type: 'string'
                  }
                }
              ]
            },
            security_hole: {
              type: 'string',
              description: 'Security issue marker'
            },
            template_path: {
              type: 'string',
              description: 'Issue template path'
            },
            issue_type: {
              type: 'string',
              description: 'Issue type'
            },
            issue_severity: {
              type: 'string',
              description: 'Issue severity'
            },
            custom_fields: {
              type: 'array',
              description: 'Custom enterprise issue fields',
              items: {
                type: 'object',
                properties: {
                  field_name: {
                    type: 'string'
                  },
                  field_values: {
                    type: 'array',
                    items: {
                      type: 'string'
                    }
                  }
                },
                required: ['field_name', 'field_values']
              }
            }
          },
          required: ['owner', 'repo', 'title', 'body']
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
            number: stringOrNumberSchema('The number of the issue')
          },
          required: ['owner', 'repo', 'number']
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
            number: stringOrNumberSchema('The number of the issue'),
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
              description: 'State of the issue (close/reopen, also accepts open/closed for compatibility)',
              enum: ['open', 'closed', 'reopen', 'close']
            },
            assignee: {
              type: 'string',
              description: 'Comma-separated usernames to assign'
            },
            assignees: {
              type: 'array',
              description: 'Legacy compatibility alias for assignee',
              items: {
                type: 'string'
              }
            },
            milestone: {
              type: 'number',
              description: 'Milestone number to associate with the issue'
            },
            labels: {
              description: 'Comma-separated label names. Also accepts an array for legacy compatibility.',
              oneOf: [
                {
                  type: 'string'
                },
                {
                  type: 'array',
                  items: {
                    type: 'string'
                  }
                }
              ]
            },
            security_hole: {
              type: 'string',
              description: 'Security issue marker'
            },
            template_path: {
              type: 'string',
              description: 'Issue template path'
            },
            issue_type: {
              type: 'string',
              description: 'Issue type'
            },
            issue_severity: {
              type: 'string',
              description: 'Issue severity'
            },
            status: {
              type: 'string',
              description: 'Enterprise issue status'
            },
            custom_fields: {
              type: 'array',
              description: 'Custom enterprise issue fields',
              items: {
                type: 'object',
                properties: {
                  field_name: {
                    type: 'string'
                  },
                  field_values: {
                    type: 'array',
                    items: {
                      type: 'string'
                    }
                  }
                },
                required: ['field_name', 'field_values']
              }
            }
          },
          required: ['owner', 'repo', 'number', 'title', 'issue_severity']
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
            number: stringOrNumberSchema('The number of the issue'),
            order: {
              type: 'string',
              description: 'Sort order'
            },
            since: {
              type: 'string',
              description: 'Only return comments updated after this time'
            },
            page: {
              ...stringOrNumberSchema('Page number for pagination', 1)
            },
            perPage: {
              ...stringOrNumberSchema('Number of results per page', 30)
            }
          },
          required: ['owner', 'repo', 'number']
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
            number: stringOrNumberSchema('The number of the issue'),
            body: {
              type: 'string',
              description: 'The text of the comment'
            }
          },
          required: ['owner', 'repo', 'number', 'body']
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
            id: stringOrNumberSchema('The ID of the comment')
          },
          required: ['owner', 'repo', 'id']
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
            id: stringOrNumberSchema('The ID of the comment'),
            body: {
              type: 'string',
              description: 'The updated text of the comment'
            }
          },
          required: ['owner', 'repo', 'id', 'body']
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
            id: stringOrNumberSchema('The ID of the comment')
          },
          required: ['owner', 'repo', 'id']
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
            number: stringOrNumberSchema('The number of the issue'),
            labels: {
              type: 'array',
              description: 'Array of label names to add',
              items: {
                type: 'string'
              }
            }
          },
          required: ['owner', 'repo', 'number']
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
            number: stringOrNumberSchema('The number of the issue'),
            name: {
              type: 'string',
              description: 'The name of the label to delete'
            }
          },
          required: ['owner', 'repo', 'number', 'name']
        }
      },
      {
        name: 'delete_repository_all_issue_labels',
        description: 'Delete all labels from an issue',
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
            number: stringOrNumberSchema('The number of the issue')
          },
          required: ['owner', 'repo', 'number']
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
            number: stringOrNumberSchema('The number of the issue'),
            page: {
              ...stringOrNumberSchema('Page number for pagination', 1)
            },
            perPage: {
              ...stringOrNumberSchema('Number of results per page', 30)
            }
          },
          required: ['owner', 'repo', 'number']
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
            number: stringOrNumberSchema('The number of the issue')
          },
          required: ['owner', 'repo', 'number']
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
            number: stringOrNumberSchema('The number of the issue'),
            page: {
              ...stringOrNumberSchema('Page number for pagination', 1)
            },
            perPage: {
              ...stringOrNumberSchema('Number of results per page', 30)
            },
            emoji_name: {
              type: 'string',
              description: 'Emoji filter'
            }
          },
          required: ['owner', 'repo', 'number']
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
            comment_id: stringOrNumberSchema('The ID of the comment'),
            page: {
              ...stringOrNumberSchema('Page number for pagination', 1)
            },
            perPage: {
              ...stringOrNumberSchema('Number of results per page', 30)
            },
            emoji_name: {
              type: 'string',
              description: 'Emoji filter'
            }
          },
          required: ['owner', 'repo', 'comment_id']
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
            number: stringOrNumberSchema('The number of the issue')
          },
          required: ['owner', 'repo', 'number']
        }
      },
      {
        name: 'get_repository_issue_comment_modify_history',
        description: 'Get modification history of an issue comment',
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
            comment_id: stringOrNumberSchema('The ID of the comment')
          },
          required: ['owner', 'repo', 'comment_id']
        }
      },
      {
        name: 'get_enterprise_issue_labels',
        description: 'Get labels for an enterprise issue',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise: {
              type: 'string',
              description: 'The enterprise name'
            },
            issue_id: {
              type: 'string',
              description: 'The issue ID'
            },
            page: {
              ...stringOrNumberSchema('Page number for pagination', 1)
            },
            perPage: {
              ...stringOrNumberSchema('Number of results per page', 30)
            }
          },
          required: ['enterprise', 'issue_id']
        }
      },
      {
        name: 'get_enterprise_issues',
        description: 'Get all issues for an enterprise',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise: {
              type: 'string',
              description: 'The enterprise name'
            },
            state: {
              type: 'string',
              description: 'Issue state'
            },
            labels: {
              type: 'string',
              description: 'Comma-separated label names'
            },
            sort: {
              type: 'string',
              description: 'Sort field'
            },
            direction: {
              type: 'string',
              description: 'Sort direction'
            },
            since: {
              type: 'string',
              description: 'Only return issues updated after this time'
            },
            milestone: stringOrNumberSchema('Milestone number'),
            assignee: {
              type: 'string',
              description: 'Assignee username'
            },
            creator: {
              type: 'string',
              description: 'Creator username'
            },
            program: {
              type: 'string',
              description: 'Program filter'
            },
            created_at: {
              type: 'string',
              description: 'Created at filter'
            },
            created_before: {
              type: 'string',
              description: 'Created before filter'
            },
            search: {
              type: 'string',
              description: 'Search keyword'
            },
            page: {
              ...stringOrNumberSchema('Page number for pagination', 1)
            },
            perPage: {
              ...stringOrNumberSchema('Number of results per page', 30)
            }
          },
          required: ['enterprise']
        }
      },
      {
        name: 'get_user_issues',
        description: 'Get all issues for the authenticated user',
        inputSchema: {
          type: 'object',
          properties: {
            filter: {
              type: 'string',
              description: 'Issue filter'
            },
            state: {
              type: 'string',
              description: 'Issue state'
            },
            labels: {
              type: 'string',
              description: 'Comma-separated label names'
            },
            sort: {
              type: 'string',
              description: 'Sort field'
            },
            direction: {
              type: 'string',
              description: 'Sort direction'
            },
            since: {
              type: 'string',
              description: 'Only return issues updated after this time'
            },
            schedule: {
              type: 'string',
              description: 'Schedule filter'
            },
            deadline: {
              type: 'string',
              description: 'Deadline filter'
            },
            created_at: {
              type: 'string',
              description: 'Created at filter'
            },
            finished_at: {
              type: 'string',
              description: 'Finished at filter'
            },
            page: {
              ...stringOrNumberSchema('Page number for pagination', 1)
            },
            perPage: {
              ...stringOrNumberSchema('Number of results per page', 30)
            }
          },
          required: []
        }
      },
      {
        name: 'get_organization_issues',
        description: 'Get issues for an organization',
        inputSchema: {
          type: 'object',
          properties: {
            org: {
              type: 'string',
              description: 'The organization name'
            },
            filter: {
              type: 'string',
              description: 'Issue filter'
            },
            state: {
              type: 'string',
              description: 'Issue state'
            },
            labels: {
              type: 'string',
              description: 'Comma-separated label names'
            },
            sort: {
              type: 'string',
              description: 'Sort field'
            },
            direction: {
              type: 'string',
              description: 'Sort direction'
            },
            created_at: {
              type: 'string',
              description: 'Created at filter'
            },
            search: {
              type: 'string',
              description: 'Search keyword'
            },
            page: {
              ...stringOrNumberSchema('Page number for pagination', 1)
            },
            perPage: {
              ...stringOrNumberSchema('Number of results per page', 30)
            }
          },
          required: ['org']
        }
      },
      {
        name: 'get_enterprise_issue_comments',
        description: 'Get comments for an enterprise issue',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise: {
              type: 'string',
              description: 'The enterprise name'
            },
            number: {
              type: 'number',
              description: 'The issue number'
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
          required: ['enterprise', 'number']
        }
      },
      {
        name: 'get_enterprise_issue',
        description: 'Get a specific enterprise issue',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise: {
              type: 'string',
              description: 'The enterprise name'
            },
            number: {
              type: 'number',
              description: 'The issue number'
            }
          },
          required: ['enterprise', 'number']
        }
      },
      {
        name: 'get_enterprise_issue_statuses',
        description: 'Get enterprise issue statuses',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise: {
              type: 'string',
              description: 'The enterprise name'
            }
          },
          required: ['enterprise']
        }
      },
      {
        name: 'get_all_repository_issue_comments',
        description: 'Get all issue comments in a repository',
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
            sort: {
              type: 'string',
              description: 'Sort field'
            },
            direction: {
              type: 'string',
              description: 'Sort direction'
            },
            since: {
              type: 'string',
              description: 'Only return comments updated after this time'
            },
            page: {
              ...stringOrNumberSchema('Page number for pagination', 1)
            },
            perPage: {
              ...stringOrNumberSchema('Number of results per page', 30)
            }
          },
          required: ['owner', 'repo']
        }
      },
      {
        name: 'get_repository_issue_pull_requests',
        description: 'Get pull requests associated with an issue',
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
            number: stringOrNumberSchema('The issue number'),
            mode: stringOrNumberSchema('Relation mode filter')
          },
          required: ['owner', 'repo', 'number']
        }
      },
      {
        name: 'update_repository_issue_related_branches',
        description: 'Update branches related to an issue',
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
            number: stringOrNumberSchema('The number of the issue'),
            branch_names: stringOrArraySchema('Branch names to associate with the issue')
          },
          required: ['owner', 'repo', 'number', 'branch_names']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    const number = args.number ?? args.issueNumber;
    const id = args.id ?? args.commentId;
    const commentId = args.comment_id ?? args.commentId;
    const issueId = args.issue_id ?? args.issueId;

    switch (name) {
      case 'get_repository_issues':
        return await this.issuesService.getRepositoryIssues(
          args.owner,
          args.repo,
          {
            state: args.state,
            labels: args.labels,
            sort: args.sort,
            direction: args.direction,
            since: args.since,
            created_at: args.created_at ?? args.createdAt,
            milestone: args.milestone,
            assignee: args.assignee,
            creator: args.creator,
            created_after: args.created_after ?? args.createdAfter,
            created_before: args.created_before ?? args.createdBefore,
            updated_after: args.updated_after ?? args.updatedAfter,
            updated_before: args.updated_before ?? args.updatedBefore,
            search: args.search,
            page: args.page,
            perPage: args.perPage
          }
        );

      case 'create_repository_issue':
        const issueData = {
          title: args.title,
          body: args.body,
          assignee: args.assignee,
          assignees: args.assignees,
          milestone: args.milestone,
          labels: args.labels,
          security_hole: args.security_hole,
          template_path: args.template_path,
          issue_type: args.issue_type,
          issue_severity: args.issue_severity,
          custom_fields: args.custom_fields
        };
        return await this.issuesService.createRepositoryIssue(args.owner, args.repo, issueData);

      case 'get_repository_issue':
        return await this.issuesService.getRepositoryIssue(args.owner, args.repo, number);

      case 'update_repository_issue':
        return await this.issuesService.updateRepositoryIssue(args.owner, args.repo, number, {
          title: args.title,
          body: args.body,
          state: args.state,
          assignee: args.assignee,
          assignees: args.assignees,
          milestone: args.milestone,
          labels: args.labels,
          security_hole: args.security_hole,
          template_path: args.template_path,
          issue_type: args.issue_type,
          status: args.status,
          issue_severity: args.issue_severity,
          custom_fields: args.custom_fields
        });

      case 'get_repository_issue_comments':
        return await this.issuesService.getRepositoryIssueComments(
          args.owner,
          args.repo,
          number,
          {
            order: args.order,
            since: args.since,
            page: args.page,
            perPage: args.perPage
          }
        );

      case 'create_repository_issue_comment':
        return await this.issuesService.createRepositoryIssueComment(args.owner, args.repo, number, {
          body: args.body
        });

      case 'get_repository_issue_comment':
        return await this.issuesService.getRepositoryIssueComment(args.owner, args.repo, id);

      case 'update_repository_issue_comment':
        return await this.issuesService.updateRepositoryIssueComment(args.owner, args.repo, id, {
          body: args.body
        });

      case 'delete_repository_issue_comment':
        return await this.issuesService.deleteRepositoryIssueComment(args.owner, args.repo, id);

      case 'create_repository_issue_label':
        return await this.issuesService.createRepositoryIssueLabel(args.owner, args.repo, number, args.labels);

      case 'delete_repository_issue_label':
        return await this.issuesService.deleteRepositoryIssueLabel(args.owner, args.repo, number, args.name);

      case 'get_repository_issue_operate_logs':
        return await this.issuesService.getRepositoryIssueOperateLogs(
          args.owner,
          args.repo,
          number,
          {
            page: args.page,
            perPage: args.perPage
          }
        );

      case 'get_repository_issue_related_branches':
        return await this.issuesService.getRepositoryIssueRelatedBranches(args.owner, args.repo, number);

      case 'get_repository_issue_reactions':
        return await this.issuesService.getRepositoryIssueReactions(args.owner, args.repo, number, {
          page: args.page,
          perPage: args.perPage,
          emoji_name: args.emoji_name ?? args.emojiName
        });

      case 'get_repository_issue_comment_reactions':
        return await this.issuesService.getRepositoryIssueCommentReactions(args.owner, args.repo, commentId, {
          page: args.page,
          perPage: args.perPage,
          emoji_name: args.emoji_name ?? args.emojiName
        });

      case 'get_repository_issue_modify_history':
        return await this.issuesService.getRepositoryIssueModifyHistory(args.owner, args.repo, number);

      case 'get_repository_issue_comment_modify_history':
        return await this.issuesService.getRepositoryIssueCommentModifyHistory(args.owner, args.repo, commentId);

      case 'get_enterprise_issue_labels':
        return await this.issuesService.getEnterpriseIssueLabels(args.enterprise, issueId, {
          page: args.page,
          perPage: args.perPage
        });

      case 'get_enterprise_issues':
        return await this.issuesService.getEnterpriseIssues(args.enterprise, {
          state: args.state,
          labels: args.labels,
          sort: args.sort,
          direction: args.direction,
          since: args.since,
          milestone: args.milestone,
          assignee: args.assignee,
          creator: args.creator,
          program: args.program,
          created_at: args.created_at ?? args.createdAt,
          created_before: args.created_before ?? args.createdBefore,
          search: args.search,
          page: args.page,
          perPage: args.perPage
        });

      case 'get_user_issues':
        return await this.issuesService.getUserIssues({
          filter: args.filter,
          state: args.state,
          labels: args.labels,
          sort: args.sort,
          direction: args.direction,
          since: args.since,
          schedule: args.schedule,
          deadline: args.deadline,
          created_at: args.created_at ?? args.createdAt,
          finished_at: args.finished_at ?? args.finishedAt,
          page: args.page,
          perPage: args.perPage
        });

      case 'get_organization_issues':
        return await this.issuesService.getOrganizationIssues(args.org, {
          filter: args.filter,
          state: args.state,
          labels: args.labels,
          sort: args.sort,
          direction: args.direction,
          created_at: args.created_at ?? args.createdAt,
          search: args.search,
          page: args.page,
          perPage: args.perPage
        });

      case 'get_enterprise_issue_comments':
        return await this.issuesService.getEnterpriseIssueComments(args.enterprise, number, {
          page: args.page,
          perPage: args.perPage
        });

      case 'get_enterprise_issue':
        return await this.issuesService.getEnterpriseIssue(args.enterprise, number);

      case 'delete_repository_all_issue_labels':
        return await this.issuesService.deleteRepositoryAllIssueLabels(args.owner, args.repo, number);

      case 'get_all_repository_issue_comments':
        return await this.issuesService.getAllRepositoryIssueComments(args.owner, args.repo, {
          sort: args.sort,
          direction: args.direction,
          since: args.since,
          page: args.page,
          perPage: args.perPage
        });

      case 'get_repository_issue_pull_requests':
        return await this.issuesService.getRepositoryIssuePullRequests(args.owner, args.repo, number, {
          mode: args.mode
        });

      case 'get_enterprise_issue_statuses':
        return await this.issuesService.getEnterpriseIssueStatuses(args.enterprise);

      case 'update_repository_issue_related_branches':
        return await this.issuesService.updateRepositoryIssueRelatedBranches(args.owner, args.repo, number, {
          branch_names: Array.isArray(args.branch_names)
            ? args.branch_names
            : args.branch_names
              ? [args.branch_names]
              : args.branchName
                ? [args.branchName]
                : []
        });

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}
