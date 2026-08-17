import { autoPaginateSchemaProperties } from '../core/PaginationHelper.js';

export const stringOrNumberSchema = (description: string, defaultValue?: number) => ({
  oneOf: [
    { type: 'string' },
    { type: 'number' }
  ],
  description,
  ...(defaultValue !== undefined ? { default: defaultValue } : {})
});

export const repoPathProperties = {
  owner: {
    type: 'string',
    description: '仓库所属空间地址(组织或个人的地址path)'
  },
  repo: {
    type: 'string',
    description: '仓库路径(path)'
  }
};

export const paginationProperties = {
  keyword: {
    type: 'string',
    description: '关键字过滤'
  },
  page: {
    type: 'number',
    description: '当前页码'
  },
  perPage: {
    type: 'number',
    description: '每页的项目数'
  },
  ...autoPaginateSchemaProperties,
};

/**
 * Shared outputSchema fragments (JSON Schema 2020-12, root must be `object`
 * per MCP spec) for high-frequency tools. These are deliberately loose
 * (`additionalProperties: true`) because AtomGit responses vary across
 * endpoints; they describe the stable top-level fields only.
 */
export const repositoryOutputSchema = {
  type: 'object',
  description: 'AtomGit repository object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    full_name: { type: 'string' },
    description: { type: 'string' },
    private: { type: 'boolean' },
    fork: { type: 'boolean' },
    html_url: { type: 'string' },
    ssh_url: { type: 'string' },
    clone_url: { type: 'string' },
    owner: { type: 'object' },
    language: { type: 'string' },
    stargazers_count: { type: 'number' },
    watchers_count: { type: 'number' },
    forks_count: { type: 'number' },
    open_issues_count: { type: 'number' },
    created_at: { type: 'string' },
    updated_at: { type: 'string' },
    pushed_at: { type: 'string' },
    default_branch: { type: 'string' },
  },
  additionalProperties: true,
} as const;

export const repositoryListOutputSchema = {
  type: 'object',
  description: 'A JSON array of AtomGit repository objects (fetchers unwrap envelopes, so the array may be the direct payload)',
  properties: {
    total_count: { type: 'number', description: 'Present only on envelope responses' },
  },
  additionalProperties: true,
} as const;

export const userOutputSchema = {
  type: 'object',
  description: 'AtomGit user object',
  properties: {
    id: { type: ['number', 'string'] },
    username: { type: 'string' },
    login: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string' },
    avatar_url: { type: 'string' },
    html_url: { type: 'string' },
    followers: { type: 'number' },
    following: { type: 'number' },
    public_repos: { type: 'number' },
    created_at: { type: 'string' },
  },
  additionalProperties: true,
} as const;

export const branchOutputSchema = {
  type: 'object',
  description: 'AtomGit branch object',
  properties: {
    name: { type: 'string' },
    commit: { type: 'object' },
    protected: { type: 'boolean' },
  },
  additionalProperties: true,
} as const;

export const issueOutputSchema = {
  type: 'object',
  description: 'AtomGit issue object',
  properties: {
    id: { type: 'number' },
    number: { type: 'number' },
    title: { type: 'string' },
    body: { type: 'string' },
    state: { type: 'string', enum: ['open', 'closed'] },
    user: { type: 'object' },
    assignee: { type: 'object' },
    comments: { type: 'number' },
    created_at: { type: 'string' },
    updated_at: { type: 'string' },
    html_url: { type: 'string' },
    url: { type: 'string' },
  },
  additionalProperties: true,
} as const;

export const pullRequestOutputSchema = {
  type: 'object',
  description: 'AtomGit pull request object',
  properties: {
    id: { type: 'number' },
    number: { type: 'number' },
    title: { type: 'string' },
    body: { type: 'string' },
    state: { type: 'string', enum: ['open', 'closed', 'merged'] },
    user: { type: 'object' },
    head: { type: 'object' },
    base: { type: 'object' },
    merged: { type: 'boolean' },
    mergeable: { type: 'boolean' },
    comments: { type: 'number' },
    commits: { type: 'number' },
    created_at: { type: 'string' },
    updated_at: { type: 'string' },
    html_url: { type: 'string' },
    url: { type: 'string' },
  },
  additionalProperties: true,
} as const;

export const commitOutputSchema = {
  type: 'object',
  description: 'AtomGit commit object',
  properties: {
    sha: { type: 'string' },
    url: { type: 'string' },
    html_url: { type: 'string' },
    commit: { type: 'object' },
    author: { type: 'object' },
    committer: { type: 'object' },
    parents: { type: 'array' },
  },
  additionalProperties: true,
} as const;

export const treeOutputSchema = {
  type: 'object',
  description: 'AtomGit repository tree object',
  properties: {
    sha: { type: 'string' },
    url: { type: 'string' },
    tree: { type: 'array' },
    truncated: { type: 'boolean' },
  },
  additionalProperties: true,
} as const;

/**
 * Loose outputSchema for list tools whose payload is a plain JSON array.
 * MCP requires the schema root to be `object`, so we describe the actual
 * array payload in the description and keep the schema permissive.
 */
export const looseArrayOutputSchema = (description: string) =>
  ({
    type: 'object',
    description,
    additionalProperties: true,
  } as const);
