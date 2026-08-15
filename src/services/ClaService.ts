import { BaseService } from './BaseService.js';

export class ClaService extends BaseService {
  async getRepositoryClas(owner: string, repo: string): Promise<any> {
    const response = await this.client.get(`/api/v5/repos/${owner}/${repo}/clas`);
    return response.data;
  }

  async configureRepositoryCla(owner: string, repo: string, claId?: string, enforceCheck?: boolean): Promise<any> {
    const payload: Record<string, unknown> = {
      cla_id: claId ?? ''
    };
    if (enforceCheck !== undefined) {
      payload.enforce_check = enforceCheck;
    }
    const response = await this.client.put(`/api/v5/repos/${owner}/${repo}/cla`, payload);
    return response.data;
  }
}
