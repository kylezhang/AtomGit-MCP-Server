import { BaseService } from './BaseService.js';

export class ClaService extends BaseService {
  async getRepositoryClas(owner: string, repo: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/clas`);
    return response.data;
  }

  async configureRepositoryCla(owner: string, repo: string, claId?: string): Promise<any> {
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/cla`, {
      cla_id: claId ?? ''
    });
    return response.data;
  }
}
