import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { PullRequestService } from '../services/PullRequestService.js';
export declare class PullRequestTools {
    private pullRequestService;
    constructor(pullRequestService: PullRequestService);
    getTools(): Tool[];
    callTool(name: string, args: any): Promise<any>;
}
//# sourceMappingURL=PullRequestTools.d.ts.map