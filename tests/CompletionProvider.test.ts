import { CompletionProvider } from '../src/core/CompletionProvider.js';

describe('CompletionProvider', () => {
  const makeUserService = (overrides: Record<string, jest.Mock> = {}) => ({
    getCurrentUser: jest.fn(async () => ({ username: 'alice' })),
    getCurrentUserNamespaces: jest.fn(async () => [
      { path: 'alice' },
      { path: 'team-a' },
    ]),
    ...overrides,
  });

  const makeOrgService = (overrides: Record<string, jest.Mock> = {}) => ({
    getCurrentUserOrganizations: jest.fn(async () => [{ path: 'team-a' }, { path: 'team-b' }]),
    ...overrides,
  });

  const resourceRef = (uri: string) => ({ type: 'ref/resource' as const, uri });
  const promptRef = (name: string) => ({ type: 'ref/prompt' as const, name });

  it('completes owner from current user, orgs and namespaces (deduplicated)', async () => {
    const provider = new CompletionProvider(makeUserService() as any, makeOrgService() as any);
    const result = await provider.complete({
      ref: resourceRef('atomgit://{owner}/{repo}'),
      argument: { name: 'owner', value: '' },
    } as any);

    expect(result.values).toEqual(['alice', 'team-a', 'team-b']);
    expect(result.total).toBe(3);
  });

  it('filters owner candidates by prefix', async () => {
    const provider = new CompletionProvider(makeUserService() as any, makeOrgService() as any);
    const result = await provider.complete({
      ref: resourceRef('atomgit://{owner}/{repo}'),
      argument: { name: 'owner', value: 'team' },
    } as any);

    expect(result.values).toEqual(['team-a', 'team-b']);
  });

  it('completes repo from the current user repositories filtered by prefix', async () => {
    const userService = makeUserService({
      getCurrentUserRepos: jest.fn(async () => [
        { name: 'alpha-repo' },
        { name: 'beta-repo' },
        { name: 'alpha-docs' },
      ]),
    });
    const provider = new CompletionProvider(userService as any, makeOrgService() as any);

    const result = await provider.complete({
      ref: resourceRef('atomgit://{owner}/{repo}'),
      argument: { name: 'repo', value: 'alpha' },
    } as any);

    expect(result.values).toEqual(['alpha-repo', 'alpha-docs']);
  });

  it('returns empty values for prompt refs', async () => {
    const provider = new CompletionProvider(makeUserService() as any, makeOrgService() as any);
    const result = await provider.complete({
      ref: promptRef('create-issue'),
      argument: { name: 'title', value: '' },
    } as any);

    expect(result).toEqual({ values: [] });
  });

  it('returns empty values for unknown argument names', async () => {
    const provider = new CompletionProvider(makeUserService() as any, makeOrgService() as any);
    const result = await provider.complete({
      ref: resourceRef('atomgit://{owner}/{repo}'),
      argument: { name: 'unknown', value: 'x' },
    } as any);

    expect(result).toEqual({ values: [] });
  });

  it('degrades to empty values when services throw (never propagates)', async () => {
    const userService = makeUserService({
      getCurrentUser: jest.fn(async () => {
        throw new Error('network down');
      }),
      getCurrentUserNamespaces: jest.fn(async () => {
        throw new Error('network down');
      }),
      getCurrentUserRepos: jest.fn(async () => {
        throw new Error('network down');
      }),
    });
    const orgService = makeOrgService({
      getCurrentUserOrganizations: jest.fn(async () => {
        throw new Error('network down');
      }),
    });
    const provider = new CompletionProvider(userService as any, orgService as any);

    const ownerResult = await provider.complete({
      ref: resourceRef('atomgit://{owner}/{repo}'),
      argument: { name: 'owner', value: '' },
    } as any);
    expect(ownerResult.values).toEqual([]);

    const repoResult = await provider.complete({
      ref: resourceRef('atomgit://{owner}/{repo}'),
      argument: { name: 'repo', value: '' },
    } as any);
    expect(repoResult.values).toEqual([]);
  });
});
