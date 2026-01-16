import { BaseService } from './BaseService.js';
export class IssuesService extends BaseService {
    async createRepositoryIssue(owner, repo, issueData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/issues`, issueData);
        return response.data;
    }
    async updateRepositoryIssue(owner, repo, issueNumber, updateData) {
        const response = await this.client.patch(`/api/v5/repos/${owner}/issues/${issueNumber}`, updateData);
        return response.data;
    }
    async getRepositoryIssue(owner, repo, issueNumber) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}`);
        return response.data;
    }
    async getRepositoryIssues(owner, repo, state = 'open', page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues`, {
            params: {
                state,
                page,
                per_page: perPage
            }
        });
        return response.data;
    }
    async getRepositoryIssueComments(owner, repo, issueNumber, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/comments`, {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    async createRepositoryIssueComment(owner, repo, issueNumber, commentData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/comments`, commentData);
        return response.data;
    }
    async getRepositoryAllIssueComments(owner, repo, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/comments`, {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    async getRepositoryIssuePullRequests(owner, repo, issueNumber) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/pull_requests`);
        return response.data;
    }
    async getEnterpriseIssueLabels(enterprise, issueId) {
        const response = await this.client.get(`/api/v5/enterprises/${enterprise}/issues/${issueId}/labels`);
        return response.data;
    }
    async createRepositoryIssueLabel(owner, repo, issueNumber, labels) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/labels`, { labels });
        return response.data;
    }
    async deleteRepositoryIssueLabel(owner, repo, issueNumber, name) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/labels/${name}`);
        return response.data;
    }
    async getRepositoryIssueOperateLogs(owner, repo, issueNumber, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/operate_logs`, {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    async getEnterpriseIssues(enterprise, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/enterprises/${enterprise}/issues`, {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    async getUserIssues(page = 1, perPage = 30) {
        const response = await this.client.get('/api/v5/user/issues', {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    async updateRepositoryIssueComment(owner, repo, commentId, updateData) {
        const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/issues/comments/${commentId}`, updateData);
        return response.data;
    }
    async deleteRepositoryIssueComment(owner, repo, commentId) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/issues/comments/${commentId}`);
        return response.data;
    }
    async getRepositoryIssueComment(owner, repo, commentId) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/comments/${commentId}`);
        return response.data;
    }
    async getOrganizationIssues(org, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/orgs/${org}/issues`, {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    async getEnterpriseIssueComments(enterprise, issueNumber, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/enterprises/${enterprise}/issues/${issueNumber}/comments`, {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    async getEnterpriseIssue(enterprise, issueNumber) {
        const response = await this.client.get(`/api/v5/enterprises/${enterprise}/issues/${issueNumber}`);
        return response.data;
    }
    async getEnterpriseIssueStatuses(enterprise) {
        const response = await this.client.get(`/api/v5/enterprises/${enterprise}/issue_statuses`);
        return response.data;
    }
    async getRepositoryIssueRelatedBranches(owner, repo, issueNumber) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/related_branches`);
        return response.data;
    }
    async getRepositoryIssueReactions(owner, repo, issueNumber) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/user_reactions`);
        return response.data;
    }
    async getRepositoryIssueCommentReactions(owner, repo, commentId) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/comment/${commentId}/user_reactions`);
        return response.data;
    }
    async getRepositoryIssueModifyHistory(owner, repo, issueNumber) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/modify_history`);
        return response.data;
    }
    async getRepositoryIssueCommentModifyHistory(owner, repo, commentId) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/comment/${commentId}/modify_history`);
        return response.data;
    }
    async replaceRepositoryIssueAllLabels(owner, repo, issueNumber, labels) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/labels`, { labels });
        return response.data;
    }
    async deleteRepositoryAllIssueLabels(owner, repo, issueNumber) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/labels`);
        return response.data;
    }
    async getAllRepositoryIssueComments(owner, repo, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/comments`, {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
}
//# sourceMappingURL=IssuesService.js.map