import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { WebhooksService } from '../services/WebhooksService.js';
export declare class WebhooksTools {
    private webhooksService;
    constructor(webhooksService: WebhooksService);
    getTools(): Tool[];
    callTool(name: string, args: any): Promise<any>;
}
//# sourceMappingURL=WebhooksTools.d.ts.map