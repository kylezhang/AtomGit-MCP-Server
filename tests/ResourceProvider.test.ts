import { ResourceProvider } from '../src/core/ResourceProvider.js';

type AnyFn = jest.Mock;

function makeServiceMocks() {
  const reposService = {
    getRepository: jest.fn(async () => ({ full_name: 'a/b', stargazers_count: 3 })),
    getRepositoryContent: jest.fn(async () => ({ content: Buffer.from('hello file').toString('base64') })),
  };
  const issuesService = {
    getRepositoryIssue: jest.fn(async () => ({ number: 1, title: 'issue 1' })),
  };
  const pullRequestService = {
    getRepositoryPull: jest.fn(async () => ({ number: 2, title: 'pr 2' })),
  };
  const commitService = {
    getRepositoryCommit: jest.fn(async () => ({ sha: 'abc123' })),
  };
  const userService = {
    getCurrentUser: jest.fn(async () => ({ username: 'tester' })),
  };

  return { reposService, issuesService, pullRequestService, commitService, userService };
}

describe('ResourceProvider', () => {
  it('lists the current user resource', () => {
    const { userService } = makeServiceMocks();
    const provider = new ResourceProvider({} as any, {} as any, {} as any, {} as any, userService as any);
    const resources = provider.listResources();
    expect(resources).toHaveLength(1);
    expect(resources[0]!.uri).toBe('atomgit://user');
    expect(resources[0]!.mimeType).toBe('application/json');
  });

  it('lists all resource templates', () => {
    const provider = new ResourceProvider({} as any, {} as any, {} as any, {} as any, {} as any);
    const templates = provider.listResourceTemplates();
    expect(templates.map((t) => t.uriTemplate)).toEqual([
      'atomgit://{owner}/{repo}',
      'atomgit://{owner}/{repo}/readme',
      'atomgit://{owner}/{repo}/file/{path}',
      'atomgit://{owner}/{repo}/commit/{sha}',
      'atomgit://{owner}/{repo}/issue/{number}',
      'atomgit://{owner}/{repo}/pull/{number}',
    ]);
  });

  it('reads the current user resource', async () => {
    const { userService } = makeServiceMocks();
    const provider = new ResourceProvider({} as any, {} as any, {} as any, {} as any, userService as any);
    const content = await provider.readResource('atomgit://user');
    expect(userService.getCurrentUser as AnyFn).toHaveBeenCalledTimes(1);
    expect(JSON.parse(content.text)).toEqual({ username: 'tester' });
  });

  it('reads repository info', async () => {
    const { reposService } = makeServiceMocks();
    const provider = new ResourceProvider(reposService as any, {} as any, {} as any, {} as any, {} as any);
    const content = await provider.readResource('atomgit://a/b');
    expect(reposService.getRepository as AnyFn).toHaveBeenCalledWith('a', 'b');
    expect(JSON.parse(content.text)).toMatchObject({ full_name: 'a/b' });
  });

  it('decodes base64 README content as markdown', async () => {
    const { reposService } = makeServiceMocks();
    const provider = new ResourceProvider(reposService as any, {} as any, {} as any, {} as any, {} as any);
    const content = await provider.readResource('atomgit://a/b/readme');
    expect(reposService.getRepositoryContent as AnyFn).toHaveBeenCalledWith('a', 'b', 'README.md');
    expect(content.mimeType).toBe('text/markdown');
    expect(content.text).toBe('hello file');
  });

  it('reads a nested file path', async () => {
    const { reposService } = makeServiceMocks();
    const provider = new ResourceProvider(reposService as any, {} as any, {} as any, {} as any, {} as any);
    await provider.readResource('atomgit://a/b/file/src/index.ts');
    expect(reposService.getRepositoryContent as AnyFn).toHaveBeenCalledWith('a', 'b', 'src/index.ts');
  });

  it('reads commit details', async () => {
    const { commitService } = makeServiceMocks();
    const provider = new ResourceProvider({} as any, {} as any, {} as any, commitService as any, {} as any);
    const content = await provider.readResource('atomgit://a/b/commit/abc123');
    expect(commitService.getRepositoryCommit as AnyFn).toHaveBeenCalledWith('a', 'b', 'abc123');
    expect(JSON.parse(content.text)).toMatchObject({ sha: 'abc123' });
  });

  it('reads issue details', async () => {
    const { issuesService } = makeServiceMocks();
    const provider = new ResourceProvider({} as any, issuesService as any, {} as any, {} as any, {} as any);
    const content = await provider.readResource('atomgit://a/b/issue/1');
    expect(issuesService.getRepositoryIssue as AnyFn).toHaveBeenCalledWith('a', 'b', '1');
    expect(JSON.parse(content.text)).toMatchObject({ number: 1 });
  });

  it('reads pull request details with a numeric identifier', async () => {
    const { pullRequestService } = makeServiceMocks();
    const provider = new ResourceProvider({} as any, {} as any, pullRequestService as any, {} as any, {} as any);
    const content = await provider.readResource('atomgit://a/b/pull/2');
    expect(pullRequestService.getRepositoryPull as AnyFn).toHaveBeenCalledWith('a', 'b', 2);
    expect(JSON.parse(content.text)).toMatchObject({ number: 2 });
  });

  it('throws on unknown URIs', async () => {
    const provider = new ResourceProvider({} as any, {} as any, {} as any, {} as any, {} as any);
    await expect(provider.readResource('atomgit://a/b/unknown/thing')).rejects.toThrow('Unknown resource type');
    await expect(provider.readResource('other://x')).rejects.toThrow('Unknown resource URI');
  });

  it('throws when owner/repo/path are missing', async () => {
    const provider = new ResourceProvider({} as any, {} as any, {} as any, {} as any, {} as any);
    await expect(provider.readResource('atomgit://file')).rejects.toThrow(/Missing|Unknown/);
  });
});
