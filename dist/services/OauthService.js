import { BaseService } from './BaseService.js';
export class OauthService extends BaseService {
    async getOauthToken(code, clientId, clientSecret) {
        const response = await this.client.post('/oauth/token', {
            grant_type: 'authorization_code',
            code,
            client_id: clientId,
            client_secret: clientSecret
        });
        return response.data;
    }
}
//# sourceMappingURL=OauthService.js.map