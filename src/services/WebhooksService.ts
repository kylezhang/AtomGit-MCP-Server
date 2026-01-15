import { BaseService } from './BaseService.js';

export class WebhooksService extends BaseService {
  
  async getRepositoryWebhooks(owner: string, repo: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/hooks`);
    return response.data;
  }

  async createRepositoryWebhook(owner: string, repo: string, webhookData: any): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/hooks`, webhookData);
    return response.data;
  }

  async getRepositoryWebhook(owner: string, repo: string, id: number): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/hooks/${id}`);
    return response.data;
  }

  async updateRepositoryWebhook(owner: string, repo: string, id: number, webhookData: any): Promise<any> {
    const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/hooks/${id}`, webhookData);
    return response.data;
  }

  async deleteRepositoryWebhook(owner: string, repo: string, id: number): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/hooks/${id}`);
    return response.data;
  }

  async testRepositoryWebhook(owner: string, repo: string, id: number): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/hooks/${id}/tests`);
    return response.data;
  }
}
