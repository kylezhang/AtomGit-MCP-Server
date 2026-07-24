import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ActionsService } from '../services/ActionsService.js';
import { autoPaginate, autoPaginateSchemaProperties } from '../core/PaginationHelper.js';

const stringOrNumberSchema = (description: string) => ({
  oneOf: [
    { type: 'string' },
    { type: 'number' }
  ],
  description
});

const repoPathProperties = {
  owner: {
    type: 'string',
    description: '仓库所属空间地址(组织或个人的地址path)'
  },
  repo: {
    type: 'string',
    description: '仓库路径(path)'
  }
};

const paginationProperties = {
  keyword: {
    type: 'string',
    description: '关键字过滤'
  },
  page: {
    type: 'number',
    description: '当前页码'
  },
  perPage: {
    type: 'number',
    description: '每页的项目数'
  },
  ...autoPaginateSchemaProperties,
};

const artifactListProperties = {
  name: {
    type: 'string',
    description: '制品名称过滤（模糊匹配）'
  },
  sort: {
    type: 'string',
    description: '排序字段，当前仅支持 created'
  },
  direction: {
    type: 'string',
    description: '排序方向，asc 或 desc'
  },
  page: {
    type: 'number',
    description: '当前页码'
  },
  perPage: {
    type: 'number',
    description: '每页的项目数'
  },
  ...autoPaginateSchemaProperties,
};

export class ActionsTools {
  private actionsService: ActionsService;

  constructor(actionsService: ActionsService) {
    this.actionsService = actionsService;
  }

  getTools(): Tool[] {
    return [
      {
        name: 'get_repository_actions_artifacts',
        description: '列出仓库的 Artifacts',
        inputSchema: {
          type: 'object',
          properties: {
            ...repoPathProperties,
            ...artifactListProperties
          },
          required: ['owner', 'repo']
        }
      },
      {
        name: 'get_repository_actions_artifact',
        description: '获取 Artifact 详情',
        inputSchema: {
          type: 'object',
          properties: {
            ...repoPathProperties,
            artifactId: {
              type: 'string',
              description: '制品id'
            }
          },
          required: ['owner', 'repo', 'artifactId']
        }
      },
      {
        name: 'download_repository_actions_artifact',
        description: '下载指定 Artifact',
        inputSchema: {
          type: 'object',
          properties: {
            ...repoPathProperties,
            artifactId: {
              type: 'string',
              description: '制品id'
            },
            archiveFormat: {
              type: 'string',
              description: '归档格式，仅支持 zip'
            }
          },
          required: ['owner', 'repo', 'artifactId', 'archiveFormat']
        }
      },
      {
        name: 'delete_repository_actions_artifact',
        description: '删除指定 Artifact',
        inputSchema: {
          type: 'object',
          properties: {
            ...repoPathProperties,
            artifactId: {
              type: 'string',
              description: '制品id'
            }
          },
          required: ['owner', 'repo', 'artifactId']
        }
      },
      {
        name: 'get_repository_actions_runs',
        description: '获取仓库所有的流水线的运行记录',
        inputSchema: {
          type: 'object',
          properties: {
            ...repoPathProperties,
            event: {
              type: 'string',
              description: '触发事件类型，MR、Push 或 Manual'
            },
            status: {
              type: 'string',
              description: '运行状态'
            },
            branch: {
              type: 'string',
              description: '分支过滤'
            },
            executor: {
              type: 'string',
              description: '触发人用户名'
            },
            pull_request_id: {
              type: 'string',
              description: 'PR 的编号'
            },
            workflow_id: {
              type: 'string',
              description: '流水线 id'
            },
            workflow_name: {
              type: 'string',
              description: '流水线名称'
            },
            page: stringOrNumberSchema('当前的页码'),
            perPage: stringOrNumberSchema('每页的数量，最大为 100，默认 20')
          },
          required: ['owner', 'repo']
        }
      },
      {
        name: 'get_repository_actions_run',
        description: '获取流水线的运行详情',
        inputSchema: {
          type: 'object',
          properties: {
            ...repoPathProperties,
            runId: {
              type: 'string',
              description: '流水线运行id'
            }
          },
          required: ['owner', 'repo', 'runId']
        }
      },
      {
        name: 'get_repository_actions_run_artifacts',
        description: '列出特定 Run 的 Artifacts',
        inputSchema: {
          type: 'object',
          properties: {
            ...repoPathProperties,
            runId: {
              type: 'string',
              description: '流水线运行id'
            },
            ...artifactListProperties
          },
          required: ['owner', 'repo', 'runId']
        }
      },
      {
        name: 'get_repository_actions_run_jobs',
        description: '获取工作流运行的jobs列表',
        inputSchema: {
          type: 'object',
          properties: {
            ...repoPathProperties,
            runId: {
              type: 'string',
              description: '流水线运行id'
            }
          },
          required: ['owner', 'repo', 'runId']
        }
      },
      {
        name: 'get_repository_actions_run_job',
        description: '获取工作流运行的job详情',
        inputSchema: {
          type: 'object',
          properties: {
            ...repoPathProperties,
            runId: {
              type: 'string',
              description: '流水线运行id'
            },
            jobId: {
              type: 'string',
              description: '任务id'
            }
          },
          required: ['owner', 'repo', 'runId', 'jobId']
        }
      },
      {
        name: 'download_repository_actions_run_job_log',
        description: '下载工作流运行的job日志',
        inputSchema: {
          type: 'object',
          properties: {
            ...repoPathProperties,
            runId: {
              type: 'string',
              description: '流水线运行id'
            },
            jobId: {
              type: 'string',
              description: '任务id'
            }
          },
          required: ['owner', 'repo', 'runId', 'jobId']
        }
      },
      {
        name: 'get_repository_actions_runners',
        description: '查询指定仓库下的所有主机 Runner',
        inputSchema: {
          type: 'object',
          properties: {
            ...repoPathProperties,
            ...paginationProperties
          },
          required: ['owner', 'repo']
        }
      },
      {
        name: 'get_repository_actions_runner_sets',
        description: '查询指定仓库下的所有 K8S Runner',
        inputSchema: {
          type: 'object',
          properties: {
            ...repoPathProperties,
            ...paginationProperties
          },
          required: ['owner', 'repo']
        }
      },
      {
        name: 'get_repository_actions_shared_runners',
        description: '查询分享给仓库的所有主机 Runner',
        inputSchema: {
          type: 'object',
          properties: {
            ...repoPathProperties,
            ...paginationProperties
          },
          required: ['owner', 'repo']
        }
      },
      {
        name: 'get_repository_actions_shared_runner_sets',
        description: '查询分享给仓库的所有 K8S Runner',
        inputSchema: {
          type: 'object',
          properties: {
            ...repoPathProperties,
            ...paginationProperties
          },
          required: ['owner', 'repo']
        }
      },
      {
        name: 'get_organization_actions_runner_groups',
        description: '查询指定组织下的所有 Runner Group',
        inputSchema: {
          type: 'object',
          properties: {
            org: {
              type: 'string',
              description: '组织path'
            },
            ...paginationProperties
          },
          required: ['org']
        }
      },
      {
        name: 'get_organization_actions_runner_group',
        description: '获取指定 Runner Group 的详细信息',
        inputSchema: {
          type: 'object',
          properties: {
            org: {
              type: 'string',
              description: '组织path'
            },
            runnerGroupId: {
              type: 'string',
              description: 'Runner Group id'
            }
          },
          required: ['org', 'runnerGroupId']
        }
      },
      {
        name: 'get_organization_actions_runner_group_runners',
        description: '查询指定 Runner Group 下的所有主机 Runner',
        inputSchema: {
          type: 'object',
          properties: {
            org: {
              type: 'string',
              description: '组织path'
            },
            runnerGroupId: {
              type: 'string',
              description: 'Runner Group id'
            },
            ...paginationProperties
          },
          required: ['org', 'runnerGroupId']
        }
      },
      {
        name: 'get_organization_actions_runner_group_runner_sets',
        description: '查询指定 Runner Group 下的所有 K8S Runner',
        inputSchema: {
          type: 'object',
          properties: {
            org: {
              type: 'string',
              description: '组织path'
            },
            runnerGroupId: {
              type: 'string',
              description: 'Runner Group id'
            },
            ...paginationProperties
          },
          required: ['org', 'runnerGroupId']
        }
      },
      {
        name: 'get_organization_actions_runner_group_shared_namespaces',
        description: '查询有权访问指定 Runner Group 的仓库列表',
        inputSchema: {
          type: 'object',
          properties: {
            org: {
              type: 'string',
              description: '组织path'
            },
            runnerGroupId: {
              type: 'string',
              description: 'Runner Group id'
            },
            ...paginationProperties
          },
          required: ['org', 'runnerGroupId']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'get_repository_actions_artifacts':
        if (args.autoPaginate) {
          return autoPaginate(
            (page, perPage) => this.actionsService.getRepositoryActionsArtifacts(args.owner, args.repo, { name: args.name, sort: args.sort, direction: args.direction, page, per_page: perPage }),
            { page: args.page, perPage: args.perPage, autoPaginate: true, maxPages: args.maxPages }
          );
        }
        return await this.actionsService.getRepositoryActionsArtifacts(args.owner, args.repo, {
          name: args.name,
          sort: args.sort,
          direction: args.direction,
          page: args.page,
          per_page: args.perPage
        });

      case 'get_repository_actions_artifact':
        return await this.actionsService.getRepositoryActionsArtifact(args.owner, args.repo, args.artifactId);

      case 'download_repository_actions_artifact':
        return await this.actionsService.downloadRepositoryActionsArtifact(
          args.owner,
          args.repo,
          args.artifactId,
          args.archiveFormat
        );

      case 'delete_repository_actions_artifact':
        return await this.actionsService.deleteRepositoryActionsArtifact(args.owner, args.repo, args.artifactId);

      case 'get_repository_actions_runs':
        if (args.autoPaginate) {
          return autoPaginate(
            (page, perPage) => this.actionsService.getRepositoryActionsRuns(args.owner, args.repo, { event: args.event, status: args.status, branch: args.branch, executor: args.executor, pull_request_id: args.pull_request_id, workflow_id: args.workflow_id, workflow_name: args.workflow_name, page: page.toString(), per_page: perPage.toString() }),
            { page: args.page, perPage: args.perPage, autoPaginate: true, maxPages: args.maxPages }
          );
        }
        return await this.actionsService.getRepositoryActionsRuns(args.owner, args.repo, {
          event: args.event,
          status: args.status,
          branch: args.branch,
          executor: args.executor,
          pull_request_id: args.pull_request_id,
          workflow_id: args.workflow_id,
          workflow_name: args.workflow_name,
          page: args.page,
          per_page: args.perPage
        });

      case 'get_repository_actions_run':
        return await this.actionsService.getRepositoryActionsRun(args.owner, args.repo, args.runId);

      case 'get_repository_actions_run_artifacts':
        if (args.autoPaginate) {
          return autoPaginate(
            (page, perPage) => this.actionsService.getRepositoryActionsRunArtifacts(args.owner, args.repo, args.runId, { name: args.name, sort: args.sort, direction: args.direction, page, per_page: perPage }),
            { page: args.page, perPage: args.perPage, autoPaginate: true, maxPages: args.maxPages }
          );
        }
        return await this.actionsService.getRepositoryActionsRunArtifacts(args.owner, args.repo, args.runId, {
          name: args.name,
          sort: args.sort,
          direction: args.direction,
          page: args.page,
          per_page: args.perPage
        });

      case 'get_repository_actions_run_jobs':
        return await this.actionsService.getRepositoryActionsRunJobs(args.owner, args.repo, args.runId);

      case 'get_repository_actions_run_job':
        return await this.actionsService.getRepositoryActionsRunJob(args.owner, args.repo, args.runId, args.jobId);

      case 'download_repository_actions_run_job_log':
        return await this.actionsService.downloadRepositoryActionsRunJobLog(args.owner, args.repo, args.runId, args.jobId);

      case 'get_repository_actions_runners':
        return await this.actionsService.getRepositoryActionsRunners(args.owner, args.repo, {
          keyword: args.keyword,
          page: args.page,
          per_page: args.perPage
        });

      case 'get_repository_actions_runner_sets':
        return await this.actionsService.getRepositoryActionsRunnerSets(args.owner, args.repo, {
          keyword: args.keyword,
          page: args.page,
          per_page: args.perPage
        });

      case 'get_repository_actions_shared_runners':
        return await this.actionsService.getRepositoryActionsSharedRunners(args.owner, args.repo, {
          keyword: args.keyword,
          page: args.page,
          per_page: args.perPage
        });

      case 'get_repository_actions_shared_runner_sets':
        return await this.actionsService.getRepositoryActionsSharedRunnerSets(args.owner, args.repo, {
          keyword: args.keyword,
          page: args.page,
          per_page: args.perPage
        });

      case 'get_organization_actions_runner_groups':
        return await this.actionsService.getOrganizationActionsRunnerGroups(args.org, {
          keyword: args.keyword,
          page: args.page,
          per_page: args.perPage
        });

      case 'get_organization_actions_runner_group':
        return await this.actionsService.getOrganizationActionsRunnerGroup(args.org, args.runnerGroupId);

      case 'get_organization_actions_runner_group_runners':
        return await this.actionsService.getOrganizationActionsRunnerGroupRunners(args.org, args.runnerGroupId, {
          keyword: args.keyword,
          page: args.page,
          per_page: args.perPage
        });

      case 'get_organization_actions_runner_group_runner_sets':
        return await this.actionsService.getOrganizationActionsRunnerGroupRunnerSets(args.org, args.runnerGroupId, {
          keyword: args.keyword,
          page: args.page,
          per_page: args.perPage
        });

      case 'get_organization_actions_runner_group_shared_namespaces':
        return await this.actionsService.getOrganizationActionsRunnerGroupSharedNamespaces(args.org, args.runnerGroupId, {
          keyword: args.keyword,
          page: args.page,
          per_page: args.perPage
        });

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}
