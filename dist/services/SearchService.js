import { BaseService } from './BaseService.js';
export class SearchService extends BaseService {
    async searchUsers(query, page = 1, perPage = 30) {
        const response = await this.client.get('/api/v5/search/users', {
            params: {
                q: query,
                page,
                per_page: perPage
            }
        });
        return response.data;
    }
    async searchIssues(query, page = 1, perPage = 30) {
        const response = await this.client.get('/api/v5/search/issues', {
            params: {
                q: query,
                page,
                per_page: perPage
            }
        });
        return response.data;
    }
    async searchRepositories(query, page = 1, perPage = 30) {
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
//# sourceMappingURL=SearchService.js.map