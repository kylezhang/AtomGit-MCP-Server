import { BaseService } from './BaseService.js';
export class UserService extends BaseService {
    async getUserStarredRepos(username, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/users/${username}/starred`, {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    async getUser(username) {
        const response = await this.client.get(`/api/v5/users/${username}`);
        return response.data;
    }
    async getCurrentUser() {
        const response = await this.client.get('/api/v5/user');
        return response.data;
    }
    async getUserRepos(username, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/users/${username}/repos`, {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    async getUserRepository(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}`);
        return response.data;
    }
    async getCurrentUserStarredRepos(page = 1, perPage = 30) {
        const response = await this.client.get('/api/v5/user/starred', {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    async searchUsers(query, page = 1, perPage = 30) {
        const response = await this.client.get('/api/v5/search/users', {
            params: { q: query, page, per_page: perPage }
        });
        return response.data;
    }
    async getUserSubscriptions(username, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/users/${username}/subscriptions`, {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    async getCurrentUserSubscriptions(page = 1, perPage = 30) {
        const response = await this.client.get('/api/v5/user/subscriptions', {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    async getCurrentUserNamespaces(page = 1, perPage = 30) {
        const response = await this.client.get('/api/v5/user/namespaces', {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    async getRepositoryNotifications(owner, repo, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/notifications`, {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    async markRepositoryNotificationsRead(owner, repo) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/notifications`);
        return response.data;
    }
    async createUserRepository(repoData) {
        const response = await this.client.post('/api/v5/user/repos', repoData);
        return response.data;
    }
    async updateCurrentUser(userData) {
        const response = await this.client.patch('/api/v5/user', userData);
        return response.data;
    }
    async getCurrentUserEmails() {
        const response = await this.client.get('/api/v5/emails');
        return response.data;
    }
    async getUserEvents(username, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/users/${username}/events`, {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    async addUserKey(keyData) {
        const response = await this.client.post('/api/v5/user/keys', keyData);
        return response.data;
    }
    async getCurrentUserKeys(page = 1, perPage = 30) {
        const response = await this.client.get('/api/v5/user/keys', {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    async deleteUserKey(keyId) {
        const response = await this.client.delete(`/api/v5/user/keys/${keyId}`);
        return response.data;
    }
    async getUserKey(keyId) {
        const response = await this.client.get(`/api/v5/user/keys/${keyId}`);
        return response.data;
    }
    async getCurrentUserNamespace() {
        const response = await this.client.get('/api/v5/user/namespace');
        return response.data;
    }
    async getCurrentUserPullRequests(page = 1, perPage = 30) {
        const response = await this.client.get('/api/v5/users/merge_requests', {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
}
//# sourceMappingURL=UserService.js.map