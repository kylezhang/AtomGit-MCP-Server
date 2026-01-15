import { BaseService } from './BaseService.js';

export class SearchService extends BaseService {
  
  async searchUsers(query: string, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get('/api/v5/search/users', {
      params: {
        q: query,
        page,
        per_page: perPage
      }
    });
    return response.data;
  }

  async searchIssues(query: string, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get('/api/v5/search/issues', {
      params: {
        q: query,
        page,
        per_page: perPage
      }
    });
    return response.data;
  }

  async searchRepositories(query: string, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get('/api/v5/search/repositories', {
      params: {
        q: query,
        page,
        per_page: perPage
      }
    });
    return response.data;
  }
}
