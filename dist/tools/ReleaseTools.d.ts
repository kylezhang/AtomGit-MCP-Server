import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ReleaseService } from '../services/ReleaseService.js';
export declare class ReleaseTools {
    private releaseService;
    constructor(releaseService: ReleaseService);
    getTools(): Tool[];
    callTool(name: string, args: any): Promise<any>;
}
//# sourceMappingURL=ReleaseTools.d.ts.map