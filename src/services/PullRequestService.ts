import { BaseService } from './BaseService.js';
import {
  CreatePullRequestCommentRequest,
  PullRequest,
  UpdatePullRequestCommentRequest
} from '../types/index.js';

interface PaginationOptions {
  page?: string | number;
  perPage?: string | number;
  per_page?: string | number;
}

interface PullRequestListOptions extends PaginationOptions {
  state?: string;
  base?: string;
  since?: string;
  direction?: string;
  sort?: string;
  milestone_number?: string | number;
  labels?: string;
  author?: string;
  assignee?: string;
  reviewer?: string;
  merged_after?: string;
  merged_before?: string;
  only_count?: boolean;
  created_after?: string;
  created_before?: string;
  updated_before?: string;
  updated_after?: string;
}

interface PullRequestCommentListOptions extends PaginationOptions {
  direction?: string;
  comment_type?: string;
}

interface PullRequestIssueListOptions extends PaginationOptions {}

interface PullRequestOperateLogOptions extends PaginationOptions {
  sort?: string;
}

interface PullRequestCommitListOptions extends PaginationOptions {}

interface EnterprisePullRequestListOptions extends PaginationOptions {
  state?: string;
  issue_number?: string | number;
  sort?: string;
  direction?: string;
  base?: string;
  author?: string;
  search?: string;
  created_after?: string;
  created_before?: string;
  updated_before?: string;
  updated_after?: string;
  labels?: string;
}

interface OrganizationPullRequestListOptions extends PaginationOptions {
  state?: string;
  sort?: string;
  direction?: string;
  base?: string;
  author?: string;
  search?: string;
  created_after?: string;
  created_before?: string;
  updated_before?: string;
  updated_after?: string;
}

interface ReactionListOptions extends PaginationOptions {
  emoji_name?: string;
}

interface CreatePullRequestPayload {
  title: string;
  head: string;
  base: string;
  body?: string;
  milestone_number?: string | number;
  labels?: string | string[];
  issue?: string;
  assignees?: string | string[];
  testers?: string | string[];
  prune_source_branch?: boolean;
  draft?: boolean;
  squash?: boolean;
  squash_commit_message?: string;
  fork_path?: string;
  close_related_issue?: boolean;
  maintainer_can_modify?: boolean;
}

interface MergePullRequestPayload {
  merge_method?: 'merge' | 'squash' | 'rebase' | string;
  title?: string;
  description?: string;
  commit_title?: string;
  commit_message?: string;
  force_merge?: boolean;
}

interface UpdatePullRequestPayload {
  title?: string;
  body?: string;
  state?: string;
  milestone_number?: string | number;
  labels?: string | string[];
  draft?: boolean;
  close_related_issue?: boolean;
  base?: string;
  maintainer_can_modify?: boolean;
}

interface ProcessPullActionPayload {
  action: string;
  comment?: string;
  force?: boolean;
}

interface PullAssigneePayload {
  assignees: string | string[];
}

interface PullTesterPayload {
  testers: string | string[];
  add?: boolean;
}

interface PullReviewerPayload {
  reviewers: string | string[];
  add?: boolean;
}

interface PullAssigneeResetPayload {
  reset_all?: boolean;
  assignees?: string[];
}

interface PullTesterResetPayload {
  reset_all?: boolean;
  testers?: string[];
}

export class PullRequestService extends BaseService {
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

  private normalizeCsv(value?: string | string[]): string | undefined {
    if (typeof value === 'string') {
      return value;
    }
    if (Array.isArray(value) && value.length > 0) {
      return value.join(',');
    }
    return undefined;
  }

  private buildPullPayload(
    payload: CreatePullRequestPayload | UpdatePullRequestPayload
  ): Record<string, unknown> {
    const body: Record<string, unknown> = {};
    const rawPayload = payload as Record<string, unknown>;

    for (const key of [
      'title',
      'head',
      'base',
      'body',
      'milestone_number',
      'issue',
      'prune_source_branch',
      'draft',
      'squash',
      'squash_commit_message',
      'fork_path',
      'close_related_issue',
      'maintainer_can_modify',
      'state'
    ] as const) {
      const value = rawPayload[key];
      if (value !== undefined) {
        body[key] = value;
      }
    }

    const labels = this.normalizeCsv(payload.labels);
    if (labels !== undefined) {
      body.labels = labels;
    }

    if ('assignees' in payload) {
      const assignees = this.normalizeCsv(payload.assignees);
      if (assignees !== undefined) {
        body.assignees = assignees;
      }
    }

    if ('testers' in payload) {
      const testers = this.normalizeCsv(payload.testers);
      if (testers !== undefined) {
        body.testers = testers;
      }
    }

    return body;
  }

  async getRepositoryPulls(owner: string, repo: string, options: PullRequestListOptions = {}): Promise<PullRequest[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async createRepositoryPull(owner: string, repo: string, pullData: CreatePullRequestPayload): Promise<PullRequest> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls`, this.buildPullPayload(pullData));
    return response.data;
  }

  async mergeRepositoryPull(
    owner: string,
    repo: string,
    pullNumber: string | number,
    mergeData: MergePullRequestPayload
  ): Promise<any> {
    const payload: Record<string, unknown> = {};

    if (mergeData.merge_method !== undefined) {
      payload.merge_method = mergeData.merge_method;
    }
    if (mergeData.title !== undefined || mergeData.commit_title !== undefined) {
      payload.title = mergeData.title ?? mergeData.commit_title;
    }
    if (mergeData.description !== undefined || mergeData.commit_message !== undefined) {
      payload.description = mergeData.description ?? mergeData.commit_message;
    }
    if (mergeData.force_merge !== undefined) {
      payload.force_merge = mergeData.force_merge;
    }

    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/merge`, payload);
    return response.data;
  }

  async getRepositoryPullMergeStatus(owner: string, repo: string, pullNumber: string | number): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/merge`);
    return response.data;
  }

  async getRepositoryPullIssues(
    owner: string,
    repo: string,
    pullNumber: string | number,
    options: PullRequestIssueListOptions = {}
  ): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/issues`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async createRepositoryPullComment(
    owner: string,
    repo: string,
    pullNumber: string | number,
    commentData: CreatePullRequestCommentRequest
  ): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/comments`, commentData);
    return response.data;
  }

  async getRepositoryPullComments(
    owner: string,
    repo: string,
    pullNumber: string | number,
    options: PullRequestCommentListOptions = {}
  ): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/comments`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getRepositoryPullFiles(owner: string, repo: string, pullNumber: string | number, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/files`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async updateRepositoryPull(
    owner: string,
    repo: string,
    pullNumber: string | number,
    updateData: UpdatePullRequestPayload
  ): Promise<PullRequest> {
    const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}`, this.buildPullPayload(updateData));
    return response.data;
  }

  async getRepositoryPull(owner: string, repo: string, pullNumber: string | number): Promise<PullRequest> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}`);
    return response.data;
  }

  async getRepositoryPullCommits(
    owner: string,
    repo: string,
    pullNumber: string | number,
    options: PullRequestCommitListOptions = {}
  ): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/commits`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async createRepositoryPullLabel(owner: string, repo: string, pullNumber: string | number, labels: string[]): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/labels`, labels);
    return response.data;
  }

  async getRepositoryPullLabels(owner: string, repo: string, pullNumber: string | number): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/labels`);
    return response.data;
  }

  async replaceRepositoryPullLabels(owner: string, repo: string, pullNumber: string | number, labels: string[]): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/labels`, labels);
    return response.data;
  }

  async deleteRepositoryPullLabel(owner: string, repo: string, pullNumber: string | number, label: string): Promise<any> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/labels/${label}`);
    return response.data;
  }

  async getRepositoryPullOperateLogs(
    owner: string,
    repo: string,
    pullNumber: string | number,
    options: PullRequestOperateLogOptions = {}
  ): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/operate_logs`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async linkRepositoryPullIssues(owner: string, repo: string, pullNumber: string | number, issues: number[]): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/issues`, { issues });
    return response.data;
  }

  async unlinkRepositoryPullIssues(owner: string, repo: string, pullNumber: string | number, issues: number[]): Promise<any> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/issues`, { data: { issues } });
    return response.data;
  }

  async getRepositoryPullFilesJson(owner: string, repo: string, pullNumber: string | number): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/files.json`);
    return response.data;
  }

  async getRepositoryPullFileContent(owner: string, repo: string, headSha: string, name: string): Promise<any> {
    const response = await this.client.get(`/${owner}/${repo}/raw/${headSha}/${name}`);
    return response.data;
  }

  async resetRepositoryPullTesters(
    owner: string,
    repo: string,
    pullNumber: string | number,
    payload: PullTesterResetPayload = {}
  ): Promise<any> {
    const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/testers`, payload);
    return response.data;
  }

  async resetRepositoryPullAssignees(
    owner: string,
    repo: string,
    pullNumber: string | number,
    payload: PullAssigneeResetPayload = {}
  ): Promise<any> {
    const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/assignees`, payload);
    return response.data;
  }

  async processRepositoryPullTest(
    owner: string,
    repo: string,
    pullNumber: string | number,
    payload: ProcessPullActionPayload
  ): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/test`, payload);
    return response.data;
  }

  async processRepositoryPullReview(
    owner: string,
    repo: string,
    pullNumber: string | number,
    payload: ProcessPullActionPayload
  ): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/review`, payload);
    return response.data;
  }

  async assignRepositoryPullTesters(
    owner: string,
    repo: string,
    pullNumber: string | number,
    payload: PullTesterPayload
  ): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/testers`, {
      testers: this.normalizeCsv(payload.testers),
      add: payload.add
    });
    return response.data;
  }

  async removeRepositoryPullTesters(
    owner: string,
    repo: string,
    pullNumber: string | number,
    testers: string | string[]
  ): Promise<any> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/testers`, {
      data: {
        testers: this.normalizeCsv(testers)
      }
    });
    return response.data;
  }

  async getRepositoryPullTesterOptions(owner: string, repo: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/option_testers`);
    return response.data;
  }

  async assignRepositoryPullAssignees(
    owner: string,
    repo: string,
    pullNumber: string | number,
    payload: PullAssigneePayload
  ): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/assignees`, {
      assignees: this.normalizeCsv(payload.assignees)
    });
    return response.data;
  }

  async removeRepositoryPullAssignees(
    owner: string,
    repo: string,
    pullNumber: string | number,
    assignees: string | string[]
  ): Promise<any> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/assignees`, {
      params: this.buildParams({
        assignees: this.normalizeCsv(assignees)
      })
    });
    return response.data;
  }

  async assignRepositoryPullApprovalReviewers(
    owner: string,
    repo: string,
    pullNumber: string | number,
    payload: PullReviewerPayload
  ): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/reviewers`, {
      reviewers: this.normalizeCsv(payload.reviewers),
      add: payload.add
    });
    return response.data;
  }

  async removeRepositoryPullApprovalReviewers(
    owner: string,
    repo: string,
    pullNumber: string | number,
    reviewers: string | string[]
  ): Promise<any> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/reviewers`, {
      data: {
        reviewers: this.normalizeCsv(reviewers)
      }
    });
    return response.data;
  }

  async getRepositoryPullApprovalReviewerOptions(owner: string, repo: string, pullNumber: string | number): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/option_reviewers`);
    return response.data;
  }

  async getPullRequestComment(owner: string, repo: string, commentId: string | number): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/comments/${commentId}`);
    return response.data;
  }

  async editPullRequestComment(
    owner: string,
    repo: string,
    commentId: string | number,
    commentData: UpdatePullRequestCommentRequest
  ): Promise<any> {
    const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/pulls/comments/${commentId}`, commentData);
    return response.data;
  }

  async replyPullRequestDiscussion(
    owner: string,
    repo: string,
    pullNumber: string | number,
    discussionId: string | number,
    commentData: CreatePullRequestCommentRequest
  ): Promise<any> {
    const response = await this.client.post(
      `/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/discussions/${discussionId}/comments`,
      commentData
    );
    return response.data;
  }

  async updatePullRequestDiscussionComment(
    owner: string,
    repo: string,
    pullNumber: string | number,
    discussionId: string | number,
    commentData: UpdatePullRequestCommentRequest
  ): Promise<any> {
    const response = await this.client.put(
      `/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/comments/${discussionId}`,
      commentData
    );
    return response.data;
  }

  async deletePullRequestComment(owner: string, repo: string, commentId: string | number): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/pulls/comments/${commentId}`);
    return response.data;
  }

  async getPullRequestReactions(
    owner: string,
    repo: string,
    pullNumber: string | number,
    options: ReactionListOptions = {}
  ): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/user_reactions`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getPullRequestCommentReactions(
    owner: string,
    repo: string,
    commentId: string | number,
    options: ReactionListOptions = {}
  ): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/comment/${commentId}/user_reactions`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getPullRequestModifyHistory(owner: string, repo: string, pullNumber: string | number): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/modify_history`);
    return response.data;
  }

  async getPullRequestCommentModifyHistory(owner: string, repo: string, commentId: string | number): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/comment/${commentId}/modify_history`);
    return response.data;
  }

  async getEnterprisePullRequests(enterprise: string, options: EnterprisePullRequestListOptions = {}): Promise<any[]> {
    const response = await this.client.get(`/api/v5/enterprises/${enterprise}/pull_requests`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getOrganizationPullRequests(org: string, options: OrganizationPullRequestListOptions = {}): Promise<any[]> {
    const response = await this.client.get(`/api/v5/org/${org}/pull_requests`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getEnterprisePullRequestIssues(enterprise: string, issueNumber: string | number): Promise<any[]> {
    const response = await this.client.get(`/api/v5/enterprises/${enterprise}/issues/${issueNumber}/pull_requests`);
    return response.data;
  }
}
