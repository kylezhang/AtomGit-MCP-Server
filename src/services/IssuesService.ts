import { BaseService } from './BaseService.js';
import { Issue, CreateIssueRequest, UpdateIssueRequest, CreateIssueCommentRequest, UpdateIssueCommentRequest } from '../types/index.js';

export class IssuesService extends BaseService {
  
  async createRepositoryIssue(owner: string, repo: string, issueData: CreateIssueRequest): Promise<Issue> {
    const response = await this.client.post(`/api/v5/repos/${owner}/issues`, issueData);
    return response.data;
  }

  async updateRepositoryIssue(owner: string, repo: string, issueNumber: number, updateData: UpdateIssueRequest): Promise<Issue> {
    const response = await this.client.patch(`/api/v5/repos/${owner}/issues/${issueNumber}`, updateData);
    return response.data;
  }

  async getRepositoryIssue(owner: string, repo: string, issueNumber: number): Promise<Issue> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}`);
    return response.data;
  }

  async getRepositoryIssues(owner: string, repo: string, state: 'open' | 'closed' | 'all' = 'open', page = 1, perPage = 30): Promise<Issue[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues`, {
      params: {
        state,
        page,
        per_page: perPage
      }
    });
    return response.data;
  }

  async getRepositoryIssueComments(owner: string, repo: string, issueNumber: number, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/comments`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async createRepositoryIssueComment(owner: string, repo: string, issueNumber: number, commentData: CreateIssueCommentRequest): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/comments`, commentData);
    return response.data;
  }

  async getRepositoryAllIssueComments(owner: string, repo: string, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/comments`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async getRepositoryIssuePullRequests(owner: string, repo: string, issueNumber: number): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/pull_requests`);
    return response.data;
  }

  async getEnterpriseIssueLabels(enterprise: string, issueId: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/enterprises/${enterprise}/issues/${issueId}/labels`);
    return response.data;
  }

  async createRepositoryIssueLabel(owner: string, repo: string, issueNumber: number, labels: string[]): Promise<any[]> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/labels`, { labels });
    return response.data;
  }

  async deleteRepositoryIssueLabel(owner: string, repo: string, issueNumber: number, name: string): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/labels/${name}`);
    return response.data;
  }

  async getRepositoryIssueOperateLogs(owner: string, repo: string, issueNumber: number, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/issues/${issueNumber}/operate_logs`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async getEnterpriseIssues(enterprise: string, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/enterprises/${enterprise}/issues`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async getUserIssues(page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get('/api/v5/user/issues', {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async updateRepositoryIssueComment(owner: string, repo: string, commentId: number, updateData: UpdateIssueCommentRequest): Promise<any> {
    const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/issues/comments/${commentId}`, updateData);
    return response.data;
  }

  async deleteRepositoryIssueComment(owner: string, repo: string, commentId: number): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/issues/comments/${commentId}`);
    return response.data;
  }

  async getRepositoryIssueComment(owner: string, repo: string, commentId: number): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/comments/${commentId}`);
    return response.data;
  }

  async getOrganizationIssues(org: string, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/orgs/${org}/issues`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async getEnterpriseIssueComments(enterprise: string, issueNumber: number, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/enterprises/${enterprise}/issues/${issueNumber}/comments`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async getEnterpriseIssue(enterprise: string, issueNumber: number): Promise<any> {
    const response = await this.client.get(`/api/v5/enterprises/${enterprise}/issues/${issueNumber}`);
    return response.data;
  }

  async getEnterpriseIssueStatuses(enterprise: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/enterprises/${enterprise}/issue/statuses`);
    return response.data;
  }

  async updateRepositoryIssueRelatedBranches(owner: string, repo: string, issueNumber: number, branchName: string): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/related_branches`, { branch_name: branchName });
    return response.data;
  }

  async getRepositoryIssueRelatedBranches(owner: string, repo: string, issueNumber: number): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/related_branches`);
    return response.data;
  }

  async getRepositoryIssueReactions(owner: string, repo: string, issueNumber: number): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/user_reactions`);
    return response.data;
  }

  async getRepositoryIssueCommentReactions(owner: string, repo: string, commentId: number): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/comment/${commentId}/user_reactions`);
    return response.data;
  }

  async getRepositoryIssueModifyHistory(owner: string, repo: string, issueNumber: number): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/modify_history`);
    return response.data;
  }

  async getRepositoryIssueCommentModifyHistory(owner: string, repo: string, commentId: number): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/comment/${commentId}/modify_history`);
    return response.data;
  }

  async replaceRepositoryIssueAllLabels(owner: string, repo: string, issueNumber: number, labels: string[]): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/labels`, { labels });
    return response.data;
  }

  async deleteRepositoryAllIssueLabels(owner: string, repo: string, issueNumber: number): Promise<any> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/labels`);
    return response.data;
  }

  async getAllRepositoryIssueComments(owner: string, repo: string, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/comments`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }
}
