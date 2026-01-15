import { BaseService } from './BaseService.js';
export declare class MemberService extends BaseService {
    addRepositoryCollaborator(owner: string, repo: string, username: string, collaboratorData: any): Promise<any>;
    removeRepositoryCollaborator(owner: string, repo: string, username: string): Promise<void>;
    isRepositoryCollaborator(owner: string, repo: string, username: string): Promise<any>;
    getRepositoryCollaborators(owner: string, repo: string): Promise<any[]>;
    getRepositoryCollaboratorPermission(owner: string, repo: string, username: string): Promise<any>;
    getRepositoryCollaboratorSelfPermission(owner: string, repo: string): Promise<any>;
}
//# sourceMappingURL=MemberService.d.ts.map