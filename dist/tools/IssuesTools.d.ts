import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { IssuesService } from '../services/IssuesService.js';
export declare class IssuesTools {
    private issuesService;
    constructor(issuesService: IssuesService);
    getTools(): Tool[];
    callTool(name: string, args: any): Promise<any>;
}
//# sourceMappingURL=IssuesTools.d.ts.map