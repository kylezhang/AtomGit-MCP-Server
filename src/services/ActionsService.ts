import { BaseService } from './BaseService.js';

interface ActionsPaginationOptions {
  keyword?: string;
  page?: number;
  per_page?: number;
}

interface ActionsRunsQueryOptions {
  event?: string;
  status?: string;
  branch?: string;
  executor?: string;
  pull_request_id?: string;
  workflow_id?: string;
  workflow_name?: string;
  page?: string;
  per_page?: string;
}

interface ActionsArtifactsQueryOptions {
  name?: string;
  sort?: string;
  direction?: string;
  page?: number;
  per_page?: number;
}

export class ActionsService extends BaseService {
  private buildParams(options?: object): Record<string, unknown> {
    const params: Record<string, unknown> = { ...((options ?? {}) as Record<string, unknown>) };

    return Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
    );
  }

  async deleteRepositoryActionsArtifact(owner: string, repo: string, artifactId: string): Promise<any> {
    const response = await this.client.delete(`/api/v8/repos/${owner}/${repo}/actions/artifacts/${artifactId}`);
    return response.data;
  }

  async getRepositoryActionsSharedRunnerSets(
    owner: string,
    repo: string,
    options: ActionsPaginationOptions = {}
  ): Promise<any> {
    const response = await this.client.get(`/api/v8/repos/${owner}/${repo}/actions/shared-runner-sets`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getRepositoryActionsSharedRunners(
    owner: string,
    repo: string,
    options: ActionsPaginationOptions = {}
  ): Promise<any> {
    const response = await this.client.get(`/api/v8/repos/${owner}/${repo}/actions/runners/shared-runners`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getOrganizationActionsRunnerGroupSharedNamespaces(
    org: string,
    runnerGroupId: string,
    options: ActionsPaginationOptions = {}
  ): Promise<any> {
    const response = await this.client.get(
      `/api/v8/orgs/${org}/actions/runner-groups/${runnerGroupId}/shared-namespaces`,
      {
        params: this.buildParams(options)
      }
    );
    return response.data;
  }

  async getOrganizationActionsRunnerGroupRunnerSets(
    org: string,
    runnerGroupId: string,
    options: ActionsPaginationOptions = {}
  ): Promise<any> {
    const response = await this.client.get(`/api/v8/orgs/${org}/actions/runner-groups/${runnerGroupId}/runner-sets`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getOrganizationActionsRunnerGroupRunners(
    org: string,
    runnerGroupId: string,
    options: ActionsPaginationOptions = {}
  ): Promise<any> {
    const response = await this.client.get(`/api/v8/orgs/${org}/actions/runner-groups/${runnerGroupId}/runners`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getRepositoryActionsRunnerSets(
    owner: string,
    repo: string,
    options: ActionsPaginationOptions = {}
  ): Promise<any> {
    const response = await this.client.get(`/api/v8/repos/${owner}/${repo}/actions/runner-sets`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getRepositoryActionsRunners(
    owner: string,
    repo: string,
    options: ActionsPaginationOptions = {}
  ): Promise<any> {
    const response = await this.client.get(`/api/v8/repos/${owner}/${repo}/actions/runners`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getOrganizationActionsRunnerGroups(org: string, options: ActionsPaginationOptions = {}): Promise<any> {
    const response = await this.client.get(`/api/v8/orgs/${org}/actions/runner-groups`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getRepositoryActionsArtifact(owner: string, repo: string, artifactId: string): Promise<any> {
    const response = await this.client.get(`/api/v8/repos/${owner}/${repo}/actions/artifacts/${artifactId}`);
    return response.data;
  }

  async getRepositoryActionsRuns(
    owner: string,
    repo: string,
    options: ActionsRunsQueryOptions = {}
  ): Promise<any> {
    const response = await this.client.get(`/api/v8/repos/${owner}/${repo}/actions/runs`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getRepositoryActionsRunJob(owner: string, repo: string, runId: string, jobId: string): Promise<any> {
    const response = await this.client.get(`/api/v8/repos/${owner}/${repo}/actions/runs/${runId}/jobs/${jobId}`);
    return response.data;
  }

  async getRepositoryActionsRunJobs(owner: string, repo: string, runId: string): Promise<any> {
    const response = await this.client.get(`/api/v8/repos/${owner}/${repo}/actions/runs/${runId}/jobs`);
    return response.data;
  }

  async getRepositoryActionsRun(owner: string, repo: string, runId: string): Promise<any> {
    const response = await this.client.get(`/api/v8/repos/${owner}/${repo}/actions/runs/${runId}`);
    return response.data;
  }

  async getOrganizationActionsRunnerGroup(org: string, runnerGroupId: string): Promise<any> {
    const response = await this.client.get(`/api/v8/orgs/${org}/actions/runner-groups/${runnerGroupId}`);
    return response.data;
  }

  async getRepositoryActionsArtifacts(
    owner: string,
    repo: string,
    options: ActionsArtifactsQueryOptions = {}
  ): Promise<any> {
    const response = await this.client.get(`/api/v8/repos/${owner}/${repo}/actions/artifacts`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getRepositoryActionsRunArtifacts(
    owner: string,
    repo: string,
    runId: string,
    options: ActionsArtifactsQueryOptions = {}
  ): Promise<any> {
    const response = await this.client.get(`/api/v8/repos/${owner}/${repo}/actions/runs/${runId}/artifacts`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async downloadRepositoryActionsRunJobLog(owner: string, repo: string, runId: string, jobId: string): Promise<any> {
    const response = await this.client.get(
      `/api/v8/repos/${owner}/${repo}/actions/runs/${runId}/jobs/${jobId}/download_log`
    );
    return response.data;
  }

  async downloadRepositoryActionsArtifact(
    owner: string,
    repo: string,
    artifactId: string,
    archiveFormat: string
  ): Promise<any> {
    const response = await this.client.get(
      `/api/v8/repos/${owner}/${repo}/actions/artifacts/${artifactId}/${archiveFormat}`
    );
    return response.data;
  }
}
