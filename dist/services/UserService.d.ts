import { BaseService } from './BaseService.js';
import { AtomGitRepository, AtomGitUser } from '../types/index.js';
export declare class UserService extends BaseService {
    getUserStarredRepos(username: string, page?: number, perPage?: number): Promise<AtomGitRepository[]>;
    getUser(username: string): Promise<AtomGitUser>;
    getCurrentUser(): Promise<AtomGitUser>;
    getUserRepos(username: string, page?: number, perPage?: number): Promise<any[]>;
    getCurrentUserStarredRepos(page?: number, perPage?: number): Promise<any[]>;
    searchUsers(query: string, page?: number, perPage?: number): Promise<any[]>;
    getUserSubscriptions(username: string, page?: number, perPage?: number): Promise<any[]>;
    getCurrentUserSubscriptions(page?: number, perPage?: number): Promise<any[]>;
    getCurrentUserNamespaces(page?: number, perPage?: number): Promise<any[]>;
    getRepositoryNotifications(owner: string, repo: string, page?: number, perPage?: number): Promise<any[]>;
    markRepositoryNotificationsRead(owner: string, repo: string): Promise<any>;
    createUserRepository(repoData: any): Promise<any>;
    updateCurrentUser(userData: any): Promise<any>;
    getCurrentUserEmails(): Promise<any[]>;
    getUserEvents(username: string, page?: number, perPage?: number): Promise<any[]>;
    addUserKey(keyData: any): Promise<any>;
    getCurrentUserKeys(page?: number, perPage?: number): Promise<any[]>;
    deleteUserKey(keyId: number): Promise<any>;
    getUserKey(keyId: number): Promise<any>;
    getCurrentUserNamespace(): Promise<any>;
    getCurrentUserPullRequests(page?: number, perPage?: number): Promise<any[]>;
}
//# sourceMappingURL=UserService.d.ts.map