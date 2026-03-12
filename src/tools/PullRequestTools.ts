import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { PullRequestService } from '../services/PullRequestService.js';

export class PullRequestTools {
  constructor(private pullRequestService: PullRequestService) {}

  getTools(): Tool[] {
    return [
      {
        name: 'get_repository_pulls',
        description: 'Get all pull requests in a repository',
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
              description: 'State of pull requests to return (open, closed, all)',
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
        name: 'get_repository_pull',
        description: 'Get a specific pull request in a repository',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
            }
          },
          required: ['owner', 'repo', 'pullNumber']
        }
      },
      {
        name: 'create_repository_pull',
        description: 'Create a new pull request in a repository',
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
              description: 'The title of the pull request'
            },
            head: {
              type: 'string',
              description: 'The name of the branch where your changes are implemented'
            },
            base: {
              type: 'string',
              description: 'The name of the branch you want the changes pulled into'
            },
            body: {
              type: 'string',
              description: 'The contents of the pull request',
              default: ''
            },
            draft: {
              type: 'boolean',
              description: 'Indicates whether the pull request is a draft',
              default: false
            },
            maintainer_can_modify: {
              type: 'boolean',
              description: 'Indicates whether maintainers can modify the pull request',
              default: true
            }
          },
          required: ['owner', 'repo', 'title', 'head', 'base']
        }
      },
      {
        name: 'merge_repository_pull',
        description: 'Merge a pull request',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
            },
            commit_title: {
              type: 'string',
              description: 'Title for the automatic commit message'
            },
            commit_message: {
              type: 'string',
              description: 'Extra detail to append to automatic commit message',
              default: ''
            },
            merge_method: {
              type: 'string',
              description: 'Merge method to use (merge, squash, rebase)',
              enum: ['merge', 'squash', 'rebase'],
              default: 'merge'
            }
          },
          required: ['owner', 'repo', 'pullNumber']
        }
      },
      {
        name: 'get_repository_pull_merge_status',
        description: 'Check if a pull request can be merged',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
            }
          },
          required: ['owner', 'repo', 'pullNumber']
        }
      },
      {
        name: 'get_repository_pull_issues',
        description: 'Get issues associated with a pull request',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
            }
          },
          required: ['owner', 'repo', 'pullNumber']
        }
      },
      {
        name: 'create_repository_pull_comment',
        description: 'Create a comment on a pull request',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
            },
            body: {
              type: 'string',
              description: 'The text of the comment'
            },
            commit_id: {
              type: 'string',
              description: 'The SHA of the commit to comment on'
            },
            path: {
              type: 'string',
              description: 'The relative path to the file being commented on'
            },
            position: {
              type: 'number',
              description: 'The line index in the diff to comment on'
            }
          },
          required: ['owner', 'repo', 'pullNumber', 'body']
        }
      },
      {
        name: 'get_repository_pull_comments',
        description: 'Get all comments on a pull request',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
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
          required: ['owner', 'repo', 'pullNumber']
        }
      },
      {
        name: 'get_repository_pull_files',
        description: 'Get files changed in a pull request',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
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
          required: ['owner', 'repo', 'pullNumber']
        }
      },
      {
        name: 'update_repository_pull',
        description: 'Update a pull request',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
            },
            title: {
              type: 'string',
              description: 'The title of the pull request'
            },
            body: {
              type: 'string',
              description: 'The contents of the pull request'
            },
            state: {
              type: 'string',
              description: 'State of the pull request (open, closed)',
              enum: ['open', 'closed']
            },
            base: {
              type: 'string',
              description: 'The name of the branch you want the changes pulled into'
            },
            maintainer_can_modify: {
              type: 'boolean',
              description: 'Indicates whether maintainers can modify the pull request'
            }
          },
          required: ['owner', 'repo', 'pullNumber']
        }
      },
      {
        name: 'get_repository_pull_commits',
        description: 'Get commits in a pull request',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
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
          required: ['owner', 'repo', 'pullNumber']
        }
      },
      {
        name: 'create_repository_pull_label',
        description: 'Create a label for a pull request',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
            },
            labels: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of label names to add'
            }
          },
          required: ['owner', 'repo', 'pullNumber', 'labels']
        }
      },
      {
        name: 'get_repository_pull_labels',
        description: 'Get labels for a pull request',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
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
          required: ['owner', 'repo', 'pullNumber']
        }
      },
      {
        name: 'replace_repository_pull_labels',
        description: 'Replace all labels for a pull request',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
            },
            labels: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of label names to set'
            }
          },
          required: ['owner', 'repo', 'pullNumber', 'labels']
        }
      },
      {
        name: 'delete_repository_pull_label',
        description: 'Delete a label from a pull request',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
            },
            name: {
              type: 'string',
              description: 'The name of the label to delete'
            }
          },
          required: ['owner', 'repo', 'pullNumber', 'name']
        }
      },
      {
        name: 'process_repository_pull_test',
        description: 'Process pull request test',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
            },
            action: {
              type: 'string',
              description: 'Test action (approve, reject, reset)',
              enum: ['approve', 'reject', 'reset']
            },
            comment: {
              type: 'string',
              description: 'Optional comment for the test action'
            }
          },
          required: ['owner', 'repo', 'pullNumber', 'action']
        }
      },
      {
        name: 'process_repository_pull_review',
        description: 'Process pull request review',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
            },
            action: {
              type: 'string',
              description: 'Review action (approve, reject, reset)',
              enum: ['approve', 'reject', 'reset']
            },
            comment: {
              type: 'string',
              description: 'Optional comment for the review action'
            }
          },
          required: ['owner', 'repo', 'pullNumber', 'action']
        }
      },
      {
        name: 'get_repository_pull_operate_logs',
        description: 'Get pull request operation logs',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
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
          required: ['owner', 'repo', 'pullNumber']
        }
      },
      {
        name: 'reset_repository_pull_testers',
        description: 'Reset pull request testers status',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
            }
          },
          required: ['owner', 'repo', 'pullNumber']
        }
      },
      {
        name: 'assign_repository_pull_testers',
        description: 'Assign users to test pull request',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
            },
            testers: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of usernames to assign as testers'
            }
          },
          required: ['owner', 'repo', 'pullNumber', 'testers']
        }
      },
      {
        name: 'remove_repository_pull_testers',
        description: 'Remove testers from pull request',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
            },
            testers: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of usernames to remove as testers'
            }
          },
          required: ['owner', 'repo', 'pullNumber', 'testers']
        }
      },
      {
        name: 'get_repository_pull_tester_options',
        description: 'Get available testers for pull request',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
            }
          },
          required: ['owner', 'repo', 'pullNumber']
        }
      },
      {
        name: 'reset_repository_pull_assignees',
        description: 'Reset pull request assignees status',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
            }
          },
          required: ['owner', 'repo', 'pullNumber']
        }
      },
      {
        name: 'assign_repository_pull_assignees',
        description: 'Assign users to review pull request',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
            },
            assignees: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of usernames to assign as reviewers'
            }
          },
          required: ['owner', 'repo', 'pullNumber', 'assignees']
        }
      },
      {
        name: 'remove_repository_pull_assignees',
        description: 'Remove assignees from pull request',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
            },
            assignees: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of usernames to remove as assignees'
            }
          },
          required: ['owner', 'repo', 'pullNumber', 'assignees']
        }
      },
      {
        name: 'get_repository_pull_files_json',
        description: 'Get pull request file changes information',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
            }
          },
          required: ['owner', 'repo', 'pullNumber']
        }
      },
      {
        name: 'get_repository_pull_file_content',
        description: 'Get file content from pull request',
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
            head: {
              type: 'string',
              description: 'The head branch SHA'
            },
            sha: {
              type: 'string',
              description: 'The commit SHA'
            },
            name: {
              type: 'string',
              description: 'The file name'
            }
          },
          required: ['owner', 'repo', 'head', 'sha', 'name']
        }
      },
      {
        name: 'link_repository_pull_issues',
        description: 'Link issues to pull request',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
            },
            issues: {
              type: 'array',
              items: {
                type: 'number'
              },
              description: 'Array of issue numbers to link'
            }
          },
          required: ['owner', 'repo', 'pullNumber', 'issues']
        }
      },
      {
        name: 'unlink_repository_pull_issues',
        description: 'Unlink issues from pull request',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
            },
            issues: {
              type: 'array',
              items: {
                type: 'number'
              },
              description: 'Array of issue numbers to unlink'
            }
          },
          required: ['owner', 'repo', 'pullNumber', 'issues']
        }
      },
      {
        name: 'assign_repository_pull_approval_reviewers',
        description: 'Assign users to approve pull request',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
            },
            reviewers: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of usernames to assign as approval reviewers'
            }
          },
          required: ['owner', 'repo', 'pullNumber', 'reviewers']
        }
      },
      {
        name: 'remove_repository_pull_approval_reviewers',
        description: 'Remove approval reviewers from pull request',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
            },
            reviewers: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of usernames to remove as approval reviewers'
            }
          },
          required: ['owner', 'repo', 'pullNumber', 'reviewers']
        }
      },
      {
        name: 'get_repository_pull_approval_reviewer_options',
        description: 'Get available approval reviewers for pull request',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
            }
          },
          required: ['owner', 'repo', 'pullNumber']
        }
      },
      {
        name: 'get_pull_request_comment',
        description: 'Get a specific pull request comment',
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
            commentId: {
              type: 'number',
              description: 'The ID of comment'
            }
          },
          required: ['owner', 'repo', 'commentId']
        }
      },
      {
        name: 'edit_pull_request_comment',
        description: 'Edit a pull request comment',
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
            commentId: {
              type: 'number',
              description: 'The ID of comment to edit'
            },
            body: {
              type: 'string',
              description: 'The updated comment content'
            }
          },
          required: ['owner', 'repo', 'commentId', 'body']
        }
      },
      {
        name: 'delete_pull_request_comment',
        description: 'Delete a pull request comment',
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
            commentId: {
              type: 'number',
              description: 'The ID of comment to delete'
            }
          },
          required: ['owner', 'repo', 'commentId']
        }
      },
      {
        name: 'reply_pull_request_discussion',
        description: 'Reply to a pull request discussion comment',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
            },
            discussionId: {
              type: 'number',
              description: 'The ID of discussion'
            },
            body: {
              type: 'string',
              description: 'The reply content'
            }
          },
          required: ['owner', 'repo', 'pullNumber', 'discussionId', 'body']
        }
      },
      {
        name: 'update_pull_request_discussion_comment',
        description: 'Update pull request discussion comment resolve status',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
            },
            discussionId: {
              type: 'number',
              description: 'The ID of discussion'
            },
            resolved: {
              type: 'boolean',
              description: 'Whether the comment is resolved'
            }
          },
          required: ['owner', 'repo', 'pullNumber', 'discussionId', 'resolved']
        }
      },
      {
        name: 'get_pull_request_reactions',
        description: 'Get reactions for a pull request',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
            }
          },
          required: ['owner', 'repo', 'pullNumber']
        }
      },
      {
        name: 'get_pull_request_comment_reactions',
        description: 'Get reactions for a pull request comment',
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
            commentId: {
              type: 'number',
              description: 'The ID of comment'
            }
          },
          required: ['owner', 'repo', 'commentId']
        }
      },
      {
        name: 'get_pull_request_modify_history',
        description: 'Get modification history for a pull request',
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
            pullNumber: {
              type: 'number',
              description: 'The number of pull request'
            }
          },
          required: ['owner', 'repo', 'pullNumber']
        }
      },
      {
        name: 'get_pull_request_comment_modify_history',
        description: 'Get modification history for a pull request comment',
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
            commentId: {
              type: 'number',
              description: 'The ID of comment'
            }
          },
          required: ['owner', 'repo', 'commentId']
        }
      },
      {
        name: 'get_enterprise_pull_requests',
        description: 'Get enterprise pull requests list',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise: {
              type: 'string',
              description: 'The enterprise name'
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
          required: ['enterprise']
        }
      },
      {
        name: 'get_organization_pull_requests',
        description: 'Get organization pull requests list',
        inputSchema: {
          type: 'object',
          properties: {
            org: {
              type: 'string',
              description: 'The organization name'
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
          required: ['org']
        }
      },
      {
        name: 'get_enterprise_pull_request_issues',
        description: 'Get enterprise issue related pull requests',
        inputSchema: {
          type: 'object',
          properties: {
            enterprise: {
              type: 'string',
              description: 'The enterprise name'
            },
            issueNumber: {
              type: 'number',
              description: 'The issue number'
            }
          },
          required: ['enterprise', 'issueNumber']
        }
      },
      {
        name: 'reply_pull_request_discussion_comment',
        description: '回复pr评论',
        inputSchema: {
          type: 'object',
          properties: {
            owner: { type: 'string', description: '仓库所属空间地址' },
            repo: { type: 'string', description: '仓库路径' },
            pullNumber: { type: 'number', description: 'Pull Request ID' },
            discussionId: { type: 'number', description: '讨论ID' },
            body: { type: 'string', description: '回复内容' }
          },
          required: ['owner', 'repo', 'pullNumber', 'discussionId', 'body']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'get_repository_pulls':
        return await this.pullRequestService.getRepositoryPulls(
          args.owner,
          args.repo,
          args.state,
          args.page,
          args.perPage
        );

      case 'get_repository_pull':
        return await this.pullRequestService.getRepositoryPull(args.owner, args.repo, args.pullNumber);

      case 'create_repository_pull':
        return await this.pullRequestService.createRepositoryPull(args.owner, args.repo, {
          title: args.title,
          head: args.head,
          base: args.base,
          body: args.body,
          draft: args.draft,
          maintainer_can_modify: args.maintainer_can_modify
        });

      case 'merge_repository_pull':
        return await this.pullRequestService.mergeRepositoryPull(args.owner, args.repo, args.pullNumber, {
          commit_title: args.commit_title,
          commit_message: args.commit_message,
          merge_method: args.merge_method
        });

      case 'get_repository_pull_merge_status':
        return await this.pullRequestService.getRepositoryPullMergeStatus(args.owner, args.repo, args.pullNumber);

      case 'get_repository_pull_issues':
        return await this.pullRequestService.getRepositoryPullIssues(args.owner, args.repo, args.pullNumber);

      case 'create_repository_pull_comment':
        return await this.pullRequestService.createRepositoryPullComment(args.owner, args.repo, args.pullNumber, {
          body: args.body,
          commit_id: args.commit_id,
          path: args.path,
          position: args.position
        });

      case 'get_repository_pull_comments':
        return await this.pullRequestService.getRepositoryPullComments(
          args.owner,
          args.repo,
          args.pullNumber,
          args.page,
          args.perPage
        );

      case 'get_repository_pull_files':
        return await this.pullRequestService.getRepositoryPullFiles(
          args.owner,
          args.repo,
          args.pullNumber,
          args.page,
          args.perPage
        );

      case 'update_repository_pull':
        return await this.pullRequestService.updateRepositoryPull(args.owner, args.repo, args.pullNumber, {
          title: args.title,
          body: args.body,
          state: args.state,
          base: args.base,
          maintainer_can_modify: args.maintainer_can_modify
        });

      case 'get_repository_pull_commits':
        return await this.pullRequestService.getRepositoryPullCommits(
          args.owner,
          args.repo,
          args.pullNumber,
          args.page,
          args.perPage
        );

      case 'create_repository_pull_label':
        return await this.pullRequestService.createRepositoryPullLabel(args.owner, args.repo, args.pullNumber, args.labels);

      case 'get_repository_pull_labels':
        return await this.pullRequestService.getRepositoryPullLabels(
          args.owner,
          args.repo,
          args.pullNumber
        );

      case 'replace_repository_pull_labels':
        return await this.pullRequestService.replaceRepositoryPullLabels(args.owner, args.repo, args.pullNumber, args.labels);

      case 'delete_repository_pull_label':
        return await this.pullRequestService.deleteRepositoryPullLabel(args.owner, args.repo, args.pullNumber, args.name);

      case 'process_repository_pull_test':
        return await this.pullRequestService.processRepositoryPullTest(args.owner, args.repo, args.pullNumber, args.action, args.comment);

      case 'process_repository_pull_review':
        return await this.pullRequestService.processRepositoryPullReview(args.owner, args.repo, args.pullNumber, args.action, args.comment);

      case 'get_repository_pull_operate_logs':
        return await this.pullRequestService.getRepositoryPullOperateLogs(
          args.owner,
          args.repo,
          args.pullNumber
        );

      case 'reset_repository_pull_testers':
        return await this.pullRequestService.resetRepositoryPullTesters(args.owner, args.repo, args.pullNumber);

      case 'assign_repository_pull_testers':
        return await this.pullRequestService.assignRepositoryPullTesters(args.owner, args.repo, args.pullNumber, args.testers);

      case 'remove_repository_pull_testers':
        return await this.pullRequestService.removeRepositoryPullTesters(args.owner, args.repo, args.pullNumber, args.testers);

      case 'get_repository_pull_tester_options':
        return await this.pullRequestService.getRepositoryPullTesterOptions(args.owner, args.repo);

      case 'reset_repository_pull_assignees':
        return await this.pullRequestService.resetRepositoryPullAssignees(args.owner, args.repo, args.pullNumber);

      case 'assign_repository_pull_assignees':
        return await this.pullRequestService.assignRepositoryPullAssignees(args.owner, args.repo, args.pullNumber, args.assignees);

      case 'remove_repository_pull_assignees':
        return await this.pullRequestService.removeRepositoryPullAssignees(args.owner, args.repo, args.pullNumber, args.assignees);

      case 'get_repository_pull_files_json':
        return await this.pullRequestService.getRepositoryPullFilesJson(args.owner, args.repo, args.pullNumber);

      case 'get_repository_pull_file_content':
        return await this.pullRequestService.getRepositoryPullFileContent(args.owner, args.repo, args.pullNumber, args.filePath);

      case 'link_repository_pull_issues':
        return await this.pullRequestService.linkRepositoryPullIssues(args.owner, args.repo, args.pullNumber, args.issues);

      case 'unlink_repository_pull_issues':
        return await this.pullRequestService.unlinkRepositoryPullIssues(args.owner, args.repo, args.pullNumber, args.issues);

      case 'assign_repository_pull_approval_reviewers':
        return await this.pullRequestService.assignRepositoryPullApprovalReviewers(args.owner, args.repo, args.pullNumber, args.reviewers);

      case 'remove_repository_pull_approval_reviewers':
        return await this.pullRequestService.removeRepositoryPullApprovalReviewers(args.owner, args.repo, args.pullNumber, args.reviewers);

      case 'get_repository_pull_approval_reviewer_options':
        return await this.pullRequestService.getRepositoryPullApprovalReviewerOptions(args.owner, args.repo);

      case 'get_pull_request_comment':
        return await this.pullRequestService.getPullRequestComment(args.owner, args.repo, args.commentId);
      
      case 'edit_pull_request_comment':
        return await this.pullRequestService.editPullRequestComment(args.owner, args.repo, args.commentId, { body: args.body });
      
      case 'delete_pull_request_comment':
        return await this.pullRequestService.deletePullRequestComment(args.owner, args.repo, args.commentId);
      
      case 'reply_pull_request_discussion':
        return await this.pullRequestService.replyPullRequestDiscussion(args.owner, args.repo, args.pullNumber, args.discussionId, { body: args.body });
      
      case 'reply_pull_request_discussion_comment':
        return await this.pullRequestService.replyPullRequestDiscussionComment(args.owner, args.repo, args.pullNumber, args.discussionId, { body: args.body });

      case 'update_pull_request_discussion_comment':
        return await this.pullRequestService.updatePullRequestDiscussionComment(args.owner, args.repo, args.pullNumber, args.discussionId, { resolved: args.resolved });
      
      case 'get_pull_request_reactions':
        return await this.pullRequestService.getPullRequestReactions(args.owner, args.repo, args.pullNumber);
      
      case 'get_pull_request_comment_reactions':
        return await this.pullRequestService.getPullRequestCommentReactions(args.owner, args.repo, args.commentId);
      
      case 'get_pull_request_modify_history':
        return await this.pullRequestService.getPullRequestModifyHistory(args.owner, args.repo, args.pullNumber);
      
      case 'get_pull_request_comment_modify_history':
        return await this.pullRequestService.getPullRequestCommentModifyHistory(args.owner, args.repo, args.commentId);
      
      case 'get_enterprise_pull_requests':
        return await this.pullRequestService.getEnterprisePullRequests(args.enterprise, args.page, args.perPage);
      
      case 'get_organization_pull_requests':
        return await this.pullRequestService.getOrganizationPullRequests(args.org, args.page, args.perPage);
      
      case 'get_enterprise_pull_request_issues':
        return await this.pullRequestService.getEnterprisePullRequestIssues(args.enterprise, args.issueNumber);

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}