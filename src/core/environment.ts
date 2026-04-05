export interface SDKConfig {
    apiUrl: string;
    cdnUrl: string;
}

const isNode =
    typeof process !== 'undefined' &&
    typeof process.versions !== 'undefined' &&
    typeof process.versions.node !== 'undefined';

if (isNode) {
    try {
        require('dotenv').config();
    } catch { }
}

const getEnv = (key: string): string | undefined => {
    if (!isNode) return undefined;
    return process.env?.[key];
};

const DefaultEnvironment: SDKConfig = {
    apiUrl: getEnv('API_URL') ?? "https://api.chatenium.hu",
    cdnUrl: getEnv('CDN_URL') ?? "https://cdn.chatenium.hu",
};

let currentConfig: SDKConfig = { ...DefaultEnvironment };

export const environment = {
    get(): SDKConfig {
        return { ...currentConfig };
    },
    overwrite(newConfig: Partial<SDKConfig>): void {
        currentConfig = {
            ...currentConfig,
            ...newConfig,
        };
    },
    reset(): void {
        currentConfig = { ...DefaultEnvironment };
    }
};