import * as _ from 'lodash';
import { Headers, get, post, Response } from 'request';
import { HttpResponseModel } from './response.model';

export class RequestPromise {
    getDefaultHeader() {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        return headers;
    }

    private onResponse<T>(error: Error, res: Response, body: any) {
        let response = new HttpResponseModel<T>(error, res, JSON.stringify(body));
        return response;
    }

    doGet<T>(url: string, headers: Headers) {
        return new Promise((resolve, reject) => {
            let context = this;
            get(url, {
                headers
            }, (error: Error, res: Response, body: any) => {
                try {
                    let data = context.onResponse<T>(error, res, body);
                    resolve(data);
                } catch (err) {
                    reject(err);
                }
            });
        }) as Promise<HttpResponseModel<T>>;
    }

    post<T>(url: string, body: any, headers?: Headers) {
        return new Promise((resolve, reject) => {
            let context = this;
            get(url, {
                headers,
                json: body
            }, (error: Error, res: Response, body: any) => {
                try {
                    let data = context.onResponse<T>(error, res, body);
                    resolve(data);
                } catch (err) {
                    reject(err);
                }
            });
        }) as Promise<HttpResponseModel<T>>;
    }
}