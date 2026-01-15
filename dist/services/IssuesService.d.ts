import { BaseService } from './BaseService.js';
import { Issue } from '../types/index.js';
export declare class IssuesService extends BaseService {
    createRepositoryIssue(owner: string, repo: string, issueData: any): Promise<Issue>;
    updateRepositoryIssue(owner: string, repo: string, issueNumber: number, updateData: any): Promise<Issue>;
    getRepositoryIssue(owner: string, repo: string, issueNumber: number): Promise<Issue>;
    getRepositoryIssues(owner: string, repo: string, state?: 'open' | 'closed' | 'all', page?: number, perPage?: number): Promise<Issue[]>;
    getRepositoryIssueComments(owner: string, repo: string, issueNumber: number, page?: number, perPage?: number): Promise<any[]>;
    createRepositoryIssueComment(owner: string, repo: string, issueNumber: number, commentData: any): Promise<any>;
    getRepositoryAllIssueComments(owner: string, repo: string, page?: number, perPage?: number): Promise<any[]>;
    getRepositoryIssuePullRequests(owner: string, repo: string, issueNumber: number): Promise<any[]>;
    getEnterpriseIssueLabels(enterprise: string, issueId: string): Promise<any[]>;
    createRepositoryIssueLabel(owner: string, repo: string, issueNumber: number, labels: string[]): Promise<any[]>;
    deleteRepositoryIssueLabel(owner: string, repo: string, issueNumber: number, name: string): Promise<void>;
    getRepositoryIssueOperateLogs(owner: string, issueNumber: number, page?: number, perPage?: number): Promise<any[]>;
    getEnterpriseIssues(enterprise: string, page?: number, perPage?: number): Promise<any[]>;
    getUserIssues(page?: number, perPage?: number): Promise<any[]>;
    updateRepositoryIssueComment(owner: string, repo: string, commentId: number, updateData: any): Promise<any>;
    deleteRepositoryIssueComment(owner: string, repo: string, commentId: number): Promise<void>;
    getRepositoryIssueComment(owner: string, repo: string, commentId: number): Promise<any>;
    getOrganizationIssues(org: string, page?: number, perPage?: number): Promise<any[]>;
    getEnterpriseIssueComments(enterprise: string, issueNumber: number, page?: number, perPage?: number): Promise<any[]>;
    getEnterpriseIssue(enterprise: string, issueNumber: number): Promise<any>;
    getEnterpriseIssueStatuses(enterprise: string): Promise<any[]>;
    getRepositoryIssueRelatedBranches(owner: string, repo: string, issueNumber: number): Promise<any[]>;
    getRepositoryIssueReactions(owner: string, repo: string, issueNumber: number): Promise<any[]>;
    getRepositoryIssueCommentReactions(owner: string, repo: string, commentId: number): Promise<any[]>;
    getRepositoryIssueModifyHistory(owner: string, repo: string, issueNumber: number): Promise<any[]>;
    getRepositoryIssueCommentModifyHistory(owner: string, repo: string, commentId: number): Promise<any[]>;
    replaceRepositoryIssueAllLabels(owner: string, repo: string, issueNumber: number, labels: string[]): Promise<any>;
    deleteRepositoryAllIssueLabels(owner: string, repo: string, issueNumber: number): Promise<any>;
    getAllRepositoryIssueComments(owner: string, repo: string, page?: number, perPage?: number): Promise<any[]>;
}
//# sourceMappingURL=IssuesService.d.ts.map