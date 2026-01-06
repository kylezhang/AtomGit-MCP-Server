import { AtomGitUser, AtomGitRepository, AtomGitTree, AtomGitConfig, CreateRepositoryRequest } from '../types/index.js';
export declare class AtomGitService {
    private client;
    private config;
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
}
//# sourceMappingURL=AtomGitService.d.ts.map