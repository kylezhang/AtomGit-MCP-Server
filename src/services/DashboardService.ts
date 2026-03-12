import { BaseService } from './BaseService.js';

export class DashboardService extends BaseService {
  
  async getOrganizationKanbanList(owner: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/org/${owner}/kanban/list`);
    return response.data;
  }

  async getOrganizationKanban(owner: string, id: string): Promise<any> {
    const response = await this.client.get(`/api/v5/org/${owner}/kanban/${id}/detail`);
    return response.data;
  }

  async addKanbanItem(owner: string, id: string, itemData: any): Promise<any> {
    const response = await this.client.post(`/api/v5/org/${owner}/kanban/${id}/add_item`, itemData);
    return response.data;
  }

  async updateKanbanItem(owner: string, repo: string, type: string, iid: number, newData: any): Promise<any> {
    const response = await this.client.put(`/api/v5/org/${owner}/kanban/repo/${repo}/${type}/${iid}`, newData);
    return response.data;
  }

  async removeKanbanItem(owner: string, kanbanId: string, itemData: any): Promise<any> {
    const response = await this.client.delete(`/api/v5/org/${owner}/kanban/${kanbanId}/remove_item`, {
      data: itemData
    });
    return response.data;
  }

  async getKanbanContent(owner: string, kanbanId: string): Promise<any[]> {
    const response = await this.client.get(`/api/v5/org/${owner}/kanban/${kanbanId}/item_list`);
    return response.data;
  }

  async updateKanbanState(owner: string, kanbanId: string, stateData: any): Promise<any> {
    const response = await this.client.put(`/api/v5/org/${owner}/kanban/${kanbanId}/state`, stateData);
    return response.data;
  }

  async createOrganizationKanban(owner: string, kanbanData: any): Promise<any> {
    const response = await this.client.post(`/api/v5/org/${owner}/kanban/create`, kanbanData);
    return response.data;
  }

  async updateOrganizationKanban(owner: string, id: string, kanbanData: any): Promise<any> {
    const response = await this.client.put(`/api/v5/org/${owner}/kanban/${id}`, kanbanData);
    return response.data;
  }

  async deleteOrganizationKanban(owner: string, id: string): Promise<any> {
    const response = await this.client.delete(`/api/v5/org/${owner}/kanban/${id}`);
    return response.data;
  }

  async getOrganizationKanbanContent(owner: string, id: string): Promise<any> {
    const response = await this.client.get(`/api/v5/org/${owner}/kanban/${id}/item_list`);
    return response.data;
  }

  async updateOrganizationKanbanContent(owner: string, id: string, contentData: any): Promise<any> {
    const response = await this.client.put(`/api/v5/org/${owner}/kanban/${id}/content`, contentData);
    return response.data;
  }

  async getKanbanItemList(owner: string, kanbanId: string): Promise<any> {
    const response = await this.client.get(`/api/v5/org/${owner}/kanban/${kanbanId}/item_list`);
    return response.data;
  }
}
