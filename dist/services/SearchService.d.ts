import { BaseService } from './BaseService.js';
export declare class SearchService extends BaseService {
    searchUsers(query: string, page?: number, perPage?: number): Promise<any[]>;
    searchIssues(query: string, page?: number, perPage?: number): Promise<any[]>;
    searchRepositories(query: string, page?: number, perPage?: number): Promise<any[]>;
}
//# sourceMappingURL=SearchService.d.ts.map