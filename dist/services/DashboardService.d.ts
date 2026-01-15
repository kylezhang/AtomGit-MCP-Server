import { BaseService } from './BaseService.js';
export declare class DashboardService extends BaseService {
    getOrganizationKanbanList(owner: string): Promise<any[]>;
    getOrganizationKanban(owner: string, id: string): Promise<any>;
    addKanbanItem(owner: string, id: string, itemData: any): Promise<any>;
    updateKanbanItem(owner: string, repo: string, type: string, iid: number, newData: any): Promise<any>;
    removeKanbanItem(owner: string, kanbanId: string, itemData: any): Promise<any>;
    getKanbanContent(owner: string, kanbanId: string): Promise<any[]>;
    updateKanbanState(owner: string, kanbanId: string, stateData: any): Promise<any>;
    createOrganizationKanban(owner: string, kanbanData: any): Promise<any>;
    updateOrganizationKanban(owner: string, id: string, kanbanData: any): Promise<any>;
    deleteOrganizationKanban(owner: string, id: string): Promise<any>;
    getOrganizationKanbanContent(owner: string, id: string): Promise<any>;
    updateOrganizationKanbanContent(owner: string, id: string, contentData: any): Promise<any>;
}
//# sourceMappingURL=DashboardService.d.ts.map