import { BaseService } from './BaseService.js';
export class ReleaseService extends BaseService {
    async createRelease(owner, repo, releaseData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/releases`, releaseData);
        return response.data;
    }
    async updateRelease(owner, repo, tag, releaseData) {
        const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/releases/${tag}`, releaseData);
        return response.data;
    }
    async getReleaseUploadUrl(owner, repo, tag) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/releases/${tag}/upload_url`);
        return response.data;
    }
    async getRelease(owner, repo, tag) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/releases/${tag}`);
        return response.data;
    }
    async getLatestRelease(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/releases/latest`);
        return response.data;
    }
    async getReleaseByTag(owner, repo, tag) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/releases/tags/${tag}`);
        return response.data;
    }
    async getReleases(owner, repo, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/releases`, {
            params: {
                page,
                per_page: perPage
            }
        });
        return response.data;
    }
    async downloadReleaseAsset(owner, repo, fileName) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/releases/attach_files/${fileName}/download`);
        return response.data;
    }
}
//# sourceMappingURL=ReleaseService.js.map