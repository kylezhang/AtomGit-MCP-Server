import axios from 'axios';
export class AtomGitService {
    client;
    constructor(config) {
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
        console.log(`🔍 getUser API call: /api/v5/users/${username}`);
        try {
            const response = await this.client.get(`/api/v5/users/${username}`);
            console.log(`📊 Response status: ${response.status}`);
            console.log(`📊 Response headers:`, response.headers);
            if (response.data) {
                console.log(`✅ User data received: ${response.data.login || response.data.name}`);
                console.log(`👤 User ID: ${response.data.id}`);
                console.log(`🏢 User page: ${response.data.html_url}`);
            }
            else {
                console.log(`⚠️  No user data received`);
            }
            return response.data;
        }
        catch (error) {
            console.log(`❌ Error: ${error.message}`);
            if (error.response) {
                console.log(`📊 Status: ${error.response.status}`);
                console.log(`📄 Status Text: ${error.response.statusText}`);
                console.log(`📋 Error Data:`, error.response.data);
            }
            throw error;
        }
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
    async getRepositoryBranches(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/branches`);
        return response.data;
    }
    async getRepositoryIssues(owner, repo, state = 'open', page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues`, {
            params: {
                state,
                page,
                per_page: perPage
            }
        });
        return response.data;
    }
    async createRepositoryIssue(owner, repo, issueData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/issues`, issueData);
        return response.data;
    }
    async getRepositoryIssue(owner, repo, issueNumber) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}`);
        return response.data;
    }
    async getRepositoryPulls(owner, repo, state = 'open', page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls`, {
            params: {
                state,
                page,
                per_page: perPage
            }
        });
        return response.data;
    }
    async getRepositoryPull(owner, repo, pullNumber) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}`);
        return response.data;
    }
    // Commit APIs
    async getRepositoryCommits(owner, repo, sha, page = 1, perPage = 30) {
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
    async getRepositoryCommit(owner, repo, sha) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/commits/${sha}`);
        return response.data;
    }
    // Tag APIs
    async getRepositoryTags(owner, repo, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/tags`, {
            params: {
                page,
                per_page: perPage
            }
        });
        return response.data;
    }
    // Release APIs
    async createRelease(owner, repo, releaseData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/releases`, releaseData);
        return response.data;
    }
    async getRepositoryReleases(owner, repo, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/releases`, {
            params: {
                page,
                per_page: perPage
            }
        });
        return response.data;
    }
    async getRepositoryRelease(owner, repo, tag) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/releases/${tag}`);
        return response.data;
    }
    async getLatestRelease(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/releases/latest`);
        return response.data;
    }
}
//# sourceMappingURL=AtomGitService.js.map