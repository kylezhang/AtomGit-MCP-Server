export interface AtomGitUser {
  id: number | string;
  username: string;
  login: string;
  name: string;
  email: string;
  bio: string;
  avatar_url: string;
  html_url: string;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
  updated_at: string;
  company?: string;
  blog?: string;
  top_languages?: string[];
}

export interface AtomGitRepository {
  id: number;
  name: string;
  full_name: string;
  human_name?: string;
  description: string;
  private: boolean;
  fork: boolean;
  html_url: string;
  web_url?: string;
  ssh_url: string;
  http_url_to_repo?: string;
  clone_url: string;
  owner: AtomGitUser;
  language: string;
  languages?: Record<string, number>;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  default_branch: string;
  status?: string;
  namespace?: any;
  path?: string;
  members?: string[];
  relation?: string;
  permission?: any;
  internal?: boolean;
  has_issue?: boolean;
  has_issues?: boolean;
  issue_template_source?: string;
  project_creator?: string;
  public?: boolean;
  enterprise?: any;
}

export interface AtomGitTreeItem {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size: number;
  url: string;
}

export interface AtomGitTree {
  sha: string;
  url: string;
  tree: AtomGitTreeItem[];
  truncated: boolean;
}

export interface CreateRepositoryRequest {
  name: string;
  description?: string;
  private?: boolean;
  auto_init?: boolean;
  gitignore_template?: string;
  license_template?: string;
  readme?: string;
  default_branch?: string;
}

export interface Branch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
  protection?: {
    enabled: boolean;
    required_status_checks?: {
      enforcement_level: string;
      contexts: string[];
    };
    restrictions?: {
      users: any[];
      teams: any[];
    };
  };
}

export interface Issue {
  id: number;
  number: number;
  title: string;
  body?: string;
  state: 'open' | 'closed';
  user: AtomGitUser;
  assignee?: AtomGitUser;
  assignees?: AtomGitUser[];
  milestone?: any;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  html_url: string;
  url: string;
}

export interface PullRequest {
  id: number;
  number: number;
  title: string;
  body?: string;
  state: 'open' | 'closed' | 'merged';
  user: AtomGitUser;
  assignee?: AtomGitUser;
  assignees?: AtomGitUser[];
  milestone?: any;
  head: {
    label: string;
    ref: string;
    sha: string;
    user: AtomGitUser;
    repo: AtomGitRepository;
  };
  base: {
    label: string;
    ref: string;
    sha: string;
    user: AtomGitUser;
    repo: AtomGitRepository;
  };
  merged: boolean;
  mergeable?: boolean;
  merged_at?: string;
  comments: number;
  commits: number;
  additions?: number;
  deletions?: number;
  changed_files?: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  html_url: string;
  url: string;
}

export interface CreateIssueRequest {
  title: string;
  body?: string;
  assignees?: string[];
  milestone?: number;
  labels?: string[];
}

export interface AtomGitConfig {
  apiBaseUrl: string;
  token?: string;
}