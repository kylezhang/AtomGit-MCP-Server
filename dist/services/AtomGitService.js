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
    async getRepositoryFileList(owner, repo, path = '', ref, page = 1, perPage = 30) {
        const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/file/list`, {
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
}
//# sourceMappingURL=AtomGitService.js.map