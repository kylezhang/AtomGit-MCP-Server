import { BaseService } from './BaseService.js';
import { Commit, CreatePullRequestCommentRequest, UpdatePullRequestCommentRequest } from '../types/index.js';
export declare class CommitService extends BaseService {
    getRepositoryCommits(owner: string, repo: string, sha?: string, page?: number, perPage?: number): Promise<Commit[]>;
    getRepositoryCommit(owner: string, repo: string, sha: string): Promise<Commit>;
    compareRepositoryCommits(owner: string, repo: string, base: string, head: string): Promise<any>;
    createRepositoryCommitComment(owner: string, repo: string, sha: string, commentData: CreatePullRequestCommentRequest): Promise<any>;
    deleteRepositoryCommitComment(owner: string, repo: string, commentId: number): Promise<void>;
    getRepositoryCommitComment(owner: string, repo: string, commentId: number): Promise<any>;
    updateRepositoryCommitComment(owner: string, repo: string, commentId: number, commentData: UpdatePullRequestCommentRequest): Promise<any>;
    getRepositoryCommitComments(owner: string, repo: string, page?: number, perPage?: number): Promise<any[]>;
    getRepositoryCommitStatistics(owner: string, repo: string, sha?: string): Promise<any>;
    getRepositoryCommitRefComments(owner: string, repo: string, ref: string): Promise<any[]>;
    getRepositoryCommitDiff(owner: string, repo: string, sha: string): Promise<any>;
    getRepositoryCommitPatch(owner: string, repo: string, sha: string): Promise<any>;
}
//# sourceMappingURL=CommitService.d.ts.map