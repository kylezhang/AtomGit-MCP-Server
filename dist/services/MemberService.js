import { BaseService } from './BaseService.js';
export class MemberService extends BaseService {
    async addRepositoryCollaborator(owner, repo, username, collaboratorData) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/collaborators/${username}`, collaboratorData);
        return response.data;
    }
    async removeRepositoryCollaborator(owner, repo, username) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/collaborators/${username}`);
        return response.data;
    }
    async isRepositoryCollaborator(owner, repo, username) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/collaborators/${username}`);
        return response.data;
    }
    async getRepositoryCollaborators(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/collaborators`);
        return response.data;
    }
    async getRepositoryCollaboratorPermission(owner, repo, username) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/collaborators/${username}/permission`);
        return response.data;
    }
    async getRepositoryCollaboratorSelfPermission(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/collaborators/self_permission`);
        return response.data;
    }
}
//# sourceMappingURL=MemberService.js.map