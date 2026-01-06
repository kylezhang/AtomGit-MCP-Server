export interface AtomGitUser {
    id: number;
    username: string;
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
}
export interface AtomGitRepository {
    id: number;
    name: string;
    full_name: string;
    description: string;
    private: boolean;
    fork: boolean;
    html_url: string;
    ssh_url: string;
    clone_url: string;
    owner: AtomGitUser;
    language: string;
    languages: Record<string, number>;
    stargazers_count: number;
    watchers_count: number;
    forks_count: number;
    open_issues_count: number;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    default_branch: string;
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
export interface AtomGitConfig {
    apiBaseUrl: string;
    token?: string;
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
//# sourceMappingURL=index.d.ts.map