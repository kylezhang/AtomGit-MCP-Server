import { BaseService } from './BaseService.js';

export class EnterpriseService extends BaseService {
  
  async getEnterpriseMemberV8(enterprise: string, username: string): Promise<any> {
    const response = await this.client.get(`/api/v8/enterprises/${enterprise}/members/${username}`);
    return response.data;
  }

  async getEnterpriseMembersV8(enterprise: string, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v8/enterprises/${enterprise}/members`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async inviteEnterpriseMember(enterprise: string, username: string, memberData: any): Promise<any> {
    const response = await this.client.post(`/api/v8/enterprises/${enterprise}/memberships/${username}`, memberData);
    return response.data;
  }

  async deleteEnterpriseMembers(enterprise: string, usernames: string[]): Promise<void> {
    const response = await this.client.delete(`/api/v8/enterprises/${enterprise}/members/${usernames.join(',')}`);
    return response.data;
  }

  async updateEnterpriseMemberV8(enterprise: string, username: string, memberData: any): Promise<any> {
    const response = await this.client.put(`/api/v8/enterprises/${enterprise}/members/${username}`, memberData);
    return response.data;
  }

  async getEnterpriseIssuesV8(enterpriseId: string, queryData: any = {}): Promise<any> {
    const response = await this.client.post(`/api/v8/enterprises/${enterpriseId}/issues`, queryData);
    return response.data;
  }

  async getOrganizationEnterprise(org: string): Promise<any> {
    const response = await this.client.get(`/api/v8/org/${org}/enterprise`);
    return response.data;
  }

  async getEnterpriseCustomizedRoles(enterprise: string, enterpriseId: string): Promise<any[]> {
    const response = await this.client.get(`/api/v8/enterprise/${enterpriseId}/customized_roles`);
    return response.data;
  }

  async createEnterpriseMilestone(enterprise: string, milestoneData: any): Promise<any> {
    const response = await this.client.post(`/api/v8/enterprises/${enterprise}/milestones`, milestoneData);
    return response.data;
  }

  async updateEnterpriseMilestone(enterprise: string, milestoneId: string, milestoneData: any): Promise<any> {
    const response = await this.client.put(`/api/v8/enterprises/${enterprise}/milestones/${milestoneId}`, milestoneData);
    return response.data;
  }

  async getEnterpriseMilestone(enterprise: string, milestoneId: string): Promise<any> {
    const response = await this.client.get(`/api/v8/enterprises/${enterprise}/milestones/${milestoneId}`);
    return response.data;
  }

  async deleteEnterpriseMilestone(enterprise: string, milestoneId: string): Promise<void> {
    const response = await this.client.delete(`/api/v8/enterprises/${enterprise}/milestones/${milestoneId}`);
    return response.data;
  }

  async getEnterpriseMilestones(enterprise: string, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v8/enterprises/${enterprise}/milestones`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async getEnterpriseProjects(enterprise: string, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v8/enterprises/${enterprise}/groups/projects`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async getEnterpriseIssueExtendFields(enterprise: string, enterprisesId: string): Promise<any[]> {
    const response = await this.client.get(`/api/v8/enterprises/${enterprisesId}/issue_extend_field`);
    return response.data;
  }
}
