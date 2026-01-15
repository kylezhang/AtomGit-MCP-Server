import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { OrganizationService } from '../services/OrganizationService.js';
export declare class OrganizationTools {
    private organizationService;
    constructor(organizationService: OrganizationService);
    getTools(): Tool[];
    callTool(name: string, args: any): Promise<any>;
}
//# sourceMappingURL=OrganizationTools.d.ts.map