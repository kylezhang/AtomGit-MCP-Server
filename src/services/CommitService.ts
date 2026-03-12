import { BaseService } from './BaseService.js';
import { Commit, CreatePullRequestCommentRequest, UpdatePullRequestCommentRequest } from '../types/index.js';

export class CommitService extends BaseService {
  
  async getRepositoryCommits(owner: string, repo: string, sha?: string, page = 1, perPage = 30): Promise<Commit[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/commits`, {
      params: {
        sha,
        page,
        per_page: perPage
      }
    });
    return response.data;
  }

  async getRepositoryCommit(owner: string, repo: string, sha: string): Promise<Commit> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/commits/${sha}`);
    return response.data;
  }

  async compareRepositoryCommits(owner: string, repo: string, base: string, head: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/compare/${base}...${head}`);
    return response.data;
  }

  async createRepositoryCommitComment(owner: string, repo: string, sha: string, commentData: CreatePullRequestCommentRequest): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/commits/${sha}/comments`, commentData);
    return response.data;
  }

  async deleteRepositoryCommitComment(owner: string, repo: string, commentId: number): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/comments/${commentId}`);
    return response.data;
  }

  async getRepositoryCommitComment(owner: string, repo: string, commentId: number): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/comments/${commentId}`);
    return response.data;
  }

  async updateRepositoryCommitComment(owner: string, repo: string, commentId: number, commentData: UpdatePullRequestCommentRequest): Promise<any> {
    const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/comments/${commentId}`, commentData);
    return response.data;
  }

  async getRepositoryCommitComments(owner: string, repo: string, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/comments`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async getRepositoryCommitStatistics(owner: string, repo: string, sha?: string): Promise<any> {
    const url = `/api/v5/${owner}/${repo}/repository/commit_statistics`;
    const params: any = {};
    if (sha) {
      params.sha = sha;
    }
    const response = await this.client.get(url, { params });
    return response.data;
  }

  async getRepositoryCommitRefComments(owner: string, repo: string, ref: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/commits/${ref}/comments`);
    return response.data;
  }

  async getRepositoryCommitDiff(owner: string, repo: string, sha: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/commits/${sha}/diff`);
    return response.data;
  }

  async getRepositoryCommitPatch(owner: string, repo: string, sha: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/commits/${sha}/patch`);
    return response.data;
  }
}
