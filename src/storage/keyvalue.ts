export interface KeyValueAPI {
    set(key: string, value: any): void;
    get(key: string): Promise<string>;
    delete(key: string): void;
    flush(): void;
}