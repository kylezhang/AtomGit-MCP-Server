import { BaseService } from './BaseService.js';
import { AtomGitRepository, AtomGitUser } from '../types/index.js';

interface PaginationOptions {
  page?: string | number;
  perPage?: string | number;
  per_page?: string | number;
}

interface UserRepositoryListOptions extends PaginationOptions {
  type?: string;
  sort?: string;
  direction?: string;
}

interface CurrentUserRepositoryListOptions extends UserRepositoryListOptions {
  visibility?: string;
  affiliation?: string;
  q?: string;
  repo_type?: string;
}

interface StarredOrSubscriptionOptions extends PaginationOptions {
  sort?: string;
  direction?: string;
}

interface NamespaceListOptions extends PaginationOptions {
  mode?: string;
}

interface RepositoryNotificationOptions {
  unread?: boolean;
  type?: string;
  since?: string;
  before?: string;
  ids?: string;
}

interface UserRepositoryCreateRequest {
  name: string;
  description?: string;
  has_issues?: boolean;
  has_wiki?: boolean;
  can_comment?: boolean;
  auto_init?: boolean;
  gitignore_template?: string;
  license_template?: string;
  path?: string;
  private?: boolean;
  default_branch?: string;
  import_url?: string;
  project_template?: string;
  repository_type?: string;
}

interface UpdateCurrentUserRequest {
  avatar?: string;
  nickname?: string;
  company?: string;
  description?: string;
  email?: string;
  github_account?: string;
  website?: string;
  location?: string;
}

interface AddUserKeyRequest {
  title: string;
  key: string;
}

interface UserEventOptions extends PaginationOptions {
  year?: string;
  next?: string;
}

interface CurrentUserPullRequestOptions extends PaginationOptions {
  state?: string;
  sort?: string;
  direction?: string;
  labels?: string;
  created_after?: string;
  created_before?: string;
  updated_after?: string;
  updated_before?: string;
  scope?: string;
  source_branch?: string;
  target_branch?: string;
}

export class UserService extends BaseService {
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

  async getUserStarredRepos(username: string, options: StarredOrSubscriptionOptions = {}): Promise<AtomGitRepository[]> {
    const response = await this.client.get(`/api/v5/users/${username}/starred`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getUser(username: string): Promise<AtomGitUser> {
    const response = await this.client.get(`/api/v5/users/${username}`);
    return response.data;
  }

  async getCurrentUser(): Promise<AtomGitUser> {
    const response = await this.client.get('/api/v5/user');
    return response.data;
  }

  async getUserRepos(username: string, options: UserRepositoryListOptions = {}): Promise<any[]> {
    const response = await this.client.get(`/api/v5/users/${username}/repos`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getCurrentUserRepos(options: CurrentUserRepositoryListOptions = {}): Promise<any[]> {
    const response = await this.client.get('/api/v5/user/repos', {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getUserRepository(owner: string, repo: string): Promise<AtomGitRepository> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}`);
    return response.data;
  }

  async getCurrentUserStarredRepos(options: StarredOrSubscriptionOptions = {}): Promise<any[]> {
    const response = await this.client.get('/api/v5/user/starred', {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async searchUsers(query: string, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get('/api/v5/search/users', {
      params: { q: query, page, per_page: perPage }
    });
    return response.data;
  }

  async getUserSubscriptions(username: string, options: StarredOrSubscriptionOptions = {}): Promise<any[]> {
    const response = await this.client.get(`/api/v5/users/${username}/subscriptions`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getCurrentUserSubscriptions(options: StarredOrSubscriptionOptions = {}): Promise<any[]> {
    const response = await this.client.get('/api/v5/user/subscriptions', {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getCurrentUserNamespaces(options: NamespaceListOptions = {}): Promise<any[]> {
    const response = await this.client.get('/api/v5/user/namespaces', {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getRepositoryNotifications(owner: string, repo: string, options: RepositoryNotificationOptions = {}): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/notifications`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async markRepositoryNotificationsRead(owner: string, repo: string, ids?: string): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/notifications`, undefined, {
      params: this.buildParams({ ids })
    });
    return response.data;
  }

  async createUserRepository(repoData: UserRepositoryCreateRequest): Promise<any> {
    const response = await this.client.post('/api/v5/user/repos', repoData);
    return response.data;
  }

  async updateCurrentUser(userData: UpdateCurrentUserRequest): Promise<any> {
    const response = await this.client.patch('/api/v5/user', userData);
    return response.data;
  }

  async getCurrentUserEmails(): Promise<any[]> {
    const response = await this.client.get('/api/v5/emails');
    return response.data;
  }

  async getUserEvents(username: string, options: UserEventOptions = {}): Promise<any[]> {
    const response = await this.client.get(`/api/v5/users/${username}/events`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async addUserKey(keyData: AddUserKeyRequest): Promise<any> {
    const response = await this.client.post('/api/v5/user/keys', keyData);
    return response.data;
  }

  async getCurrentUserKeys(options: PaginationOptions = {}): Promise<any[]> {
    const response = await this.client.get('/api/v5/user/keys', {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async deleteUserKey(keyId: string | number): Promise<any> {
    const response = await this.client.delete(`/api/v5/user/keys/${keyId}`);
    return response.data;
  }

  async getUserKey(keyId: string | number): Promise<any> {
    const response = await this.client.get(`/api/v5/user/keys/${keyId}`);
    return response.data;
  }

  async getCurrentUserNamespace(path: string): Promise<any> {
    const response = await this.client.get('/api/v5/user/namespace', {
      params: this.buildParams({ path })
    });
    return response.data;
  }

  async getCurrentUserPullRequests(options: CurrentUserPullRequestOptions = {}): Promise<any[]> {
    const response = await this.client.get('/api/v5/user/pulls', {
      params: this.buildParams(options)
    });
    return response.data;
  }
}
