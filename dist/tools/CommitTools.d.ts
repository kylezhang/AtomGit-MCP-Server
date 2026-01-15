import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { CommitService } from '../services/CommitService.js';
export declare class CommitTools {
    private commitService;
    constructor(commitService: CommitService);
    getTools(): Tool[];
    callTool(name: string, args: any): Promise<any>;
}
//# sourceMappingURL=CommitTools.d.ts.map