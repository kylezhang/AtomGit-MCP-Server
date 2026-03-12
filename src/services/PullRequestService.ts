import { BaseService } from './BaseService.js';
import { 
  PullRequest, 
  CreatePullRequestRequest, 
  MergePullRequestRequest, 
  UpdatePullRequestRequest,
  CreatePullRequestCommentRequest,
  UpdatePullRequestCommentRequest
} from '../types/index.js';

export class PullRequestService extends BaseService {
  
  async getRepositoryPulls(owner: string, repo: string, state: 'open' | 'closed' | 'all' = 'open', page = 1, perPage = 30): Promise<PullRequest[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls`, {
      params: {
        state,
        page,
        per_page: perPage
      }
    });
    return response.data;
  }

  async createRepositoryPull(owner: string, repo: string, pullData: CreatePullRequestRequest): Promise<PullRequest> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls`, pullData);
    return response.data;
  }

  async mergeRepositoryPull(owner: string, repo: string, pullNumber: number, mergeData: MergePullRequestRequest): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/merge`, mergeData);
    return response.data;
  }

  async getRepositoryPullMergeStatus(owner: string, repo: string, pullNumber: number): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/merge`);
    return response.data;
  }

  async getRepositoryPullIssues(owner: string, repo: string, pullNumber: number): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/issues`);
    return response.data;
  }

  async createRepositoryPullComment(owner: string, repo: string, pullNumber: number, commentData: CreatePullRequestCommentRequest): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/comments`, commentData);
    return response.data;
  }

  async getRepositoryPullComments(owner: string, repo: string, pullNumber: number, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/comments`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async getRepositoryPullFiles(owner: string, repo: string, pullNumber: number, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/files`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async updateRepositoryPull(owner: string, repo: string, pullNumber: number, updateData: UpdatePullRequestRequest): Promise<PullRequest> {
    const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}`, updateData);
    return response.data;
  }

  async getRepositoryPull(owner: string, repo: string, pullNumber: number): Promise<PullRequest> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}`);
    return response.data;
  }

  async getRepositoryPullCommits(owner: string, repo: string, pullNumber: number, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/commits`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async createRepositoryPullLabel(owner: string, repo: string, pullNumber: number, labels: string[]): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/labels`, { labels });
    return response.data;
  }

  async getRepositoryPullLabels(owner: string, repo: string, pullNumber: number): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/labels`);
    return response.data;
  }

  async replaceRepositoryPullLabels(owner: string, repo: string, pullNumber: number, labels: string[]): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/labels`, { labels });
    return response.data;
  }

  async deleteRepositoryPullLabel(owner: string, repo: string, pullNumber: number, label: string): Promise<any> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/labels/${label}`);
    return response.data;
  }

  async getRepositoryPullOperateLogs(owner: string, repo: string, pullNumber: number): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/operate_logs`);
    return response.data;
  }

  async linkRepositoryPullIssues(owner: string, repo: string, pullNumber: number, issues: number[]): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/issues`, { issues });
    return response.data;
  }

  async unlinkRepositoryPullIssues(owner: string, repo: string, pullNumber: number, issues: number[]): Promise<any> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/issues`, { data: { issues } });
    return response.data;
  }

  async getRepositoryPullFilesJson(owner: string, repo: string, pullNumber: number): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/files.json`);
    return response.data;
  }

  async getRepositoryPullFileContent(owner: string, repo: string, pullNumber: number, filePath: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/files/content`, {
      params: { file_path: filePath }
    });
    return response.data;
  }

  async resetRepositoryPullTesters(owner: string, repo: string, pullNumber: number): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/test/reset`);
    return response.data;
  }

  async resetRepositoryPullAssignees(owner: string, repo: string, pullNumber: number): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/assign/reset`);
    return response.data;
  }

  async processRepositoryPullTest(owner: string, repo: string, pullNumber: number, action: string, comment?: string): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/test`, {
      action,
      comment
    });
    return response.data;
  }

  async processRepositoryPullReview(owner: string, repo: string, pullNumber: number, action: string, comment?: string): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/review`, {
      action,
      comment
    });
    return response.data;
  }

  async assignRepositoryPullTesters(owner: string, repo: string, pullNumber: number, testers: string[]): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/test/assign`, { testers });
    return response.data;
  }

  async removeRepositoryPullTesters(owner: string, repo: string, pullNumber: number, testers: string[]): Promise<any> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/test/remove`, { data: { testers } });
    return response.data;
  }

  async getRepositoryPullTesterOptions(owner: string, repo: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/tester_options`);
    return response.data;
  }

  async assignRepositoryPullAssignees(owner: string, repo: string, pullNumber: number, assignees: string[]): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/assign/assign`, { assignees });
    return response.data;
  }

  async removeRepositoryPullAssignees(owner: string, repo: string, pullNumber: number, assignees: string[]): Promise<any> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/assign/remove`, { data: { assignees } });
    return response.data;
  }

  async assignRepositoryPullApprovalReviewers(owner: string, repo: string, pullNumber: number, reviewers: string[]): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/approval_reviewers/assign`, { reviewers });
    return response.data;
  }

  async removeRepositoryPullApprovalReviewers(owner: string, repo: string, pullNumber: number, reviewers: string[]): Promise<any> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/approval_reviewers/remove`, { data: { reviewers } });
    return response.data;
  }

  async getRepositoryPullApprovalReviewerOptions(owner: string, repo: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/approval_reviewer_options`);
    return response.data;
  }

  async getPullRequestComment(owner: string, repo: string, commentId: number): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/comments/${commentId}`);
    return response.data;
  }

  async editPullRequestComment(owner: string, repo: string, commentId: number, commentData: UpdatePullRequestCommentRequest): Promise<any> {
    const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/pulls/comments/${commentId}`, commentData);
    return response.data;
  }

  async replyPullRequestDiscussion(owner: string, repo: string, pullNumber: number, discussionId: number, commentData: CreatePullRequestCommentRequest): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/discussions/${discussionId}/comments`, commentData);
    return response.data;
  }
  
  async replyPullRequestDiscussionComment(owner: string, repo: string, pullNumber: number, discussionId: number, commentData: CreatePullRequestCommentRequest): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/discussions/${discussionId}/comments`, commentData);
    return response.data;
  }

  async updatePullRequestDiscussionComment(owner: string, repo: string, pullNumber: number, discussionId: number, commentData: UpdatePullRequestCommentRequest): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/comments/${discussionId}`, commentData);
    return response.data;
  }

  async deletePullRequestComment(owner: string, repo: string, commentId: number): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/pulls/comments/${commentId}`);
    return response.data;
  }



  async getPullRequestReactions(owner: string, repo: string, pullNumber: number): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/user_reactions`);
    return response.data;
  }

  async getPullRequestCommentReactions(owner: string, repo: string, commentId: number): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/comment/${commentId}/user_reactions`);
    return response.data;
  }

  async getPullRequestModifyHistory(owner: string, repo: string, pullNumber: number): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/modify_history`);
    return response.data;
  }

  async getPullRequestCommentModifyHistory(owner: string, repo: string, commentId: number): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/comment/${commentId}/modify_history`);
    return response.data;
  }

  async getEnterprisePullRequests(enterprise: string, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/enterprises/${enterprise}/pull_requests`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async getOrganizationPullRequests(org: string, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/orgs/${org}/pull_requests`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async getEnterprisePullRequestIssues(enterprise: string, issueNumber: number): Promise<any[]> {
    const response = await this.client.get(`/api/v5/enterprises/${enterprise}/issues/${issueNumber}/pull_requests`);
    return response.data;
  }


}