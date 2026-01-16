import { BaseService } from './BaseService.js';
import { CreateMilestoneRequest, UpdateMilestoneRequest } from '../types/index.js';

export class MilestoneService extends BaseService {
  
  async getRepositoryMilestones(owner: string, repo: string, state: 'open' | 'closed' | 'all' = 'open', page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/milestones`, {
      params: {
        state,
        page,
        per_page: perPage
      }
    });
    return response.data;
  }

  async createRepositoryMilestone(owner: string, repo: string, milestoneData: CreateMilestoneRequest): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/milestones`, milestoneData);
    return response.data;
  }

  async getRepositoryMilestone(owner: string, repo: string, number: number): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/milestones/${number}`);
    return response.data;
  }

  async deleteRepositoryMilestone(owner: string, repo: string, number: number): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/milestones/${number}`);
    return response.data;
  }

  async updateRepositoryMilestone(owner: string, repo: string, number: number, milestoneData: UpdateMilestoneRequest): Promise<any> {
    const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/milestones/${number}`, milestoneData);
    return response.data;
  }
}
