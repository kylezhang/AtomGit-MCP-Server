import { BaseService } from './BaseService.js';
export class LabelsService extends BaseService {
    async replaceRepositoryProjectLabels(owner, repo, labels) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/project_labels`, { labels });
        return response.data;
    }
    async deleteRepositoryIssueAllLabels(owner, repo, issueNumber) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/labels`);
        return response.data;
    }
    async replaceRepositoryIssueAllLabels(owner, repo, issueNumber, labels) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/labels`, { labels });
        return response.data;
    }
    async updateRepositoryLabel(owner, repo, originalName, labelData) {
        const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/labels/${originalName}`, labelData);
        return response.data;
    }
    async getRepositoryLabels(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/labels`);
        return response.data;
    }
    async createRepositoryLabel(owner, repo, labelData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/labels`, labelData);
        return response.data;
    }
    async deleteRepositoryLabel(owner, repo, name) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/labels/${name}`);
        return response.data;
    }
    async getEnterpriseLabels(enterprise) {
        const response = await this.client.get(`/api/v5/enterprises/${enterprise}/labels`);
        return response.data;
    }
    async getEnterpriseLabelsV8(enterprise) {
        const response = await this.client.get(`/api/v8/enterprises/${enterprise}/labels`);
        return response.data;
    }
}
//# sourceMappingURL=LabelsService.js.map