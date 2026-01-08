export class AIHubTools {
    atomGitService;
    constructor(atomGitService) {
        this.atomGitService = atomGitService;
    }
    getTools() {
        return [
            {
                name: 'chat_completion',
                description: 'AI文本生成完成',
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
                name: 'speech_recognition',
                description: 'AI语音识别',
                inputSchema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'object',
                            description: '语音识别请求数据（包含audio、format等）'
                        }
                    },
                    required: ['data']
                }
            },
            {
                name: 'object_detection',
                description: 'AI物体检测',
                inputSchema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'object',
                            description: '物体检测请求数据（包含image、threshold等）'
                        }
                    },
                    required: ['data']
                }
            },
            {
                name: 'text_embedding',
                description: 'AI文本嵌入',
                inputSchema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'object',
                            description: '文本嵌入请求数据（包含input、model等）'
                        }
                    },
                    required: ['data']
                }
            },
            {
                name: 'image_generation',
                description: 'AI图像生成',
                inputSchema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'object',
                            description: '图像生成请求数据（包含prompt、size、style等）'
                        }
                    },
                    required: ['data']
                }
            },
            {
                name: 'audio_synthesis',
                description: 'AI音频合成',
                inputSchema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'object',
                            description: '音频合成请求数据（包含text、voice、speed等）'
                        }
                    },
                    required: ['data']
                }
            },
            {
                name: 'translation',
                description: 'AI文本翻译',
                inputSchema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'object',
                            description: '文本翻译请求数据（包含text、source_lang、target_lang等）'
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
                return await this.atomGitService.chatCompletion(args.data);
            case 'speech_recognition':
                return await this.atomGitService.speechRecognition(args.data);
            case 'object_detection':
                return await this.atomGitService.objectDetection(args.data);
            case 'text_embedding':
                return await this.atomGitService.textEmbedding(args.data);
            case 'image_generation':
                return await this.atomGitService.imageGeneration(args.data);
            case 'audio_synthesis':
                return await this.atomGitService.audioSynthesis(args.data);
            case 'translation':
                return await this.atomGitService.translation(args.data);
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
}
//# sourceMappingURL=AIHubTools.js.map