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

  // Priority 1: Issues Full Management
  async updateRepositoryIssue(owner: string, repo: string, issueNumber: number, updateData: any): Promise<Issue> {
    const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}`, updateData);
    return response.data;
  }

  async getRepositoryIssueComments(owner: string, repo: string, issueNumber: number, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/comments`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async createRepositoryIssueComment(owner: string, repo: string, issueNumber: number, commentData: any): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/comments`, commentData);
    return response.data;
  }

  async getRepositoryIssueComment(owner: string, repo: string, commentId: number): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/comments/${commentId}`);
    return response.data;
  }

  async updateRepositoryIssueComment(owner: string, repo: string, commentId: number, updateData: any): Promise<any> {
    const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/issues/comments/${commentId}`, updateData);
    return response.data;
  }

  async deleteRepositoryIssueComment(owner: string, repo: string, commentId: number): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/issues/comments/${commentId}`);
    return response.data;
  }

  async createRepositoryIssueLabel(owner: string, repo: string, issueNumber: number, labels: string[]): Promise<any[]> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/labels`, { labels });
    return response.data;
  }

  async replaceRepositoryIssueLabels(owner: string, repo: string, issueNumber: number, labels: string[]): Promise<any[]> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/labels`, { labels });
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

  // Priority 1: Branch Advanced Management
  async getRepositoryBranch(owner: string, repo: string, branch: string): Promise<Branch> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/branches/${branch}`);
    return response.data;
  }

  async createBranchProtectionRule(owner: string, repo: string, ruleData: any): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/branches/setting/new`, ruleData);
    return response.data;
  }

  async deleteBranchProtectionRule(owner: string, repo: string, wildcard: string): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/branches/${wildcard}/setting`);
    return response.data;
  }

  async getBranchProtectionRules(owner: string, repo: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/protect_branches`);
    return response.data;
  }

  async updateBranchProtectionRule(owner: string, repo: string, ruleData: any): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/branches/${ruleData.wildcard}/setting`, ruleData);
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

  async get_repository_file_list($owner: string, repo: string, path: string = '', ref?: string, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${$owner}/${repo}/file_list`, {
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

  // Priority 1: Repository Settings & Configuration
  async getRepositorySettings(owner: string, repo: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/repo-settings`);
    return response.data;
  }

  async updateRepositorySettings(owner: string, repo: string, settings: any): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/repo-settings`, settings);
    return response.data;
  }

  async getRepositoryPullRequestSettings(owner: string, repo: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pull-request-settings`);
    return response.data;
  }

  async updateRepositoryPullRequestSettings(owner: string, repo: string, settings: any): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/pull-request-settings`, settings);
    return response.data;
  }

  async getRepositoryPushConfig(owner: string, repo: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/push-config`);
    return response.data;
  }

  async setRepositoryPushConfig(owner: string, repo: string, config: any): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/push-config`, config);
    return response.data;
  }

  // Priority 1: Repository Advanced Features
  async getRepositoryLanguages(owner: string, repo: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/languages`);
    return response.data;
  }

  async getRepositoryContributors(owner: string, repo: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/contributors`);
    return response.data;
  }

  async getRepositoryContributorsStatistic(owner: string, repo: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/contributors-statistic`);
    return response.data;
  }

  async getRepositoryDownloadStatistics(owner: string, repo: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/download-statistics`);
    return response.data;
  }

  async getRepositoryEvents(owner: string, repo: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/events`);
    return response.data;
  }

  // Priority 1: Repository Management
  async updateRepository(owner: string, repo: string, updateData: any): Promise<AtomGitRepository> {
    const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}`, updateData);
    return response.data;
  }

  async deleteRepository(owner: string, repo: string): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}`);
    return response.data;
  }

  async forkRepository(owner: string, repo: string, forkData?: any): Promise<AtomGitRepository> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/forks`, forkData || {});
    return response.data;
  }

  async archiveRepository(org: string, repository: string, archiveData: any): Promise<any> {
    const response = await this.client.put(`/api/v5/org/${org}/repo/${repository}/status`, archiveData);
    return response.data;
  }

  async transferRepository(org: string, repository: string, transferData: any): Promise<any> {
    const response = await this.client.post(`/api/v5/org/${org}/projects/${repository}/transfer`, transferData);
    return response.data;
  }

  async getRepositoryRawFile(owner: string, repo: string, path: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/raw/${path}`);
    return response.data;
  }

  async getRepositorySubscribers(owner: string, repo: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/subscribers`);
    return response.data;
  }

  async getRepositoryStargazers(owner: string, repo: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/stargazers`);
    return response.data;
  }

  async updateRepositoryModuleSetting(owner: string, repo: string, moduleData: any): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/module-setting`, moduleData);
    return response.data;
  }

  async updateRepositoryReviewer(owner: string, repo: string, reviewerData: any): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/reviewer`, reviewerData);
    return response.data;
  }

  async getRepositoryTransition(owner: string, repo: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/transition`);
    return response.data;
  }

  async updateRepositoryTransition(owner: string, repo: string, transitionData: any): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/transition`, transitionData);
    return response.data;
  }

  async getRepositoryCustomizedRoles(owner: string, repo: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/customized-roles`);
    return response.data;
  }

  async updateRepositoryMemberRole(owner: string, repo: string, username: string, roleData: any): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/members/${username}`, roleData);
    return response.data;
  }

  // Priority 2: Labels & Milestones Management
  async getRepositoryLabels(owner: string, repo: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/labels`);
    return response.data;
  }

  async createRepositoryLabel(owner: string, repo: string, labelData: any): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/labels`, labelData);
    return response.data;
  }

  async deleteRepositoryLabel(owner: string, repo: string, name: string): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/labels/${name}`);
    return response.data;
  }

  async updateRepositoryLabel(owner: string, repo: string, name: string, labelData: any): Promise<any> {
    const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/labels/${name}`, labelData);
    return response.data;
  }

  async getRepositoryMilestones(owner: string, repo: string, state: 'open' | 'closed' | 'all' = 'open', page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/milestones`, {
      params: {
        state,
        page,
        per_page: perPage
      }
    });
    return response.data;
  }

  async createRepositoryMilestone(owner: string, repo: string, milestoneData: any): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/milestones`, milestoneData);
    return response.data;
  }

  async updateRepositoryMilestone(owner: string, repo: string, number: number, milestoneData: any): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/milestones/${number}`, milestoneData);
    return response.data;
  }

  async deleteRepositoryMilestone(owner: string, repo: string, number: number): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/milestones/${number}`);
    return response.data;
  }

  async getRepositoryMilestone(owner: string, repo: string, number: number): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/milestones/${number}`);
    return response.data;
  }

  // Priority 2: Commit Advanced Management
  async getRepositoryCommitComments(owner: string, repo: string, sha: string, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/commits/${sha}/comments`, {
      params: {
        page,
        per_page: perPage
      }
    });
    return response.data;
  }

  async createRepositoryCommitComment(owner: string, repo: string, sha: string, commentData: any): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/commits/${sha}/comments`, commentData);
    return response.data;
  }

  async getRepositoryCommitDiff(owner: string, repo: string, sha: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/commits/${sha}/diff`);
    return response.data;
  }

  async compareRepositoryCommits(owner: string, repo: string, base: string, head: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/compare/${base}...${head}`);
    return response.data;
  }

  async getRepositoryCommitPatch(owner: string, repo: string, sha: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/commits/${sha}/patch`);
    return response.data;
  }

  async getRepositoryCommitStats(owner: string, repo: string, sha?: string): Promise<any> {
    const url = sha ? `/api/v5/repos/${owner}/${repo}/commits/${sha}/stats` : `/api/v5/repos/${owner}/${repo}/stats`;
    const response = await this.client.get(url);
    return response.data;
  }

  async getRepositoryCommitStatuses(owner: string, repo: string, sha: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/commits/${sha}/statuses`);
    return response.data;
  }

  async createRepositoryCommitStatus(owner: string, repo: string, sha: string, statusData: any): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/commits/${sha}/statuses`, statusData);
    return response.data;
  }

  async getRepositoryCommitComment(owner: string, repo: string, commentId: number): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/comments/${commentId}`);
    return response.data;
  }

  async updateRepositoryCommitComment(owner: string, repo: string, commentId: number, commentData: any): Promise<any> {
    const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/comments/${commentId}`, commentData);
    return response.data;
  }

  async deleteRepositoryCommitComment(owner: string, repo: string, commentId: number): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/comments/${commentId}`);
    return response.data;
  }

  // Priority 2: Member Management
  async getRepositoryCollaborators(owner: string, repo: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/collaborators`);
    return response.data;
  }

  async addRepositoryCollaborator(owner: string, repo: string, username: string, collaboratorData: any): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/collaborators/${username}`, collaboratorData);
    return response.data;
  }

  async removeRepositoryCollaborator(owner: string, repo: string, username: string): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/collaborators/${username}`);
    return response.data;
  }

  async getRepositoryCollaborator(owner: string, repo: string, username: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/collaborators/${username}`);
    return response.data;
  }

  // Priority 2: Search Functionality
  async searchIssues(owner: string, repo: string, query: string, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/search/issues`, {
      params: {
        q: `repo:${owner}/${repo} ${query}`,
        page,
        per_page: perPage
      }
    });
    return response.data;
  }

  async searchCode(owner: string, repo: string, query: string, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/search/code`, {
      params: {
        q: `repo:${owner}/${repo} ${query}`,
        page,
        per_page: perPage
      }
    });
    return response.data;
  }

  // Priority 2: User Advanced Features
  async getUserFollowers(username: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/users/${username}/followers`);
    return response.data;
  }

  async getUserFollowing(username: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/users/${username}/following`);
    return response.data;
  }

  async followUser(username: string): Promise<void> {
    const response = await this.client.put(`/api/v5/user/following/${username}`);
    return response.data;
  }

  async unfollowUser(username: string): Promise<void> {
    const response = await this.client.delete(`/api/v5/user/following/${username}`);
    return response.data;
  }

  async getCurrentUserFollowers(): Promise<any[]> {
    const response = await this.client.get('/api/v5/user/followers');
    return response.data;
  }

  async getCurrentUserFollowing(): Promise<any[]> {
    const response = await this.client.get('/api/v5/user/following');
    return response.data;
  }

  async getUserOrganizations(username: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/users/${username}/orgs`);
    return response.data;
  }

  async getCurrentUserOrganizations(): Promise<any[]> {
    const response = await this.client.get('/api/v5/user/orgs');
    return response.data;
  }

  // Priority 2: Release Advanced Management
  async updateRelease(owner: string, repo: string, tag: string, releaseData: any): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/releases/${tag}`, releaseData);
    return response.data;
  }

  async deleteRelease(owner: string, repo: string, tag: string): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/releases/${tag}`);
    return response.data;
  }

  async getReleaseAssets(owner: string, repo: string, tag: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/releases/${tag}/assets`);
    return response.data;
  }

  async uploadReleaseAsset(owner: string, repo: string, tag: string, assetData: any): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/releases/${tag}/assets`, assetData);
    return response.data;
  }

  async getReleaseAsset(owner: string, repo: string, assetId: number): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/releases/assets/${assetId}`);
    return response.data;
  }

  async updateReleaseAsset(owner: string, repo: string, assetId: number, assetData: any): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/releases/assets/${assetId}`, assetData);
    return response.data;
  }

  async deleteReleaseAsset(owner: string, repo: string, assetId: number): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/releases/assets/${assetId}`);
    return response.data;
  }

  // Priority 3: Organization Management
  async getOrganization(org: string): Promise<any> {
    const response = await this.client.get(`/api/v5/orgs/${org}`);
    return response.data;
  }

  async createOrganizationRepository(org: string, repoData: any): Promise<any> {
    const response = await this.client.post(`/api/v5/orgs/${org}/repos`, repoData);
    return response.data;
  }

  async getOrganizationMembers(org: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/orgs/${org}/members`);
    return response.data;
  }

  async addOrganizationMember(org: string, username: string, memberData: any): Promise<any> {
    const response = await this.client.put(`/api/v5/orgs/${org}/members/${username}`, memberData);
    return response.data;
  }

  async removeOrganizationMember(org: string, username: string): Promise<void> {
    const response = await this.client.delete(`/api/v5/orgs/${org}/members/${username}`);
    return response.data;
  }

  async getOrganizationProjects(org: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/orgs/${org}/projects`);
    return response.data;
  }

  async createOrganizationProject(org: string, projectData: any): Promise<any> {
    const response = await this.client.post(`/api/v5/orgs/${org}/projects`, projectData);
    return response.data;
  }

  async updateOrganizationProject(org: string, project: string, projectData: any): Promise<any> {
    const response = await this.client.put(`/api/v5/orgs/${org}/projects/${project}`, projectData);
    return response.data;
  }

  async deleteOrganizationProject(org: string, project: string): Promise<void> {
    const response = await this.client.delete(`/api/v5/orgs/${org}/projects/${project}`);
    return response.data;
  }

  async getOrganizationTeams(org: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/orgs/${org}/teams`);
    return response.data;
  }

  async createOrganizationTeam(org: string, teamData: any): Promise<any> {
    const response = await this.client.post(`/api/v5/orgs/${org}/teams`, teamData);
    return response.data;
  }

  async updateOrganizationTeam(org: string, team: string, teamData: any): Promise<any> {
    const response = await this.client.put(`/api/v5/orgs/${org}/teams/${team}`, teamData);
    return response.data;
  }

  async deleteOrganizationTeam(org: string, team: string): Promise<void> {
    const response = await this.client.delete(`/api/v5/orgs/${org}/teams/${team}`);
    return response.data;
  }

  async getOrganizationTeamMembers(org: string, team: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/orgs/${org}/teams/${team}/members`);
    return response.data;
  }

  async addOrganizationTeamMember(org: string, team: string, username: string, memberData: any): Promise<any> {
    const response = await this.client.put(`/api/v5/orgs/${org}/teams/${team}/members/${username}`, memberData);
    return response.data;
  }

  // Priority 3: Webhooks Management
  async getRepositoryWebhooks(owner: string, repo: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/hooks`);
    return response.data;
  }

  async createRepositoryWebhook(owner: string, repo: string, webhookData: any): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/hooks`, webhookData);
    return response.data;
  }

  async getRepositoryWebhook(owner: string, repo: string, id: number): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/hooks/${id}`);
    return response.data;
  }

  async updateRepositoryWebhook(owner: string, repo: string, id: number, webhookData: any): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/hooks/${id}`, webhookData);
    return response.data;
  }

  async deleteRepositoryWebhook(owner: string, repo: string, id: number): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/hooks/${id}`);
    return response.data;
  }

  async testRepositoryWebhook(owner: string, repo: string, id: number): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/hooks/${id}/test`);
    return response.data;
  }

  // Priority 3: Enterprise Management
  async getEnterprise(enterprise: string): Promise<any> {
    const response = await this.client.get(`/api/v8/enterprises/${enterprise}`);
    return response.data;
  }

  async getEnterpriseMembers(enterprise: string): Promise<any[]> {
    const response = await this.client.get(`/api/v8/enterprises/${enterprise}/members`);
    return response.data;
  }

  async getEnterpriseMember(enterprise: string, username: string): Promise<any> {
    const response = await this.client.get(`/api/v8/enterprises/${enterprise}/members/${username}`);
    return response.data;
  }

  async updateEnterpriseMember(enterprise: string, username: string, memberData: any): Promise<any> {
    const response = await this.client.put(`/api/v8/enterprises/${enterprise}/members/${username}`, memberData);
    return response.data;
  }

  async removeEnterpriseMember(enterprise: string, username: string): Promise<void> {
    const response = await this.client.delete(`/api/v8/enterprises/${enterprise}/members/${username}`);
    return response.data;
  }

  async getEnterpriseRoles(enterprise: string): Promise<any[]> {
    const response = await this.client.get(`/api/v8/enterprises/${enterprise}/roles`);
    return response.data;
  }

  async createEnterpriseRole(enterprise: string, roleData: any): Promise<any> {
    const response = await this.client.post(`/api/v8/enterprises/${enterprise}/roles`, roleData);
    return response.data;
  }

  async updateEnterpriseRole(enterprise: string, role: string, roleData: any): Promise<any> {
    const response = await this.client.put(`/api/v8/enterprises/${enterprise}/roles/${role}`, roleData);
    return response.data;
  }

  async deleteEnterpriseRole(enterprise: string, role: string): Promise<void> {
    const response = await this.client.delete(`/api/v8/enterprises/${enterprise}/roles/${role}`);
    return response.data;
  }

  async getEnterpriseMilestones(enterprise: string): Promise<any[]> {
    const response = await this.client.get(`/api/v8/enterprises/${enterprise}/milestones`);
    return response.data;
  }

  async createEnterpriseMilestone(enterprise: string, milestoneData: any): Promise<any> {
    const response = await this.client.post(`/api/v8/enterprises/${enterprise}/milestones`, milestoneData);
    return response.data;
  }

  async updateEnterpriseMilestone(enterprise: string, milestone: string, milestoneData: any): Promise<any> {
    const response = await this.client.put(`/api/v8/enterprises/${enterprise}/milestones/${milestone}`, milestoneData);
    return response.data;
  }

  async deleteEnterpriseMilestone(enterprise: string, milestone: string): Promise<void> {
    const response = await this.client.delete(`/api/v8/enterprises/${enterprise}/milestones/${milestone}`);
    return response.data;
  }

  async getEnterpriseProjects(enterprise: string): Promise<any[]> {
    const response = await this.client.get(`/api/v8/enterprises/${enterprise}/projects`);
    return response.data;
  }

  async createEnterpriseProject(enterprise: string, projectData: any): Promise<any> {
    const response = await this.client.post(`/api/v8/enterprises/${enterprise}/projects`, projectData);
    return response.data;
  }

  // Priority 4: Dashboard (Kanban) Management
  async getOrganizationKanbans(owner: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/org/${owner}/kanban/list`);
    return response.data;
  }

  async createOrganizationKanban(owner: string, kanbanData: any): Promise<any> {
    const response = await this.client.post(`/api/v5/org/${owner}/kanban`, kanbanData);
    return response.data;
  }

  async getOrganizationKanban(owner: string, id: string): Promise<any> {
    const response = await this.client.get(`/api/v5/org/${owner}/kanban/${id}`);
    return response.data;
  }

  async updateOrganizationKanban(owner: string, id: string, kanbanData: any): Promise<any> {
    const response = await this.client.put(`/api/v5/org/${owner}/kanban/${id}`, kanbanData);
    return response.data;
  }

  async deleteOrganizationKanban(owner: string, id: string): Promise<void> {
    const response = await this.client.delete(`/api/v5/org/${owner}/kanban/${id}`);
    return response.data;
  }

  async getOrganizationKanbanContent(owner: string, id: string): Promise<any> {
    const response = await this.client.get(`/api/v5/org/${owner}/kanban/${id}/content`);
    return response.data;
  }

  async updateOrganizationKanbanContent(owner: string, id: string, contentData: any): Promise<any> {
    const response = await this.client.put(`/api/v5/org/${owner}/kanban/${id}/content`, contentData);
    return response.data;
  }

  // Priority 4: AI Hub Features
  async chatCompletion(data: any): Promise<any> {
    const response = await this.client.post('/api/v5/chat/completions', data);
    return response.data;
  }

  async speechRecognition(data: any): Promise<any> {
    const response = await this.client.post('/api/v5/speech/recognition', data);
    return response.data;
  }

  async objectDetection(data: any): Promise<any> {
    const response = await this.client.post('/api/v5/object/detection', data);
    return response.data;
  }

  async textEmbedding(data: any): Promise<any> {
    const response = await this.client.post('/api/v5/text/embedding', data);
    return response.data;
  }

  async imageGeneration(data: any): Promise<any> {
    const response = await this.client.post('/api/v5/image/generation', data);
    return response.data;
  }

  async audioSynthesis(data: any): Promise<any> {
    const response = await this.client.post('/api/v5/audio/synthesis', data);
    return response.data;
  }

  async translation(data: any): Promise<any> {
    const response = await this.client.post('/api/v5/translation', data);
    return response.data;
  }
}