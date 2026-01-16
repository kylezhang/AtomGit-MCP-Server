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
          'PRIVATE-TOKEN': config.token
        })
      }
    });
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
