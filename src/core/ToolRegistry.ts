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
export class ToolRegistry {
  private handlers: Map<string, ToolHandler> = new Map();

  /**
   * Register a tool with its execution handler
   */
  register(name: string, handler: ToolHandler): void {
    this.handlers.set(name, handler);
  }

  /**
   * Register all tools from a tool class instance
   */
  registerTools(toolsInstance: any): void {
    const tools = toolsInstance.getTools();
    for (const tool of tools) {
      // Add 'atomgit_' prefix to all tool names
      const prefixedName = `atomgit_${tool.name}`;
      const prefixedTool = { ...tool, name: prefixedName };
      
      this.register(prefixedName, {
        tool: prefixedTool,
        execute: (args) => toolsInstance.callTool(tool.name, args),
      });
    }
  }

  /**
   * Get tool handler by name (O(1) lookup)
   */
  get(name: string): ToolHandler | undefined {
    return this.handlers.get(name);
  }

  /**
   * Get all registered tools
   */
  getAllTools(): Tool[] {
    return Array.from(this.handlers.values()).map((h) => h.tool);
  }

  /**
   * Check if tool exists
   */
  has(name: string): boolean {
    return this.handlers.has(name);
  }

  /**
   * Get total tool count
   */
  get size(): number {
    return this.handlers.size;
  }
}
