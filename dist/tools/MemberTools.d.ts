import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { MemberService } from '../services/MemberService.js';
export declare class MemberTools {
    private memberService;
    constructor(memberService: MemberService);
    getTools(): Tool[];
    callTool(name: string, args: any): Promise<any>;
}
//# sourceMappingURL=MemberTools.d.ts.map