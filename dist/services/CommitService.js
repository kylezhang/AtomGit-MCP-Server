import { BaseService } from './BaseService.js';
export class CommitService extends BaseService {
    async getRepositoryCommits(owner, repo, sha, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/commits`, {
            params: {
                sha,
                page,
                per_page: perPage
            }
        });
        return response.data;
    }
    async getRepositoryCommit(owner, repo, sha) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/commits/${sha}`);
        return response.data;
    }
    async compareRepositoryCommits(owner, repo, base, head) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/compare/${base}...${head}`);
        return response.data;
    }
    async createRepositoryCommitComment(owner, repo, sha, commentData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/commits/${sha}/comments`, commentData);
        return response.data;
    }
    async deleteRepositoryCommitComment(owner, repo, commentId) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/comments/${commentId}`);
        return response.data;
    }
    async getRepositoryCommitComment(owner, repo, commentId) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/comments/${commentId}`);
        return response.data;
    }
    async updateRepositoryCommitComment(owner, repo, commentId, commentData) {
        const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/comments/${commentId}`, commentData);
        return response.data;
    }
    async getRepositoryCommitComments(owner, repo, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/comments`, {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    async getRepositoryCommitStatistics(owner, repo, sha) {
        const url = `/api/v5/repos/${owner}/${repo}/repository-commit-statistics`;
        const params = {};
        if (sha) {
            params.sha = sha;
        }
        const response = await this.client.get(url, { params });
        return response.data;
    }
    async getRepositoryCommitRefComments(owner, repo, ref) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/commits/${ref}/comments`);
        return response.data;
    }
    async getRepositoryCommitDiff(owner, repo, sha) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/commits/${sha}/diff`);
        return response.data;
    }
    async getRepositoryCommitPatch(owner, repo, sha) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/commits/${sha}/patch`);
        return response.data;
    }
}
//# sourceMappingURL=CommitService.js.map