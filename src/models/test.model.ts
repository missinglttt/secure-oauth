import { BaseResponse, HttpRequestModel } from "../lib/server";

export class TestModel extends BaseResponse {
    constructor(private _request: HttpRequestModel<any, any>) {
        super();
    }

    toJson() {
        return this._request;
    }
}