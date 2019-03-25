import { HashTableBase } from '../data_structures/hashtable';

const NO_INSTANCE = "no_instance_of_type";

export interface IDenpendencyProvider {
    instanceOf<T>(key: string): T;
    register<T>(key: string, value: T): number;
}

export class DependencyProvider extends HashTableBase<any> implements IDenpendencyProvider {
    constructor() {
        super();
    }

    instanceOf<T>(key: string) {
        if (!this.hasKey(key)) {
            throw new Error(NO_INSTANCE + "_" + key);
        }

        return this.get(key) as T;
    }

    register<T>(key: string, value: T) {
        this.put(key, value);
        return this.count();
    }
}