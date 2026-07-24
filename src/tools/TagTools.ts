import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { TagService } from '../services/TagService.js';
import { autoPaginate, autoPaginateSchemaProperties } from '../core/PaginationHelper.js';

export class TagTools {
  constructor(private tagService: TagService) { }

  getTools(): Tool[] {
    return [
      {
        name: 'get_repository_tags',
        description: 'List all tags in a repository',
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
            },
            ...autoPaginateSchemaProperties,
          },
          required: ['owner', 'repo']
        }
      },
      {
        name: 'create_repository_tag',
        description: 'Create a tag for a repository',
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
            tag_name: {
              type: 'string',
              description: 'The name of the tag'
            },
            refs: {
              type: 'string',
              description: 'The commit SHA or ref this tag points to'
            },
            tag_message: {
              type: 'string',
              description: 'Tag message'
            }
          },
          required: ['owner', 'repo', 'tag_name', 'refs']
        }
      },
      {
        name: 'delete_repository_tag',
        description: 'Delete a tag from a repository',
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
            tag_name: {
              type: 'string',
              description: 'The name of the tag to delete'
            }
          },
          required: ['owner', 'repo', 'tag_name']
        }
      },
      {
        name: 'get_repository_protected_tags',
        description: 'List protected tags in a repository',
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
              description: 'Page number'
            },
            perPage: {
              type: 'number',
              description: 'Number of results per page'
            },
            ...autoPaginateSchemaProperties,
          },
          required: ['owner', 'repo']
        }
      },
      {
        name: 'create_repository_protected_tag',
        description: 'Create a protected tag in a repository',
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
            name: {
              type: 'string',
              description: 'The name of the protected tag'
            },
            create_access_level: {
              type: 'number',
              description: 'Allowed access level for creating the tag'
            }
          },
          required: ['owner', 'repo', 'name']
        }
      },
      {
        name: 'update_repository_protected_tag',
        description: 'Update a protected tag in a repository',
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
            name: {
              type: 'string',
              description: 'The name of protected tag'
            },
            create_access_level: {
              type: 'number',
              description: 'Allowed access level for creating the tag'
            }
          },
          required: ['owner', 'repo', 'name', 'create_access_level']
        }
      },
      {
        name: 'delete_repository_protected_tag',
        description: 'Delete a protected tag from a repository',
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
            tag_name: {
              type: 'string',
              description: 'The name of the protected tag to delete'
            }
          },
          required: ['owner', 'repo', 'tag_name']
        }
      },
      {
        name: 'get_repository_protected_tag',
        description: 'Get details of a protected tag',
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
            tag_name: {
              type: 'string',
              description: 'The name of protected tag'
            }
          },
          required: ['owner', 'repo', 'tag_name']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    switch(name) {
      case 'get_repository_tags':
        if (args.autoPaginate) {
          return autoPaginate(
            (page, perPage) => this.tagService.getRepositoryTags(args.owner, args.repo, page, perPage),
            { page: args.page, perPage: args.perPage, autoPaginate: true, maxPages: args.maxPages }
          );
        }
        return await this.tagService.getRepositoryTags(
          args.owner,
          args.repo,
          args.page,
          args.perPage
        );

      case 'create_repository_tag':
        return await this.tagService.createRepositoryTag(args.owner, args.repo, {
          tag_name: args.tag_name ?? args.tagName,
          ref: args.refs ?? args.target,
          message: args.tag_message ?? args.message,
          target: args.refs ?? args.target
        });

      case 'delete_repository_tag':
        return await this.tagService.deleteRepositoryTag(args.owner, args.repo, args.tag_name ?? args.tagName);

      case 'get_repository_protected_tags':
        if (args.autoPaginate) {
          return autoPaginate(
            (page, perPage) => this.tagService.getRepositoryProtectedTags(args.owner, args.repo, page, perPage),
            { page: args.page, perPage: args.perPage, autoPaginate: true, maxPages: args.maxPages }
          );
        }
        return await this.tagService.getRepositoryProtectedTags(args.owner, args.repo, args.page, args.perPage);

      case 'create_repository_protected_tag':
        return await this.tagService.createRepositoryProtectedTag(args.owner, args.repo, {
          name: args.name ?? args.tagName,
          create_access_level: args.create_access_level
        });

      case 'update_repository_protected_tag':
        return await this.tagService.updateRepositoryProtectedTag(args.owner, args.repo, {
          name: args.name ?? args.tagName,
          create_access_level: args.create_access_level
        });

      case 'delete_repository_protected_tag':
        return await this.tagService.deleteRepositoryProtectedTag(args.owner, args.repo, args.tag_name ?? args.tagName);

      case 'get_repository_protected_tag':
        return await this.tagService.getRepositoryProtectedTag(args.owner, args.repo, args.tag_name ?? args.tagName);

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}
