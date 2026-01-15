import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { TagService } from '../services/TagService.js';
export declare class TagTools {
    private tagService;
    constructor(tagService: TagService);
    getTools(): Tool[];
    callTool(name: string, args: any): Promise<any>;
}
//# sourceMappingURL=TagTools.d.ts.map