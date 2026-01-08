import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { AtomGitService } from '../services/AtomGitService.js';
export declare class RepositorySettingsTools {
    private atomGitService;
    constructor(atomGitService: AtomGitService);
    getTools(): Tool[];
    callTool(name: string, args: any): Promise<any>;
}
//# sourceMappingURL=RepositorySettingsTools.d.ts.map