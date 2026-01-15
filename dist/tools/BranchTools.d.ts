import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { BranchService } from '../services/BranchService.js';
export declare class BranchTools {
    private branchService;
    constructor(branchService: BranchService);
    getTools(): Tool[];
    callTool(name: string, args: any): Promise<any>;
}
//# sourceMappingURL=BranchTools.d.ts.map