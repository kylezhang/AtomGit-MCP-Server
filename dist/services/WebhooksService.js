import { BaseService } from './BaseService.js';
export class WebhooksService extends BaseService {
    async getRepositoryWebhooks(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/hooks`);
        return response.data;
    }
    async createRepositoryWebhook(owner, repo, webhookData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/hooks`, webhookData);
        return response.data;
    }
    async getRepositoryWebhook(owner, repo, id) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/hooks/${id}`);
        return response.data;
    }
    async updateRepositoryWebhook(owner, repo, id, webhookData) {
        const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/hooks/${id}`, webhookData);
        return response.data;
    }
    async deleteRepositoryWebhook(owner, repo, id) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/hooks/${id}`);
        return response.data;
    }
    async testRepositoryWebhook(owner, repo, id) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/hooks/${id}/tests`);
        return response.data;
    }
}
//# sourceMappingURL=WebhooksService.js.map