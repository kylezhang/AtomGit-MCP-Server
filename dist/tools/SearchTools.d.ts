import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { SearchService } from '../services/SearchService.js';
export declare class SearchTools {
    private searchService;
    constructor(searchService: SearchService);
    getTools(): Tool[];
    callTool(name: string, args: any): Promise<any>;
}
//# sourceMappingURL=SearchTools.d.ts.map