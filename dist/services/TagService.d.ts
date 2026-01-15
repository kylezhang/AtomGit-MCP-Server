import { BaseService } from './BaseService.js';
import { Tag } from '../types/index.js';
export declare class TagService extends BaseService {
    getRepositoryTags(owner: string, repo: string, page?: number, perPage?: number): Promise<Tag[]>;
    createRepositoryTag(owner: string, repo: string, tagData: any): Promise<Tag>;
    deleteRepositoryTag(owner: string, repo: string, tagName: string): Promise<void>;
    getRepositoryProtectedTags(owner: string, repo: string): Promise<any[]>;
    createRepositoryProtectedTag(owner: string, repo: string, tagData: any): Promise<any>;
    updateRepositoryProtectedTag(owner: string, repo: string, tagData: any): Promise<any>;
    deleteRepositoryProtectedTag(owner: string, repo: string, tagName: string): Promise<void>;
    getRepositoryProtectedTag(owner: string, repo: string, tagName: string): Promise<any>;
}
//# sourceMappingURL=TagService.d.ts.map