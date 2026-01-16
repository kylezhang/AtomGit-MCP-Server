import { BaseService } from './BaseService.js';
import { Tag, CreateTagRequest, CreateProtectedTagRequest } from '../types/index.js';

export class TagService extends BaseService {
  
  async getRepositoryTags(owner: string, repo: string, page = 1, perPage = 30): Promise<Tag[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/tags`, {
      params: {
        page,
        per_page: perPage
      }
    });
    return response.data;
  }

  async createRepositoryTag(owner: string, repo: string, tagData: CreateTagRequest): Promise<Tag> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/tags`, tagData);
    return response.data;
  }

  async deleteRepositoryTag(owner: string, repo: string, tagName: string): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/tags/${tagName}`);
    return response.data;
  }

  async getRepositoryProtectedTags(owner: string, repo: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/protected_tags`);
    return response.data;
  }

  async createRepositoryProtectedTag(owner: string, repo: string, tagData: CreateProtectedTagRequest): Promise<any> {
    const response = await this.client.post(`/api/v5/repos/${owner}/${repo}/protected_tags`, tagData);
    return response.data;
  }

  async updateRepositoryProtectedTag(owner: string, repo: string, tagData: CreateProtectedTagRequest): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/protected_tags`, tagData);
    return response.data;
  }

  async deleteRepositoryProtectedTag(owner: string, repo: string, tagName: string): Promise<void> {
    const response = await this.client.delete(`/api/v5/repos/${owner}/${repo}/protected_tags/${tagName}`);
    return response.data;
  }

  async getRepositoryProtectedTag(owner: string, repo: string, tagName: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/protected_tags/${tagName}`);
    return response.data;
  }
}
