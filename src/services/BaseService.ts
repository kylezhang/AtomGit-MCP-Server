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
}
