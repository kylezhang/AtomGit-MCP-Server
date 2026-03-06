import { BaseService } from './BaseService.js';
export class PullRequestService extends BaseService {
    async getRepositoryPulls(owner, repo, state = 'open', page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls`, {
            params: {
                state,
                page,
                per_page: perPage
            }
        });
        return response.data;
    }
    async createRepositoryPull(owner, repo, pullData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls`, pullData);
        return response.data;
    }
    async mergeRepositoryPull(owner, repo, pullNumber, mergeData) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/merge`, mergeData);
        return response.data;
    }
    async getRepositoryPullMergeStatus(owner, repo, pullNumber) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/merge`);
        return response.data;
    }
    async getRepositoryPullIssues(owner, repo, pullNumber) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/issues`);
        return response.data;
    }
    async createRepositoryPullComment(owner, repo, pullNumber, commentData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/comments`, commentData);
        return response.data;
    }
    async getRepositoryPullComments(owner, repo, pullNumber, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/comments`, {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    async getRepositoryPullFiles(owner, repo, pullNumber, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/files`, {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    async updateRepositoryPull(owner, repo, pullNumber, updateData) {
        const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}`, updateData);
        return response.data;
    }
    async getRepositoryPull(owner, repo, pullNumber) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}`);
        return response.data;
    }
    async getRepositoryPullCommits(owner, repo, pullNumber, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/commits`, {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    async createRepositoryPullLabel(owner, repo, pullNumber, labels) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/labels`, { labels });
        return response.data;
    }
    async getRepositoryPullLabels(owner, repo, pullNumber) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/labels`);
        return response.data;
    }
    async replaceRepositoryPullLabels(owner, repo, pullNumber, labels) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/labels`, { labels });
        return response.data;
    }
    async deleteRepositoryPullLabel(owner, repo, pullNumber, label) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/labels/${label}`);
        return response.data;
    }
    async getRepositoryPullOperateLogs(owner, repo, pullNumber) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/operate_logs`);
        return response.data;
    }
    async linkRepositoryPullIssues(owner, repo, pullNumber, issues) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/issues`, { issues });
        return response.data;
    }
    async unlinkRepositoryPullIssues(owner, repo, pullNumber, issues) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/issues`, { data: { issues } });
        return response.data;
    }
    async getRepositoryPullFilesJson(owner, repo, pullNumber) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/files_json`);
        return response.data;
    }
    async getRepositoryPullFileContent(owner, repo, pullNumber, filePath) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/files/content`, {
            params: { file_path: filePath }
        });
        return response.data;
    }
    async resetRepositoryPullTesters(owner, repo, pullNumber) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/test/reset`);
        return response.data;
    }
    async resetRepositoryPullAssignees(owner, repo, pullNumber) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/assign/reset`);
        return response.data;
    }
    async processRepositoryPullTest(owner, repo, pullNumber, action, comment) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/test`, {
            action,
            comment
        });
        return response.data;
    }
    async processRepositoryPullReview(owner, repo, pullNumber, action, comment) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/review`, {
            action,
            comment
        });
        return response.data;
    }
    async assignRepositoryPullTesters(owner, repo, pullNumber, testers) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/test/assign`, { testers });
        return response.data;
    }
    async removeRepositoryPullTesters(owner, repo, pullNumber, testers) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/test/remove`, { data: { testers } });
        return response.data;
    }
    async getRepositoryPullTesterOptions(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/tester_options`);
        return response.data;
    }
    async assignRepositoryPullAssignees(owner, repo, pullNumber, assignees) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/assign/assign`, { assignees });
        return response.data;
    }
    async removeRepositoryPullAssignees(owner, repo, pullNumber, assignees) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/assign/remove`, { data: { assignees } });
        return response.data;
    }
    async assignRepositoryPullApprovalReviewers(owner, repo, pullNumber, reviewers) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/approval_reviewers/assign`, { reviewers });
        return response.data;
    }
    async removeRepositoryPullApprovalReviewers(owner, repo, pullNumber, reviewers) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/approval_reviewers/remove`, { data: { reviewers } });
        return response.data;
    }
    async getRepositoryPullApprovalReviewerOptions(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/approval_reviewer_options`);
        return response.data;
    }
    async getPullRequestComment(owner, repo, commentId) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/comments/${commentId}`);
        return response.data;
    }
    async editPullRequestComment(owner, repo, commentId, commentData) {
        const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/pulls/comments/${commentId}`, commentData);
        return response.data;
    }
    async replyPullRequestDiscussion(owner, repo, pullNumber, discussionId, commentData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/discussions/${discussionId}/comments`, commentData);
        return response.data;
    }
    async updatePullRequestDiscussionComment(owner, repo, pullNumber, discussionId, commentData) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/comments/discussions/${discussionId}`, commentData);
        return response.data;
    }
    async deletePullRequestComment(owner, repo, commentId) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/pulls/comments/${commentId}`);
        return response.data;
    }
    async getPullRequestReactions(owner, repo, pullNumber) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/user_reactions`);
        return response.data;
    }
    async getPullRequestCommentReactions(owner, repo, commentId) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/comment/${commentId}/user_reactions`);
        return response.data;
    }
    async getPullRequestModifyHistory(owner, repo, pullNumber) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/modify_history`);
        return response.data;
    }
    async getPullRequestCommentModifyHistory(owner, repo, commentId) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/comment/${commentId}/modify_history`);
        return response.data;
    }
    async getEnterprisePullRequests(enterprise, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/enterprises/${enterprise}/pull_requests`, {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    async getOrganizationPullRequests(org, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/orgs/${org}/pull_requests`, {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    async getEnterprisePullRequestIssues(enterprise, issueNumber) {
        const response = await this.client.get(`/api/v5/enterprises/${enterprise}/issues/${issueNumber}/pull_requests`);
        return response.data;
    }
}
//# sourceMappingURL=PullRequestService.js.map