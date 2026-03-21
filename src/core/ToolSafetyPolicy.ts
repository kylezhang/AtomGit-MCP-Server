export const PUBLIC_TOOL_PREFIX = 'atomgit_';

export const DANGEROUS_TOOL_PREFIXES = [
  'delete_',
  'remove_',
  'leave_',
  'archive_',
  'transfer_',
] as const;

export interface ToolSafetyPolicyOptions {
  allowDangerousTools?: boolean;
  dangerousToolAllowlist?: Iterable<string>;
  dangerousToolDenylist?: Iterable<string>;
}

export class ToolSafetyPolicy {
  private readonly allowDangerousTools: boolean;
  private readonly dangerousToolAllowlist: Set<string>;
  private readonly dangerousToolDenylist: Set<string>;

  constructor(options: ToolSafetyPolicyOptions = {}) {
    this.allowDangerousTools = options.allowDangerousTools ?? false;
    this.dangerousToolAllowlist = new Set(options.dangerousToolAllowlist ?? []);
    this.dangerousToolDenylist = new Set(options.dangerousToolDenylist ?? []);
  }

  toPublicToolName(internalName: string): string {
    return `${PUBLIC_TOOL_PREFIX}${internalName}`;
  }

  isDangerousInternalName(name: string): boolean {
    if (this.dangerousToolAllowlist.has(name)) {
      return false;
    }

    if (this.dangerousToolDenylist.has(name)) {
      return true;
    }

    return DANGEROUS_TOOL_PREFIXES.some((prefix) => name.startsWith(prefix));
  }

  isDangerousPublicName(name: string): boolean {
    if (!name.startsWith(PUBLIC_TOOL_PREFIX)) {
      return false;
    }

    return this.isDangerousInternalName(name.slice(PUBLIC_TOOL_PREFIX.length));
  }

  shouldRegisterInternalName(name: string): boolean {
    return this.allowDangerousTools || !this.isDangerousInternalName(name);
  }

  getBlockedToolMessage(name: string): string {
    return `Tool "${name}" is disabled by safe mode. Set ATOMGIT_ENABLE_DANGEROUS_TOOLS=true and restart the server to enable dangerous tools.`;
  }
}
