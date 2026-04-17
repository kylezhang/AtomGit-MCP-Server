import { BaseService } from './BaseService.js';

interface SearchOptions {
  q: string;
  page?: number;
  perPage?: number;
  sort?: string;
  order?: string;
  repo?: string;
  state?: string;
  owner?: string;
  fork?: string;
  language?: string;
}

export class SearchService extends BaseService {
  private buildParams(options: SearchOptions): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries({
        ...options,
        per_page: options.perPage
      }).filter(([key, value]) => key !== 'perPage' && value !== undefined)
    );
  }

  async searchUsers(options: SearchOptions): Promise<any[]> {
    const response = await this.client.get('/api/v5/search/users', {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async searchIssues(options: SearchOptions): Promise<any[]> {
    const response = await this.client.get('/api/v5/search/issues', {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async searchRepositories(options: SearchOptions): Promise<any[]> {
    const response = await this.client.get('/api/v5/search/repositories', {
      params: this.buildParams(options)
    });
    return response.data;
  }
}
