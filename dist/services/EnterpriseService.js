import { BaseService } from './BaseService.js';
export class EnterpriseService extends BaseService {
    async getEnterpriseMemberV8(enterprise, username) {
        const response = await this.client.get(`/api/v8/enterprises/${enterprise}/members/${username}`);
        return response.data;
    }
    async getEnterpriseMembersV8(enterprise, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v8/enterprises/${enterprise}/members`, {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    async inviteEnterpriseMember(enterprise, username, memberData) {
        const response = await this.client.post(`/api/v8/enterprises/${enterprise}/memberships/${username}`, memberData);
        return response.data;
    }
    async deleteEnterpriseMembers(enterprise, usernames) {
        const response = await this.client.delete(`/api/v8/enterprises/${enterprise}/members/${usernames.join(',')}`);
        return response.data;
    }
    async updateEnterpriseMemberV8(enterprise, username, memberData) {
        const response = await this.client.put(`/api/v8/enterprises/${enterprise}/members/${username}`, memberData);
        return response.data;
    }
    async getOrganizationEnterprise(org) {
        const response = await this.client.get(`/api/v8/org/${org}/enterprise`);
        return response.data;
    }
    async getEnterpriseCustomizedRoles(enterprise, enterpriseId) {
        const response = await this.client.get(`/api/v8/enterprise/${enterpriseId}/customized_roles`);
        return response.data;
    }
    async createEnterpriseMilestone(enterprise, enterpriseId, milestoneData) {
        const response = await this.client.post(`/api/v8/enterprise/${enterpriseId}/milestones`, milestoneData);
        return response.data;
    }
    async updateEnterpriseMilestone(enterprise, enterpriseId, milestoneId, milestoneData) {
        const response = await this.client.put(`/api/v8/enterprise/${enterpriseId}/milestones/${milestoneId}`, milestoneData);
        return response.data;
    }
    async getEnterpriseMilestone(enterprise, enterpriseId, milestoneId) {
        const response = await this.client.get(`/api/v8/enterprise/${enterpriseId}/milestones/${milestoneId}`);
        return response.data;
    }
    async deleteEnterpriseMilestone(enterprise, enterpriseId, milestoneId) {
        const response = await this.client.delete(`/api/v8/enterprise/${enterpriseId}/milestones/${milestoneId}`);
        return response.data;
    }
    async getEnterpriseMilestones(enterprise, enterpriseId, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v8/enterprise/${enterpriseId}/milestones`, {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    async getEnterpriseProjects(enterprise, enterpriseId, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v8/enterprise/${enterpriseId}/groups/projects`, {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    async getEnterpriseIssueExtendFields(enterprise, enterprisesId) {
        const response = await this.client.get(`/api/v8/enterprises/${enterprisesId}/issue_extend_field`);
        return response.data;
    }
}
//# sourceMappingURL=EnterpriseService.js.map