import { BaseService } from './BaseService.js';
import { CreateReleaseRequest, UpdateReleaseRequest, Release } from '../types/index.js';

export class ReleaseService extends BaseService {
  
  async createRelease(owner: string, repo: string, releaseData: CreateReleaseRequest): Promise<Release> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/releases`, releaseData);
    return response.data;
  }

  async updateRelease(owner: string, repo: string, tag: string, releaseData: UpdateReleaseRequest): Promise<Release> {
    const response = await this.client.patch(`/api/v5/repos/${owner}/${repo}/releases/${tag}`, releaseData);
    return response.data;
  }

  async getReleaseUploadUrl(owner: string, repo: string, tag: string, fileName?: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/releases/${tag}/upload_url`, {
      params: { file_name: fileName }
    });
    return response.data;
  }

  async getRelease(owner: string, repo: string, tag: string, tempDownloadUrl?: string | boolean): Promise<Release> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/releases/${tag}`, {
      params: { temp_download_url: tempDownloadUrl }
    });
    return response.data;
  }

  async getLatestRelease(owner: string, repo: string, type?: string): Promise<Release> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/releases/latest`, {
      params: { type }
    });
    return response.data;
  }

  async getReleaseByTag(owner: string, repo: string, tag: string): Promise<Release> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/releases/tags/${tag}`);
    return response.data;
  }

  async getReleases(owner: string, repo: string, page = 1, perPage = 30, direction?: string): Promise<Release[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/releases`, {
      params: {
        page,
        per_page: perPage,
        direction
      }
    });
    return response.data;
  }

  async downloadReleaseAsset(owner: string, repo: string, tag: string, fileName: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/releases/${tag}/attach_files/${fileName}/download`);
    return response.data;
  }

  async deleteReleaseAttachment(owner: string, repo: string, tag: string, attachFileId: string | number): Promise<void> {
    await this.client.delete(`/api/v5/repos/${owner}/${repo}/releases/${tag}/attach_files/${attachFileId}`);
  }
}
