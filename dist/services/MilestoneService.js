import { BaseService } from './BaseService.js';
export class MilestoneService extends BaseService {
    async getRepositoryMilestones(owner, repo, state = 'open', page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/milestones`, {
            params: {
                state,
                page,
                per_page: perPage
            }
        });
        return response.data;
    }
    async createRepositoryMilestone(owner, repo, milestoneData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/milestones`, milestoneData);
        return response.data;
    }
    async getRepositoryMilestone(owner, repo, number) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/milestones/${number}`);
        return response.data;
    }
    async deleteRepositoryMilestone(owner, repo, number) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/milestones/${number}`);
        return response.data;
    }
    async updateRepositoryMilestone(owner, repo, number, milestoneData) {
        const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/milestones/${number}`, milestoneData);
        return response.data;
    }
}
//# sourceMappingURL=MilestoneService.js.map