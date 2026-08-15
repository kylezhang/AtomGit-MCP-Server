import { ToolRegistry } from '../src/core/ToolRegistry.js';
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
