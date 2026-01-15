import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { UserService } from '../services/UserService.js';
export declare class UserTools {
    private userService;
    constructor(userService: UserService);
    getTools(): Tool[];
    callTool(name: string, args: any): Promise<any>;
}
//# sourceMappingURL=UserTools.d.ts.map