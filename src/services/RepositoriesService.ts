import { BaseService } from './BaseService.js';
import {
  AtomGitRepository,
  AtomGitTree,
  CreateFileRequest,
  UpdateFileRequest,
  DeleteFileRequest,
  ModuleSettingRequest,
  UpdateRepositorySettingsRequest,
  UpdateReviewerRequest,
  ArchiveRepositoryRequest,
  TransferRepositoryRequest,
  TransitionModeRequest,
  PushConfigRequest,
  ForkRepositoryRequest,
  RepoSettingsRequest,
  PullRequestSettingsRequest,
  UpdateMemberRoleRequest,
  UploadFileRequest
} from '../types/index.js';

export class RepositoriesService extends BaseService {

  async getRepositoryTree(owner: string, repo: string, sha: string, recursive?: string): Promise<AtomGitTree> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/git/trees/${sha}`, {
      params: recursive ? { recursive } : {}
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
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/contents/${fileData.path}`, fileData);
    return response.data;
  }

  async updateRepositoryFile(owner: string, repo: string, fileData: UpdateFileRequest): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/contents/${fileData.path}`, fileData);
    return response.data;
  }

  async deleteRepositoryFile(owner: string, repo: string, fileData: DeleteFileRequest): Promise<any> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/contents/${fileData.path}`, {
      data: fileData
    });
    return response.data;
  }

  async getRepositoryFileList(owner: string, repo: string, path: string = '', ref?: string, page = 1, perPage = 30): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/file_list`, {
      params: {
        path,
        ref,
        page,
        per_page: perPage
      }
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

  async getRepositoryContributors(owner: string, repo: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/contributors`);
    return response.data;
  }

  async setRepositoryModuleSetting(owner: string, repo: string, moduleData: ModuleSettingRequest): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/module/setting`, moduleData);
    return response.data;
  }

  async updateRepositorySettings(owner: string, repo: string, updateData: UpdateRepositorySettingsRequest): Promise<AtomGitRepository> {
    const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}`, updateData);
    return response.data;
  }

  async deleteRepository(owner: string, repo: string): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}`);
    return response.data;
  }

  async updateRepositoryReviewer(owner: string, repo: string, reviewerData: UpdateReviewerRequest): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/reviewer`, reviewerData);
    return response.data;
  }

  async archiveRepository(org: string, repository: string, archiveData: ArchiveRepositoryRequest): Promise<any> {
    const response = await this.client.put(`/api/v5/org/${org}/repo/${repository}/status`, archiveData);
    return response.data;
  }

  async transferRepositoryToOrg(org: string, repository: string, transferData: TransferRepositoryRequest): Promise<any> {
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

  async getRepositoryForks(owner: string, repo: string, page = 1, perPage = 30): Promise<AtomGitRepository[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/forks`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  async uploadRepositoryImage(owner: string, repo: string, fileData: UploadFileRequest): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/img/upload`, fileData);
    return response.data;
  }

  async uploadRepositoryFile(owner: string, repo: string, fileData: UploadFileRequest): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/file/upload`, fileData);
    return response.data;
  }

  async getRepositorySubscribers(owner: string, repo: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/subscribers`);
    return response.data;
  }

  async getRepositoryStargazers(owner: string, repo: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/stargazers`);
    return response.data;
  }

  async updateRepositoryRepoSettings(owner: string, repo: string, settings: RepoSettingsRequest): Promise<any> {
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

  async updateRepositoryPullRequestSettings(owner: string, repo: string, settings: PullRequestSettingsRequest): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/pull_request_settings`, settings);
    return response.data;
  }

  async updateRepositoryMemberRole(owner: string, repo: string, username: string, roleData: UpdateMemberRoleRequest): Promise<any> {
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

  async getRepositoryDownloadStatistics(owner: string, repo: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/download_statistics`);
    return response.data;
  }

  async getRepositoryRawFile(owner: string, repo: string, path: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/raw/${path}`);
    return response.data;
  }

  async getRepositoryContributorsStatistic(owner: string, repo: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/contributors/statistic`);
    return response.data;
  }

  async getRepositoryEvents(owner: string, repo: string, _accessToken?: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/events`);
    return response.data;
  }
}
