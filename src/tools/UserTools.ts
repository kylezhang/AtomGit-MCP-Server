import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { UserService } from '../services/UserService.js';

const stringOrNumberSchema = (description: string, defaultValue?: number) => ({
  oneOf: [
    { type: 'string' },
    { type: 'number' }
  ],
  description,
  ...(defaultValue !== undefined ? { default: defaultValue } : {})
});

export class UserTools {
  constructor(private userService: UserService) {}

  getTools(): Tool[] {
    return [
      {
        name: 'get_current_user',
        description: 'Get the current authenticated user information',
        inputSchema: {
          type: 'object',
          properties: {},
        }
      },
      {
        name: 'get_user',
        description: 'Get information about a specific user',
        inputSchema: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: 'The username of the user'
            }
          },
          required: ['username']
        }
      },
      {
        name: 'get_user_repos',
        description: 'Get all repositories for a specific user',
        inputSchema: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: 'The username of the user'
            },
            type: {
              type: 'string',
              description: 'Repository type filter'
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
              ...stringOrNumberSchema('Page number for pagination', 1)
            },
            perPage: {
              ...stringOrNumberSchema('Number of results per page', 30)
            }
          },
          required: ['username']
        }
      },
      {
        name: 'get_repository',
        description: 'Get a specific repository',
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
        name: 'get_current_user_repos',
        description: 'Get all repositories for the current authenticated user',
        inputSchema: {
          type: 'object',
          properties: {
            visibility: {
              type: 'string',
              description: 'Visibility filter'
            },
            affiliation: {
              type: 'string',
              description: 'Affiliation filter'
            },
            type: {
              type: 'string',
              description: 'Repository type filter'
            },
            sort: {
              type: 'string',
              description: 'Sort field'
            },
            direction: {
              type: 'string',
              description: 'Sort direction'
            },
            q: {
              type: 'string',
              description: 'Search keyword'
            },
            page: {
              ...stringOrNumberSchema('Page number for pagination', 1)
            },
            perPage: {
              ...stringOrNumberSchema('Number of results per page', 30)
            },
            repo_type: {
              type: 'string',
              description: 'Repository category filter'
            }
          },
        }
      },
      {
        name: 'get_user_starred_repos',
        description: 'Get all starred repositories for a specific user',
        inputSchema: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: 'The username of the user'
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
              ...stringOrNumberSchema('Page number for pagination', 1)
            },
            perPage: {
              ...stringOrNumberSchema('Number of results per page', 30)
            }
          },
          required: ['username']
        }
      },
      {
        name: 'get_current_user_starred_repos',
        description: 'Get all starred repositories for the current authenticated user',
        inputSchema: {
          type: 'object',
          properties: {
            sort: {
              type: 'string',
              description: 'Sort field'
            },
            direction: {
              type: 'string',
              description: 'Sort direction'
            },
            page: {
              ...stringOrNumberSchema('Page number for pagination', 1)
            },
            perPage: {
              ...stringOrNumberSchema('Number of results per page', 30)
            }
          },
        }
      },
      {
        name: 'get_user_subscriptions',
        description: 'List repositories watched by a user',
        inputSchema: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: 'The username'
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
              ...stringOrNumberSchema('Page number for pagination', 1)
            },
            perPage: {
              ...stringOrNumberSchema('Number of results per page', 30)
            }
          },
          required: ['username']
        }
      },
      {
        name: 'get_current_user_subscriptions',
        description: 'List repositories watched by current user',
        inputSchema: {
          type: 'object',
          properties: {
            sort: {
              type: 'string',
              description: 'Sort field'
            },
            direction: {
              type: 'string',
              description: 'Sort direction'
            },
            page: {
              ...stringOrNumberSchema('Page number for pagination', 1)
            },
            perPage: {
              ...stringOrNumberSchema('Number of results per page', 30)
            }
          }
        }
      },
      {
        name: 'get_current_user_namespaces',
        description: 'List all namespaces for current user',
        inputSchema: {
          type: 'object',
          properties: {
            mode: {
              type: 'string',
              description: 'Namespace mode'
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
          }
        }
      },
      {
        name: 'get_repository_notifications',
        description: 'List notifications in a repository',
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
            unread: {
              type: 'boolean',
              description: 'Whether to return unread notifications only'
            },
            type: {
              type: 'string',
              description: 'Notification type filter'
            },
            since: {
              type: 'string',
              description: 'Only return notifications updated after this time'
            },
            before: {
              type: 'string',
              description: 'Only return notifications updated before this time'
            },
            ids: {
              type: 'string',
              description: 'Comma-separated notification IDs'
            }
          },
          required: ['owner', 'repo']
        }
      },
      {
        name: 'mark_repository_notifications_read',
        description: 'Mark notifications in a repository as read',
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
            ids: {
              type: 'string',
              description: 'Comma-separated notification IDs'
            }
          },
          required: ['owner', 'repo']
        }
      },
      {
        name: 'create_user_repository',
        description: 'Create a personal repository',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Repository name'
            },
            description: {
              type: 'string',
              description: 'Repository description'
            },
            has_issues: {
              type: 'boolean',
              description: 'Whether issues are enabled'
            },
            has_wiki: {
              type: 'boolean',
              description: 'Whether wiki is enabled'
            },
            can_comment: {
              type: 'boolean',
              description: 'Whether comments are enabled'
            },
            auto_init: {
              type: 'boolean',
              description: 'Initialize with a README'
            },
            gitignore_template: {
              type: 'string',
              description: 'Gitignore template'
            },
            license_template: {
              type: 'string',
              description: 'License template'
            },
            path: {
              type: 'string',
              description: 'Repository path'
            },
            private: {
              type: 'boolean',
              description: 'Whether repository is private'
            },
            default_branch: {
              type: 'string',
              description: 'Default branch name'
            },
            import_url: {
              type: 'string',
              description: 'Git URL to import'
            },
            project_template: {
              type: 'string',
              description: 'Project template path'
            },
            repository_type: {
              type: 'string',
              description: 'Repository type'
            }
          },
          required: ['name']
        }
      },
      {
        name: 'update_current_user',
        description: 'Update current user profile',
        inputSchema: {
          type: 'object',
          properties: {
            avatar: {
              type: 'string',
              description: 'Avatar URL'
            },
            nickname: {
              type: 'string',
              description: 'User nickname'
            },
            company: {
              type: 'string',
              description: 'Company'
            },
            description: {
              type: 'string',
              description: 'Profile description'
            },
            email: {
              type: 'string',
              description: 'User email'
            },
            github_account: {
              type: 'string',
              description: 'GitHub account'
            },
            website: {
              type: 'string',
              description: 'Personal website'
            },
            location: {
              type: 'string',
              description: 'Location'
            }
          }
        }
      },
      {
        name: 'get_current_user_emails',
        description: 'Get all emails for current user',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'get_user_events',
        description: 'Get user events',
        inputSchema: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: 'The username'
            },
            year: {
              type: 'string',
              description: 'Year filter'
            },
            next: {
              type: 'string',
              description: 'Next page token'
            }
          },
          required: ['username']
        }
      },
      {
        name: 'add_user_key',
        description: 'Add a public key for user',
        inputSchema: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Key title'
            },
            key: {
              type: 'string',
              description: 'Public key content'
            }
          },
          required: ['title', 'key']
        }
      },
      {
        name: 'get_current_user_keys',
        description: 'List all public keys for current user',
        inputSchema: {
          type: 'object',
          properties: {
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
          }
        }
      },
      {
        name: 'delete_user_key',
        description: 'Delete a public key',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              ...stringOrNumberSchema('The ID of key to delete')
            }
          },
          required: ['id']
        }
      },
      {
        name: 'get_current_user_namespace',
        description: 'Get a namespace for current user',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Namespace path'
            }
          },
          required: ['path']
        }
      },
      {
        name: 'get_user_key',
        description: 'Get a specific public key',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              ...stringOrNumberSchema('The ID of key')
            }
          },
          required: ['id']
        }
      },

      {
        name: 'get_current_user_pull_requests',
        description: 'List pull requests for current user',
        inputSchema: {
          type: 'object',
          properties: {
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
            labels: {
              type: 'string',
              description: 'Comma-separated label names'
            },
            created_after: {
              type: 'string',
              description: 'Created after filter'
            },
            created_before: {
              type: 'string',
              description: 'Created before filter'
            },
            updated_after: {
              type: 'string',
              description: 'Updated after filter'
            },
            updated_before: {
              type: 'string',
              description: 'Updated before filter'
            },
            scope: {
              type: 'string',
              description: 'Scope filter'
            },
            source_branch: {
              type: 'string',
              description: 'Source branch filter'
            },
            target_branch: {
              type: 'string',
              description: 'Target branch filter'
            },
            page: {
              ...stringOrNumberSchema('Page number for pagination', 1)
            },
            perPage: {
              ...stringOrNumberSchema('Number of results per page', 30)
            }
          }
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'get_current_user':
        return await this.userService.getCurrentUser();
      
      case 'get_user':
        return await this.userService.getUser(args.username);
      
      case 'get_user_repos':
        return await this.userService.getUserRepos(args.username, {
          type: args.type,
          sort: args.sort,
          direction: args.direction,
          page: args.page,
          perPage: args.perPage
        });
      
      case 'get_repository':
        return await this.userService.getUserRepository(args.owner, args.repo);

      case 'get_current_user_repos':
        return await this.userService.getCurrentUserRepos({
          visibility: args.visibility,
          affiliation: args.affiliation,
          type: args.type,
          sort: args.sort,
          direction: args.direction,
          q: args.q,
          page: args.page,
          perPage: args.perPage,
          repo_type: args.repo_type ?? args.repoType
        });
      
      case 'get_user_starred_repos':
        return await this.userService.getUserStarredRepos(args.username, {
          sort: args.sort,
          direction: args.direction,
          page: args.page,
          perPage: args.perPage
        });
      
      case 'get_current_user_starred_repos':
        return await this.userService.getCurrentUserStarredRepos({
          sort: args.sort,
          direction: args.direction,
          page: args.page,
          perPage: args.perPage
        });
      
      case 'get_user_subscriptions':
        return await this.userService.getUserSubscriptions(args.username, {
          sort: args.sort,
          direction: args.direction,
          page: args.page,
          perPage: args.perPage
        });
      
      case 'get_current_user_subscriptions':
        return await this.userService.getCurrentUserSubscriptions({
          sort: args.sort,
          direction: args.direction,
          page: args.page,
          perPage: args.perPage
        });
      
      case 'get_current_user_namespaces':
        return await this.userService.getCurrentUserNamespaces({
          mode: args.mode,
          page: args.page,
          perPage: args.perPage
        });
      
      case 'get_repository_notifications':
        return await this.userService.getRepositoryNotifications(args.owner, args.repo, {
          unread: args.unread,
          type: args.type,
          since: args.since,
          before: args.before,
          ids: args.ids
        });
      
      case 'mark_repository_notifications_read':
        return await this.userService.markRepositoryNotificationsRead(args.owner, args.repo, args.ids);
      
      case 'create_user_repository':
        return await this.userService.createUserRepository({
          name: args.name,
          description: args.description,
          has_issues: args.has_issues ?? args.hasIssues,
          has_wiki: args.has_wiki ?? args.hasWiki,
          can_comment: args.can_comment ?? args.canComment,
          auto_init: args.auto_init ?? args.autoInit,
          gitignore_template: args.gitignore_template ?? args.gitignoreTemplate,
          license_template: args.license_template ?? args.licenseTemplate,
          path: args.path,
          private: args.private,
          default_branch: args.default_branch ?? args.defaultBranch,
          import_url: args.import_url ?? args.importUrl,
          project_template: args.project_template ?? args.projectTemplate,
          repository_type: args.repository_type ?? args.repositoryType
        });
      
      case 'update_current_user':
        return await this.userService.updateCurrentUser({
          avatar: args.avatar,
          nickname: args.nickname,
          company: args.company,
          description: args.description ?? args.bio,
          email: args.email,
          github_account: args.github_account ?? args.githubAccount,
          website: args.website,
          location: args.location
        });
      
      case 'get_current_user_emails':
        return await this.userService.getCurrentUserEmails();
      
      case 'get_user_events':
        return await this.userService.getUserEvents(args.username, {
          year: args.year,
          next: args.next
        });
      
      case 'add_user_key':
        return await this.userService.addUserKey({
          title: args.title,
          key: args.key
        });
      
      case 'get_current_user_keys':
        return await this.userService.getCurrentUserKeys({
          page: args.page,
          perPage: args.perPage
        });
      
      case 'delete_user_key':
        return await this.userService.deleteUserKey(args.id ?? args.keyId);
      
      case 'get_user_key':
        return await this.userService.getUserKey(args.id ?? args.keyId);
      
      case 'get_current_user_namespace':
        return await this.userService.getCurrentUserNamespace(args.path);
      
      case 'get_current_user_pull_requests':
        return await this.userService.getCurrentUserPullRequests({
          state: args.state,
          sort: args.sort,
          direction: args.direction,
          labels: args.labels,
          created_after: args.created_after ?? args.createdAfter,
          created_before: args.created_before ?? args.createdBefore,
          updated_after: args.updated_after ?? args.updatedAfter,
          updated_before: args.updated_before ?? args.updatedBefore,
          scope: args.scope,
          source_branch: args.source_branch ?? args.sourceBranch,
          target_branch: args.target_branch ?? args.targetBranch,
          page: args.page,
          perPage: args.perPage
        });

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}
