import { BaseService } from './BaseService.js';

export class LabelsService extends BaseService {
  
  async replaceRepositoryProjectLabels(owner: string, repo: string, labels: string[]): Promise<any[]> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/project_labels`, { labels });
    return response.data;
  }

  async deleteRepositoryIssueAllLabels(owner: string, repo: string, issueNumber: number): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/labels`);
    return response.data;
  }

  async replaceRepositoryIssueAllLabels(owner: string, repo: string, issueNumber: number, labels: string[]): Promise<any[]> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/labels`, { labels });
    return response.data;
  }

  async updateRepositoryLabel(owner: string, repo: string, originalName: string, labelData: any): Promise<any> {
    const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/labels/${originalName}`, labelData);
    return response.data;
  }

  async getRepositoryLabels(owner: string, repo: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/labels`);
    return response.data;
  }

  async createRepositoryLabel(owner: string, repo: string, labelData: any): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/labels`, labelData);
    return response.data;
  }

  async deleteRepositoryLabel(owner: string, repo: string, name: string): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/labels/${name}`);
    return response.data;
  }

  async getEnterpriseLabels(enterprise: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/enterprises/${enterprise}/labels`);
    return response.data;
  }

  async getEnterpriseLabelsV8(enterprise: string): Promise<any[]> {
    const response = await this.client.get(`/api/v8/enterprises/${enterprise}/labels`);
    return response.data;
  }
}
