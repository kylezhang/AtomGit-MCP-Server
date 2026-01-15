import { BaseService } from './BaseService.js';
export class DashboardService extends BaseService {
    async getOrganizationKanbanList(owner) {
        const response = await this.client.get(`/api/v5/org/${owner}/kanban/list`);
        return response.data;
    }
    async getOrganizationKanban(owner, id) {
        const response = await this.client.get(`/api/v5/org/${owner}/kanban/${id}/detail`);
        return response.data;
    }
    async addKanbanItem(owner, id, itemData) {
        const response = await this.client.post(`/api/v5/org/${owner}/kanban/${id}/add_item`, itemData);
        return response.data;
    }
    async updateKanbanItem(owner, repo, type, iid, newData) {
        const response = await this.client.put(`/api/v5/org/${owner}/kanban/${repo}/${type}/${iid}/new`, newData);
        return response.data;
    }
    async removeKanbanItem(owner, kanbanId, itemData) {
        const response = await this.client.delete(`/api/v5/org/${owner}/kanban/${kanbanId}/remove_item_new`, {
            data: itemData
        });
        return response.data;
    }
    async getKanbanContent(owner, kanbanId) {
        const response = await this.client.get(`/api/v5/org/${owner}/kanban/${kanbanId}/item_list`);
        return response.data;
    }
    async updateKanbanState(owner, kanbanId, stateData) {
        const response = await this.client.put(`/api/v5/org/${owner}/kanban/${kanbanId}/state`, stateData);
        return response.data;
    }
    async createOrganizationKanban(owner, kanbanData) {
        const response = await this.client.post(`/api/v5/org/${owner}/kanban/create`, kanbanData);
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
}
//# sourceMappingURL=DashboardService.js.map