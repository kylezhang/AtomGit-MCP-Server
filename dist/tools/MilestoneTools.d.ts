import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { MilestoneService } from '../services/MilestoneService.js';
export declare class MilestoneTools {
    private milestoneService;
    constructor(milestoneService: MilestoneService);
    getTools(): Tool[];
    callTool(name: string, args: any): Promise<any>;
}
//# sourceMappingURL=MilestoneTools.d.ts.map