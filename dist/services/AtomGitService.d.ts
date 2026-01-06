import { AtomGitUser, AtomGitRepository, AtomGitTree, AtomGitConfig, CreateRepositoryRequest, Branch, Issue, PullRequest, CreateIssueRequest, Commit, Tag, CreateReleaseRequest, Release } from '../types/index.js';
export declare class AtomGitService {
    private client;
    constructor(config: AtomGitConfig);
    getCurrentUser(): Promise<AtomGitUser>;
    getUser(username: string): Promise<AtomGitUser>;
    getUserRepos(username: string): Promise<AtomGitRepository[]>;
    getCurrentUserRepos(): Promise<AtomGitRepository[]>;
    getRepository(owner: string, repo: string): Promise<AtomGitRepository>;
    getRepositoryTree(owner: string, repo: string, sha?: string): Promise<AtomGitTree>;
    getUserStarredRepos(username: string): Promise<AtomGitRepository[]>;
    getCurrentUserStarredRepos(): Promise<AtomGitRepository[]>;
    searchRepositories(query: string, page?: number, perPage?: number): Promise<AtomGitRepository[]>;
    searchUsers(query: string, page?: number, perPage?: number): Promise<AtomGitUser[]>;
    createRepository(repoData: CreateRepositoryRequest): Promise<AtomGitRepository>;
    getRepositoryBranches(owner: string, repo: string): Promise<Branch[]>;
    getRepositoryIssues(owner: string, repo: string, state?: 'open' | 'closed' | 'all', page?: number, perPage?: number): Promise<Issue[]>;
    createRepositoryIssue(owner: string, repo: string, issueData: CreateIssueRequest): Promise<Issue>;
    getRepositoryIssue(owner: string, repo: string, issueNumber: number): Promise<Issue>;
    getRepositoryPulls(owner: string, repo: string, state?: 'open' | 'closed' | 'all', page?: number, perPage?: number): Promise<PullRequest[]>;
    getRepositoryPull(owner: string, repo: string, pullNumber: number): Promise<PullRequest>;
    getRepositoryCommits(owner: string, repo: string, sha?: string, page?: number, perPage?: number): Promise<Commit[]>;
    getRepositoryCommit(owner: string, repo: string, sha: string): Promise<Commit>;
    getRepositoryTags(owner: string, repo: string, page?: number, perPage?: number): Promise<Tag[]>;
    createRelease(owner: string, repo: string, releaseData: CreateReleaseRequest): Promise<Release>;
    getRepositoryReleases(owner: string, repo: string, page?: number, perPage?: number): Promise<Release[]>;
    getRepositoryRelease(owner: string, repo: string, tag: string): Promise<Release>;
    getLatestRelease(owner: string, repo: string): Promise<Release>;
    getRepositoryForks(owner: string, repo: string, page?: number, perPage?: number): Promise<AtomGitRepository[]>;
    createRepositoryBranch(owner: string, repo: string, branch: string, sha?: string): Promise<Branch>;
    deleteRepositoryBranch(owner: string, repo: string, branch: string): Promise<void>;
    createRepositoryPull(owner: string, repo: string, pullData: any): Promise<PullRequest>;
    getUserSubscriptions(): Promise<AtomGitRepository[]>;
    getUserNamespaces(): Promise<string[]>;
}
//# sourceMappingURL=AtomGitService.d.ts.map