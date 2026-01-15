import { BaseService } from './BaseService.js';
import { CreateReleaseRequest, Release } from '../types/index.js';
export declare class ReleaseService extends BaseService {
    createRelease(owner: string, repo: string, releaseData: CreateReleaseRequest): Promise<Release>;
    updateRelease(owner: string, repo: string, tag: string, releaseData: any): Promise<Release>;
    getReleaseUploadUrl(owner: string, repo: string, tag: string): Promise<any>;
    getRelease(owner: string, repo: string, tag: string): Promise<Release>;
    getLatestRelease(owner: string, repo: string): Promise<Release>;
    getReleaseByTag(owner: string, repo: string, tag: string): Promise<Release>;
    getReleases(owner: string, repo: string, page?: number, perPage?: number): Promise<Release[]>;
    downloadReleaseAsset(owner: string, repo: string, fileName: string): Promise<any>;
}
//# sourceMappingURL=ReleaseService.d.ts.map