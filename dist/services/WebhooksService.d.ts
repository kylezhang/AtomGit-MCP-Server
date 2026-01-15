import { BaseService } from './BaseService.js';
export declare class WebhooksService extends BaseService {
    getRepositoryWebhooks(owner: string, repo: string): Promise<any[]>;
    createRepositoryWebhook(owner: string, repo: string, webhookData: any): Promise<any>;
    getRepositoryWebhook(owner: string, repo: string, id: number): Promise<any>;
    updateRepositoryWebhook(owner: string, repo: string, id: number, webhookData: any): Promise<any>;
    deleteRepositoryWebhook(owner: string, repo: string, id: number): Promise<void>;
    testRepositoryWebhook(owner: string, repo: string, id: number): Promise<any>;
}
//# sourceMappingURL=WebhooksService.d.ts.map