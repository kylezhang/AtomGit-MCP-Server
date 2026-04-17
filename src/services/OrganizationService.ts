import { BaseService } from './BaseService.js';

export class OrganizationService extends BaseService {
  async createOrganization(orgData: any): Promise<any> {
    const response = await this.client.post('/api/v5/orgs', orgData);
    return response.data;
  }
  
  async createOrganizationRepository(org: string, repoData: any): Promise<any> {
    const response = await this.client.post(`/api/v5/orgs/${org}/repos`, repoData);
    return response.data;
  }

  async getOrganizationRepositories(org: string, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/orgs/${org}/repos`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async getUserOrganizations(username: string, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/users/${username}/orgs`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async getCurrentUserOrganizations(page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get('/api/v5/users/orgs', {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async getOrganizationMember(org: string, username: string): Promise<any> {
    const response = await this.client.get(`/api/v5/orgs/${org}/members/${username}`);
    return response.data;
  }

  async getOrganization(org: string): Promise<any> {
    const response = await this.client.get(`/api/v5/orgs/${org}`);
    return response.data;
  }

  async updateOrganization(org: string, updateData: any): Promise<any> {
    const response = await this.client.patch(`/api/v5/orgs/${org}`, updateData);
    return response.data;
  }

  async getEnterpriseMember(enterprise: string, username: string): Promise<any> {
    const response = await this.client.get(`/api/v5/enterprises/${enterprise}/members/${username}`);
    return response.data;
  }

  async updateEnterpriseMember(enterprise: string, username: string, memberData: any): Promise<any> {
    const response = await this.client.put(`/api/v5/enterprises/${enterprise}/members/${username}`, memberData);
    return response.data;
  }

  async getCurrentUserOrganizationMembership(org: string): Promise<any> {
    const response = await this.client.get(`/api/v5/user/memberships/orgs/${org}`);
    return response.data;
  }

  async leaveOrganization(org: string): Promise<void> {
    const response = await this.client.delete(`/api/v5/user/memberships/orgs/${org}`);
    return response.data;
  }

  async getOrganizationMembers(org: string, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/orgs/${org}/members`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async getEnterpriseMembers(enterprise: string, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/enterprises/${enterprise}/members`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async removeOrganizationMember(org: string, username: string): Promise<void> {
    const response = await this.client.delete(`/api/v5/orgs/${org}/memberships/${username}`);
    return response.data;
  }

  async inviteOrganizationMember(org: string, username: string, memberData: any): Promise<any> {
    const response = await this.client.post(`/api/v5/orgs/${org}/memberships/${username}`, memberData);
    return response.data;
  }

  async getOrganizationFollowers(owner: string, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/orgs/${owner}/followers`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async getOrganizationIssueExtendSettings(org: string): Promise<any> {
    const response = await this.client.get(`/api/v5/orgs/${org}/issue/extend/settings`);
    return response.data;
  }

  async getOrganizationCustomizedRoles(org: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/orgs/${org}/customized_roles`);
    return response.data;
  }
}
