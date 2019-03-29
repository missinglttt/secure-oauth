export class QueueItem<TValue> {
    public value: TValue;
    public id: number;
    constructor(_value: TValue, _id: number = 0) {
        this.value = _value;
        this.id = _id;
    }
}

export class Queue<TValue> {
    private _queue: Array<QueueItem<TValue>>;
    constructor() {
        this._queue = [];
    }

    enqueue(item: TValue) {
        let qItem = new QueueItem<TValue>(item, this._queue.length);
        this._queue.push(qItem);
    }

    dequeue() {
        let item = this._queue.shift();
        return item ? item.value : null;
    }

    count() {
        return this._queue.length;
    }

    dump() {
        return this._queue;
    }
}