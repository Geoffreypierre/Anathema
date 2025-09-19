import axios from 'axios';

export class ApiService {
    static async sendRequest(requestData) {
        const { method, url, headers = [], body } = requestData;

        const startTime = Date.now();

        const config = {
            method: method.toLowerCase(),
            url,
            headers: {},
            validateStatus: () => true
        };

        headers.forEach(header => {
            if (header.key && header.value) {
                config.headers[header.key] = header.value;
            }
        });

        if (body && ['post', 'put', 'patch'].includes(config.method)) {
            try {
                config.data = JSON.parse(body);
                config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
            } catch {
                config.data = body;
                config.headers['Content-Type'] = config.headers['Content-Type'] || 'text/plain';
            }
        }

        try {
            const response = await axios(config);
            const endTime = Date.now();

            return {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                data: typeof response.data === 'object'
                    ? JSON.stringify(response.data, null, 2)
                    : response.data,
                duration: endTime - startTime,
                size: this.calculateSize(response.data)
            };
        } catch (error) {
            const endTime = Date.now();

            if (error.response) {
                return {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    headers: error.response.headers,
                    data: typeof error.response.data === 'object'
                        ? JSON.stringify(error.response.data, null, 2)
                        : error.response.data,
                    duration: endTime - startTime,
                    size: this.calculateSize(error.response.data)
                };
            }

            throw new Error(error.message || 'Network error');
        }
    }

    static calculateSize(data) {
        if (!data) return '0 B';

        const bytes = new Blob([typeof data === 'string' ? data : JSON.stringify(data)]).size;

        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return Math.round(bytes / 1024) + ' KB';
        return Math.round(bytes / 1048576) + ' MB';
    }

    static replaceVariables(text, environment) {
        if (!environment || !environment.variables) return text;

        let result = text;
        Object.entries(environment.variables).forEach(([key, value]) => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            result = result.replace(regex, value);
        });

        return result;
    }
}