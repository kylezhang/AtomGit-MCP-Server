import { BaseService } from './BaseService.js';
import {
  AtomGitRepository,
  AtomGitTree,
  CreateFileRequest,
  UpdateFileRequest,
  DeleteFileRequest,
  ModuleSettingRequest,
  TransferRepositoryRequest,
  TransitionModeRequest,
  PushConfigRequest,
  ForkRepositoryRequest,
  UploadRepositoryFileRequest,
  UploadRepositoryImageRequest
} from '../types/index.js';

interface UpdateRepositoryMetadataRequest {
  name: string;
  description?: string;
  homepage?: string;
  path?: string;
  private?: boolean;
  default_branch?: string;
  lfs_enabled?: boolean;
  tags?: string[];
}

interface RepositoryReviewerSettingsRequest {
  assignees?: string;
  testers?: string;
  assignees_number?: number;
  testers_number?: number;
}

interface ArchiveRepositoryStatusRequest {
  status: number;
  password?: string;
}

interface TransferRepositoryToOrgRequest {
  transfer_to: string;
  password: string;
}

interface RepositoryRulesSettingsRequest {
  disable_fork?: boolean;
  forbidden_developer_create_branch?: boolean;
  forbidden_developer_create_tag?: boolean;
  forbidden_committer_create_branch?: boolean;
  forbidden_developer_create_branch_user_ids?: string;
  branch_name_regex?: string;
  tag_name_regex?: string;
  generate_pre_merge_ref?: boolean;
  rebase_disable_trigger_webhook?: boolean;
  open_gpg_verified?: boolean;
  include_lfs_objects?: boolean;
}

interface PullRequestWorkflowSettingsRequest {
  approval_required_reviewers_enable?: boolean;
  approval_required_reviewers?: number;
  only_allow_merge_if_all_discussions_are_resolved?: boolean;
  only_allow_merge_if_pipeline_succeeds?: boolean;
  disable_merge_by_self?: boolean;
  can_force_merge?: boolean;
  add_notes_after_merged?: boolean;
  mark_auto_merged_mr_as_closed?: boolean;
  can_reopen?: boolean;
  delete_source_branch_when_merged?: boolean;
  disable_squash_merge?: boolean;
  auto_squash_merge?: boolean;
  merge_method?: string;
  squash_merge_with_no_merge_commit?: boolean;
  merged_commit_author?: string;
  approval_required_approvers?: number;
  approval_approver_ids?: string;
  approval_tester_ids?: string;
  approval_required_testers?: number;
  is_check_cla?: boolean;
  is_allow_lite_merge_request?: boolean;
  lite_merge_request_prefix_title?: string;
  close_issue_when_mr_merged?: boolean;
  forbidden_pr_related_issue_closed?: boolean;
}

interface UpdateRepositoryMemberPermissionRequest {
  permission?: string;
  role_id?: string;
}

interface RepositoryDiscussionListOptions {
  page?: string | number;
  perPage?: string | number;
  sort?: string;
  direction?: string;
  search?: string;
}

interface RepositorySyncStatusOptions {
  branch?: string;
}

interface RepositorySyncPayload {
  branch?: string;
}

export class RepositoriesService extends BaseService {
  private encodeFileContent(content: string): string {
    return Buffer.from(content, 'utf8').toString('base64');
  }

  private buildParams(options?: object): Record<string, unknown> {
    const params: Record<string, unknown> = { ...((options ?? {}) as Record<string, unknown>) };

    if (params.per_page === undefined && params.perPage !== undefined) {
      params.per_page = params.perPage;
    }

    delete params.perPage;

    return Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined)
    );
  }

  private withEncodedContent<T extends CreateFileRequest | UpdateFileRequest>(fileData: T): T {
    return {
      ...fileData,
      content: this.encodeFileContent(fileData.content)
    };
  }

  async getRepositoryTree(
    owner: string,
    repo: string,
    sha: string,
    options: {
      recursive?: number;
      page?: number;
      perPage?: number;
      file_path?: string;
    } = {}
  ): Promise<AtomGitTree> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/git/trees/${sha}`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getRepositoryContent(owner: string, repo: string, path: string = '', ref?: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/contents/${path}`, {
      params: ref ? { ref } : {}
    });
    return response.data;
  }

  async createRepositoryFile(owner: string, repo: string, fileData: CreateFileRequest): Promise<any> {
    const response = await this.client.post(
      `/api/v5/repos/${owner}/${repo}/contents/${fileData.path}`,
      this.withEncodedContent(fileData)
    );
    return response.data;
  }

  async updateRepositoryFile(owner: string, repo: string, fileData: UpdateFileRequest): Promise<any> {
    const response = await this.client.put(
      `/api/v5/repos/${owner}/${repo}/contents/${fileData.path}`,
      this.withEncodedContent(fileData)
    );
    return response.data;
  }

  async deleteRepositoryFile(owner: string, repo: string, fileData: DeleteFileRequest): Promise<any> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/contents/${fileData.path}`, {
      data: fileData
    });
    return response.data;
  }

  async getRepositoryFileList(
    owner: string,
    repo: string,
    path: string = '',
    ref?: string,
    page = 1,
    perPage = 30,
    refName?: string,
    fileName?: string
  ): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/file_list`, {
      params: this.buildParams({
        path,
        ref,
        page,
        per_page: perPage,
        ref_name: refName,
        file_name: fileName
      })
    });
    return response.data;
  }

  async getRepositoryFileBlob(owner: string, repo: string, sha: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/git/blobs/${sha}`);
    return response.data;
  }

  async getRepositoryLanguages(owner: string, repo: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/languages`);
    return response.data;
  }

  async getRepositoryContributors(owner: string, repo: string, type?: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/contributors`, {
      params: this.buildParams({ type })
    });
    return response.data;
  }

  async setRepositoryModuleSetting(owner: string, repo: string, moduleData: ModuleSettingRequest): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/module/setting`, moduleData);
    return response.data;
  }

  async getRepository(owner: string, repo: string): Promise<AtomGitRepository> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}`);
    return response.data;
  }

  async updateRepositorySettings(
    owner: string,
    repo: string,
    updateData: UpdateRepositoryMetadataRequest
  ): Promise<AtomGitRepository> {
    const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}`, updateData);
    return response.data;
  }

  async deleteRepository(owner: string, repo: string): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}`);
    return response.data;
  }

  async updateRepositoryReviewer(
    owner: string,
    repo: string,
    reviewerData: RepositoryReviewerSettingsRequest
  ): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/reviewer`, reviewerData);
    return response.data;
  }

  async archiveRepository(org: string, repository: string, archiveData: ArchiveRepositoryStatusRequest): Promise<any> {
    const response = await this.client.put(`/api/v5/org/${org}/repo/${repository}/status`, archiveData);
    return response.data;
  }

  async transferRepositoryToOrg(org: string, repository: string, transferData: TransferRepositoryToOrgRequest): Promise<any> {
    const response = await this.client.post(`/api/v5/org/${org}/projects/${repository}/transfer`, transferData);
    return response.data;
  }

  async getRepositoryTransition(owner: string, repo: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/transition`);
    return response.data;
  }

  async updateRepositoryTransition(owner: string, repo: string, transitionData: TransitionModeRequest): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/transition`, transitionData);
    return response.data;
  }

  async setRepositoryPushConfig(owner: string, repo: string, config: PushConfigRequest): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/push_config`, config);
    return response.data;
  }

  async getRepositoryPushConfig(owner: string, repo: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/push_config`);
    return response.data;
  }

  async forkRepository(owner: string, repo: string, forkData?: ForkRepositoryRequest): Promise<AtomGitRepository> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/forks`, forkData || {});
    return response.data;
  }

  async getRepositoryForks(
    owner: string,
    repo: string,
    page = 1,
    perPage = 30,
    sort?: string,
    createdAfter?: string,
    createdBefore?: string
  ): Promise<AtomGitRepository[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/forks`, {
      params: this.buildParams({
        page,
        per_page: perPage,
        sort,
        created_after: createdAfter,
        created_before: createdBefore
      })
    });
    return response.data;
  }

  async uploadRepositoryImage(owner: string, repo: string, fileData: UploadRepositoryImageRequest): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/img/upload`, fileData);
    return response.data;
  }

  async uploadRepositoryFile(owner: string, repo: string, fileData: UploadRepositoryFileRequest): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/file/upload`, fileData);
    return response.data;
  }

  async getRepositorySubscribers(
    owner: string,
    repo: string,
    page?: number,
    perPage?: number,
    watchedAfter?: string,
    watchedBefore?: string
  ): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/subscribers`, {
      params: this.buildParams({
        page,
        per_page: perPage,
        watched_after: watchedAfter,
        watched_before: watchedBefore
      })
    });
    return response.data;
  }

  async getRepositoryStargazers(
    owner: string,
    repo: string,
    page?: number,
    perPage?: number,
    starredAfter?: string,
    starredBefore?: string
  ): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/stargazers`, {
      params: this.buildParams({
        page,
        per_page: perPage,
        starred_after: starredAfter,
        starred_before: starredBefore
      })
    });
    return response.data;
  }

  async updateRepositoryRepoSettings(owner: string, repo: string, settings: RepositoryRulesSettingsRequest): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/repo_settings`, settings);
    return response.data;
  }

  async getRepositoryRepoSettings(owner: string, repo: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/repo_settings`);
    return response.data;
  }

  async getRepositoryPullRequestSettings(owner: string, repo: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/pull_request_settings`);
    return response.data;
  }

  async updateRepositoryPullRequestSettings(
    owner: string,
    repo: string,
    settings: PullRequestWorkflowSettingsRequest
  ): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/pull_request_settings`, settings);
    return response.data;
  }

  async updateRepositoryMemberRole(
    owner: string,
    repo: string,
    username: string,
    roleData: UpdateRepositoryMemberPermissionRequest
  ): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/members/${username}`, roleData);
    return response.data;
  }

  async transferRepository(owner: string, repo: string, transferData: TransferRepositoryRequest): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/transfer`, transferData);
    return response.data;
  }

  async getRepositoryCustomizedRoles(owner: string, repo: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/customized_roles`);
    return response.data;
  }

  async getRepositoryDownloadStatistics(owner: string, repo: string, startDate?: string, endDate?: string, direction?: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/download_statistics`, {
      params: this.buildParams({
        start_date: startDate,
        end_date: endDate,
        direction
      })
    });
    return response.data;
  }

  async getRepositoryRawFile(owner: string, repo: string, path: string, ref?: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/raw/${path}`, {
      params: ref ? { ref } : {},
      responseType: 'text'
    });
    return response.data;
  }

  async getRepositoryContributorsStatistic(
    owner: string,
    repo: string,
    options: {
      author?: string;
      current_user?: boolean;
      since?: string;
      until?: string;
      ref_name?: string;
    } = {}
  ): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/contributors/statistic`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getRepositoryEvents(
    owner: string,
    repo: string,
    options: {
      filter?: string;
      author?: string;
      before?: string;
      after?: string;
      page?: number;
      perPage?: number;
    } = {}
  ): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/events`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getRepositoryDiscussions(
    owner: string,
    repo: string,
    options: RepositoryDiscussionListOptions = {}
  ): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/discuss`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async getRepositoryDiscussion(owner: string, repo: string, number: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/discuss/${number}`);
    return response.data;
  }

  async getRepositoryDiscussionComments(owner: string, repo: string, number: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/discuss/${number}/comment`);
    return response.data;
  }

  async getRepositoryDiscussionCommentReplies(
    owner: string,
    repo: string,
    number: string,
    commentId: string
  ): Promise<any[]> {
    const response = await this.client.get(
      `/api/v5/repos/${owner}/${repo}/discuss/${number}/comment/${commentId}/reply`
    );
    return response.data;
  }

  async getRepositorySyncStatus(
    owner: string,
    repo: string,
    options: RepositorySyncStatusOptions = {}
  ): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/sync_repo`, {
      params: this.buildParams(options)
    });
    return response.data;
  }

  async syncRepositoryFromSource(owner: string, repo: string, syncData: RepositorySyncPayload = {}): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/sync_repo`, syncData);
    return response.data;
  }

  async getPushRemoteMirrors(owner: string, repo: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/push_remote_mirrors`);
    return response.data;
  }

  async getRepositoryRemoteMirror(owner: string, repo: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/repo_remote_mirror`);
    return response.data;
  }

  async getRepositoryLicense(owner: string, repo: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/license`);
    return response.data;
  }
}
