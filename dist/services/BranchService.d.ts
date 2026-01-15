import { BaseService } from './BaseService.js';
import { Branch } from '../types/index.js';
export declare class BranchService extends BaseService {
    getRepositoryBranches(owner: string, repo: string): Promise<Branch[]>;
    createRepositoryBranch(owner: string, repo: string, branch: string, sha?: string): Promise<Branch>;
    deleteRepositoryBranch(owner: string, repo: string, branch: string): Promise<void>;
    getRepositoryBranch(owner: string, repo: string, branch: string): Promise<Branch>;
    createBranchProtectionRule(owner: string, repo: string, ruleData: any): Promise<any>;
    deleteBranchProtectionRule(owner: string, repo: string, wildcard: string): Promise<void>;
    getBranchProtectionRules(owner: string, repo: string): Promise<any[]>;
    updateBranchProtectionRule(owner: string, repo: string, wildcard: string, ruleData: any): Promise<any>;
}
//# sourceMappingURL=BranchService.d.ts.map