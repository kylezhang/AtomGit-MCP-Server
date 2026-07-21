export interface PromptDefinition {
  name: string;
  description: string;
  arguments?: Array<{
    name: string;
    description: string;
    required?: boolean;
  }>;
}

export interface PromptResult {
  description?: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: { type: 'text'; text: string };
  }>;
}

export class PromptProvider {
  private prompts: Map<string, PromptDefinition>;

  constructor() {
    this.prompts = new Map([
      ['create-repository', {
        name: 'create-repository',
        description: 'Create a new repository on AtomGit',
        arguments: [
          { name: 'name', description: 'Repository name', required: true },
          { name: 'description', description: 'Repository description' },
          { name: 'private', description: 'Whether the repository is private (true/false)' },
          { name: 'autoInit', description: 'Auto-initialize with README (true/false)' },
          { name: 'gitignoreTemplate', description: 'Gitignore template language' },
          { name: 'licenseTemplate', description: 'License template' },
        ],
      }],
      ['create-issue', {
        name: 'create-issue',
        description: 'Create a new issue in a repository',
        arguments: [
          { name: 'owner', description: 'Repository owner', required: true },
          { name: 'repo', description: 'Repository name', required: true },
          { name: 'title', description: 'Issue title', required: true },
          { name: 'body', description: 'Issue description/body' },
          { name: 'labels', description: 'Comma-separated label names' },
          { name: 'assignee', description: 'Assignee username' },
        ],
      }],
      ['create-pull-request', {
        name: 'create-pull-request',
        description: 'Create a new pull request',
        arguments: [
          { name: 'owner', description: 'Repository owner', required: true },
          { name: 'repo', description: 'Repository name', required: true },
          { name: 'title', description: 'Pull request title', required: true },
          { name: 'head', description: 'Source branch name', required: true },
          { name: 'base', description: 'Target branch name', required: true },
          { name: 'body', description: 'Pull request description' },
          { name: 'draft', description: 'Whether to create as draft (true/false)' },
        ],
      }],
      ['review-code', {
        name: 'review-code',
        description: 'Review code in a pull request or commit',
        arguments: [
          { name: 'owner', description: 'Repository owner', required: true },
          { name: 'repo', description: 'Repository name', required: true },
          { name: 'number', description: 'Pull request number (for PR review)' },
          { name: 'sha', description: 'Commit SHA (for commit review)' },
        ],
      }],
      ['setup-ci', {
        name: 'setup-ci',
        description: 'Set up CI/CD pipeline for a repository',
        arguments: [
          { name: 'owner', description: 'Repository owner', required: true },
          { name: 'repo', description: 'Repository name', required: true },
          { name: 'workflowName', description: 'Workflow name (e.g., build, test, deploy)' },
        ],
      }],
      ['manage-collaborators', {
        name: 'manage-collaborators',
        description: 'Manage repository collaborators',
        arguments: [
          { name: 'owner', description: 'Repository owner', required: true },
          { name: 'repo', description: 'Repository name', required: true },
          { name: 'action', description: 'Action: add, remove, or list', required: true },
          { name: 'username', description: 'Username (for add/remove)' },
          { name: 'permission', description: 'Permission level: pull, push, admin (for add)' },
        ],
      }],
      ['search-code', {
        name: 'search-code',
        description: 'Search across AtomGit repositories, issues, and users',
        arguments: [
          { name: 'query', description: 'Search query', required: true },
          { name: 'type', description: 'Search type: repositories, issues, or users' },
          { name: 'limit', description: 'Maximum number of results' },
        ],
      }],
      ['manage-issues', {
        name: 'manage-issues',
        description: 'List and filter repository issues',
        arguments: [
          { name: 'owner', description: 'Repository owner', required: true },
          { name: 'repo', description: 'Repository name', required: true },
          { name: 'state', description: 'Issue state: open, closed, or all' },
          { name: 'labels', description: 'Comma-separated label names to filter' },
          { name: 'assignee', description: 'Assignee username to filter' },
          { name: 'sort', description: 'Sort field: created, updated, or comments' },
        ],
      }],
    ]);
  }

  listPrompts(): PromptDefinition[] {
    return Array.from(this.prompts.values());
  }

  getPrompt(name: string, args: Record<string, string>): PromptResult {
    const prompt = this.prompts.get(name);
    if (!prompt) throw new Error(`Unknown prompt: ${name}`);

    const lines = this.buildPromptLines(name, args);
    return {
      description: prompt.description,
      messages: [{ role: 'user', content: { type: 'text', text: lines.join('\n') } }],
    };
  }

  private buildPromptLines(name: string, args: Record<string, string>): string[] {
    const lines: string[] = [];

    switch (name) {
      case 'create-repository':
        lines.push('I want to create a new repository on AtomGit.');
        break;
      case 'create-issue':
        lines.push(`I want to create a new issue in repository ${args.owner}/${args.repo}.`);
        break;
      case 'create-pull-request':
        lines.push(`I want to create a new pull request in ${args.owner}/${args.repo}.`);
        break;
      case 'review-code':
        lines.push(`I want to review code in ${args.owner}/${args.repo}.`);
        break;
      case 'setup-ci':
        lines.push(`I want to set up CI/CD for ${args.owner}/${args.repo}.`);
        break;
      case 'manage-collaborators':
        lines.push(`I want to ${args.action} collaborators for ${args.owner}/${args.repo}.`);
        break;
      case 'search-code':
        lines.push(`Search for "${args.query}" across AtomGit.`);
        break;
      case 'manage-issues':
        lines.push(`I want to view issues for ${args.owner}/${args.repo}.`);
        break;
    }

    for (const [key, value] of Object.entries(args)) {
      if (['owner', 'repo', 'action', 'query'].includes(key)) continue;
      if (value) lines.push(`- ${key}: ${value}`);
    }

    lines.push('', 'Please help me with this using the appropriate tools.');
    return lines;
  }
}