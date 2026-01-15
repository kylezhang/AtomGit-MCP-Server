import { BaseService } from './BaseService.js';
export declare class OrganizationService extends BaseService {
    createOrganizationRepository(org: string, repoData: any): Promise<any>;
    getOrganizationRepositories(org: string, page?: number, perPage?: number): Promise<any[]>;
    getUserOrganizations(username: string, page?: number, perPage?: number): Promise<any[]>;
    getCurrentUserOrganizations(page?: number, perPage?: number): Promise<any[]>;
    getOrganizationMember(org: string, username: string): Promise<any>;
    getOrganization(org: string): Promise<any>;
    updateOrganization(org: string, updateData: any): Promise<any>;
    getEnterpriseMember(enterprise: string, username: string): Promise<any>;
    updateEnterpriseMember(enterprise: string, username: string, memberData: any): Promise<any>;
    getCurrentUserOrganizationMembership(org: string): Promise<any>;
    leaveOrganization(org: string): Promise<void>;
    getOrganizationMembers(org: string, page?: number, perPage?: number): Promise<any[]>;
    getEnterpriseMembers(enterprise: string, page?: number, perPage?: number): Promise<any[]>;
    removeOrganizationMember(org: string, username: string): Promise<void>;
    inviteOrganizationMember(org: string, username: string, memberData: any): Promise<any>;
    getOrganizationFollowers(owner: string, page?: number, perPage?: number): Promise<any[]>;
    getOrganizationIssueExtendSettings(org: string): Promise<any>;
    getOrganizationCustomizedRoles(org: string): Promise<any[]>;
}
//# sourceMappingURL=OrganizationService.d.ts.map