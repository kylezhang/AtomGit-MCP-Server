import { BaseService } from './BaseService.js';
export class BranchService extends BaseService {
    async getRepositoryBranches(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/branches`);
        return response.data;
    }
    async createRepositoryBranch(owner, repo, branch, sha) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/branches`, { branch, sha });
        return response.data;
    }
    async deleteRepositoryBranch(owner, repo, branch) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/branches/${branch}`);
        return response.data;
    }
    async getRepositoryBranch(owner, repo, branch) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/branches/${branch}`);
        return response.data;
    }
    async createBranchProtectionRule(owner, repo, ruleData) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/branches/setting/new`, ruleData);
        return response.data;
    }
    async deleteBranchProtectionRule(owner, repo, wildcard) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/branches/${wildcard}/setting`);
        return response.data;
    }
    async getBranchProtectionRules(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/protect_branches`);
        return response.data;
    }
    async updateBranchProtectionRule(owner, repo, wildcard, ruleData) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/branches/${wildcard}/setting`, ruleData);
        return response.data;
    }
}
//# sourceMappingURL=BranchService.js.map