import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { BranchService } from '../services/BranchService.js';
import { autoPaginate } from '../core/PaginationHelper.js';

export class BranchTools {
  constructor(private branchService: BranchService) { }

  getTools(): Tool[] {
    return [
      {
        name: 'get_repository_branches',
        description: 'Get all branches in a repository',
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
            sort: {
              type: 'string',
              description: 'Sort field',
              enum: ['name', 'updated']
            },
            direction: {
              type: 'string',
              description: 'Sort direction',
              enum: ['asc', 'desc']
            },
            page: {
              type: 'number',
              description: 'Page number'
            },
            perPage: {
              type: 'number',
              description: 'Number of results per page'
            },
            autoPaginate: {
              type: 'boolean',
              description: '是否自动获取所有页（默认 false，设为 true 时自动获取全部数据）',
              default: false
            },
            maxPages: {
              oneOf: [{ type: 'string' }, { type: 'number' }],
              description: '自动分页时的最大页数限制（默认 100）',
              default: 100
            }
          },
          required: ['owner', 'repo']
        }
      },
      {
        name: 'create_repository_branch',
        description: 'Create a new branch in a repository',
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
            branch_name: {
              type: 'string',
              description: 'The name of the new branch to create'
            },
            branch: {
              type: 'string',
              description: 'Legacy alias for branch_name'
            },
            refs: {
              type: 'string',
              description: 'The branch name or commit SHA to create the new branch from'
            }
          },
          required: ['owner', 'repo', 'branch_name', 'refs']
        }
      },
      {
        name: 'delete_repository_branch',
        description: 'Delete a branch from a repository',
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
            name: {
              type: 'string',
              description: 'The name of the branch to delete'
            }
          },
          required: ['owner', 'repo', 'name']
        }
      },
      {
        name: 'get_repository_branch',
        description: 'Get a specific branch in a repository',
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
            branch: {
              type: 'string',
              description: 'The name of the branch'
            }
          },
          required: ['owner', 'repo', 'branch']
        }
      },
      {
        name: 'create_branch_protection_rule',
        description: 'Create a branch protection rule',
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
            wildcard: {
              type: 'string',
              description: 'The branch name pattern (supports wildcards like "main", "feature/*")'
            },
            pusher: {
              type: 'string',
              description: '允许推送代码的成员或角色'
            },
            merger: {
              type: 'string',
              description: '允许合并 Pull Request 的成员或角色'
            }
          },
          required: ['owner', 'repo', 'wildcard', 'pusher', 'merger']
        }
      },
      {
        name: 'delete_branch_protection_rule',
        description: 'Delete a branch protection rule',
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
            wildcard: {
              type: 'string',
              description: 'The branch name pattern to delete protection for'
            }
          },
          required: ['owner', 'repo', 'wildcard']
        }
      },
      {
        name: 'get_branch_protection_rules',
        description: 'Get all branch protection rules in a repository',
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
        name: 'update_branch_protection_rule',
        description: 'Update a branch protection rule',
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
            wildcard: {
              type: 'string',
              description: 'The branch name pattern to update'
            },
            pusher: {
              type: 'string',
              description: '允许推送代码的成员或角色'
            },
            merger: {
              type: 'string',
              description: '允许合并 Pull Request 的成员或角色'
            }
          },
          required: ['owner', 'repo', 'wildcard', 'pusher', 'merger']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'get_repository_branches':
        if (args.autoPaginate) {
          return autoPaginate(
            (page, perPage) => this.branchService.getRepositoryBranches(args.owner, args.repo, args.sort, args.direction, page, perPage),
            { page: args.page, perPage: args.perPage, autoPaginate: true, maxPages: args.maxPages }
          );
        }
        return await this.branchService.getRepositoryBranches(
          args.owner,
          args.repo,
          args.sort,
          args.direction,
          args.page,
          args.perPage
        );

      case 'create_repository_branch':
        const branchName = args.branch_name ?? args.branch;
        if (!branchName) {
          throw new Error('create_repository_branch requires branch_name (or legacy branch)');
        }
        return await this.branchService.createRepositoryBranch(args.owner, args.repo, branchName, args.refs);

      case 'delete_repository_branch':
        return await this.branchService.deleteRepositoryBranch(args.owner, args.repo, args.name ?? args.branch);

      case 'get_repository_branch':
        return await this.branchService.getRepositoryBranch(args.owner, args.repo, args.branch);

      case 'create_branch_protection_rule':
        return await this.branchService.createBranchProtectionRule(args.owner, args.repo, {
          wildcard: args.wildcard,
          pusher: args.pusher,
          merger: args.merger
        });

      case 'delete_branch_protection_rule':
        return await this.branchService.deleteBranchProtectionRule(args.owner, args.repo, args.wildcard);

      case 'get_branch_protection_rules':
        return await this.branchService.getBranchProtectionRules(args.owner, args.repo);

      case 'update_branch_protection_rule':
        return await this.branchService.updateBranchProtectionRule(args.owner, args.repo, args.wildcard, {
          pusher: args.pusher,
          merger: args.merger
        });

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}
