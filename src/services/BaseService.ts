import axios, { AxiosInstance } from 'axios';
import { AtomGitConfig } from '../types/index.js';

export abstract class BaseService {
  protected client: AxiosInstance;

  constructor(config: AtomGitConfig) {
    this.client = axios.create({
      baseURL: config.apiBaseUrl,
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Version': '2023-02-21',
        ...(config.token && {
          'Authorization': `Bearer ${config.token}`,
          'PRIVATE-TOKEN': config.token,
          'Private-Token': config.token,
          'token': config.token
        })
      }
    });
  }

  // URL 路径参数按段编码：保留 / 分隔符，其余特殊字符（空格/中文/# 等）转义（用于文件路径）
  protected encodePath(path: string): string {
    return path.split('/').map(encodeURIComponent).join('/');
  }

  // URL 路径参数整体编码：/ 也编码为 %2F（用于分支/tag/ref 等名字，AtomGit 服务端要求全编码）
  protected encodeName(name: string): string {
    return encodeURIComponent(name);
  }

  // protected async request<T = any>(method: string, url: string, data?: any, params?: any): Promise<T> {
  //   try {
  //     let response;
  //     switch (method.toLowerCase()) {
  //       case 'get':
  //         response = await this.client.get(url, { params });
  //         break;
  //       case 'post':
  //         response = await this.client.post(url, data, { params });
  //         break;
  //       case 'put':
  //         response = await this.client.put(url, data, { params });
  //         break;
  //       case 'delete':
  //         response = await this.client.delete(url, { params });
  //         break;
  //       case 'patch':
  //         response = await this.client.patch(url, data, { params });
  //         break;
  //       default:
  //         throw new Error(`Unsupported HTTP method: ${method}`);
  //     }
  //     return response.data;
  //   } catch (error) {
  //     console.error(`BaseService ${method} request failed:`, error);
  //     throw error;
  //   }
  // }
}
