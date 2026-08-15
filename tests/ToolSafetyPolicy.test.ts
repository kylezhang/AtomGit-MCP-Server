import { ToolSafetyPolicy } from '../src/core/ToolSafetyPolicy.js';

describe('ToolSafetyPolicy', () => {
  it('prefixes public tool names with atomgit_', () => {
    const policy = new ToolSafetyPolicy();
    expect(policy.toPublicToolName('get_repository')).toBe('atomgit_get_repository');
  });

  it('detects dangerous internal names by prefix', () => {
    const policy = new ToolSafetyPolicy();
    expect(policy.isDangerousInternalName('delete_repository')).toBe(true);
    expect(policy.isDangerousInternalName('remove_member')).toBe(true);
    expect(policy.isDangerousInternalName('leave_org')).toBe(true);
    expect(policy.isDangerousInternalName('archive_repo')).toBe(true);
    expect(policy.isDangerousInternalName('transfer_repo')).toBe(true);
    expect(policy.isDangerousInternalName('get_repository')).toBe(false);
  });

  it('only treats atomgit_-prefixed public names as dangerous', () => {
    const policy = new ToolSafetyPolicy();
    expect(policy.isDangerousPublicName('atomgit_delete_repository')).toBe(true);
    expect(policy.isDangerousPublicName('delete_repository')).toBe(false);
    expect(policy.isDangerousPublicName('atomgit_get_repository')).toBe(false);
  });

  it('filters dangerous tools in safe mode by default', () => {
    const policy = new ToolSafetyPolicy();
    expect(policy.shouldRegisterInternalName('get_repository')).toBe(true);
    expect(policy.shouldRegisterInternalName('delete_repository')).toBe(false);
  });

  it('registers dangerous tools when allowDangerousTools is set', () => {
    const policy = new ToolSafetyPolicy({ allowDangerousTools: true });
    expect(policy.shouldRegisterInternalName('delete_repository')).toBe(true);
  });

  it('honors allowlist and denylist', () => {
    const allowed = new ToolSafetyPolicy({ dangerousToolAllowlist: ['delete_keep'] });
    expect(allowed.isDangerousInternalName('delete_keep')).toBe(false);

    const denied = new ToolSafetyPolicy({ dangerousToolDenylist: ['get_secret'] });
    expect(denied.isDangerousInternalName('get_secret')).toBe(true);
  });

  it('produces a clear blocked message mentioning the env var', () => {
    const policy = new ToolSafetyPolicy();
    const message = policy.getBlockedToolMessage('atomgit_delete_repository');
    expect(message).toContain('ATOMGIT_ENABLE_DANGEROUS_TOOLS=true');
  });
});
