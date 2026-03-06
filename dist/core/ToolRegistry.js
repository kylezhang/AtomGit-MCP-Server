/**
 * ToolRegistry - O(1) lookup for tool routing
 *
 * Replaces manual if-else routing with Map-based registry.
 * Each tool is registered by name for fast access.
 */
export class ToolRegistry {
    handlers = new Map();
    /**
     * Register a tool with its execution handler
     */
    register(name, handler) {
        this.handlers.set(name, handler);
    }
    /**
     * Register all tools from a tool class instance
     */
    registerTools(toolsInstance) {
        const tools = toolsInstance.getTools();
        for (const tool of tools) {
            // Add 'atomgit:' prefix to all tool names
            const prefixedName = `atomgit:${tool.name}`;
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
    get(name) {
        return this.handlers.get(name);
    }
    /**
     * Get all registered tools
     */
    getAllTools() {
        return Array.from(this.handlers.values()).map((h) => h.tool);
    }
    /**
     * Check if tool exists
     */
    has(name) {
        return this.handlers.has(name);
    }
    /**
     * Get total tool count
     */
    get size() {
        return this.handlers.size;
    }
}
//# sourceMappingURL=ToolRegistry.js.map