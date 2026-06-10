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
  repo?: string;
  title: string;
  body?: string;
  assignee?: string;
  assignees?: string[];
  labels?: string | string[];
  milestone?: number;
  security_hole?: string;
  template_path?: string;
  issue_type?: string;
  issue_severity?: string;
  custom_fields?: Array<{
    field_name: string;
    field_values: string[];
  }>;
}

export interface CreatePullRequestRequest {
  title: string;
  head: string;
  base: string;
  body?: string;
  draft?: boolean;
  maintainer_can_modify?: boolean;
}

export interface MergePullRequestRequest {
  commit_title?: string;
  commit_message?: string;
  merge_method?: 'merge' | 'squash' | 'rebase';
}

export interface UpdatePullRequestRequest {
  title?: string;
  body?: string;
  state?: 'open' | 'closed';
  base?: string;
  maintainer_can_modify?: boolean;
}

export interface CreatePullRequestCommentRequest {
  body: string;
  commit_id?: string;
  path?: string;
  position?: number;
  position_type?: string;
}

export interface UpdatePullRequestCommentRequest {
  body?: string;
  resolved?: boolean;
}

export interface AtomGitConfig {
  apiBaseUrl: string;
  token?: string;
}

export interface Commit {
  sha: string;
  url: string;
  html_url: string;
  comments_url: string;
  commit: {
    url: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
    tree: {
      sha: string;
      url: string;
    };
  };
  author: AtomGitUser;
  committer: AtomGitUser;
  parents: Array<{
    sha: string;
    url: string;
  }>;
  stats?: {
    additions: number;
    deletions: number;
    total: number;
  };
  files?: Array<{
    filename: string;
    additions: number;
    deletions: number;
    changes: number;
    patch: string;
    blob_url: string;
    raw_url: string;
    contents_url: string;
  }>;
}

export interface Tag {
  name: string;
  zipball_url: string;
  tarball_url: string;
  commit: {
    sha: string;
    url: string;
  };
  node_id: string;
}

export interface CreateReleaseRequest {
  tag_name: string;
  target_commitish?: string;
  name: string;
  body?: string;
  draft?: boolean;
  prerelease?: boolean;
  release_status?: string;
}

export interface UpdateReleaseRequest {
  tag_name?: string;
  target_commitish?: string;
  name?: string;
  body?: string;
  draft?: boolean;
  prerelease?: boolean;
  release_status?: string;
}

export interface Release {
  id: number;
  tag_name: string;
  target_commitish: string;
  name: string;
  body: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  author: AtomGitUser;
  assets: Array<{
    url: string;
    browser_download_url: string;
    id: number;
    name: string;
    label?: string;
    state: string;
    content_type: string;
    size: number;
    download_count: number;
    created_at: string;
    updated_at: string;
  }>;
  tarball_url: string;
  zipball_url: string;
  html_url: string;
  url: string;
  upload_url: string;
}

export interface CreateFileRequest {
  path: string;
  content: string;
  message: string;
  branch?: string;
  sha?: string;
  author?: {
    name?: string;
    email?: string;
  };
}

export interface UpdateFileRequest {
  path: string;
  content: string;
  message: string;
  sha: string;
  branch?: string;
  author?: {
    name?: string;
    email?: string;
  };
}

export interface DeleteFileRequest {
  path: string;
  message: string;
  sha: string;
  branch?: string;
}

export interface BranchProtectionRuleCreate {
  wildcard: string;
  pusher: string;
  merger: string;
}

export interface BranchProtectionRuleUpdate {
  pusher: string;
  merger: string;
}

export interface CreateMilestoneRequest {
  title: string;
  description?: string;
  state?: 'open' | 'closed';
  due_on?: string;
}

export interface UpdateMilestoneRequest {
  title?: string;
  state?: 'open' | 'closed';
  description?: string;
  due_on?: string;
}

export interface UpdateMilestoneRequest {
  title?: string;
  description?: string;
  state_event?: 'close' | 'open';
  due_on?: string;
}

export interface CreateTagRequest {
  tag_name: string;
  ref: string;
  message?: string;
  target?: string;
}

export interface CreateProtectedTagRequest {
  name: string;
  create_access_level?: number;
}

// Repositories - Module Setting
export interface ModuleSettingRequest {
  issue?: boolean;
  wiki?: boolean;
  pr?: boolean;
  commits?: boolean;
  has_wiki?: boolean;
  has_issue?: boolean;
  has_security?: boolean;
  has_merge_request?: boolean;
  has_fork?: boolean;
  has_analysis?: boolean;
  has_discussion?: boolean;
}

// Repositories - Update Settings
export interface UpdateRepositorySettingsRequest {
  name?: string;
  description?: string;
  private?: boolean;
  has_issues?: boolean;
  has_wiki?: boolean;
  default_branch?: string;
  allow_merge_commit?: boolean;
  allow_squash_merge?: boolean;
  allow_rebase_merge?: boolean;
  allow_fast_forward_merge?: boolean;
  website?: string;
}

// Repositories - Update Reviewer
export interface UpdateReviewerRequest {
  assignees?: string[];
  testers?: string[];
  reviewers?: string[];
  auto_assign?: boolean;
}

// Repositories - Archive
export interface ArchiveRepositoryRequest {
  status: 'archived' | 'active';
}

// Repositories - Transfer
export interface TransferRepositoryRequest {
  to?: string;
  team_id?: number;
  new_owner: string;
}

// Repositories - Transition
export interface TransitionModeRequest {
  mode: number;
}

// Repositories - Push Config
export interface PushConfigRequest {
  allow_force_pushes?: boolean;
  require_signed_commits?: boolean;
  require_linear_history?: boolean;
  reject_not_signed_by_gpg?: boolean;
  commit_message_regex?: string;
  max_file_size?: number;
  skip_rule_for_owner?: boolean;
  deny_force_push?: boolean;
}

// Repositories - Fork
export interface ForkRepositoryRequest {
  namespace?: string;
  organization?: string;
  name?: string;
  path?: string;
}

// Repositories - Repo Settings
export interface RepoSettingsRequest {
  auto_init?: boolean;
  gitignore_template?: string;
  license_template?: string;
  readme?: string;
}

// Repositories - Pull Request Settings
export interface PullRequestSettingsRequest {
  allow_merge_commits?: boolean;
  allow_squash_commits?: boolean;
  allow_rebase_commits?: boolean;
  allow_force_push?: boolean;
}

// Repositories - Update Member Role
export interface UpdateMemberRoleRequest {
  role: string;
}

// Repositories - Upload Image/File
export interface UploadRepositoryImageRequest {
  body: string;
  file_name: string;
}

export interface UploadRepositoryFileRequest {
  file: string;
}

// Labels
export interface CreateLabelRequest {
  name: string;
  color: string;
  description?: string;
}

export interface UpdateLabelRequest {
  name?: string;
  color?: string;
  description?: string;
}

// Milestone
export interface UpdateMilestoneRequest {
  title?: string;
  state?: 'open' | 'closed';
  description?: string;
  due_on?: string;
}

// Issues
export interface CreateIssueRequest {
  repo?: string;
  title: string;
  body?: string;
  assignee?: string;
  assignees?: string[];
  labels?: string | string[];
  milestone?: number;
  security_hole?: string;
  template_path?: string;
  issue_type?: string;
  issue_severity?: string;
  custom_fields?: Array<{
    field_name: string;
    field_values: string[];
  }>;
}

export interface UpdateIssueRequest {
  title?: string;
  body?: string;
  state?: 'open' | 'closed' | 'reopen' | 'close';
  assignee?: string;
  assignees?: string[];
  labels?: string | string[];
  milestone?: number;
  security_hole?: string;
  template_path?: string;
  issue_type?: string;
  status?: string;
  issue_severity?: string;
  custom_fields?: Array<{
    field_name: string;
    field_values: string[];
  }>;
}

export interface CreateIssueCommentRequest {
  body: string;
}

export interface UpdateIssueCommentRequest {
  body?: string;
}

// Member
export interface AddCollaboratorRequest {
  permission: 'pull' | 'push' | 'admin';
}

// Webhooks
export interface CreateWebhookRequest {
  name: string;
  url: string;
  active?: boolean;
  events?: string[];
}

export interface UpdateWebhookRequest {
  name?: string;
  url?: string;
  active?: boolean;
  events?: string[];
}

// Enterprise
export interface EnterpriseMemberRequest {
  role: string;
}

// Dashboard
export interface KanbanItemRequest {
  iid: number;
  repo_id: number;
  type: string;
}

export interface UpdateKanbanRequest {
  iid?: number;
  repo_id?: number;
  type?: string;
  new_kanban_id?: number;
}

export interface RemoveKanbanItemRequest {
  iid?: number;
  repo_id?: number;
  type?: string;
}

export interface UpdateKanbanStateRequest {
  state: 'archived' | 'active';
}
