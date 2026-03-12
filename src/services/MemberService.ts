import { BaseService } from './BaseService.js';

export class MemberService extends BaseService {
  
  async addRepositoryCollaborator(owner: string, repo: string, username: string, collaboratorData: any): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/collaborators/${username}`, collaboratorData);
    return response.data;
  }

  async removeRepositoryCollaborator(owner: string, repo: string, username: string): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/collaborators/${username}`);
    return response.data;
  }

  async isRepositoryCollaborator(owner: string, repo: string, username: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/collaborators/${username}`);
    return response.data;
  }

  async getRepositoryCollaborators(owner: string, repo: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/collaborators`);
    return response.data;
  }

  async getRepositoryCollaboratorPermission(owner: string, repo: string, username: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/collaborators/${username}/permission`);
    return response.data;
  }

  async getRepositoryCollaboratorSelfPermission(owner: string, repo: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/collaborators/self-permission`);
    return response.data;
  }
}
