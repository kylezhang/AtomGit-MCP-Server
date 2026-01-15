import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { DashboardService } from '../services/DashboardService.js';
export declare class DashboardTools {
    private dashboardService;
    constructor(dashboardService: DashboardService);
    getTools(): Tool[];
    callTool(name: string, args: any): Promise<any>;
}
//# sourceMappingURL=DashboardTools.d.ts.map