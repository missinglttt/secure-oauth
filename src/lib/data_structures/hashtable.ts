import IHashtableStatic from 'hashtable';

export class HashTableBase<TValue> {
    protected _store: IHashtable<string, TValue> = new IHashtableStatic<string, TValue>();

    protected put(key: string, value: TValue) {
        this._store.put(key, value);
    }

    protected get(key: string) {
        return this._store.get(key);
    }

    protected remove(key: string) {
        return this._store.remove(key);
    }

    protected count() {
        return this._store.size();
    }

    protected hasKey(key: string) {
        //@ts-ignore
        return this._store.has(key);
    }
}