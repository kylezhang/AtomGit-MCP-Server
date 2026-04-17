import { BaseService } from './BaseService.js';

interface LabelPayload {
  name: string;
  color?: string;
  description?: string;
}

interface PaginationOptions {
  page?: number;
  perPage?: number;
  per_page?: number;
}

export class LabelsService extends BaseService {
  private buildParams(options?: object): Record<string, unknown> {
    const params: Record<string, unknown> = { ...((options ?? {}) as Record<string, unknown>) };

    if (params.per_page === undefined && params.perPage !== undefined) {
      params.per_page = params.perPage;
    }

    delete params.perPage;

    return Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined)
    );
  }
  
  async replaceRepositoryProjectLabels(owner: string, repo: string, labels: string[]): Promise<any[]> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/project_labels`, { labels });
    return response.data;
  }

  async deleteRepositoryIssueAllLabels(owner: string, repo: string, issueNumber: number): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/labels`);
    return response.data;
  }

  async replaceRepositoryIssueAllLabels(owner: string, repo: string, issueNumber: string | number, labels: string[]): Promise<any[]> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/labels`, { labels });
    return response.data;
  }

  async updateRepositoryLabel(owner: string, repo: string, originalName: string, labelData: LabelPayload): Promise<any> {
    const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/labels/${originalName}`, labelData);
    return response.data;
  }

  async getRepositoryLabels(owner: string, repo: string, options: PaginationOptions = {}): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/labels`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async createRepositoryLabel(owner: string, repo: string, labelData: LabelPayload): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/labels`, labelData);
    return response.data;
  }

  async deleteRepositoryLabel(owner: string, repo: string, name: string): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/labels/${name}`);
    return response.data;
  }

  async getEnterpriseLabels(enterprise: string, options: PaginationOptions = {}): Promise<any[]> {
    const response = await this.client.get(`/api/v5/enterprises/${enterprise}/labels`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getEnterpriseLabelsV8(
    enterprise: string,
    options: PaginationOptions & { search?: string; direction?: string } = {}
  ): Promise<any[]> {
    const response = await this.client.get(`/api/v8/enterprises/${enterprise}/labels`, {
      params: this.buildParams(options)
    });
    return response.data;
  }
}
