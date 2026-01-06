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
  async createRepositoryPull(owner: string, repo: string, pullData: any): Promise<PullRequest> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls`, pullData);
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