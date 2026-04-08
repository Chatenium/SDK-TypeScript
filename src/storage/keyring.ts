export interface KeyringAPI {
    set(key: string, value: any): void;
    get(key: string): Promise<string>;
    getAll(): Promise<string[]>;
    delete(key: string): void;
}