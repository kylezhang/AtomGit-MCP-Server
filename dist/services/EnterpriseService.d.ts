import { BaseService } from './BaseService.js';
export declare class EnterpriseService extends BaseService {
    getEnterpriseMemberV8(enterprise: string, username: string): Promise<any>;
    getEnterpriseMembersV8(enterprise: string, page?: number, perPage?: number): Promise<any[]>;
    inviteEnterpriseMember(enterprise: string, username: string, memberData: any): Promise<any>;
    deleteEnterpriseMembers(enterprise: string, usernames: string[]): Promise<void>;
    updateEnterpriseMemberV8(enterprise: string, username: string, memberData: any): Promise<any>;
    getOrganizationEnterprise(org: string): Promise<any>;
    getEnterpriseCustomizedRoles(enterprise: string, enterpriseId: string): Promise<any[]>;
    createEnterpriseMilestone(enterprise: string, enterpriseId: string, milestoneData: any): Promise<any>;
    updateEnterpriseMilestone(enterprise: string, enterpriseId: string, milestoneId: string, milestoneData: any): Promise<any>;
    getEnterpriseMilestone(enterprise: string, enterpriseId: string, milestoneId: string): Promise<any>;
    deleteEnterpriseMilestone(enterprise: string, enterpriseId: string, milestoneId: string): Promise<void>;
    getEnterpriseMilestones(enterprise: string, enterpriseId: string, page?: number, perPage?: number): Promise<any[]>;
    getEnterpriseProjects(enterprise: string, enterpriseId: string, page?: number, perPage?: number): Promise<any[]>;
    getEnterpriseIssueExtendFields(enterprise: string, enterprisesId: string): Promise<any[]>;
}
//# sourceMappingURL=EnterpriseService.d.ts.map