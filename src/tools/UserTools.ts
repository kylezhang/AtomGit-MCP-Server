import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { UserService } from '../services/UserService.js';

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
          properties: {},
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
          properties: {},
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
          required: ['username']
        }
      },
      {
        name: 'get_current_user_subscriptions',
        description: 'List repositories watched by current user',
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
        name: 'get_current_user_namespaces',
        description: 'List all namespaces for current user',
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
            private: {
              type: 'boolean',
              description: 'Whether repository is private'
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
            name: {
              type: 'string',
              description: 'User name'
            },
            email: {
              type: 'string',
              description: 'User email'
            },
            bio: {
              type: 'string',
              description: 'User bio'
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
            keyId: {
              type: 'number',
              description: 'The ID of key to delete'
            }
          },
          required: ['keyId']
        }
      },
      {
        name: 'get_user_key',
        description: 'Get a specific public key',
        inputSchema: {
          type: 'object',
          properties: {
            keyId: {
              type: 'number',
              description: 'The ID of key'
            }
          },
          required: ['keyId']
        }
      },
      {
        name: 'get_current_user_namespace',
        description: 'Get a namespace for current user',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'get_current_user_pull_requests',
        description: 'List pull requests for current user',
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
        return await this.userService.getUserRepos(args.username, args.page, args.perPage);
      
      case 'get_repository':
        return await this.userService.getUserRepository(args.owner, args.repo);

      case 'get_current_user_repos':
        return await this.userService.getUserRepos('current');
      
      case 'get_user_starred_repos':
        return await this.userService.getUserStarredRepos(args.username);
      
      case 'get_current_user_starred_repos':
        return await this.userService.getCurrentUserStarredRepos();
      
      case 'get_user_subscriptions':
        return await this.userService.getUserSubscriptions(args.username, args.page, args.perPage);
      
      case 'get_current_user_subscriptions':
        return await this.userService.getCurrentUserSubscriptions(args.page, args.perPage);
      
      case 'get_current_user_namespaces':
        return await this.userService.getCurrentUserNamespaces(args.page, args.perPage);
      
      case 'get_repository_notifications':
        return await this.userService.getRepositoryNotifications(args.owner, args.repo, args.page, args.perPage);
      
      case 'mark_repository_notifications_read':
        return await this.userService.markRepositoryNotificationsRead(args.owner, args.repo);
      
      case 'create_user_repository':
        return await this.userService.createUserRepository(args);
      
      case 'update_current_user':
        return await this.userService.updateCurrentUser(args);
      
      case 'get_current_user_emails':
        return await this.userService.getCurrentUserEmails();
      
      case 'get_user_events':
        return await this.userService.getUserEvents(args.username, args.page, args.perPage);
      
      case 'add_user_key':
        return await this.userService.addUserKey(args);
      
      case 'get_current_user_keys':
        return await this.userService.getCurrentUserKeys(args.page, args.perPage);
      
      case 'delete_user_key':
        return await this.userService.deleteUserKey(args.keyId);
      
      case 'get_user_key':
        return await this.userService.getUserKey(args.keyId);
      
      case 'get_current_user_namespace':
        return await this.userService.getCurrentUserNamespace();
      
      case 'get_current_user_pull_requests':
        return await this.userService.getCurrentUserPullRequests(args.page, args.perPage);

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}