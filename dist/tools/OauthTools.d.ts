import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { OauthService } from '../services/OauthService.js';
export declare class OauthTools {
    private oauthService;
    constructor(oauthService: OauthService);
    getTools(): Tool[];
    callTool(name: string, args: any): Promise<any>;
}
//# sourceMappingURL=OauthTools.d.ts.map