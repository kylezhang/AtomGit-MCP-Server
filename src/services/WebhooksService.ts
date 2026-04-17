import { BaseService } from './BaseService.js';

interface RepositoryWebhookPayload {
  url: string;
  encryption_type?: number;
  password?: string;
  push_events?: boolean;
  tag_push_events?: boolean;
  issues_events?: boolean;
  note_events?: boolean;
  merge_requests_events?: boolean;
}

export class WebhooksService extends BaseService {
  
  async getRepositoryWebhooks(owner: string, repo: string, page?: number, perPage?: number): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/hooks`, {
      params: {
        page,
        per_page: perPage
      }
    });
    return response.data;
  }

  async createRepositoryWebhook(owner: string, repo: string, webhookData: RepositoryWebhookPayload): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/hooks`, webhookData);
    return response.data;
  }

  async getRepositoryWebhook(owner: string, repo: string, id: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/hooks/${id}`);
    return response.data;
  }

  async updateRepositoryWebhook(
    owner: string,
    repo: string,
    id: string,
    webhookData: RepositoryWebhookPayload
  ): Promise<any> {
    const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/hooks/${id}`, webhookData);
    return response.data;
  }

  async deleteRepositoryWebhook(owner: string, repo: string, id: string): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/hooks/${id}`);
    return response.data;
  }

  async testRepositoryWebhook(owner: string, repo: string, id: string): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/hooks/${id}/tests`);
    return response.data;
  }
}
