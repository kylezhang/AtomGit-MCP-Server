import { BaseService } from './BaseService.js';
import {
  CreateIssueCommentRequest,
  CreateIssueRequest,
  Issue,
  UpdateIssueCommentRequest,
  UpdateIssueRequest
} from '../types/index.js';

interface PaginationOptions {
  page?: string | number;
  perPage?: string | number;
  per_page?: string | number;
}

interface RepositoryIssueListOptions extends PaginationOptions {
  state?: string;
  labels?: string;
  sort?: string;
  direction?: string;
  since?: string;
  created_at?: string;
  milestone?: string | number;
  assignee?: string;
  creator?: string;
  created_after?: string;
  created_before?: string;
  updated_after?: string;
  updated_before?: string;
  search?: string;
}

interface IssueCommentListOptions extends PaginationOptions {
  order?: string;
  since?: string;
}

interface EnterpriseIssueListOptions extends PaginationOptions {
  state?: string;
  labels?: string;
  sort?: string;
  direction?: string;
  since?: string;
  milestone?: string | number;
  assignee?: string;
  creator?: string;
  program?: string;
  created_at?: string;
  created_before?: string;
  search?: string;
  approximate?: boolean;
}

interface UserIssueListOptions extends PaginationOptions {
  filter?: string;
  state?: string;
  labels?: string;
  sort?: string;
  direction?: string;
  since?: string;
  schedule?: string;
  deadline?: string;
  created_at?: string;
  finished_at?: string;
}

interface OrganizationIssueListOptions extends PaginationOptions {
  filter?: string;
  state?: string;
  labels?: string;
  sort?: string;
  direction?: string;
  created_at?: string;
  search?: string;
}

interface ReactionListOptions extends PaginationOptions {
  emoji_name?: string;
}

interface RepositoryIssuePullRequestOptions {
  mode?: string;
}

interface UpdateIssueRelatedBranchesRequest {
  branch_names: string[];
}

export class IssuesService extends BaseService {
  private normalizeIssueAssignee(assignee?: string, assignees?: string[]): string | undefined {
    if (assignee) {
      return assignee;
    }
    if (assignees && assignees.length > 0) {
      return assignees.join(',');
    }
    return undefined;
  }

  private normalizeIssueLabels(labels?: string | string[]): string | undefined {
    if (typeof labels === 'string') {
      return labels;
    }
    if (labels && labels.length > 0) {
      return labels.join(',');
    }
    return undefined;
  }

  private normalizeIssueState(state?: 'open' | 'closed' | 'reopen' | 'close'): 'reopen' | 'close' | undefined {
    if (!state) {
      return undefined;
    }
    if (state === 'open') {
      return 'reopen';
    }
    if (state === 'closed') {
      return 'close';
    }
    return state;
  }

  private buildParams(options?: object): Record<string, unknown> {
    const params: Record<string, unknown> = { ...((options ?? {}) as Record<string, unknown>) };

    if (params.per_page === undefined && params.perPage !== undefined) {
      params.per_page = params.perPage;
    }

    delete params.perPage;

    return Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined)
    );
  }

  private buildIssuePayload(
    repo: string | undefined,
    issueData: CreateIssueRequest | UpdateIssueRequest,
    includeRepo = false
  ): Record<string, unknown> {
    const payload: Record<string, unknown> = {};

    if (includeRepo && repo) {
      payload.repo = repo;
    }

    if (issueData.title !== undefined) {
      payload.title = issueData.title;
    }
    if (issueData.body !== undefined) {
      payload.body = issueData.body;
    }

    const assignee = this.normalizeIssueAssignee(issueData.assignee, issueData.assignees);
    if (assignee) {
      payload.assignee = assignee;
    }

    if (issueData.milestone !== undefined) {
      payload.milestone = issueData.milestone;
    }

    const labels = this.normalizeIssueLabels(issueData.labels);
    if (labels) {
      payload.labels = labels;
    }

    if (issueData.security_hole !== undefined) {
      payload.security_hole = issueData.security_hole;
    }
    if (issueData.template_path !== undefined) {
      payload.template_path = issueData.template_path;
    }
    if (issueData.issue_type !== undefined) {
      payload.issue_type = issueData.issue_type;
    }
    if ('status' in issueData && issueData.status !== undefined) {
      payload.status = issueData.status;
    }
    if (issueData.issue_severity !== undefined) {
      payload.issue_severity = issueData.issue_severity;
    }
    if (issueData.custom_fields !== undefined) {
      payload.custom_fields = issueData.custom_fields;
    }

    const normalizedState = this.normalizeIssueState(
      'state' in issueData ? issueData.state : undefined
    );
    if (normalizedState) {
      payload.state = normalizedState;
    }

    return payload;
  }

  async createRepositoryIssue(owner: string, repo: string, issueData: CreateIssueRequest): Promise<Issue> {
    const response = await this.client.post(
      `/api/v5/repos/${owner}/issues`,
      this.buildIssuePayload(repo, issueData, true)
    );
    return response.data;
  }

  async updateRepositoryIssue(
    owner: string,
    repo: string,
    issueNumber: string | number,
    updateData: UpdateIssueRequest
  ): Promise<Issue> {
    const response = await this.client.patch(
      `/api/v5/repos/${owner}/issues/${issueNumber}`,
      this.buildIssuePayload(repo, updateData, true)
    );
    return response.data;
  }

  async getRepositoryIssue(owner: string, repo: string, issueNumber: string | number): Promise<Issue> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}`);
    return response.data;
  }

  async getRepositoryIssues(
    owner: string,
    repo: string,
    options: RepositoryIssueListOptions = {}
  ): Promise<Issue[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getRepositoryIssueComments(
    owner: string,
    repo: string,
    issueNumber: string | number,
    options: IssueCommentListOptions = {}
  ): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/comments`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async createRepositoryIssueComment(
    owner: string,
    repo: string,
    issueNumber: string | number,
    commentData: CreateIssueCommentRequest
  ): Promise<any> {
    const response = await this.client.post(
      `/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/comments`,
      commentData
    );
    return response.data;
  }

  async getRepositoryIssuePullRequests(
    owner: string,
    repo: string,
    issueNumber: string | number,
    options: RepositoryIssuePullRequestOptions = {}
  ): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/pull_requests`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getEnterpriseIssueLabels(
    enterprise: string,
    issueId: string,
    options: PaginationOptions = {}
  ): Promise<any[]> {
    const response = await this.client.get(`/api/v5/enterprises/${enterprise}/issues/${issueId}/labels`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async createRepositoryIssueLabel(
    owner: string,
    repo: string,
    issueNumber: string | number,
    labels: string[]
  ): Promise<any[]> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/labels`, labels);
    return response.data;
  }

  async deleteRepositoryIssueLabel(
    owner: string,
    repo: string,
    issueNumber: string | number,
    name: string
  ): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/labels/${name}`);
    return response.data;
  }

  async getRepositoryIssueOperateLogs(
    owner: string,
    repo: string,
    issueNumber: string | number,
    options: PaginationOptions = {}
  ): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/issues/${issueNumber}/operate_logs`, {
      params: this.buildParams({ repo, ...options })
    });
    return response.data;
  }

  async getEnterpriseIssues(enterprise: string, options: EnterpriseIssueListOptions = {}): Promise<any[]> {
    const response = await this.client.get(`/api/v5/enterprises/${enterprise}/issues`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getUserIssues(options: UserIssueListOptions = {}): Promise<any[]> {
    const response = await this.client.get('/api/v5/user/issues', {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async updateRepositoryIssueComment(
    owner: string,
    repo: string,
    commentId: string | number,
    updateData: UpdateIssueCommentRequest
  ): Promise<any> {
    const response = await this.client.patch(
      `/api/v5/repos/${owner}/${repo}/issues/comments/${commentId}`,
      updateData
    );
    return response.data;
  }

  async deleteRepositoryIssueComment(owner: string, repo: string, commentId: string | number): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/issues/comments/${commentId}`);
    return response.data;
  }

  async getRepositoryIssueComment(owner: string, repo: string, commentId: string | number): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/comments/${commentId}`);
    return response.data;
  }

  async getOrganizationIssues(org: string, options: OrganizationIssueListOptions = {}): Promise<any[]> {
    const response = await this.client.get(`/api/v5/orgs/${org}/issues`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getEnterpriseIssueComments(
    enterprise: string,
    issueNumber: string | number,
    options: PaginationOptions = {}
  ): Promise<any[]> {
    const response = await this.client.get(`/api/v5/enterprises/${enterprise}/issues/${issueNumber}/comments`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getEnterpriseIssue(enterprise: string, issueNumber: string | number): Promise<any> {
    const response = await this.client.get(`/api/v5/enterprises/${enterprise}/issues/${issueNumber}`);
    return response.data;
  }

  async getEnterpriseIssueStatuses(enterprise: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/enterprises/${enterprise}/issue/statuses`);
    return response.data;
  }

  async updateRepositoryIssueRelatedBranches(
    owner: string,
    repo: string,
    issueNumber: string | number,
    request: UpdateIssueRelatedBranchesRequest
  ): Promise<any> {
    const response = await this.client.put(
      `/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/related_branches`,
      request
    );
    return response.data;
  }

  async getRepositoryIssueRelatedBranches(owner: string, repo: string, issueNumber: string | number): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/related_branches`);
    return response.data;
  }

  async getRepositoryIssueReactions(
    owner: string,
    repo: string,
    issueNumber: string | number,
    options: ReactionListOptions = {}
  ): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/user_reactions`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getRepositoryIssueCommentReactions(
    owner: string,
    repo: string,
    commentId: string | number,
    options: ReactionListOptions = {}
  ): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/comment/${commentId}/user_reactions`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getRepositoryIssueModifyHistory(owner: string, repo: string, issueNumber: string | number): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/modify_history`);
    return response.data;
  }

  async getRepositoryIssueCommentModifyHistory(
    owner: string,
    repo: string,
    commentId: string | number
  ): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/comment/${commentId}/modify_history`);
    return response.data;
  }

  async replaceRepositoryIssueAllLabels(
    owner: string,
    repo: string,
    issueNumber: string | number,
    labels: string[]
  ): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/labels`, labels);
    return response.data;
  }

  async deleteRepositoryAllIssueLabels(owner: string, repo: string, issueNumber: string | number): Promise<any> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/labels`);
    return response.data;
  }

  async getAllRepositoryIssueComments(
    owner: string,
    repo: string,
    options: (PaginationOptions & { sort?: string; direction?: string; since?: string }) = {}
  ): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/comments`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getRepositoryAllIssueComments(
    owner: string,
    repo: string,
    options: (PaginationOptions & { sort?: string; direction?: string; since?: string }) = {}
  ): Promise<any[]> {
    return this.getAllRepositoryIssueComments(owner, repo, options);
  }

  async updateIssueKanbanValues(
    owner: string,
    repo: string,
    issueNumber: string | number,
    kanbanValues: Record<string, string>
  ): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/kanban_values`, kanbanValues);
    return response.data;
  }
}
