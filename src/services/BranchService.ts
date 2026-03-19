import { BaseService } from './BaseService.js';
import { Branch, BranchProtectionRuleCreate, BranchProtectionRuleUpdate } from '../types/index.js';

export class BranchService extends BaseService {

  async getRepositoryBranches(owner: string, repo: string): Promise<Branch[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/branches`);
    return response.data;
  }

  // fix: AtomGit API requires "refs" not "sha" for branch source
  // ref: https://docs.gitcode.com/docs/apis/post-api-v-5-repos-owner-repo-branches/
  async createRepositoryBranch(owner: string, repo: string, branch: string, refs?: string): Promise<Branch> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/branches`, { branch, refs });
    return response.data;
  }

  async deleteRepositoryBranch(owner: string, repo: string, branch: string): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/branches/${branch}`);
    return response.data;
  }

  async getRepositoryBranch(owner: string, repo: string, branch: string): Promise<Branch> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/branches/${branch}`);
    return response.data;
  }

  async createBranchProtectionRule(owner: string, repo: string, ruleData: BranchProtectionRuleCreate): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/branches/setting/new`, ruleData);
    return response.data;
  }

  async deleteBranchProtectionRule(owner: string, repo: string, wildcard: string): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/branches/${wildcard}/setting`);
    return response.data;
  }

  async getBranchProtectionRules(owner: string, repo: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/protect_branches`);
    return response.data;
  }

  async updateBranchProtectionRule(owner: string, repo: string, wildcard: string, ruleData: BranchProtectionRuleUpdate): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/branches/${wildcard}/setting`, ruleData);
    return response.data;
  }
}
