import { BaseService } from './BaseService.js';
export declare class LabelsService extends BaseService {
    replaceRepositoryProjectLabels(owner: string, repo: string, labels: string[]): Promise<any[]>;
    deleteRepositoryIssueAllLabels(owner: string, repo: string, issueNumber: number): Promise<void>;
    replaceRepositoryIssueAllLabels(owner: string, repo: string, issueNumber: number, labels: string[]): Promise<any[]>;
    updateRepositoryLabel(owner: string, repo: string, originalName: string, labelData: any): Promise<any>;
    getRepositoryLabels(owner: string, repo: string): Promise<any[]>;
    createRepositoryLabel(owner: string, repo: string, labelData: any): Promise<any>;
    deleteRepositoryLabel(owner: string, repo: string, name: string): Promise<void>;
    getEnterpriseLabels(enterprise: string): Promise<any[]>;
    getEnterpriseLabelsV8(enterprise: string): Promise<any[]>;
}
//# sourceMappingURL=LabelsService.d.ts.map