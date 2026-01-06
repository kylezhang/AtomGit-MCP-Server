import axios from 'axios';
export class AtomGitService {
    client;
    config;
    constructor(config) {
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
    async getCurrentUser() {
        const response = await this.client.get('/api/v5/user');
        return response.data;
    }
    async getUser(username) {
        const response = await this.client.get(`/api/v5/users/${username}`);
        return response.data;
    }
    async getUserRepos(username) {
        const response = await this.client.get(`/api/v5/users/${username}/repos`);
        return response.data;
    }
    async getCurrentUserRepos() {
        const response = await this.client.get('/api/v5/user/repos');
        return response.data;
    }
    async getRepository(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}`);
        return response.data;
    }
    async getRepositoryTree(owner, repo, sha) {
        const url = sha ? `/api/v5/repos/${owner}/${repo}/git/trees/${sha}` : `/api/v5/repos/${owner}/${repo}/git/trees/main`;
        const response = await this.client.get(url);
        return response.data;
    }
    async getUserStarredRepos(username) {
        const response = await this.client.get(`/api/v5/users/${username}/starred`);
        return response.data;
    }
    async getCurrentUserStarredRepos() {
        const response = await this.client.get('/api/v5/user/starred');
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
        return response.data; // Direct array, not wrapped in items
    }
    async searchUsers(query, page = 1, perPage = 30) {
        const response = await this.client.get('/api/v5/search/users', {
            params: {
                q: query,
                page,
                per_page: perPage
            }
        });
        return response.data; // Direct array, not wrapped in items
    }
    async createRepository(repoData) {
        const response = await this.client.post('/api/v5/user/repos', repoData);
        return response.data;
    }
}
//# sourceMappingURL=AtomGitService.js.map