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

interface GenericSearchOptions {
  type: string;
  q?: string;
  repo_type?: string;
  task?: string;
  library?: string;
  min?: number;
  max?: number;
  sort?: string;
  order?: string;
  page?: number;
  perPage?: number;
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

  async search(options: GenericSearchOptions): Promise<any> {
    // OpenAPI /api/v5/search query aliases: param.min/param.max, s=sort, o=order, p=page, pp=perPage
    const params = Object.fromEntries(
      Object.entries({
        type: options.type,
        q: options.q,
        repo_type: options.repo_type,
        task: options.task,
        library: options.library,
        'param.min': options.min,
        'param.max': options.max,
        s: options.sort,
        o: options.order,
        p: options.page,
        pp: options.perPage
      }).filter(([, value]) => value !== undefined)
    );
    const response = await this.client.get('/api/v5/search', { params });
    return response.data;
  }
}
