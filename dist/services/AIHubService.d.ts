import { BaseService } from './BaseService.js';
import { AtomGitConfig } from '../types/index.js';
export declare class AIHubService extends BaseService {
    constructor(config: AtomGitConfig);
    chatCompletion(data: any): Promise<any>;
    similarity(data: any): Promise<any>;
    audioTranscription(data: any): Promise<any>;
    detectYolo(data: any): Promise<any>;
    videoGenerate(data: any): Promise<any>;
    videoStatus(data: any): Promise<any>;
    audioClassification(data: any): Promise<any>;
}
//# sourceMappingURL=AIHubService.d.ts.map