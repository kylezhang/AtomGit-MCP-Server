import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { PullRequestService } from '../services/PullRequestService.js';

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
            base: {
              type: 'string',
              description: 'Base branch filter'
            },
            since: {
              type: 'string',
              description: 'Only return pull requests updated after this time'
            },
            direction: {
              type: 'string',
              description: 'Sort direction'
            },
            sort: {
              type: 'string',
              description: 'Sort field'
            },
            milestone_number: stringOrNumberSchema('Milestone number filter'),
            labels: {
              type: 'string',
              description: 'Comma-separated label names'
            },
            author: {
              type: 'string',
              description: 'Author username'
            },
            assignee: {
              type: 'string',
              description: 'Assignee username'
            },
            reviewer: {
              type: 'string',
              description: 'Reviewer username'
            },
            merged_after: {
              type: 'string',
              description: 'Merged after filter'
            },
            merged_before: {
              type: 'string',
              description: 'Merged before filter'
            },
            only_count: {
              type: 'boolean',
              description: 'Whether to return only the total count'
            },
            created_after: {
              type: 'string',
              description: 'Created after filter'
            },
            created_before: {
              type: 'string',
              description: 'Created before filter'
            },
            updated_before: {
              type: 'string',
              description: 'Updated before filter'
            },
            updated_after: {
              type: 'string',
              description: 'Updated after filter'
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
            number: {
              type: 'number',
              description: 'The number of pull request'
            }
          },
          required: ['owner', 'repo', 'number']
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
            milestone_number: stringOrNumberSchema('Milestone number'),
            labels: {
              type: 'string',
              description: 'Comma-separated label names'
            },
            issue: {
              type: 'string',
              description: 'Issue number to auto-fill from'
            },
            assignees: stringOrArraySchema('Assignee usernames'),
            testers: stringOrArraySchema('Tester usernames'),
            prune_source_branch: {
              type: 'boolean',
              description: 'Delete the source branch after merge'
            },
            draft: {
              type: 'boolean',
              description: 'Indicates whether the pull request is a draft',
              default: false
            },
            squash: {
              type: 'boolean',
              description: 'Use squash merge when merging'
            },
            squash_commit_message: {
              type: 'string',
              description: 'Squash merge commit message'
            },
            fork_path: {
              type: 'string',
              description: 'Fork repository path for cross-repo pull requests'
            },
            close_related_issue: {
              type: 'boolean',
              description: 'Close related issues when merged'
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
            number: {
              type: 'number',
              description: 'The number of pull request'
            },
            title: {
              type: 'string',
              description: 'Merge title'
            },
            description: {
              type: 'string',
              description: 'Merge description'
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
          required: ['owner', 'repo', 'number']
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
            number: stringOrNumberSchema('The number of pull request')
          },
          required: ['owner', 'repo', 'number']
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
            number: stringOrNumberSchema('The number of pull request'),
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
          required: ['owner', 'repo', 'number']
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
            number: {
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
          required: ['owner', 'repo', 'number', 'body']
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
            number: {
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
            },
            direction: {
              type: 'string',
              description: 'Sort direction'
            },
            comment_type: {
              type: 'string',
              description: 'Comment type filter'
            }
          },
          required: ['owner', 'repo', 'number']
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
            number: {
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
          required: ['owner', 'repo', 'number']
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
            number: {
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
            milestone_number: stringOrNumberSchema('Milestone number'),
            labels: {
              type: 'string',
              description: 'Comma-separated label names'
            },
            draft: {
              type: 'boolean',
              description: 'Whether the pull request is a draft'
            },
            close_related_issue: {
              type: 'boolean',
              description: 'Close related issues when merged'
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
          required: ['owner', 'repo', 'number']
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
            number: {
              type: 'number',
              description: 'The number of pull request'
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
            number: {
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
          required: ['owner', 'repo', 'number']
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
            number: {
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
          required: ['owner', 'repo', 'number']
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
            number: {
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
          required: ['owner', 'repo', 'number']
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
            number: {
              type: 'number',
              description: 'The number of pull request'
            },
            name: {
              type: 'string',
              description: 'The name of the label to delete'
            }
          },
          required: ['owner', 'repo', 'number', 'name']
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
            number: {
              type: 'number',
              description: 'The number of pull request'
            },
            action: {
              type: 'string',
              description: 'Test action (approve, reject, reset)',
              enum: ['approve', 'reject', 'reset']
            },
            force: {
              type: 'boolean',
              description: 'Force the action as an administrator'
            },
            comment: {
              type: 'string',
              description: 'Optional comment for the test action'
            }
          },
          required: ['owner', 'repo', 'number']
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
            number: {
              type: 'number',
              description: 'The number of pull request'
            },
            action: {
              type: 'string',
              description: 'Review action (approve, reject, reset)',
              enum: ['approve', 'reject', 'reset']
            },
            force: {
              type: 'boolean',
              description: 'Force the action as an administrator'
            },
            comment: {
              type: 'string',
              description: 'Optional comment for the review action'
            }
          },
          required: ['owner', 'repo', 'number']
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
            number: stringOrNumberSchema('The number of pull request'),
            sort: {
              type: 'string',
              description: 'Sort field'
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
          required: ['owner', 'repo', 'number']
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
            number: {
              type: 'number',
              description: 'The number of pull request'
            },
            reset_all: {
              type: 'boolean',
              description: 'Reset all testers'
            },
            testers: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Optional tester list to set; omit to clear all testers'
            }
          },
          required: ['owner', 'repo', 'number']
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
            number: {
              type: 'number',
              description: 'The number of pull request'
            },
            testers: stringOrArraySchema('Usernames to assign as testers'),
            add: {
              type: 'boolean',
              description: 'Append testers instead of replacing them'
            }
          },
          required: ['owner', 'repo', 'number', 'testers']
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
            number: stringOrNumberSchema('The number of pull request'),
            testers: stringOrArraySchema('Usernames to remove as testers')
          },
          required: ['owner', 'repo', 'number', 'testers']
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
            }
          },
          required: ['owner', 'repo']
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
            number: {
              type: 'number',
              description: 'The number of pull request'
            },
            reset_all: {
              type: 'boolean',
              description: 'Reset all assignees'
            },
            assignees: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Optional assignee list to set; omit to clear all assignees'
            }
          },
          required: ['owner', 'repo', 'number']
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
            number: {
              type: 'number',
              description: 'The number of pull request'
            },
            assignees: stringOrArraySchema('Usernames to assign as reviewers')
          },
          required: ['owner', 'repo', 'number', 'assignees']
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
            number: {
              type: 'number',
              description: 'The number of pull request'
            },
            assignees: stringOrArraySchema('Usernames to remove as assignees')
          },
          required: ['owner', 'repo', 'number']
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
            number: stringOrNumberSchema('The number of pull request')
          },
          required: ['owner', 'repo', 'number']
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
            head_sha: {
              type: 'string',
              description: 'The head SHA from the documentation path'
            },
            name: {
              type: 'string',
              description: 'The file name'
            }
          },
          required: ['owner', 'repo', 'head_sha', 'name']
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
            number: stringOrNumberSchema('The number of pull request'),
            issues: {
              type: 'array',
              items: {
                type: 'number'
              },
              description: 'Array of issue numbers to link'
            }
          },
          required: ['owner', 'repo', 'number']
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
            number: stringOrNumberSchema('The number of pull request'),
            issues: {
              type: 'array',
              items: {
                type: 'number'
              },
              description: 'Array of issue numbers to unlink'
            }
          },
          required: ['owner', 'repo', 'number']
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
            number: stringOrNumberSchema('The number of pull request'),
            reviewers: {
              ...stringOrArraySchema('Usernames to assign as approval reviewers')
            },
            add: {
              type: 'boolean',
              description: 'Append reviewers instead of replacing them'
            }
          },
          required: ['owner', 'repo', 'number', 'reviewers']
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
            number: stringOrNumberSchema('The number of pull request'),
            reviewers: stringOrArraySchema('Usernames to remove as approval reviewers')
          },
          required: ['owner', 'repo', 'number', 'reviewers']
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
            number: stringOrNumberSchema('The number of pull request')
          },
          required: ['owner', 'repo', 'number']
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
            id: stringOrNumberSchema('The ID of comment')
          },
          required: ['owner', 'repo', 'id']
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
            id: stringOrNumberSchema('The ID of comment to edit'),
            body: {
              type: 'string',
              description: 'The updated comment content'
            }
          },
          required: ['owner', 'repo', 'id', 'body']
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
            id: stringOrNumberSchema('The ID of comment to delete')
          },
          required: ['owner', 'repo', 'id']
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
            number: {
              type: 'number',
              description: 'The number of pull request'
            },
            discussion_id: stringOrNumberSchema('The ID of discussion'),
            body: {
              type: 'string',
              description: 'The reply content'
            }
          },
          required: ['owner', 'repo', 'number', 'discussion_id', 'body']
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
            number: stringOrNumberSchema('The number of pull request'),
            discussion_id: stringOrNumberSchema('The ID of discussion'),
            resolved: {
              type: 'boolean',
              description: 'Whether the comment is resolved'
            }
          },
          required: ['owner', 'repo', 'number', 'discussion_id', 'resolved']
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
            number: stringOrNumberSchema('The number of pull request'),
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
            comment_id: stringOrNumberSchema('The ID of comment'),
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
            number: stringOrNumberSchema('The number of pull request')
          },
          required: ['owner', 'repo', 'number']
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
            comment_id: stringOrNumberSchema('The ID of comment')
          },
          required: ['owner', 'repo', 'comment_id']
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
            state: {
              type: 'string',
              description: 'Pull request state'
            },
            issue_number: stringOrNumberSchema('Issue number filter'),
            sort: {
              type: 'string',
              description: 'Sort field'
            },
            direction: {
              type: 'string',
              description: 'Sort direction'
            },
            base: {
              type: 'string',
              description: 'Base branch filter'
            },
            author: {
              type: 'string',
              description: 'Author username'
            },
            search: {
              type: 'string',
              description: 'Search keyword'
            },
            created_after: {
              type: 'string',
              description: 'Created after filter'
            },
            created_before: {
              type: 'string',
              description: 'Created before filter'
            },
            updated_before: {
              type: 'string',
              description: 'Updated before filter'
            },
            updated_after: {
              type: 'string',
              description: 'Updated after filter'
            },
            labels: {
              type: 'string',
              description: 'Comma-separated label names'
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
            state: {
              type: 'string',
              description: 'Pull request state'
            },
            sort: {
              type: 'string',
              description: 'Sort field'
            },
            direction: {
              type: 'string',
              description: 'Sort direction'
            },
            page: {
              type: 'number',
              description: 'Page number for pagination',
              default: 1
            },
            perPage: {
              ...stringOrNumberSchema('Number of results per page', 30)
            },
            base: {
              type: 'string',
              description: 'Base branch filter'
            },
            author: {
              type: 'string',
              description: 'Author username'
            },
            search: {
              type: 'string',
              description: 'Search keyword'
            },
            created_after: {
              type: 'string',
              description: 'Created after filter'
            },
            created_before: {
              type: 'string',
              description: 'Created before filter'
            },
            updated_before: {
              type: 'string',
              description: 'Updated before filter'
            },
            updated_after: {
              type: 'string',
              description: 'Updated after filter'
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
            number: {
              type: 'number',
              description: 'The issue number'
            }
          },
          required: ['enterprise', 'number']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    const number = args.number ?? args.pullNumber ?? args.issueNumber;
    const id = args.id ?? args.commentId;
    const commentId = args.comment_id ?? args.commentId;
    const discussionId = args.discussion_id ?? args.discussionId;

    switch (name) {
      case 'get_repository_pulls':
        return await this.pullRequestService.getRepositoryPulls(
          args.owner,
          args.repo,
          {
            state: args.state,
            base: args.base,
            since: args.since,
            direction: args.direction,
            sort: args.sort,
            milestone_number: args.milestone_number ?? args.milestoneNumber,
            labels: args.labels,
            author: args.author,
            assignee: args.assignee,
            reviewer: args.reviewer,
            merged_after: args.merged_after ?? args.mergedAfter,
            merged_before: args.merged_before ?? args.mergedBefore,
            only_count: args.only_count ?? args.onlyCount,
            created_after: args.created_after ?? args.createdAfter,
            created_before: args.created_before ?? args.createdBefore,
            updated_before: args.updated_before ?? args.updatedBefore,
            updated_after: args.updated_after ?? args.updatedAfter,
            page: args.page,
            perPage: args.perPage
          }
        );

      case 'get_repository_pull':
        return await this.pullRequestService.getRepositoryPull(args.owner, args.repo, number);

      case 'create_repository_pull':
        return await this.pullRequestService.createRepositoryPull(args.owner, args.repo, {
          title: args.title,
          head: args.head,
          base: args.base,
          body: args.body,
          milestone_number: args.milestone_number ?? args.milestoneNumber,
          labels: args.labels,
          issue: args.issue,
          assignees: args.assignees,
          testers: args.testers,
          prune_source_branch: args.prune_source_branch ?? args.pruneSourceBranch,
          draft: args.draft,
          squash: args.squash,
          squash_commit_message: args.squash_commit_message ?? args.squashCommitMessage,
          fork_path: args.fork_path ?? args.forkPath,
          close_related_issue: args.close_related_issue ?? args.closeRelatedIssue,
          maintainer_can_modify: args.maintainer_can_modify
        });

      case 'merge_repository_pull':
        return await this.pullRequestService.mergeRepositoryPull(args.owner, args.repo, number, {
          title: args.title,
          description: args.description,
          commit_title: args.commit_title,
          commit_message: args.commit_message,
          merge_method: args.merge_method
        });

      case 'get_repository_pull_merge_status':
        return await this.pullRequestService.getRepositoryPullMergeStatus(args.owner, args.repo, number);

      case 'get_repository_pull_issues':
        return await this.pullRequestService.getRepositoryPullIssues(args.owner, args.repo, number, {
          page: args.page,
          perPage: args.perPage
        });

      case 'create_repository_pull_comment':
        return await this.pullRequestService.createRepositoryPullComment(args.owner, args.repo, number, {
          body: args.body,
          commit_id: args.commit_id,
          path: args.path,
          position: args.position
        });

      case 'get_repository_pull_comments':
        return await this.pullRequestService.getRepositoryPullComments(
          args.owner,
          args.repo,
          number,
          {
            page: args.page,
            perPage: args.perPage,
            direction: args.direction,
            comment_type: args.comment_type ?? args.commentType
          }
        );

      case 'get_repository_pull_files':
        return await this.pullRequestService.getRepositoryPullFiles(
          args.owner,
          args.repo,
          number,
          args.page,
          args.perPage
        );

      case 'update_repository_pull':
        return await this.pullRequestService.updateRepositoryPull(args.owner, args.repo, number, {
          title: args.title,
          body: args.body,
          state: args.state,
          milestone_number: args.milestone_number ?? args.milestoneNumber,
          labels: args.labels,
          draft: args.draft,
          close_related_issue: args.close_related_issue ?? args.closeRelatedIssue,
          base: args.base,
          maintainer_can_modify: args.maintainer_can_modify
        });

      case 'get_repository_pull_commits':
        return await this.pullRequestService.getRepositoryPullCommits(
          args.owner,
          args.repo,
          number,
          {
            page: args.page,
            perPage: args.perPage
          }
        );

      case 'create_repository_pull_label':
        return await this.pullRequestService.createRepositoryPullLabel(args.owner, args.repo, number, args.labels);

      case 'get_repository_pull_labels':
        return await this.pullRequestService.getRepositoryPullLabels(
          args.owner,
          args.repo,
          number
        );

      case 'replace_repository_pull_labels':
        return await this.pullRequestService.replaceRepositoryPullLabels(args.owner, args.repo, number, args.labels);

      case 'delete_repository_pull_label':
        return await this.pullRequestService.deleteRepositoryPullLabel(args.owner, args.repo, number, args.name);

      case 'process_repository_pull_test':
        return await this.pullRequestService.processRepositoryPullTest(args.owner, args.repo, number, {
          action: args.action,
          comment: args.comment,
          force: args.force
        });

      case 'process_repository_pull_review':
        return await this.pullRequestService.processRepositoryPullReview(args.owner, args.repo, number, {
          action: args.action,
          comment: args.comment,
          force: args.force
        });

      case 'get_repository_pull_operate_logs':
        return await this.pullRequestService.getRepositoryPullOperateLogs(
          args.owner,
          args.repo,
          number,
          {
            sort: args.sort,
            page: args.page,
            perPage: args.perPage
          }
        );

      case 'reset_repository_pull_testers':
        return await this.pullRequestService.resetRepositoryPullTesters(
          args.owner,
          args.repo,
          number,
          {
            reset_all: args.reset_all ?? args.resetAll,
            testers: args.testers
          },
        );

      case 'assign_repository_pull_testers':
        return await this.pullRequestService.assignRepositoryPullTesters(args.owner, args.repo, number, {
          testers: args.testers,
          add: args.add
        });

      case 'remove_repository_pull_testers':
        return await this.pullRequestService.removeRepositoryPullTesters(args.owner, args.repo, number, args.testers);

      case 'get_repository_pull_tester_options':
        return await this.pullRequestService.getRepositoryPullTesterOptions(args.owner, args.repo);

      case 'reset_repository_pull_assignees':
        return await this.pullRequestService.resetRepositoryPullAssignees(
          args.owner,
          args.repo,
          number,
          {
            reset_all: args.reset_all ?? args.resetAll,
            assignees: args.assignees
          },
        );

      case 'assign_repository_pull_assignees':
        return await this.pullRequestService.assignRepositoryPullAssignees(args.owner, args.repo, number, {
          assignees: args.assignees
        });

      case 'remove_repository_pull_assignees':
        return await this.pullRequestService.removeRepositoryPullAssignees(args.owner, args.repo, number, args.assignees);

      case 'get_repository_pull_files_json':
        return await this.pullRequestService.getRepositoryPullFilesJson(args.owner, args.repo, number);

      case 'get_repository_pull_file_content':
        return await this.pullRequestService.getRepositoryPullFileContent(
          args.owner,
          args.repo,
          args.head_sha ?? args.head ?? args.sha,
          args.name,
        );

      case 'link_repository_pull_issues':
        return await this.pullRequestService.linkRepositoryPullIssues(args.owner, args.repo, number, args.issues);

      case 'unlink_repository_pull_issues':
        return await this.pullRequestService.unlinkRepositoryPullIssues(args.owner, args.repo, number, args.issues);

      case 'assign_repository_pull_approval_reviewers':
        return await this.pullRequestService.assignRepositoryPullApprovalReviewers(args.owner, args.repo, number, {
          reviewers: args.reviewers,
          add: args.add
        });

      case 'remove_repository_pull_approval_reviewers':
        return await this.pullRequestService.removeRepositoryPullApprovalReviewers(args.owner, args.repo, number, args.reviewers);

      case 'get_repository_pull_approval_reviewer_options':
        return await this.pullRequestService.getRepositoryPullApprovalReviewerOptions(args.owner, args.repo, number);

      case 'get_pull_request_comment':
        return await this.pullRequestService.getPullRequestComment(args.owner, args.repo, id);
      
      case 'edit_pull_request_comment':
        return await this.pullRequestService.editPullRequestComment(args.owner, args.repo, id, { body: args.body });
      
      case 'delete_pull_request_comment':
        return await this.pullRequestService.deletePullRequestComment(args.owner, args.repo, id);
      
      case 'reply_pull_request_discussion':
        return await this.pullRequestService.replyPullRequestDiscussion(args.owner, args.repo, number, discussionId, { body: args.body });

      case 'update_pull_request_discussion_comment':
        return await this.pullRequestService.updatePullRequestDiscussionComment(args.owner, args.repo, number, discussionId, { resolved: args.resolved });
      
      case 'get_pull_request_reactions':
        return await this.pullRequestService.getPullRequestReactions(args.owner, args.repo, number, {
          page: args.page,
          perPage: args.perPage,
          emoji_name: args.emoji_name ?? args.emojiName
        });
      
      case 'get_pull_request_comment_reactions':
        return await this.pullRequestService.getPullRequestCommentReactions(args.owner, args.repo, commentId, {
          page: args.page,
          perPage: args.perPage,
          emoji_name: args.emoji_name ?? args.emojiName
        });
      
      case 'get_pull_request_modify_history':
        return await this.pullRequestService.getPullRequestModifyHistory(args.owner, args.repo, number);
      
      case 'get_pull_request_comment_modify_history':
        return await this.pullRequestService.getPullRequestCommentModifyHistory(args.owner, args.repo, commentId);
      
      case 'get_enterprise_pull_requests':
        return await this.pullRequestService.getEnterprisePullRequests(args.enterprise, {
          state: args.state,
          issue_number: args.issue_number ?? args.issueNumber,
          sort: args.sort,
          direction: args.direction,
          base: args.base,
          author: args.author,
          search: args.search,
          created_after: args.created_after ?? args.createdAfter,
          created_before: args.created_before ?? args.createdBefore,
          updated_before: args.updated_before ?? args.updatedBefore,
          updated_after: args.updated_after ?? args.updatedAfter,
          labels: args.labels,
          page: args.page,
          perPage: args.perPage
        });
      
      case 'get_organization_pull_requests':
        return await this.pullRequestService.getOrganizationPullRequests(args.org, {
          state: args.state,
          sort: args.sort,
          direction: args.direction,
          base: args.base,
          author: args.author,
          search: args.search,
          created_after: args.created_after ?? args.createdAfter,
          created_before: args.created_before ?? args.createdBefore,
          updated_before: args.updated_before ?? args.updatedBefore,
          updated_after: args.updated_after ?? args.updatedAfter,
          page: args.page,
          perPage: args.perPage
        });
      
      case 'get_enterprise_pull_request_issues':
        return await this.pullRequestService.getEnterprisePullRequestIssues(args.enterprise, number);

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}
