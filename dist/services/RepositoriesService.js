import { BaseService } from './BaseService.js';
export class RepositoriesService extends BaseService {
    async getRepositoryTree(owner, repo, sha, recursive) {
        const url = sha ? `/api/v5/repos/${owner}/${repo}/git/trees/${sha}` : `/api/v5/repos/${owner}/${repo}/git/trees/main`;
        const response = await this.client.get(url, {
            params: recursive ? { recursive } : {}
        });
        return response.data;
    }
    async getRepositoryContent(owner, repo, path = '', ref) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/contents/${path}`, {
            params: ref ? { ref } : {}
        });
        return response.data;
    }
    async createRepositoryFile(owner, repo, fileData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/contents/${fileData.path}`, fileData);
        return response.data;
    }
    async updateRepositoryFile(owner, repo, fileData) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/contents/${fileData.path}`, fileData);
        return response.data;
    }
    async deleteRepositoryFile(owner, repo, fileData) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/contents/${fileData.path}`, {
            data: fileData
        });
        return response.data;
    }
    async getRepositoryFileList(owner, repo, path = '', ref, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/file_list`, {
            params: {
                path,
                ref,
                page,
                per_page: perPage
            }
        });
        return response.data;
    }
    async getRepositoryFileBlob(owner, repo, sha) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/git/blobs/${sha}`);
        return response.data;
    }
    async getRepositoryLanguages(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/languages`);
        return response.data;
    }
    async getRepositoryContributors(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/contributors`);
        return response.data;
    }
    async setRepositoryModuleSetting(owner, repo, moduleData) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/module-setting`, moduleData);
        return response.data;
    }
    async updateRepositorySettings(owner, repo, updateData) {
        const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}`, updateData);
        return response.data;
    }
    async deleteRepository(owner, repo) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}`);
        return response.data;
    }
    async updateRepositoryReviewer(owner, repo, reviewerData) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/reviewer`, reviewerData);
        return response.data;
    }
    async archiveRepository(org, repository, archiveData) {
        const response = await this.client.put(`/api/v5/org/${org}/repo/${repository}/status`, archiveData);
        return response.data;
    }
    async transferRepositoryToOrg(org, repository, transferData) {
        const response = await this.client.post(`/api/v5/org/${org}/projects/${repository}/transfer`, transferData);
        return response.data;
    }
    async getRepositoryTransition(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/transition`);
        return response.data;
    }
    async updateRepositoryTransition(owner, repo, transitionData) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/transition`, transitionData);
        return response.data;
    }
    async setRepositoryPushConfig(owner, repo, config) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/push-config`, config);
        return response.data;
    }
    async getRepositoryPushConfig(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/push-config`);
        return response.data;
    }
    async forkRepository(owner, repo, forkData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/forks`, forkData || {});
        return response.data;
    }
    async getRepositoryForks(owner, repo, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/forks`, {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    async uploadRepositoryImage(owner, repo, fileData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/img/upload`, fileData);
        return response.data;
    }
    async uploadRepositoryFile(owner, repo, fileData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/file/upload`, fileData);
        return response.data;
    }
    async getRepositorySubscribers(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/subscribers`);
        return response.data;
    }
    async getRepositoryStargazers(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/stargazers`);
        return response.data;
    }
    async updateRepositoryRepoSettings(owner, repo, settings) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/repo_settings`, settings);
        return response.data;
    }
    async getRepositoryRepoSettings(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/repo_settings`);
        return response.data;
    }
    async getRepositoryPullRequestSettings(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pull-request-settings`);
        return response.data;
    }
    async updateRepositoryPullRequestSettings(owner, repo, settings) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/pull-request-settings`, settings);
        return response.data;
    }
    async updateRepositoryMemberRole(owner, repo, username, roleData) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/members/${username}`, roleData);
        return response.data;
    }
    async transferRepository(owner, repo, transferData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/transfer`, transferData);
        return response.data;
    }
    async getRepositoryCustomizedRoles(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/customized-roles`);
        return response.data;
    }
    async getRepositoryDownloadStatistics(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/download-statistics`);
        return response.data;
    }
    async getRepositoryRawFile(owner, repo, path) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/raw/${path}`);
        return response.data;
    }
    async getRepositoryContributorsStatistic(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/contributors-statistic`);
        return response.data;
    }
    async getRepositoryEvents(owner, repo, accessToken) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/events/access-token/${accessToken}`);
        return response.data;
    }
}
//# sourceMappingURL=RepositoriesService.js.map