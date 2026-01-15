import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { EnterpriseService } from '../services/EnterpriseService.js';
export declare class EnterpriseTools {
    private enterpriseService;
    constructor(enterpriseService: EnterpriseService);
    getTools(): Tool[];
    callTool(name: string, args: any): Promise<any>;
}
//# sourceMappingURL=EnterpriseTools.d.ts.map