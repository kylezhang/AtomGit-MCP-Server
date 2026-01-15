import { Tool } from '@modelcontextprotocol/sdk/types.js';
/**
 * Tool handler interface for registry lookup
 */
export interface ToolHandler {
    tool: Tool;
    execute: (args: any) => Promise<any>;
}
/**
 * ToolRegistry - O(1) lookup for tool routing
 *
 * Replaces manual if-else routing with Map-based registry.
 * Each tool is registered by name for fast access.
 */
export declare class ToolRegistry {
    private handlers;
    /**
     * Register a tool with its execution handler
     */
    register(name: string, handler: ToolHandler): void;
    /**
     * Register all tools from a tool class instance
     */
    registerTools(toolsInstance: any): void;
    /**
     * Get tool handler by name (O(1) lookup)
     */
    get(name: string): ToolHandler | undefined;
    /**
     * Get all registered tools
     */
    getAllTools(): Tool[];
    /**
     * Check if tool exists
     */
    has(name: string): boolean;
    /**
     * Get total tool count
     */
    get size(): number;
}
//# sourceMappingURL=ToolRegistry.d.ts.map