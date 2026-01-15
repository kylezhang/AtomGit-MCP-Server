import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { LabelsService } from '../services/LabelsService.js';
export declare class LabelsTools {
    private labelsService;
    constructor(labelsService: LabelsService);
    getTools(): Tool[];
    callTool(name: string, args: any): Promise<any>;
}
//# sourceMappingURL=LabelsTools.d.ts.map