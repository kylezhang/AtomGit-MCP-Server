import { BaseService } from './BaseService.js';

export class DashboardService extends BaseService {
  async getOrganizationKanbanList(
    owner: string,
    status?: string | number,
    sort?: string,
    visibility?: string | number,
    search?: string,
    page?: string | number,
    perPage?: string | number
  ): Promise<any[]> {
    const response = await this.client.get(`/api/v5/org/${owner}/kanban/list`, {
      params: {
        status,
        sort,
        visibility,
        search,
        page,
        per_page: perPage
      }
    });
    return response.data;
  }

  async getOrganizationKanban(owner: string, id: string): Promise<any> {
    const response = await this.client.get(`/api/v5/org/${owner}/kanban/${id}/detail`);
    return response.data;
  }

  async addKanbanItem(
    owner: string,
    id: string,
    itemData: {
      repo: string;
      issue_iids: number[];
      pr_iids: number[];
    }
  ): Promise<any> {
    const response = await this.client.post(`/api/v5/org/${owner}/kanban/${id}/add_item`, itemData);
    return response.data;
  }

  async updateKanbanItem(
    owner: string,
    repo: string,
    type: string,
    iid: string | number,
    newData: {
      kanban_id: string;
    }
  ): Promise<any> {
    const response = await this.client.put(`/api/v5/org/${owner}/kanban/repo/${repo}/${type}/${iid}`, newData);
    return response.data;
  }

  async removeKanbanItem(
    owner: string,
    kanbanId: string,
    itemData?: {
      repo?: string;
      issue_iids?: number[];
      pr_iids?: number[];
    }
  ): Promise<any> {
    const response = await this.client.delete(`/api/v5/org/${owner}/kanban/${kanbanId}/remove_item`, {
      data: itemData
    });
    return response.data;
  }

  async getKanbanContent(owner: string, kanbanId: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/org/${owner}/kanban/${kanbanId}/item_list`);
    return response.data;
  }

  async updateKanbanState(owner: string, kanbanId: string, stateData: { state: 'archived' | 'active' }): Promise<any> {
    const response = await this.client.put(`/api/v5/org/${owner}/kanban/${kanbanId}/state`, stateData);
    return response.data;
  }

  async getKanbanItemList(
    owner: string,
    kanbanId: string,
    repo?: string,
    sourceType?: string,
    sourceStatus?: string,
    title?: string,
    sourceIids?: string,
    page?: string | number,
    perPage?: string | number
  ): Promise<any> {
    const response = await this.client.get(`/api/v5/org/${owner}/kanban/${kanbanId}/item_list`, {
      params: {
        repo,
        source_type: sourceType,
        source_status: sourceStatus,
        title,
        source_iids: sourceIids,
        page,
        per_page: perPage
      }
    });
    return response.data;
  }
}
