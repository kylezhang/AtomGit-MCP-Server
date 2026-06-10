import { BaseService } from './BaseService.js';

interface EnterpriseMemberInvitationPayload {
  permission?: string;
  role_id?: string;
}

interface EnterpriseMemberUpdatePayload {
  role: string;
  role_id?: string;
}

interface EnterpriseMilestonePayload {
  title: string;
  description?: string;
  start_date?: string;
  due_date?: string;
  state_event?: string;
  projects?: number[];
}

interface EnterpriseIssuesQueryPayload {
  page?: number;
  per_page?: number;
  labels?: string;
  sort?: string;
  direction?: string;
  since?: string;
  assignees?: string[];
  milestone_ids?: number[];
  project_ids?: number[];
  create_at?: string;
  created_before?: string;
  search?: string;
  issue_types?: string[];
  issue_states?: string[];
  custom_fields?: Array<{
    field_name?: string;
    values?: string[];
    operation: string;
  }>;
}

interface EnterpriseLabelPayload {
  name: string;
  color?: string;
  description: string;
}

export class EnterpriseService extends BaseService {
  
  async getEnterpriseMemberV8(enterprise: string, username: string): Promise<any> {
    const response = await this.client.get(`/api/v8/enterprises/${enterprise}/members/${username}`);
    return response.data;
  }

  async getEnterpriseMembersV8(enterprise: string, page = 1, perPage = 30, role?: string): Promise<any[]> {
    const response = await this.client.get(`/api/v8/enterprises/${enterprise}/members`, {
      params: { page, per_page: perPage, role }
    });
    return response.data;
  }

  async inviteEnterpriseMember(
    enterprise: string,
    username: string,
    memberData: EnterpriseMemberInvitationPayload
  ): Promise<any> {
    const response = await this.client.post(`/api/v8/enterprises/${enterprise}/memberships/${username}`, memberData);
    return response.data;
  }

  async deleteEnterpriseMembers(enterprise: string, usernames: string[]): Promise<void> {
    const response = await this.client.delete(`/api/v8/enterprises/${enterprise}/members/${usernames.join(',')}`);
    return response.data;
  }

  async updateEnterpriseMemberV8(
    enterprise: string,
    username: string,
    memberData: EnterpriseMemberUpdatePayload
  ): Promise<any> {
    const response = await this.client.put(`/api/v8/enterprises/${enterprise}/members/${username}`, memberData);
    return response.data;
  }

  async getEnterpriseIssuesV8(enterpriseId: string, queryData: EnterpriseIssuesQueryPayload = {}): Promise<any> {
    const response = await this.client.post(`/api/v8/enterprises/${enterpriseId}/issues`, queryData);
    return response.data;
  }

  async getOrganizationEnterprise(org: string): Promise<any> {
    const response = await this.client.get(`/api/v8/org/${org}/enterprise`);
    return response.data;
  }

  async getEnterpriseCustomizedRoles(enterpriseId: string): Promise<any[]> {
    const response = await this.client.get(`/api/v8/enterprise/${enterpriseId}/customized_roles`);
    return response.data;
  }

  async createEnterpriseMilestone(enterprise: string, milestoneData: EnterpriseMilestonePayload): Promise<any> {
    const response = await this.client.post(`/api/v8/enterprises/${enterprise}/milestones`, milestoneData);
    return response.data;
  }

  async updateEnterpriseMilestone(
    enterprise: string,
    milestoneId: string,
    milestoneData: EnterpriseMilestonePayload
  ): Promise<any> {
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

  async getEnterpriseMilestones(
    enterprise: string,
    page = 1,
    perPage = 30,
    name?: string,
    state?: string,
    orderBy?: string,
    sort?: string
  ): Promise<any[]> {
    const response = await this.client.get(`/api/v8/enterprises/${enterprise}/milestones`, {
      params: { page, per_page: perPage, name, state, order_by: orderBy, sort }
    });
    return response.data;
  }

  async getEnterpriseProjects(enterprise: string, page = 1, perPage = 30, groupName?: string): Promise<any[]> {
    const response = await this.client.get(`/api/v8/enterprises/${enterprise}/groups/projects`, {
      params: { page, per_page: perPage, group_name: groupName }
    });
    return response.data;
  }

  async getEnterpriseIssueExtendFields(enterprisesId: string, page?: number, perPage?: number): Promise<any[]> {
    const response = await this.client.get(`/api/v8/enterprises/${enterprisesId}/issue_extend_field`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async createEnterpriseLabel(enterpriseId: number, labelData: EnterpriseLabelPayload): Promise<any> {
    const response = await this.client.post(`/api/v8/enterprises/${enterpriseId}/label`, labelData);
    return response.data;
  }

  async updateEnterpriseLabel(enterpriseId: number, labelId: string, labelData: EnterpriseLabelPayload): Promise<any> {
    const response = await this.client.put(`/api/v8/enterprises/${enterpriseId}/label/${labelId}`, labelData);
    return response.data;
  }

  async deleteEnterpriseLabel(enterpriseId: number, labelId: string): Promise<void> {
    const response = await this.client.delete(`/api/v8/enterprises/${enterpriseId}/label/${labelId}`);
    return response.data;
  }
}
