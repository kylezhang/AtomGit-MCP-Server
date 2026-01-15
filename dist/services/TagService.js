import { BaseService } from './BaseService.js';
export class TagService extends BaseService {
    async getRepositoryTags(owner, repo, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/tags`, {
            params: {
                page,
                per_page: perPage
            }
        });
        return response.data;
    }
    async createRepositoryTag(owner, repo, tagData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/tags`, tagData);
        return response.data;
    }
    async deleteRepositoryTag(owner, repo, tagName) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/tags/${tagName}`);
        return response.data;
    }
    async getRepositoryProtectedTags(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/protected_tags`);
        return response.data;
    }
    async createRepositoryProtectedTag(owner, repo, tagData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/protected_tags`, tagData);
        return response.data;
    }
    async updateRepositoryProtectedTag(owner, repo, tagData) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/protected_tags`, tagData);
        return response.data;
    }
    async deleteRepositoryProtectedTag(owner, repo, tagName) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/protected_tags/${tagName}`);
        return response.data;
    }
    async getRepositoryProtectedTag(owner, repo, tagName) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/protected_tags/${tagName}`);
        return response.data;
    }
}
//# sourceMappingURL=TagService.js.map