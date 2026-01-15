import axios from 'axios';
export class BaseService {
    client;
    constructor(config) {
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
//# sourceMappingURL=BaseService.js.map