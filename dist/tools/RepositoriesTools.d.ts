import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { RepositoriesService } from '../services/RepositoriesService.js';
export declare class RepositoriesTools {
    private service;
    constructor(service: RepositoriesService);
    getTools(): Tool[];
    callTool(name: string, args: any): Promise<any>;
}
//# sourceMappingURL=RepositoriesTools.d.ts.map