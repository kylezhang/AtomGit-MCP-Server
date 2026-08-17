import { Tool, ToolAnnotations } from '@modelcontextprotocol/sdk/types.js';
import { ToolSafetyPolicy, DANGEROUS_TOOL_PREFIXES } from './ToolSafetyPolicy.js';

/**
 * Tool handler interface for registry lookup
 */
export interface ToolHandler {
  tool: Tool;
  execute: (args: any) => Promise<any>;
}

/** Internal tool prefixes that only read state and never mutate it. */
const READONLY_TOOL_PREFIXES = [
  'get_',
  'query_',
  'search_',
  'compare_',
  'validate_',
  'download_',
  'check_',
] as const;

/** Internal tool prefixes that perform idempotent (PUT-style) updates. */
const IDEMPOTENT_TOOL_PREFIXES = [
  'update_',
  'replace_',
  'set_',
] as const;

/**
 * Derive MCP Tool annotations from the internal tool name so clients can tell
 * read-only from destructive or idempotent tools without parsing descriptions.
 * Kept conservative: anything not clearly read-only is treated as a mutation,
 * and destructive prefixes (shared with ToolSafetyPolicy) are flagged as such.
 */
export function deriveToolAnnotations(name: string): ToolAnnotations {
  const readOnly = READONLY_TOOL_PREFIXES.some((prefix) => name.startsWith(prefix));

  if (readOnly) {
    return { readOnlyHint: true, openWorldHint: false };
  }

  const destructive = DANGEROUS_TOOL_PREFIXES.some((prefix) => name.startsWith(prefix));
  const idempotent = IDEMPOTENT_TOOL_PREFIXES.some((prefix) => name.startsWith(prefix));

  return {
    readOnlyHint: false,
    destructiveHint: destructive || undefined,
    idempotentHint: idempotent || undefined,
    openWorldHint: false,
  };
}

/**
 * ToolRegistry - O(1) lookup for tool routing
 *
 * Replaces manual if-else routing with Map-based registry.
 * Each tool is registered by name for fast access.
 */
export class ToolRegistry {
  private readonly safetyPolicy: ToolSafetyPolicy;
  private handlers: Map<string, ToolHandler> = new Map();
  private blockedTools: Set<string> = new Set();

  constructor(safetyPolicy = new ToolSafetyPolicy()) {
    this.safetyPolicy = safetyPolicy;
  }

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
      const prefixedName = this.safetyPolicy.toPublicToolName(tool.name);

      if (!this.safetyPolicy.shouldRegisterInternalName(tool.name)) {
        this.blockedTools.add(prefixedName);
        continue;
      }

      const prefixedTool = {
        ...tool,
        name: prefixedName,
        annotations: { ...deriveToolAnnotations(tool.name), ...tool.annotations },
      };
      
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
   * Check if tool is blocked by safety policy
   */
  isBlocked(name: string): boolean {
    return this.blockedTools.has(name);
  }

  /**
   * Get all blocked tool names
   */
  getBlockedTools(): string[] {
    return Array.from(this.blockedTools.values());
  }

  /**
   * Get total tool count
   */
  get size(): number {
    return this.handlers.size;
  }

  /**
   * Get blocked tool count
   */
  get blockedSize(): number {
    return this.blockedTools.size;
  }

  /**
   * Get total tool count including blocked tools
   */
  get totalSize(): number {
    return this.size + this.blockedSize;
  }
}
