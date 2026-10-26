export interface DatabaseAPI {
    set(collection: string, key: string, value: any): void;
    get(collection: string, key: string): Promise<string>;
    delete(collection: string, key: string): void;
    flush(): void;
}