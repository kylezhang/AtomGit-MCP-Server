import { BaseService } from './BaseService.js';

export class OauthService extends BaseService {
  
  async getOauthToken(code: string, clientId: string, clientSecret: string): Promise<any> {
    const response = await this.client.post('/oauth/token', {
      grant_type: 'authorization_code',
      code,
      client_id: clientId,
      client_secret: clientSecret
    });
    return response.data;
  }
}
