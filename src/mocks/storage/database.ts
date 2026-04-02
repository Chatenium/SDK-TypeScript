import {DatabaseAPI} from "../../storage/database";

export class DatabaseMock implements DatabaseAPI {
    database: { [collection: string]: { [key: string]: string } } = {};

    set(collection: string, key: string, value: any) {
        this.database[collection][key] = JSON.stringify(value);
    }

    get(collection: string, key: string): any {
        return this.database[collection][key]
    }

    delete(collection: string, key: string) {
        delete this.database[collection][key];
    }

    flush() {
        this.database = {};
    }
}