export interface KeyringAPI {
    set(key: string, value: any): void;
    get(key: string): string;
    getAll(): string[];
    delete(key: string): void;
}