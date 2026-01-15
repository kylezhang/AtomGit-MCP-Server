import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { AIHubService } from '../services/AIHubService.js';
export declare class AIHubTools {
    private aiHubService;
    constructor(aiHubService: AIHubService);
    getTools(): Tool[];
    callTool(name: string, args: any): Promise<any>;
}
//# sourceMappingURL=AIHubTools.d.ts.map