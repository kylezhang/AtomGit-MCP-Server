import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { AIHubService } from '../services/AIHubService.js';

export class AIHubTools {
  private aiHubService: AIHubService;

  constructor(aiHubService: AIHubService) {
    this.aiHubService = aiHubService;
  }

  getTools(): Tool[] {
    return [
      {
        name: 'chat_completion',
        description: 'AI文本生成完成 (Chat Completion)',
        inputSchema: {
          type: 'object',
          properties: {
            model: { type: 'string', description: '模型名称' },
            messages: {
              type: 'array',
              description: '消息列表',
              items: { type: 'string' }
            },
            temperature: { type: 'number', description: '采样温度' },
            top_k: { type: 'number', description: 'top_k' },
            top_p: { type: 'number', description: 'top_p' },
            frequency_penalty: { type: 'number', description: '频率惩罚系数' },
            maxTokens: { type: 'number', description: '最大 Token 数' }
          },
          required: ['model', 'messages']
        }
      },
      {
        name: 'sentence_similarity',
        description: '句子相似度 (Sentence Similarity)',
        inputSchema: {
          type: 'object',
          properties: {
            model: { type: 'string', description: '模型名称' },
            inputs: {
              type: 'object',
              description: '输入参数',
              properties: {
                source_sentence: { type: 'string', description: '源文本' },
                sentences: {
                  type: 'array',
                  description: '目标文本数组',
                  items: { type: 'string' }
                }
              },
              required: ['source_sentence', 'sentences']
            }
          },
          required: ['model', 'inputs']
        }
      },
      {
        name: 'audio_transcription',
        description: 'AI语音识别 (Automatic Speech Recognition)',
        inputSchema: {
          type: 'object',
          properties: {
            file: { type: 'string', description: '音频文件内容或路径标识' },
            model: { type: 'string', description: '模型名称' },
            temperature: { type: 'string', description: '采样温度' }
          },
          required: ['file', 'model']
        }
      },
      {
        name: 'object_detection',
        description: 'AI物体检测 (Object Detection - YOLO)',
        inputSchema: {
          type: 'object',
          properties: {
            model: { type: 'string', description: 'YOLO 模型权重文件名称' },
            source: { type: 'string', description: '待检测图片 base64 编码字符串' },
            imgsz: { type: 'number', description: '输入图像尺寸' },
            conf: { type: 'number', description: '置信度阈值' },
            iou: { type: 'number', description: 'IOU 阈值' }
          },
          required: ['model', 'source', 'imgsz', 'conf', 'iou']
        }
      },
      {
        name: 'video_generation_create',
        description: 'AI图像生成视频 - 创建任务 (Image to Video Generation - Create Task)',
        inputSchema: {
          type: 'object',
          properties: {
            img_url: { type: 'string', description: '图片 URL 或 Base64 内容' },
            model: { type: 'string', description: '模型名称' },
            prompt: { type: 'string', description: '提示词' },
            seed: { type: 'number', description: '随机种子' }
          },
          required: ['img_url', 'model', 'prompt']
        }
      },
      {
        name: 'video_generation_status',
        description: 'AI图像生成视频 - 查询状态 (Image to Video Generation - Query Status)',
        inputSchema: {
          type: 'object',
          properties: {
            request_id: {
              type: 'string',
              description: '请求 ID'
            }
          },
          required: ['request_id']
        }
      },
      {
        name: 'audio_classification',
        description: 'AI音频分类 (Audio Classification)',
        inputSchema: {
          type: 'object',
          properties: {
            model: {
              type: 'string',
              description: '模型名称'
            },
            file: {
              type: 'string',
              description: '音频文件内容或路径标识'
            }
          },
          required: ['model', 'file']
        }
      }
    ];
  }

  async callTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'chat_completion':
        return await this.aiHubService.chatCompletion({
          model: args.model,
          messages: args.messages,
          temperature: args.temperature,
          top_k: args.top_k,
          top_p: args.top_p,
          frequency_penalty: args.frequency_penalty,
          maxTokens: args.maxTokens
        });
      
      case 'sentence_similarity':
        return await this.aiHubService.similarity({
          model: args.model,
          inputs: args.inputs
        });
      
      case 'audio_transcription':
        return await this.aiHubService.audioTranscription({
          file: args.file,
          model: args.model,
          temperature: args.temperature
        });
      
      case 'object_detection':
        return await this.aiHubService.detectYolo({
          model: args.model,
          source: args.source,
          imgsz: args.imgsz,
          conf: args.conf,
          iou: args.iou
        });
      
      case 'video_generation_create':
        return await this.aiHubService.videoGenerate({
          img_url: args.img_url,
          model: args.model,
          prompt: args.prompt,
          seed: args.seed
        });
      
      case 'video_generation_status':
        return await this.aiHubService.videoStatus({
          request_id: args.request_id
        });
      
      case 'audio_classification':
        return await this.aiHubService.audioClassification({
          model: args.model,
          file: args.file
        });
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}
