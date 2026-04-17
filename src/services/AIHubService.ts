import { BaseService } from './BaseService.js';
import { AtomGitConfig } from '../types/index.js';

interface ChatCompletionPayload {
  model: string;
  messages: string[];
  temperature?: number;
  top_k?: number;
  top_p?: number;
  frequency_penalty?: number;
  maxTokens?: number;
}

interface SentenceSimilarityPayload {
  model: string;
  inputs: {
    source_sentence: string;
    sentences: string[];
  };
}

interface AudioTranscriptionPayload {
  file: string;
  model: string;
  temperature?: string;
}

interface ObjectDetectionPayload {
  model: string;
  source: string;
  imgsz: number;
  conf: number;
  iou: number;
}

interface VideoGenerationPayload {
  img_url: string;
  model: string;
  prompt: string;
  seed?: number;
}

interface VideoStatusPayload {
  request_id: string;
}

interface AudioClassificationPayload {
  model?: string;
  file: string;
}

export class AIHubService extends BaseService {
  
  constructor(config: AtomGitConfig) {
    super(config);
  }

  async chatCompletion(data: ChatCompletionPayload): Promise<any> {
    const response = await this.client.post('/api/v5/chat/completions', data);
    return response.data;
  }

  async similarity(data: SentenceSimilarityPayload): Promise<any> {
    const response = await this.client.post('/api/v5/similarity', data);
    return response.data;
  }

  async audioTranscription(data: AudioTranscriptionPayload): Promise<any> {
    const response = await this.client.post('/api/v5/audio/transcriptions', data);
    return response.data;
  }

  async detectYolo(data: ObjectDetectionPayload): Promise<any> {
    const response = await this.client.post('/api/v5/detect/yolo', data);
    return response.data;
  }

  async videoGenerate(data: VideoGenerationPayload): Promise<any> {
    const response = await this.client.post('/api/v5/video/generate', data);
    return response.data;
  }

  async videoStatus(data: VideoStatusPayload): Promise<any> {
    const response = await this.client.post('/api/v5/video/status', data);
    return response.data;
  }

  async audioClassification(data: AudioClassificationPayload): Promise<any> {
    const { model, ...body } = data;
    const response = await this.client.post('/api/v5/audio/classification', body, {
      params: model ? { model } : {}
    });
    return response.data;
  }
}
