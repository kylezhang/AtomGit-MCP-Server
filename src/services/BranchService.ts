import { BaseService } from './BaseService.js';
import { Branch } from '../types/index.js';

export class BranchService extends BaseService {
  
  async getRepositoryBranches(owner: string, repo: string): Promise<Branch[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/branches`);
    return response.data;
  }

  async createRepositoryBranch(owner: string, repo: string, branch: string, sha?: string): Promise<Branch> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/branches`, { branch, sha });
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

  async createBranchProtectionRule(owner: string, repo: string, ruleData: any): Promise<any> {
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

  async updateBranchProtectionRule(owner: string, repo: string, wildcard: string, ruleData: any): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/branches/${wildcard}/setting`, ruleData);
    return response.data;
  }
}
