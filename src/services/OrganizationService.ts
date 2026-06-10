import { BaseService } from './BaseService.js';

interface CreateOrganizationPayload {
  name?: string;
  path: string;
  visibility?: 'public' | 'private';
  description?: string;
}

interface CreateOrganizationRepositoryPayload {
  name: string;
  description?: string;
  homepage?: string;
  has_issues?: boolean;
  has_wiki?: boolean;
  can_comment?: boolean;
  public?: number;
  private?: boolean;
  auto_init?: boolean;
  gitignore_template?: string;
  license_template?: string;
  path?: string;
  default_branch?: string;
  import_url?: string;
  project_template?: string;
  repository_type?: 'code' | 'model' | 'dataset' | 'space';
}

interface UpdateOrganizationPayload {
  name?: string;
  email?: string;
  location?: string;
  description?: string;
  html_url?: string;
}

interface UpdateEnterpriseMemberPayload {
  role: string;
  role_id?: string;
}

interface InviteOrganizationMemberPayload {
  permission?: string;
  role_id?: string;
}

interface DiscussionListOptions {
  page?: string | number;
  per_page?: string | number;
  sort?: string;
  direction?: string;
  search?: string;
}

export class OrganizationService extends BaseService {
  private buildParams(options?: object): Record<string, unknown> {
    const params: Record<string, unknown> = { ...((options ?? {}) as Record<string, unknown>) };

    return Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
    );
  }

  async createOrganization(orgData: CreateOrganizationPayload): Promise<any> {
    const response = await this.client.post('/api/v5/orgs', orgData);
    return response.data;
  }
  
  async createOrganizationRepository(org: string, repoData: CreateOrganizationRepositoryPayload): Promise<any> {
    const response = await this.client.post(`/api/v5/orgs/${org}/repos`, repoData);
    return response.data;
  }

  async getOrganizationRepositories(org: string, page = 1, perPage = 30, type?: string, repoType?: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/orgs/${org}/repos`, {
      params: { page, per_page: perPage, type, repo_type: repoType }
    });
    return response.data;
  }

  async getUserOrganizations(username: string, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/users/${username}/orgs`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async getCurrentUserOrganizations(page = 1, perPage = 30, admin?: boolean): Promise<any[]> {
    const response = await this.client.get('/api/v5/users/orgs', {
      params: { page, per_page: perPage, admin }
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

  async updateOrganization(org: string, updateData: UpdateOrganizationPayload): Promise<any> {
    const response = await this.client.patch(`/api/v5/orgs/${org}`, updateData);
    return response.data;
  }

  async getEnterpriseMember(enterprise: string, username: string): Promise<any> {
    const response = await this.client.get(`/api/v5/enterprises/${enterprise}/members/${username}`);
    return response.data;
  }

  async updateEnterpriseMember(
    enterprise: string,
    username: string,
    memberData: UpdateEnterpriseMemberPayload
  ): Promise<any> {
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

  async getOrganizationMembers(org: string, page = 1, perPage = 30, role?: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/orgs/${org}/members`, {
      params: { page, per_page: perPage, role }
    });
    return response.data;
  }

  async getEnterpriseMembers(enterprise: string, page = 1, perPage = 30, org?: string, role?: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/enterprises/${enterprise}/members`, {
      params: { page, per_page: perPage, org, role }
    });
    return response.data;
  }

  async removeOrganizationMember(org: string, username: string): Promise<void> {
    const response = await this.client.delete(`/api/v5/orgs/${org}/memberships/${username}`);
    return response.data;
  }

  async inviteOrganizationMember(org: string, username: string, memberData: InviteOrganizationMemberPayload): Promise<any> {
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

  async getOrganizationDiscussions(org: string, options: DiscussionListOptions = {}): Promise<any[]> {
    const response = await this.client.get(`/api/v5/orgs/${org}/discuss`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getOrganizationDiscussion(org: string, number: string): Promise<any> {
    const response = await this.client.get(`/api/v5/orgs/${org}/discuss/${number}`);
    return response.data;
  }

  async getOrganizationDiscussionComments(org: string, number: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/orgs/${org}/discuss/${number}/comment`);
    return response.data;
  }

  async getOrganizationDiscussionCommentReplies(org: string, number: string, commentId: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/orgs/${org}/discuss/${number}/comment/${commentId}/reply`);
    return response.data;
  }
}
