export interface SDKConfig {
    apiUrl: string;
    cdnUrl: string;
}

const DefaultEnvironment: SDKConfig = {
    apiUrl: "https://api.chatenium.hu",
    cdnUrl: "https://cdn.chatenium.hu",
}

let currentConfig = {...DefaultEnvironment}

export const environment = {
    get: () => currentConfig,
    overwrite: (newConfig: Partial<SDKConfig>) => {
        currentConfig = {
            ...currentConfig,
            ...newConfig,
        };
    },
}