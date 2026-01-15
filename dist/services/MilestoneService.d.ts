import { BaseService } from './BaseService.js';
export declare class MilestoneService extends BaseService {
    getRepositoryMilestones(owner: string, repo: string, state?: 'open' | 'closed' | 'all', page?: number, perPage?: number): Promise<any[]>;
    createRepositoryMilestone(owner: string, repo: string, milestoneData: any): Promise<any>;
    getRepositoryMilestone(owner: string, repo: string, number: number): Promise<any>;
    deleteRepositoryMilestone(owner: string, repo: string, number: number): Promise<void>;
    updateRepositoryMilestone(owner: string, repo: string, number: number, milestoneData: any): Promise<any>;
}
//# sourceMappingURL=MilestoneService.d.ts.map