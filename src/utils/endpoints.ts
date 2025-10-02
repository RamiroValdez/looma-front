export const buildEndpoint = (endpoint: string, params?: Record<string, string | number>) => {
    let url = endpoint;

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            url = url.replace(`{${key}}`, String(value));
        });
    }

    return url;
};