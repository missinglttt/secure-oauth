import { Schema, SchemaOptions } from 'mongoose';
import { createStore } from './database';

export class BaseDataModel {
    private _schema: Schema;
    private _modelName: string;

    constructor(schema: any, modelName: string, options?: SchemaOptions) {
        schema.time = {
            type: Number,
            default: Date.now
        };

        if (options) {
            this._schema = new Schema(schema, options);
        } else {
            this._schema = new Schema(schema);
        }

        this._modelName = modelName;
        createStore().model(modelName, this._schema);
    }

    static randomId() {
        return createStore().randomId();
    }

    getModel() {
        let models = createStore().modelNames();
        if (models.indexOf(this._modelName) >= 0) {
            return createStore().model(this._modelName);
        } else {
            return createStore().model(this._modelName, this._schema);
        }
    }

    paginate(query: any, page: number, count: number, sort: any) {
        let skip = page > 0 ? (page - 1) * count : 0;
        let take = count > 0 ? count : 10;

        //build query
        let model = this.getModel();
        let action = model.find(query);
        if (sort) {
            action.sort(sort);
        }

        action.limit(take + 1); //add 1 item to check the end of query
        action.skip(skip);
        return action.exec()
            .then(data => {
                let hasMore = false;
                if (data.length === take + 1) {
                    hasMore = true;
                    data.pop();
                }

                return Promise.resolve({
                    hasMore,
                    payload: data
                });
            })
            .catch(err => {
                return Promise.reject(err);
            });
    }
}