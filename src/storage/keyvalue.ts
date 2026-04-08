export interface KeyValueAPI {
    set(key: string, value: any): void;
    get(key: string): string;
    delete(key: string): void;
    flush(): void;
}