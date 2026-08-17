import { PromptProvider } from '../src/core/PromptProvider.js';

describe('PromptProvider', () => {
  it('lists all built-in prompts', () => {
    const provider = new PromptProvider();
    const prompts = provider.listPrompts();
    expect(prompts.map((p) => p.name)).toEqual([
      'create-repository',
      'create-issue',
      'create-pull-request',
      'review-code',
      'setup-ci',
      'manage-collaborators',
      'search-code',
      'manage-issues',
      'release',
      'triage-issues',
      'sync-fork',
    ]);
  });

  it('builds a create-issue prompt with arguments', () => {
    const provider = new PromptProvider();
    const result = provider.getPrompt('create-issue', { owner: 'a', repo: 'b', title: 'hello', labels: 'bug' });
    expect(result.messages[0]!.content.text).toContain('create a new issue in repository a/b');
    expect(result.messages[0]!.content.text).toContain('- title: hello');
    expect(result.messages[0]!.content.text).toContain('- labels: bug');
  });

  it('does not repeat owner/repo/action/query as argument lines', () => {
    const provider = new PromptProvider();
    const result = provider.getPrompt('manage-collaborators', {
      owner: 'a',
      repo: 'b',
      action: 'add',
      username: 'tester',
    });
    const text = result.messages[0]!.content.text;
    expect(text).toContain('- username: tester');
    expect(text).not.toContain('- owner:');
    expect(text).not.toContain('- repo:');
    expect(text).not.toContain('- action:');
  });

  it('builds a search-code prompt', () => {
    const provider = new PromptProvider();
    const result = provider.getPrompt('search-code', { query: 'mcp server', type: 'repositories' });
    expect(result.messages[0]!.content.text).toContain('Search for "mcp server" across AtomGit.');
    expect(result.messages[0]!.content.text).toContain('- type: repositories');
  });

  it('builds a review-code prompt', () => {
    const provider = new PromptProvider();
    const result = provider.getPrompt('review-code', { owner: 'a', repo: 'b', number: '42' });
    expect(result.messages[0]!.content.text).toContain('I want to review code in a/b.');
    expect(result.messages[0]!.content.text).toContain('- number: 42');
  });

  it('builds a release prompt', () => {
    const provider = new PromptProvider();
    const result = provider.getPrompt('release', { owner: 'a', repo: 'b', tagName: 'v1.0.0', body: 'notes' });
    expect(result.messages[0]!.content.text).toContain('create tag v1.0.0 and publish a release for a/b');
    expect(result.messages[0]!.content.text).toContain('- body: notes');
  });

  it('builds a triage-issues prompt', () => {
    const provider = new PromptProvider();
    const result = provider.getPrompt('triage-issues', { owner: 'a', repo: 'b', labels: 'bug' });
    expect(result.messages[0]!.content.text).toContain('triage the open issues for a/b');
    expect(result.messages[0]!.content.text).toContain('- labels: bug');
  });

  it('builds a sync-fork prompt', () => {
    const provider = new PromptProvider();
    const result = provider.getPrompt('sync-fork', { owner: 'a', repo: 'b', upstream: 'u/v' });
    expect(result.messages[0]!.content.text).toContain('sync the fork a/b with upstream u/v');
  });

  it('throws for unknown prompt names', () => {
    const provider = new PromptProvider();
    expect(() => provider.getPrompt('nope', {})).toThrow('Unknown prompt: nope');
  });

  it('requires arguments listed on the definition', () => {
    const provider = new PromptProvider();
    const def = provider.listPrompts().find((p) => p.name === 'create-issue')!;
    const title = def.arguments!.find((a) => a.name === 'title');
    expect(title!.required).toBe(true);
    expect(def.arguments!.find((a) => a.name === 'body')!.required).toBeFalsy();
  });
});
