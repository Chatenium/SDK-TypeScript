export interface SDKConfig {
    apiUrl: string;
}

const DefaultEnvironment: SDKConfig = {
    apiUrl: "https://api.chatenium.hu"
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