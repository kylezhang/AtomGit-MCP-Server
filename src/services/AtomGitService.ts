import axios, { AxiosInstance } from 'axios';
import {
  AtomGitUser,
  AtomGitRepository,
  AtomGitTree,
  AtomGitConfig,
  CreateRepositoryRequest,
  Branch,
  Issue,
  PullRequest,
  CreateIssueRequest,
  CreatePullRequestRequest,
  MergePullRequestRequest,
  UpdatePullRequestRequest,
  CreatePullRequestCommentRequest,
  Commit,
  Tag,
  CreateReleaseRequest,
  Release
} from '../types/index.js';

export class AtomGitService {
  private client: AxiosInstance;

  constructor(config: AtomGitConfig) {
    this.client = axios.create({
      baseURL: config.apiBaseUrl,
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Version': '2023-02-21',
        ...(config.token && {
          'Authorization': `Bearer ${config.token}`,
          'PRIVATE-TOKEN': config.token
        })
      }
    });
  }

  async getCurrentUser(): Promise<AtomGitUser> {
    const response = await this.client.get('/api/v5/user');
    return response.data;
  }

  async getUser(username: string): Promise<AtomGitUser> {
    console.log(`🔍 getUser API call: /api/v5/users/${username}`);
    try {
      const response = await this.client.get(`/api/v5/users/${username}`);
      console.log(`📊 Response status: ${response.status}`);
      console.log(`📊 Response headers:`, response.headers);
      
      if (response.data) {
        console.log(`✅ User data received: ${response.data.login || response.data.name}`);
        console.log(`👤 User ID: ${response.data.id}`);
        console.log(`🏢 User page: ${response.data.html_url}`);
      } else {
        console.log(`⚠️  No user data received`);
      }
      
      return response.data;
    } catch (error: any) {
      console.log(`❌ Error: ${error.message}`);
      if (error.response) {
        console.log(`📊 Status: ${error.response.status}`);
        console.log(`📄 Status Text: ${error.response.statusText}`);
        console.log(`📋 Error Data:`, error.response.data);
      }
      throw error;
    }
  }

  async getUserRepos(username: string): Promise<AtomGitRepository[]> {
    const response = await this.client.get(`/api/v5/users/${username}/repos`);
    return response.data;
  }

  async getCurrentUserRepos(): Promise<AtomGitRepository[]> {
    const response = await this.client.get('/api/v5/user/repos');
    return response.data;
  }

  async getRepository(owner: string, repo: string): Promise<AtomGitRepository> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}`);
    return response.data;
  }

  async getRepositoryTree(owner: string, repo: string, sha?: string): Promise<AtomGitTree> {
    const url = sha ? `/api/v5/repos/${owner}/${repo}/git/trees/${sha}` : `/api/v5/repos/${owner}/${repo}/git/trees/main`;
    const response = await this.client.get(url);
    return response.data;
  }

  async getUserStarredRepos(username: string): Promise<AtomGitRepository[]> {
    const response = await this.client.get(`/api/v5/users/${username}/starred`);
    return response.data;
  }

  async getCurrentUserStarredRepos(): Promise<AtomGitRepository[]> {
    const response = await this.client.get('/api/v5/user/starred');
    return response.data;
  }

  async searchRepositories(query: string, page = 1, perPage = 30): Promise<AtomGitRepository[]> {
    const response = await this.client.get('/api/v5/search/repositories', {
      params: {
        q: query,
        page,
        per_page: perPage
      }
    });
    return response.data; // Direct array, not wrapped in items
  }

  async searchUsers(query: string, page = 1, perPage = 30): Promise<AtomGitUser[]> {
    const response = await this.client.get('/api/v5/search/users', {
      params: {
        q: query,
        page,
        per_page: perPage
      }
    });
    return response.data; // Direct array, not wrapped in items
  }

  async createRepository(repoData: CreateRepositoryRequest): Promise<AtomGitRepository> {
    const response = await this.client.post('/api/v5/user/repos', repoData);
    return response.data;
  }

  async getRepositoryBranches(owner: string, repo: string): Promise<Branch[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/branches`);
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

  async createRepositoryIssue(owner: string, repo: string, issueData: CreateIssueRequest): Promise<Issue> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/issues`, issueData);
    return response.data;
  }

  async getRepositoryIssue(owner: string, repo: string, issueNumber: number): Promise<Issue> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}`);
    return response.data;
  }

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

  async getRepositoryPull(owner: string, repo: string, pullNumber: number): Promise<PullRequest> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}`);
    return response.data;
  }

  // Commit APIs
  async getRepositoryCommits(owner: string, repo: string, sha?: string, page = 1, perPage = 30): Promise<Commit[]> {
    const url = sha ? `/api/v5/repos/${owner}/${repo}/commits` : `/api/v5/repos/${owner}/${repo}/commits`;
    const response = await this.client.get(url, {
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

  // Tag APIs
  async getRepositoryTags(owner: string, repo: string, page = 1, perPage = 30): Promise<Tag[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/tags`, {
      params: {
        page,
        per_page: perPage
      }
    });
    return response.data;
  }

  // Release APIs
  async createRelease(owner: string, repo: string, releaseData: CreateReleaseRequest): Promise<Release> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/releases`, releaseData);
    return response.data;
  }

  async getRepositoryReleases(owner: string, repo: string, page = 1, perPage = 30): Promise<Release[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/releases`, {
      params: {
        page,
        per_page: perPage
      }
    });
    return response.data;
  }

  async getRepositoryRelease(owner: string, repo: string, tag: string): Promise<Release> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/releases/${tag}`);
    return response.data;
  }

  async getLatestRelease(owner: string, repo: string): Promise<Release> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/releases/latest`);
    return response.data;
  }

  // Priority 1: Repository Management - Forks
  async getRepositoryForks(owner: string, repo: string, page = 1, perPage = 30): Promise<AtomGitRepository[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/forks`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  // Priority 1: Repository Management - Create (already exists at line 120)
  // async createRepository(repoData: CreateRepositoryRequest): Promise<AtomGitRepository> {

  // Priority 1: Branch Management - Create
  async createRepositoryBranch(owner: string, repo: string, branch: string, sha?: string): Promise<Branch> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/branches`, { branch, sha });
    return response.data;
  }

  // Priority 1: Branch Management - Delete
  async deleteRepositoryBranch(owner: string, repo: string, branch: string): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/branches/${branch}`);
    return response.data;
  }

  // Priority 1: Pull Request Management - Create
  async createRepositoryPull(owner: string, repo: string, pullData: CreatePullRequestRequest): Promise<PullRequest> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls`, pullData);
    return response.data;
  }

  // Priority 1: Pull Request Management - Merge
  async mergeRepositoryPull(owner: string, repo: string, pullNumber: number, mergeData: MergePullRequestRequest): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/merge`, mergeData);
    return response.data;
  }

  // Priority 1: Pull Request Management - Merge Status
  async getRepositoryPullMergeStatus(owner: string, repo: string, pullNumber: number): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/merge`);
    return response.data;
  }

  // Priority 1: Pull Request Management - Issues
  async getRepositoryPullIssues(owner: string, repo: string, pullNumber: number): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/issues`);
    return response.data;
  }

  // Priority 1: Pull Request Management - Comments
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

  // Priority 1: Pull Request Management - Files
  async getRepositoryPullFiles(owner: string, repo: string, pullNumber: number, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/files`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  // Priority 1: Pull Request Management - Update
  async updateRepositoryPull(owner: string, repo: string, pullNumber: number, updateData: UpdatePullRequestRequest): Promise<PullRequest> {
    const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}`, updateData);
    return response.data;
  }

  // Priority 1: Pull Request Management - Commits
  async getRepositoryPullCommits(owner: string, repo: string, pullNumber: number, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/commits`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  // Priority 1: Pull Request Management - Labels
  async createRepositoryPullLabel(owner: string, repo: string, pullNumber: number, labels: string[]): Promise<any[]> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/labels`, { labels });
    return response.data;
  }

  async getRepositoryPullLabels(owner: string, repo: string, pullNumber: number, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/labels`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async replaceRepositoryPullLabels(owner: string, repo: string, pullNumber: number, labels: string[]): Promise<any[]> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/labels`, { labels });
    return response.data;
  }

  async deleteRepositoryPullLabel(owner: string, repo: string, pullNumber: number, name: string): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/labels/${name}`);
    return response.data;
  }

  // Priority 1: Pull Request Management - Testing & Review
  async processRepositoryPullTest(owner: string, repo: string, pullNumber: number, testData: any): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/test`, testData);
    return response.data;
  }

  async processRepositoryPullReview(owner: string, repo: string, pullNumber: number, reviewData: any): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/review`, reviewData);
    return response.data;
  }

  async getRepositoryPullOperateLogs(owner: string, repo: string, pullNumber: number, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/operate_logs`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async resetRepositoryPullTesters(owner: string, repo: string, pullNumber: number): Promise<any> {
    const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/testers`, {});
    return response.data;
  }

  async assignRepositoryPullTesters(owner: string, repo: string, pullNumber: number, testers: string[]): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/testers`, { testers });
    return response.data;
  }

  async removeRepositoryPullTesters(owner: string, repo: string, pullNumber: number, testers: string[]): Promise<any> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/testers`, {
      data: { testers }
    });
    return response.data;
  }

  async getRepositoryPullTesterOptions(owner: string, repo: string, pullNumber: number): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/option_approval_testers`);
    return response.data;
  }

  async resetRepositoryPullAssignees(owner: string, repo: string, pullNumber: number): Promise<any> {
    const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/assignees`, {});
    return response.data;
  }

  async assignRepositoryPullAssignees(owner: string, repo: string, pullNumber: number, assignees: string[]): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/assignees`, { assignees });
    return response.data;
  }

  async removeRepositoryPullAssignees(owner: string, repo: string, pullNumber: number, assignees: string[]): Promise<any> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/assignees`, {
      data: { assignees }
    });
    return response.data;
  }

  // Priority 1: Pull Request Management - Additional Features
  async getRepositoryPullFilesJson(owner: string, repo: string, pullNumber: number): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/files_json`);
    return response.data;
  }

  async getRepositoryPullFileContent(owner: string, repo: string, head: string, sha: string, name: string): Promise<any> {
    const response = await this.client.get(`/${owner}/${repo}/raw/${head}/${sha}/${name}`);
    return response.data;
  }

  async linkRepositoryPullIssues(owner: string, repo: string, pullNumber: number, issues: number[]): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/linked_issues`, { issues });
    return response.data;
  }

  async unlinkRepositoryPullIssues(owner: string, repo: string, pullNumber: number, issues: number[]): Promise<any> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/issues`, {
      data: { issues }
    });
    return response.data;
  }

  async assignRepositoryPullApprovalReviewers(owner: string, repo: string, pullNumber: number, reviewers: string[]): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/approval_reviewers`, { reviewers });
    return response.data;
  }

  async removeRepositoryPullApprovalReviewers(owner: string, repo: string, pullNumber: number, reviewers: string[]): Promise<any> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/approval_reviewers`, {
      data: { reviewers }
    });
    return response.data;
  }

  async getRepositoryPullApprovalReviewerOptions(owner: string, repo: string, pullNumber: number): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/option_approval_reviewers`);
    return response.data;
  }

  // Priority 1: Repository File Content Management
  async getRepositoryContent(owner: string, repo: string, path: string = '', ref?: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/contents/${path}`, {
      params: ref ? { ref } : {}
    });
    return response.data;
  }

  async createRepositoryFile(owner: string, repo: string, fileData: any): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/contents/${fileData.path}`, fileData);
    return response.data;
  }

  async updateRepositoryFile(owner: string, repo: string, fileData: any): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/contents/${fileData.path}`, fileData);
    return response.data;
  }

  async deleteRepositoryFile(owner: string, repo: string, fileData: any): Promise<any> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/contents/${fileData.path}`, {
      data: fileData
    });
    return response.data;
  }

  async getRepositoryFileList(owner: string, repo: string, path: string = '', ref?: string, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/file/list`, {
      params: {
        path,
        ref,
        page,
        per_page: perPage
      }
    });
    return response.data;
  }

  async getRepositoryFileBlob(owner: string, repo: string, sha: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/git/blobs/${sha}`);
    return response.data;
  }

  async uploadRepositoryImage(owner: string, repo: string, fileData: string, filename: string): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/img/upload`, {
      file: fileData,
      filename
    });
    return response.data;
  }

  async uploadRepositoryFile(owner: string, repo: string, fileData: string, filename: string): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/file/upload`, {
      file: fileData,
      filename
    });
    return response.data;
  }

  // Priority 1: User Management - Subscriptions
  async getUserSubscriptions(): Promise<AtomGitRepository[]> {
    const response = await this.client.get('/api/v5/user/subscriptions');
    return response.data;
  }

  // Priority 1: User Management - Namespaces
  async getUserNamespaces(): Promise<string[]> {
    const response = await this.client.get('/api/v5/user/namespaces');
    return response.data;
  }
}