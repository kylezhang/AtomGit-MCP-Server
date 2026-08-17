import { ToolRegistry, deriveToolAnnotations } from '../src/core/ToolRegistry.js';
import { ToolSafetyPolicy } from '../src/core/ToolSafetyPolicy.js';

const makeTool = (name: string) => ({ name, description: 'test tool', inputSchema: { type: 'object' as const } });

const makeInstance = (tools: Array<{ name: string }>) => ({
  getTools: () => tools,
  callTool: jest.fn(async () => ({ ok: true })),
});

describe('ToolRegistry', () => {
  it('registers and looks up a single handler', () => {
    const registry = new ToolRegistry();
    const handler = { tool: makeTool('ping'), execute: async () => 'pong' };
    registry.register('ping', handler);
    expect(registry.has('ping')).toBe(true);
    expect(registry.get('ping')).toBe(handler);
    expect(registry.get('missing')).toBeUndefined();
  });

  it('prefixes names and registers tools from an instance', async () => {
    const registry = new ToolRegistry();
    const instance = makeInstance([{ name: 'get_repository' }]);
    registry.registerTools(instance);

    expect(registry.has('atomgit_get_repository')).toBe(true);
    expect(registry.getAllTools()[0]!.name).toBe('atomgit_get_repository');
    await registry.get('atomgit_get_repository')!.execute({});
    expect(instance.callTool).toHaveBeenCalledWith('get_repository', {});
  });

  it('blocks dangerous tools in safe mode', () => {
    const registry = new ToolRegistry();
    const instance = makeInstance([{ name: 'get_repository' }, { name: 'delete_repository' }]);
    registry.registerTools(instance);

    expect(registry.has('atomgit_get_repository')).toBe(true);
    expect(registry.has('atomgit_delete_repository')).toBe(false);
    expect(registry.isBlocked('atomgit_delete_repository')).toBe(true);
    expect(registry.size).toBe(1);
    expect(registry.blockedSize).toBe(1);
    expect(registry.totalSize).toBe(2);
    expect(registry.getBlockedTools()).toEqual(['atomgit_delete_repository']);
  });

  it('exposes dangerous tools when safe mode is disabled', () => {
    const registry = new ToolRegistry(new ToolSafetyPolicy({ allowDangerousTools: true }));
    const instance = makeInstance([{ name: 'delete_repository' }]);
    registry.registerTools(instance);
    expect(registry.has('atomgit_delete_repository')).toBe(true);
    expect(registry.blockedSize).toBe(0);
  });
});

describe('deriveToolAnnotations', () => {
  it('marks read-only tools with readOnlyHint', () => {
    expect(deriveToolAnnotations('get_repository')).toEqual({ readOnlyHint: true, openWorldHint: false });
    expect(deriveToolAnnotations('search_repositories')).toEqual({ readOnlyHint: true, openWorldHint: false });
    expect(deriveToolAnnotations('query_repository_actions_job_step_logs')).toEqual({ readOnlyHint: true, openWorldHint: false });
  });

  it('marks destructive prefixes with destructiveHint', () => {
    expect(deriveToolAnnotations('delete_repository')).toMatchObject({ readOnlyHint: false, destructiveHint: true });
    expect(deriveToolAnnotations('remove_organization_member')).toMatchObject({ destructiveHint: true });
    expect(deriveToolAnnotations('transfer_repository')).toMatchObject({ destructiveHint: true });
  });

  it('marks idempotent prefixes with idempotentHint', () => {
    expect(deriveToolAnnotations('update_repository')).toMatchObject({ readOnlyHint: false, idempotentHint: true });
    expect(deriveToolAnnotations('replace_repository_pull_request')).toMatchObject({ idempotentHint: true });
  });

  it('keeps mutating tools non-destructive by default and merges explicit annotations', () => {
    const registry = new ToolRegistry();
    const instance = makeInstance([{ name: 'create_repository' }, { name: 'get_repository' }]);
    registry.registerTools(instance);

    const createTool = registry.get('atomgit_create_repository')!.tool;
    expect(createTool.annotations).toMatchObject({ readOnlyHint: false, openWorldHint: false });
    expect(createTool.annotations!.destructiveHint).toBeUndefined();

    const getTool = registry.get('atomgit_get_repository')!.tool;
    expect(getTool.annotations).toEqual({ readOnlyHint: true, openWorldHint: false });
  });
});
