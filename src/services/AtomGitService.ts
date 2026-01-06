import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { 
  AtomGitUser, 
  AtomGitRepository, 
  AtomGitTree, 
  AtomGitConfig, 
  CreateRepositoryRequest,
  Branch,
  Issue,
  PullRequest,
  CreateIssueRequest
} from '../types/index.js';

export class AtomGitService {
  private client: AxiosInstance;
  private config: AtomGitConfig;

  constructor(config: AtomGitConfig) {
    this.config = config;
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
    const response = await this.client.get(`/api/v5/users/${username}`);
    return response.data;
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
}