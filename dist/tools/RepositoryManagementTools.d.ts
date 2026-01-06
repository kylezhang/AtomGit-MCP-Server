import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { AtomGitService } from '../services/AtomGitService.js';
export declare class RepositoryManagementTools {
    private atomGitService;
    constructor(atomGitService: AtomGitService);
    getTools(): Tool[];
    callTool(name: string, args: any): Promise<any>;
}
//# sourceMappingURL=RepositoryManagementTools.d.ts.map