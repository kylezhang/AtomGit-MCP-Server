import { BaseService } from './BaseService.js';
import { CreateMilestoneRequest, UpdateMilestoneRequest } from '../types/index.js';
export declare class MilestoneService extends BaseService {
    getRepositoryMilestones(owner: string, repo: string, state?: 'open' | 'closed' | 'all', page?: number, perPage?: number): Promise<any[]>;
    createRepositoryMilestone(owner: string, repo: string, milestoneData: CreateMilestoneRequest): Promise<any>;
    getRepositoryMilestone(owner: string, repo: string, number: number): Promise<any>;
    deleteRepositoryMilestone(owner: string, repo: string, number: number): Promise<void>;
    updateRepositoryMilestone(owner: string, repo: string, number: number, milestoneData: UpdateMilestoneRequest): Promise<any>;
}
//# sourceMappingURL=MilestoneService.d.ts.map