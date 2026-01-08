import axios from 'axios';
export class AtomGitService {
    client;
    constructor(config) {
        this.client = axios.create({
            baseURL: config.apiBaseUrl,
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Version': '2023-02-21',
                ...(config.token && {
                    'Authorization': `Bearer ${config.token}`,
                    'PRIVATE-TOKEN': config.token
                })
            }
        });
    }
    async getCurrentUser() {
        const response = await this.client.get('/api/v5/user');
        return response.data;
    }
    async getUser(username) {
        console.log(`🔍 getUser API call: /api/v5/users/${username}`);
        try {
            const response = await this.client.get(`/api/v5/users/${username}`);
            console.log(`📊 Response status: ${response.status}`);
            console.log(`📊 Response headers:`, response.headers);
            if (response.data) {
                console.log(`✅ User data received: ${response.data.login || response.data.name}`);
                console.log(`👤 User ID: ${response.data.id}`);
                console.log(`🏢 User page: ${response.data.html_url}`);
            }
            else {
                console.log(`⚠️  No user data received`);
            }
            return response.data;
        }
        catch (error) {
            console.log(`❌ Error: ${error.message}`);
            if (error.response) {
                console.log(`📊 Status: ${error.response.status}`);
                console.log(`📄 Status Text: ${error.response.statusText}`);
                console.log(`📋 Error Data:`, error.response.data);
            }
            throw error;
        }
    }
    async getUserRepos(username) {
        const response = await this.client.get(`/api/v5/users/${username}/repos`);
        return response.data;
    }
    async getCurrentUserRepos() {
        const response = await this.client.get('/api/v5/user/repos');
        return response.data;
    }
    async getRepository(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}`);
        return response.data;
    }
    async getRepositoryTree(owner, repo, sha) {
        const url = sha ? `/api/v5/repos/${owner}/${repo}/git/trees/${sha}` : `/api/v5/repos/${owner}/${repo}/git/trees/main`;
        const response = await this.client.get(url);
        return response.data;
    }
    async getUserStarredRepos(username) {
        const response = await this.client.get(`/api/v5/users/${username}/starred`);
        return response.data;
    }
    async getCurrentUserStarredRepos() {
        const response = await this.client.get('/api/v5/user/starred');
        return response.data;
    }
    async searchRepositories(query, page = 1, perPage = 30) {
        const response = await this.client.get('/api/v5/search/repositories', {
            params: {
                q: query,
                page,
                per_page: perPage
            }
        });
        return response.data; // Direct array, not wrapped in items
    }
    async searchUsers(query, page = 1, perPage = 30) {
        const response = await this.client.get('/api/v5/search/users', {
            params: {
                q: query,
                page,
                per_page: perPage
            }
        });
        return response.data; // Direct array, not wrapped in items
    }
    async createRepository(repoData) {
        const response = await this.client.post('/api/v5/user/repos', repoData);
        return response.data;
    }
    async getRepositoryBranches(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/branches`);
        return response.data;
    }
    async getRepositoryIssues(owner, repo, state = 'open', page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues`, {
            params: {
                state,
                page,
                per_page: perPage
            }
        });
        return response.data;
    }
    async createRepositoryIssue(owner, repo, issueData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/issues`, issueData);
        return response.data;
    }
    async getRepositoryIssue(owner, repo, issueNumber) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}`);
        return response.data;
    }
    // Priority 1: Issues Full Management
    async updateRepositoryIssue(owner, repo, issueNumber, updateData) {
        const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}`, updateData);
        return response.data;
    }
    async getRepositoryIssueComments(owner, repo, issueNumber, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/comments`, {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    async createRepositoryIssueComment(owner, repo, issueNumber, commentData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/comments`, commentData);
        return response.data;
    }
    async getRepositoryIssueComment(owner, repo, commentId) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/comments/${commentId}`);
        return response.data;
    }
    async updateRepositoryIssueComment(owner, repo, commentId, updateData) {
        const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/issues/comments/${commentId}`, updateData);
        return response.data;
    }
    async deleteRepositoryIssueComment(owner, repo, commentId) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/issues/comments/${commentId}`);
        return response.data;
    }
    async createRepositoryIssueLabel(owner, repo, issueNumber, labels) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/labels`, { labels });
        return response.data;
    }
    async replaceRepositoryIssueLabels(owner, repo, issueNumber, labels) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/labels`, { labels });
        return response.data;
    }
    async deleteRepositoryIssueLabel(owner, repo, issueNumber, name) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/labels/${name}`);
        return response.data;
    }
    async getRepositoryIssueOperateLogs(owner, repo, issueNumber, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/issues/${issueNumber}/operate_logs`, {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    async getRepositoryIssueRelatedBranches(owner, repo, issueNumber) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/related_branches`);
        return response.data;
    }
    async getRepositoryIssueReactions(owner, repo, issueNumber) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/user_reactions`);
        return response.data;
    }
    async getRepositoryIssueCommentReactions(owner, repo, commentId) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/comment/${commentId}/user_reactions`);
        return response.data;
    }
    async getRepositoryIssueModifyHistory(owner, repo, issueNumber) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/${issueNumber}/modify_history`);
        return response.data;
    }
    async getRepositoryIssueCommentModifyHistory(owner, repo, commentId) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/issues/comment/${commentId}/modify_history`);
        return response.data;
    }
    // Priority 1: Branch Advanced Management
    async getRepositoryBranch(owner, repo, branch) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/branches/${branch}`);
        return response.data;
    }
    async createBranchProtectionRule(owner, repo, ruleData) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/branches/setting/new`, ruleData);
        return response.data;
    }
    async deleteBranchProtectionRule(owner, repo, wildcard) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/branches/${wildcard}/setting`);
        return response.data;
    }
    async getBranchProtectionRules(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/protect_branches`);
        return response.data;
    }
    async updateBranchProtectionRule(owner, repo, ruleData) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/branches/${ruleData.wildcard}/setting`, ruleData);
        return response.data;
    }
    async getRepositoryPulls(owner, repo, state = 'open', page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls`, {
            params: {
                state,
                page,
                per_page: perPage
            }
        });
        return response.data;
    }
    async getRepositoryPull(owner, repo, pullNumber) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}`);
        return response.data;
    }
    // Commit APIs
    async getRepositoryCommits(owner, repo, sha, page = 1, perPage = 30) {
        const url = sha ? `/api/v5/repos/${owner}/${repo}/commits` : `/api/v5/repos/${owner}/${repo}/commits`;
        const response = await this.client.get(url, {
            params: {
                sha,
                page,
                per_page: perPage
            }
        });
        return response.data;
    }
    async getRepositoryCommit(owner, repo, sha) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/commits/${sha}`);
        return response.data;
    }
    // Tag APIs
    async getRepositoryTags(owner, repo, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/tags`, {
            params: {
                page,
                per_page: perPage
            }
        });
        return response.data;
    }
    // Release APIs
    async createRelease(owner, repo, releaseData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/releases`, releaseData);
        return response.data;
    }
    async getRepositoryReleases(owner, repo, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/releases`, {
            params: {
                page,
                per_page: perPage
            }
        });
        return response.data;
    }
    async getRepositoryRelease(owner, repo, tag) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/releases/${tag}`);
        return response.data;
    }
    async getLatestRelease(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/releases/latest`);
        return response.data;
    }
    // Priority 1: Repository Management - Forks
    async getRepositoryForks(owner, repo, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/forks`, {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    // Priority 1: Repository Management - Create (already exists at line 120)
    // async createRepository(repoData: CreateRepositoryRequest): Promise<AtomGitRepository> {
    // Priority 1: Branch Management - Create
    async createRepositoryBranch(owner, repo, branch, sha) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/branches`, { branch, sha });
        return response.data;
    }
    // Priority 1: Branch Management - Delete
    async deleteRepositoryBranch(owner, repo, branch) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/branches/${branch}`);
        return response.data;
    }
    // Priority 1: Pull Request Management - Create
    async createRepositoryPull(owner, repo, pullData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls`, pullData);
        return response.data;
    }
    // Priority 1: Pull Request Management - Merge
    async mergeRepositoryPull(owner, repo, pullNumber, mergeData) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/merge`, mergeData);
        return response.data;
    }
    // Priority 1: Pull Request Management - Merge Status
    async getRepositoryPullMergeStatus(owner, repo, pullNumber) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/merge`);
        return response.data;
    }
    // Priority 1: Pull Request Management - Issues
    async getRepositoryPullIssues(owner, repo, pullNumber) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/issues`);
        return response.data;
    }
    // Priority 1: Pull Request Management - Comments
    async createRepositoryPullComment(owner, repo, pullNumber, commentData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/comments`, commentData);
        return response.data;
    }
    async getRepositoryPullComments(owner, repo, pullNumber, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/comments`, {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    // Priority 1: Pull Request Management - Files
    async getRepositoryPullFiles(owner, repo, pullNumber, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/files`, {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    // Priority 1: Pull Request Management - Update
    async updateRepositoryPull(owner, repo, pullNumber, updateData) {
        const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}`, updateData);
        return response.data;
    }
    // Priority 1: Pull Request Management - Commits
    async getRepositoryPullCommits(owner, repo, pullNumber, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/commits`, {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    // Priority 1: Pull Request Management - Labels
    async createRepositoryPullLabel(owner, repo, pullNumber, labels) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/labels`, { labels });
        return response.data;
    }
    async getRepositoryPullLabels(owner, repo, pullNumber, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/labels`, {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    async replaceRepositoryPullLabels(owner, repo, pullNumber, labels) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/labels`, { labels });
        return response.data;
    }
    async deleteRepositoryPullLabel(owner, repo, pullNumber, name) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/labels/${name}`);
        return response.data;
    }
    // Priority 1: Pull Request Management - Testing & Review
    async processRepositoryPullTest(owner, repo, pullNumber, testData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/test`, testData);
        return response.data;
    }
    async processRepositoryPullReview(owner, repo, pullNumber, reviewData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/review`, reviewData);
        return response.data;
    }
    async getRepositoryPullOperateLogs(owner, repo, pullNumber, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/operate_logs`, {
            params: { page, per_page: perPage }
        });
        return response.data;
    }
    async resetRepositoryPullTesters(owner, repo, pullNumber) {
        const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/testers`, {});
        return response.data;
    }
    async assignRepositoryPullTesters(owner, repo, pullNumber, testers) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/testers`, { testers });
        return response.data;
    }
    async removeRepositoryPullTesters(owner, repo, pullNumber, testers) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/testers`, {
            data: { testers }
        });
        return response.data;
    }
    async getRepositoryPullTesterOptions(owner, repo, pullNumber) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/option_approval_testers`);
        return response.data;
    }
    async resetRepositoryPullAssignees(owner, repo, pullNumber) {
        const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/assignees`, {});
        return response.data;
    }
    async assignRepositoryPullAssignees(owner, repo, pullNumber, assignees) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/assignees`, { assignees });
        return response.data;
    }
    async removeRepositoryPullAssignees(owner, repo, pullNumber, assignees) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/assignees`, {
            data: { assignees }
        });
        return response.data;
    }
    // Priority 1: Pull Request Management - Additional Features
    async getRepositoryPullFilesJson(owner, repo, pullNumber) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/files_json`);
        return response.data;
    }
    async getRepositoryPullFileContent(owner, repo, head, sha, name) {
        const response = await this.client.get(`/${owner}/${repo}/raw/${head}/${sha}/${name}`);
        return response.data;
    }
    async linkRepositoryPullIssues(owner, repo, pullNumber, issues) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/linked_issues`, { issues });
        return response.data;
    }
    async unlinkRepositoryPullIssues(owner, repo, pullNumber, issues) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/issues`, {
            data: { issues }
        });
        return response.data;
    }
    async assignRepositoryPullApprovalReviewers(owner, repo, pullNumber, reviewers) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/approval_reviewers`, { reviewers });
        return response.data;
    }
    async removeRepositoryPullApprovalReviewers(owner, repo, pullNumber, reviewers) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/approval_reviewers`, {
            data: { reviewers }
        });
        return response.data;
    }
    async getRepositoryPullApprovalReviewerOptions(owner, repo, pullNumber) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pulls/${pullNumber}/option_approval_reviewers`);
        return response.data;
    }
    // Priority 1: Repository File Content Management
    async getRepositoryContent(owner, repo, path = '', ref) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/contents/${path}`, {
            params: ref ? { ref } : {}
        });
        return response.data;
    }
    async createRepositoryFile(owner, repo, fileData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/contents/${fileData.path}`, fileData);
        return response.data;
    }
    async updateRepositoryFile(owner, repo, fileData) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/contents/${fileData.path}`, fileData);
        return response.data;
    }
    async deleteRepositoryFile(owner, repo, fileData) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/contents/${fileData.path}`, {
            data: fileData
        });
        return response.data;
    }
    async get_repository_file_list($owner, repo, path = '', ref, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${$owner}/${repo}/file_list`, {
            params: {
                path,
                ref,
                page,
                per_page: perPage
            }
        });
        return response.data;
    }
    async getRepositoryFileBlob(owner, repo, sha) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/git/blobs/${sha}`);
        return response.data;
    }
    async uploadRepositoryImage(owner, repo, fileData, filename) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/img/upload`, {
            file: fileData,
            filename
        });
        return response.data;
    }
    async uploadRepositoryFile(owner, repo, fileData, filename) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/file/upload`, {
            file: fileData,
            filename
        });
        return response.data;
    }
    // Priority 1: User Management - Subscriptions
    async getUserSubscriptions() {
        const response = await this.client.get('/api/v5/user/subscriptions');
        return response.data;
    }
    // Priority 1: User Management - Namespaces
    async getUserNamespaces() {
        const response = await this.client.get('/api/v5/user/namespaces');
        return response.data;
    }
    // Priority 1: Repository Settings & Configuration
    async getRepositorySettings(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/repo-settings`);
        return response.data;
    }
    async updateRepositorySettings(owner, repo, settings) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/repo-settings`, settings);
        return response.data;
    }
    async getRepositoryPullRequestSettings(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pull-request-settings`);
        return response.data;
    }
    async updateRepositoryPullRequestSettings(owner, repo, settings) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/pull-request-settings`, settings);
        return response.data;
    }
    async getRepositoryPushConfig(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/push-config`);
        return response.data;
    }
    async setRepositoryPushConfig(owner, repo, config) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/push-config`, config);
        return response.data;
    }
    // Priority 1: Repository Advanced Features
    async getRepositoryLanguages(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/languages`);
        return response.data;
    }
    async getRepositoryContributors(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/contributors`);
        return response.data;
    }
    async getRepositoryContributorsStatistic(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/contributors-statistic`);
        return response.data;
    }
    async getRepositoryDownloadStatistics(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/download-statistics`);
        return response.data;
    }
    async getRepositoryEvents(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/events`);
        return response.data;
    }
    // Priority 1: Repository Management
    async updateRepository(owner, repo, updateData) {
        const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}`, updateData);
        return response.data;
    }
    async deleteRepository(owner, repo) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}`);
        return response.data;
    }
    async forkRepository(owner, repo, forkData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/forks`, forkData || {});
        return response.data;
    }
    async archiveRepository(org, repository, archiveData) {
        const response = await this.client.put(`/api/v5/org/${org}/repo/${repository}/status`, archiveData);
        return response.data;
    }
    async transferRepository(org, repository, transferData) {
        const response = await this.client.post(`/api/v5/org/${org}/projects/${repository}/transfer`, transferData);
        return response.data;
    }
    async getRepositoryRawFile(owner, repo, path) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/raw/${path}`);
        return response.data;
    }
    async getRepositorySubscribers(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/subscribers`);
        return response.data;
    }
    async getRepositoryStargazers(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/stargazers`);
        return response.data;
    }
    async updateRepositoryModuleSetting(owner, repo, moduleData) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/module-setting`, moduleData);
        return response.data;
    }
    async updateRepositoryReviewer(owner, repo, reviewerData) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/reviewer`, reviewerData);
        return response.data;
    }
    async getRepositoryTransition(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/transition`);
        return response.data;
    }
    async updateRepositoryTransition(owner, repo, transitionData) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/transition`, transitionData);
        return response.data;
    }
    async getRepositoryCustomizedRoles(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/customized-roles`);
        return response.data;
    }
    async updateRepositoryMemberRole(owner, repo, username, roleData) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/members/${username}`, roleData);
        return response.data;
    }
    // Priority 2: Labels & Milestones Management
    async getRepositoryLabels(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/labels`);
        return response.data;
    }
    async createRepositoryLabel(owner, repo, labelData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/labels`, labelData);
        return response.data;
    }
    async deleteRepositoryLabel(owner, repo, name) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/labels/${name}`);
        return response.data;
    }
    async updateRepositoryLabel(owner, repo, name, labelData) {
        const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/labels/${name}`, labelData);
        return response.data;
    }
    async getRepositoryMilestones(owner, repo, state = 'open', page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/milestones`, {
            params: {
                state,
                page,
                per_page: perPage
            }
        });
        return response.data;
    }
    async createRepositoryMilestone(owner, repo, milestoneData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/milestones`, milestoneData);
        return response.data;
    }
    async updateRepositoryMilestone(owner, repo, number, milestoneData) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/milestones/${number}`, milestoneData);
        return response.data;
    }
    async deleteRepositoryMilestone(owner, repo, number) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/milestones/${number}`);
        return response.data;
    }
    async getRepositoryMilestone(owner, repo, number) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/milestones/${number}`);
        return response.data;
    }
    // Priority 2: Commit Advanced Management
    async getRepositoryCommitComments(owner, repo, sha, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/commits/${sha}/comments`, {
            params: {
                page,
                per_page: perPage
            }
        });
        return response.data;
    }
    async createRepositoryCommitComment(owner, repo, sha, commentData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/commits/${sha}/comments`, commentData);
        return response.data;
    }
    async getRepositoryCommitDiff(owner, repo, sha) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/commits/${sha}/diff`);
        return response.data;
    }
    async compareRepositoryCommits(owner, repo, base, head) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/compare/${base}...${head}`);
        return response.data;
    }
    async getRepositoryCommitPatch(owner, repo, sha) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/commits/${sha}/patch`);
        return response.data;
    }
    async getRepositoryCommitStats(owner, repo, sha) {
        const url = sha ? `/api/v5/repos/${owner}/${repo}/commits/${sha}/stats` : `/api/v5/repos/${owner}/${repo}/stats`;
        const response = await this.client.get(url);
        return response.data;
    }
    async getRepositoryCommitStatuses(owner, repo, sha) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/commits/${sha}/statuses`);
        return response.data;
    }
    async createRepositoryCommitStatus(owner, repo, sha, statusData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/commits/${sha}/statuses`, statusData);
        return response.data;
    }
    async getRepositoryCommitComment(owner, repo, commentId) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/comments/${commentId}`);
        return response.data;
    }
    async updateRepositoryCommitComment(owner, repo, commentId, commentData) {
        const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/comments/${commentId}`, commentData);
        return response.data;
    }
    async deleteRepositoryCommitComment(owner, repo, commentId) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/comments/${commentId}`);
        return response.data;
    }
    // Priority 2: Member Management
    async getRepositoryCollaborators(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/collaborators`);
        return response.data;
    }
    async addRepositoryCollaborator(owner, repo, username, collaboratorData) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/collaborators/${username}`, collaboratorData);
        return response.data;
    }
    async removeRepositoryCollaborator(owner, repo, username) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/collaborators/${username}`);
        return response.data;
    }
    async getRepositoryCollaborator(owner, repo, username) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/collaborators/${username}`);
        return response.data;
    }
    // Priority 2: Search Functionality
    async searchIssues(owner, repo, query, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/search/issues`, {
            params: {
                q: `repo:${owner}/${repo} ${query}`,
                page,
                per_page: perPage
            }
        });
        return response.data;
    }
    async searchCode(owner, repo, query, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/search/code`, {
            params: {
                q: `repo:${owner}/${repo} ${query}`,
                page,
                per_page: perPage
            }
        });
        return response.data;
    }
    // Priority 2: User Advanced Features
    async getUserFollowers(username) {
        const response = await this.client.get(`/api/v5/users/${username}/followers`);
        return response.data;
    }
    async getUserFollowing(username) {
        const response = await this.client.get(`/api/v5/users/${username}/following`);
        return response.data;
    }
    async followUser(username) {
        const response = await this.client.put(`/api/v5/user/following/${username}`);
        return response.data;
    }
    async unfollowUser(username) {
        const response = await this.client.delete(`/api/v5/user/following/${username}`);
        return response.data;
    }
    async getCurrentUserFollowers() {
        const response = await this.client.get('/api/v5/user/followers');
        return response.data;
    }
    async getCurrentUserFollowing() {
        const response = await this.client.get('/api/v5/user/following');
        return response.data;
    }
    async getUserOrganizations(username) {
        const response = await this.client.get(`/api/v5/users/${username}/orgs`);
        return response.data;
    }
    async getCurrentUserOrganizations() {
        const response = await this.client.get('/api/v5/user/orgs');
        return response.data;
    }
    // Priority 2: Release Advanced Management
    async updateRelease(owner, repo, tag, releaseData) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/releases/${tag}`, releaseData);
        return response.data;
    }
    async deleteRelease(owner, repo, tag) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/releases/${tag}`);
        return response.data;
    }
    async getReleaseAssets(owner, repo, tag) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/releases/${tag}/assets`);
        return response.data;
    }
    async uploadReleaseAsset(owner, repo, tag, assetData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/releases/${tag}/assets`, assetData);
        return response.data;
    }
    async getReleaseAsset(owner, repo, assetId) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/releases/assets/${assetId}`);
        return response.data;
    }
    async updateReleaseAsset(owner, repo, assetId, assetData) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/releases/assets/${assetId}`, assetData);
        return response.data;
    }
    async deleteReleaseAsset(owner, repo, assetId) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/releases/assets/${assetId}`);
        return response.data;
    }
    // Priority 3: Organization Management
    async getOrganization(org) {
        const response = await this.client.get(`/api/v5/orgs/${org}`);
        return response.data;
    }
    async createOrganizationRepository(org, repoData) {
        const response = await this.client.post(`/api/v5/orgs/${org}/repos`, repoData);
        return response.data;
    }
    async getOrganizationMembers(org) {
        const response = await this.client.get(`/api/v5/orgs/${org}/members`);
        return response.data;
    }
    async addOrganizationMember(org, username, memberData) {
        const response = await this.client.put(`/api/v5/orgs/${org}/members/${username}`, memberData);
        return response.data;
    }
    async removeOrganizationMember(org, username) {
        const response = await this.client.delete(`/api/v5/orgs/${org}/members/${username}`);
        return response.data;
    }
    async getOrganizationProjects(org) {
        const response = await this.client.get(`/api/v5/orgs/${org}/projects`);
        return response.data;
    }
    async createOrganizationProject(org, projectData) {
        const response = await this.client.post(`/api/v5/orgs/${org}/projects`, projectData);
        return response.data;
    }
    async updateOrganizationProject(org, project, projectData) {
        const response = await this.client.put(`/api/v5/orgs/${org}/projects/${project}`, projectData);
        return response.data;
    }
    async deleteOrganizationProject(org, project) {
        const response = await this.client.delete(`/api/v5/orgs/${org}/projects/${project}`);
        return response.data;
    }
    async getOrganizationTeams(org) {
        const response = await this.client.get(`/api/v5/orgs/${org}/teams`);
        return response.data;
    }
    async createOrganizationTeam(org, teamData) {
        const response = await this.client.post(`/api/v5/orgs/${org}/teams`, teamData);
        return response.data;
    }
    async updateOrganizationTeam(org, team, teamData) {
        const response = await this.client.put(`/api/v5/orgs/${org}/teams/${team}`, teamData);
        return response.data;
    }
    async deleteOrganizationTeam(org, team) {
        const response = await this.client.delete(`/api/v5/orgs/${org}/teams/${team}`);
        return response.data;
    }
    async getOrganizationTeamMembers(org, team) {
        const response = await this.client.get(`/api/v5/orgs/${org}/teams/${team}/members`);
        return response.data;
    }
    async addOrganizationTeamMember(org, team, username, memberData) {
        const response = await this.client.put(`/api/v5/orgs/${org}/teams/${team}/members/${username}`, memberData);
        return response.data;
    }
    // Priority 3: Webhooks Management
    async getRepositoryWebhooks(owner, repo) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/hooks`);
        return response.data;
    }
    async createRepositoryWebhook(owner, repo, webhookData) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/hooks`, webhookData);
        return response.data;
    }
    async getRepositoryWebhook(owner, repo, id) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/hooks/${id}`);
        return response.data;
    }
    async updateRepositoryWebhook(owner, repo, id, webhookData) {
        const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/hooks/${id}`, webhookData);
        return response.data;
    }
    async deleteRepositoryWebhook(owner, repo, id) {
        const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/hooks/${id}`);
        return response.data;
    }
    async testRepositoryWebhook(owner, repo, id) {
        const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/hooks/${id}/test`);
        return response.data;
    }
    // Priority 3: Enterprise Management
    async getEnterprise(enterprise) {
        const response = await this.client.get(`/api/v8/enterprises/${enterprise}`);
        return response.data;
    }
    async getEnterpriseMembers(enterprise) {
        const response = await this.client.get(`/api/v8/enterprises/${enterprise}/members`);
        return response.data;
    }
    async getEnterpriseMember(enterprise, username) {
        const response = await this.client.get(`/api/v8/enterprises/${enterprise}/members/${username}`);
        return response.data;
    }
    async updateEnterpriseMember(enterprise, username, memberData) {
        const response = await this.client.put(`/api/v8/enterprises/${enterprise}/members/${username}`, memberData);
        return response.data;
    }
    async removeEnterpriseMember(enterprise, username) {
        const response = await this.client.delete(`/api/v8/enterprises/${enterprise}/members/${username}`);
        return response.data;
    }
    async getEnterpriseRoles(enterprise) {
        const response = await this.client.get(`/api/v8/enterprises/${enterprise}/roles`);
        return response.data;
    }
    async createEnterpriseRole(enterprise, roleData) {
        const response = await this.client.post(`/api/v8/enterprises/${enterprise}/roles`, roleData);
        return response.data;
    }
    async updateEnterpriseRole(enterprise, role, roleData) {
        const response = await this.client.put(`/api/v8/enterprises/${enterprise}/roles/${role}`, roleData);
        return response.data;
    }
    async deleteEnterpriseRole(enterprise, role) {
        const response = await this.client.delete(`/api/v8/enterprises/${enterprise}/roles/${role}`);
        return response.data;
    }
    async getEnterpriseMilestones(enterprise) {
        const response = await this.client.get(`/api/v8/enterprises/${enterprise}/milestones`);
        return response.data;
    }
    async createEnterpriseMilestone(enterprise, milestoneData) {
        const response = await this.client.post(`/api/v8/enterprises/${enterprise}/milestones`, milestoneData);
        return response.data;
    }
    async updateEnterpriseMilestone(enterprise, milestone, milestoneData) {
        const response = await this.client.put(`/api/v8/enterprises/${enterprise}/milestones/${milestone}`, milestoneData);
        return response.data;
    }
    async deleteEnterpriseMilestone(enterprise, milestone) {
        const response = await this.client.delete(`/api/v8/enterprises/${enterprise}/milestones/${milestone}`);
        return response.data;
    }
    async getEnterpriseProjects(enterprise) {
        const response = await this.client.get(`/api/v8/enterprises/${enterprise}/projects`);
        return response.data;
    }
    async createEnterpriseProject(enterprise, projectData) {
        const response = await this.client.post(`/api/v8/enterprises/${enterprise}/projects`, projectData);
        return response.data;
    }
    // Priority 4: Dashboard (Kanban) Management
    async getOrganizationKanbans(owner) {
        const response = await this.client.get(`/api/v5/org/${owner}/kanban/list`);
        return response.data;
    }
    async createOrganizationKanban(owner, kanbanData) {
        const response = await this.client.post(`/api/v5/org/${owner}/kanban`, kanbanData);
        return response.data;
    }
    async getOrganizationKanban(owner, id) {
        const response = await this.client.get(`/api/v5/org/${owner}/kanban/${id}`);
        return response.data;
    }
    async updateOrganizationKanban(owner, id, kanbanData) {
        const response = await this.client.put(`/api/v5/org/${owner}/kanban/${id}`, kanbanData);
        return response.data;
    }
    async deleteOrganizationKanban(owner, id) {
        const response = await this.client.delete(`/api/v5/org/${owner}/kanban/${id}`);
        return response.data;
    }
    async getOrganizationKanbanContent(owner, id) {
        const response = await this.client.get(`/api/v5/org/${owner}/kanban/${id}/content`);
        return response.data;
    }
    async updateOrganizationKanbanContent(owner, id, contentData) {
        const response = await this.client.put(`/api/v5/org/${owner}/kanban/${id}/content`, contentData);
        return response.data;
    }
    // Priority 4: AI Hub Features
    async chatCompletion(data) {
        const response = await this.client.post('/api/v5/chat/completions', data);
        return response.data;
    }
    async speechRecognition(data) {
        const response = await this.client.post('/api/v5/speech/recognition', data);
        return response.data;
    }
    async objectDetection(data) {
        const response = await this.client.post('/api/v5/object/detection', data);
        return response.data;
    }
    async textEmbedding(data) {
        const response = await this.client.post('/api/v5/text/embedding', data);
        return response.data;
    }
    async imageGeneration(data) {
        const response = await this.client.post('/api/v5/image/generation', data);
        return response.data;
    }
    async audioSynthesis(data) {
        const response = await this.client.post('/api/v5/audio/synthesis', data);
        return response.data;
    }
    async translation(data) {
        const response = await this.client.post('/api/v5/translation', data);
        return response.data;
    }
}
//# sourceMappingURL=AtomGitService.js.map