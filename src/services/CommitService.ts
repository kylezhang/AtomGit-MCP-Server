import { BaseService } from './BaseService.js';
import { Commit, CreatePullRequestCommentRequest, UpdatePullRequestCommentRequest } from '../types/index.js';

interface PaginationOptions {
  page?: string | number;
  perPage?: string | number;
  per_page?: string | number;
}

interface CommitListOptions extends PaginationOptions {
  sha?: string;
  path?: string;
  author?: string;
  since?: string;
  until?: string;
}

interface CommitCompareOptions {
  straight?: boolean;
  suffix?: string;
}

interface CommitDetailOptions {
  show_diff?: boolean;
}

interface CommitCommentsOptions extends PaginationOptions {
  order?: string;
}

interface CommitStatisticsOptions {
  sha?: string;
  branch_name?: string;
  author?: string;
  only_self?: boolean;
  since?: string;
  until?: string;
}

export class CommitService extends BaseService {
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

  async getRepositoryCommits(owner: string, repo: string, options: CommitListOptions = {}): Promise<Commit[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/commits`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getRepositoryCommit(owner: string, repo: string, sha: string, options: CommitDetailOptions = {}): Promise<Commit> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/commits/${sha}`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async compareRepositoryCommits(
    owner: string,
    repo: string,
    base: string,
    head: string,
    options: CommitCompareOptions = {}
  ): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/compare/${base}...${head}`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async createRepositoryCommitComment(owner: string, repo: string, sha: string, commentData: CreatePullRequestCommentRequest): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/commits/${sha}/comments`, commentData);
    return response.data;
  }

  async deleteRepositoryCommitComment(owner: string, repo: string, commentId: string | number): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/comments/${commentId}`);
    return response.data;
  }

  async getRepositoryCommitComment(owner: string, repo: string, commentId: string | number): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/comments/${commentId}`);
    return response.data;
  }

  async updateRepositoryCommitComment(
    owner: string,
    repo: string,
    commentId: string | number,
    commentData: UpdatePullRequestCommentRequest
  ): Promise<any> {
    const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/comments/${commentId}`, commentData);
    return response.data;
  }

  async getRepositoryCommitComments(owner: string, repo: string, options: CommitCommentsOptions = {}): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/comments`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getRepositoryCommitStatistics(owner: string, repo: string, options: CommitStatisticsOptions = {}): Promise<any> {
    const response = await this.client.get(`/api/v5/${owner}/${repo}/repository/commit_statistics`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getRepositoryCommitRefComments(owner: string, repo: string, ref: string, options: PaginationOptions = {}): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/commits/${ref}/comments`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getRepositoryCommitDiff(owner: string, repo: string, sha: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/commit/${sha}/diff`);
    return response.data;
  }

  async getRepositoryCommitPatch(owner: string, repo: string, sha: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/commit/${sha}/patch`);
    return response.data;
  }
}
