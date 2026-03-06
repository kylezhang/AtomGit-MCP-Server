export class AIHubTools {
    aiHubService;
    constructor(aiHubService) {
        this.aiHubService = aiHubService;
    }
    getTools() {
        return [
            {
                name: 'chat_completion',
                description: 'AI文本生成完成 (Chat Completion)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'object',
                            description: 'AI聊天完成请求数据（包含model、messages、temperature等）'
                        }
                    },
                    required: ['data']
                }
            },
            {
                name: 'sentence_similarity',
                description: '句子相似度 (Sentence Similarity)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'object',
                            description: '句子相似度请求数据（包含source_sentence, target_sentences等）'
                        }
                    },
                    required: ['data']
                }
            },
            {
                name: 'audio_transcription',
                description: 'AI语音识别 (Automatic Speech Recognition)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'object',
                            description: '语音识别请求数据（包含file等）'
                        }
                    },
                    required: ['data']
                }
            },
            {
                name: 'object_detection',
                description: 'AI物体检测 (Object Detection - YOLO)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'object',
                            description: '物体检测请求数据（包含image等）'
                        }
                    },
                    required: ['data']
                }
            },
            {
                name: 'video_generation_create',
                description: 'AI图像生成视频 - 创建任务 (Image to Video Generation - Create Task)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'object',
                            description: '视频生成请求数据（包含image, prompt等）'
                        }
                    },
                    required: ['data']
                }
            },
            {
                name: 'video_generation_status',
                description: 'AI图像生成视频 - 查询状态 (Image to Video Generation - Query Status)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'object',
                            description: '视频生成状态查询数据（包含task_id等）'
                        }
                    },
                    required: ['data']
                }
            },
            {
                name: 'audio_classification',
                description: 'AI音频分类 (Audio Classification)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'object',
                            description: '音频分类请求数据（包含file等）'
                        }
                    },
                    required: ['data']
                }
            }
        ];
    }
    async callTool(name, args) {
        switch (name) {
            case 'chat_completion':
                return await this.aiHubService.chatCompletion(args.data);
            case 'sentence_similarity':
                return await this.aiHubService.similarity(args.data);
            case 'audio_transcription':
                return await this.aiHubService.audioTranscription(args.data);
            case 'object_detection':
                return await this.aiHubService.detectYolo(args.data);
            case 'video_generation_create':
                return await this.aiHubService.videoGenerate(args.data);
            case 'video_generation_status':
                return await this.aiHubService.videoStatus(args.data);
            case 'audio_classification':
                return await this.aiHubService.audioClassification(args.data);
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
}
//# sourceMappingURL=AIHubTools.js.map