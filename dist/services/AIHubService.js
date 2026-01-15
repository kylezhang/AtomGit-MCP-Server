import { BaseService } from './BaseService.js';
export class AIHubService extends BaseService {
    async chatCompletion(data) {
        const response = await this.client.post('/api/v5/chat/completions', data);
        return response.data;
    }
    async similarity(data) {
        const response = await this.client.post('/api/v5/similarity', data);
        return response.data;
    }
    async audioTranscription(data) {
        const response = await this.client.post('/api/v1/audio/transcriptions', data);
        return response.data;
    }
    async detectYolo(data) {
        const response = await this.client.post('/api/v5/detect/yolo', data);
        return response.data;
    }
    async videoGenerate(data) {
        const response = await this.client.post('/api/v5/video/generate', data);
        return response.data;
    }
    async videoStatus(data) {
        const response = await this.client.post('/api/v5/video/status', data);
        return response.data;
    }
    async audioClassification(data) {
        const response = await this.client.post('/api/v5/audio/classification', data);
        return response.data;
    }
}
//# sourceMappingURL=AIHubService.js.map