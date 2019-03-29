import _ from 'lodash';
import { Queue } from './queue';
import { EventEmitter } from 'events';

export interface TaskHandler<TValue, TResult> {
    (item: TValue, toUpper: boolean): TResult;
};

export class TaskPool<TValue, TResult> extends EventEmitter {
    private _isRunning: boolean = false;
    private _pool: Queue<TValue> = new Queue<TValue>();
    private _work: TaskHandler<TValue, TResult>;

    constructor(fn: TaskHandler<TValue, TResult>) {
        super();
        this._work = fn;
    }

    isRunning() {
        return this._isRunning;
    }

    count() {
        return this._pool.count();
    }

    async run(items: Array<TValue>) {
        for (let i = 0; i < items.length; i++) {
            this._pool.enqueue(items[i]);
        }

        if (!this._isRunning) {
            this._isRunning = true;
            this.next();
        }
    }

    next() {
        let item = this._pool.dequeue();
        if (item === null) {
            this._isRunning = false;
            this.emit("complete", "queue_completed");
            return;
        }

        try {
            this._work(item, this.done.bind(this));
        } catch (err) {
            this.done(err, null, item);
        }
    }

    done(err: Error, result: TResult, item: TValue) {
        if (err) {
            this.emit("error", err, item);
        } else {
            this.emit("done", result, item);
        }

        setImmediate(this.next.bind(this));
    }

    dump() {
        return this._pool.dump();
    }
}