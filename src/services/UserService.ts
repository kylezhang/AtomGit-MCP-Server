import { BaseService } from './BaseService.js';
import { AtomGitRepository, AtomGitUser, CreateRepositoryRequest } from '../types/index.js';

export class UserService extends BaseService {
  
  async getUserStarredRepos(username: string, page = 1, perPage = 30): Promise<AtomGitRepository[]> {
    const response = await this.client.get(`/api/v5/users/${username}/starred`, {
      params: { page, per_page: perPage }
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

  async getUserRepos(username: string, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/users/${username}/repos`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async getCurrentUserRepos(page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get('/api/v5/user/repos', {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async getUserRepository(owner: string, repo: string): Promise<AtomGitRepository> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}`);
    return response.data;
  }

  async getCurrentUserStarredRepos(page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get('/api/v5/user/starred', {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async searchUsers(query: string, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get('/api/v5/search/users', {
      params: { q: query, page, per_page: perPage }
    });
    return response.data;
  }

  async getUserSubscriptions(username: string, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/users/${username}/subscriptions`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async getCurrentUserSubscriptions(page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get('/api/v5/user/subscriptions', {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async getCurrentUserNamespaces(page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get('/api/v5/user/namespaces', {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async getRepositoryNotifications(owner: string, repo: string, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/notifications`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async markRepositoryNotificationsRead(owner: string, repo: string): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/notifications`);
    return response.data;
  }

  async createUserRepository(repoData: any): Promise<any> {
    const response = await this.client.post('/api/v5/user/repos', repoData);
    return response.data;
  }

  async updateCurrentUser(userData: any): Promise<any> {
    const response = await this.client.patch('/api/v5/user', userData);
    return response.data;
  }

  async getCurrentUserEmails(): Promise<any[]> {
    const response = await this.client.get('/api/v5/emails');
    return response.data;
  }

  async getUserEvents(username: string, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/users/${username}/events`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async addUserKey(keyData: any): Promise<any> {
    const response = await this.client.post('/api/v5/user/keys', keyData);
    return response.data;
  }

  async getCurrentUserKeys(page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get('/api/v5/user/keys', {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async deleteUserKey(keyId: number): Promise<any> {
    const response = await this.client.delete(`/api/v5/user/keys/${keyId}`);
    return response.data;
  }

  async getUserKey(keyId: number): Promise<any> {
    const response = await this.client.get(`/api/v5/user/keys/${keyId}`);
    return response.data;
  }

  async getCurrentUserNamespace(): Promise<any> {
    const response = await this.client.get('/api/v5/user/namespace');
    return response.data;
  }

  async getCurrentUserPullRequests(page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get('/api/v5/user/pulls', {
      params: { page, per_page: perPage }
    });
    return response.data;
  }
}