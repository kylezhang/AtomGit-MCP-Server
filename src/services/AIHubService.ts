import { BaseService } from './BaseService.js';

export class AIHubService extends BaseService {
  
  async chatCompletion(data: any): Promise<any> {
    const response = await this.client.post('/api/v5/chat/completions', data);
    return response.data;
  }

  async similarity(data: any): Promise<any> {
    const response = await this.client.post('/api/v5/similarity', data);
    return response.data;
  }

  async audioTranscription(data: any): Promise<any> {
    const response = await this.client.post('/api/v1/audio/transcriptions', data);
    return response.data;
  }

  async detectYolo(data: any): Promise<any> {
    const response = await this.client.post('/api/v5/detect/yolo', data);
    return response.data;
  }

  async videoGenerate(data: any): Promise<any> {
    const response = await this.client.post('/api/v5/video/generate', data);
    return response.data;
  }

  async videoStatus(data: any): Promise<any> {
    const response = await this.client.post('/api/v5/video/status', data);
    return response.data;
  }

  async audioClassification(data: any): Promise<any> {
    const response = await this.client.post('/api/v5/audio/classification', data);
    return response.data;
  }
}
