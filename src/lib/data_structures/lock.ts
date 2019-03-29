import _ from 'lodash';

export class Lock<TKey> {
    private _locks: Array<TKey> = [];

    isLock(key: TKey) {
        return this._locks.indexOf(key) >= 0;
    }

    count() {
        return this._locks.length;
    }

    lock(key: TKey) {
        if (this.isLock(key)) {
            return;
        }

        this._locks.push(key);
    }

    unlock(key: TKey) {
        let index = this._locks.indexOf(key);
        if (index < 0) {
            return;
        }

        _.remove(this._locks, (item) => {
            return item === key;
        })
    }
}