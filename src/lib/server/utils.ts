import express from "express";
import { INVALID_RESPONSE_CHANNEL } from '../../errors/error_messages';
import { HttpRequestModel } from '.';
import { BaseResponse } from "./base_response_model";

/**
* Cast to specific datatype
*/
function cast<T>(data: any) {
    return data as T;
}

/**
* Parse request from client and cast to specific data type
* @type T Type of request parameter
* @type K: Type of request query (GET) or body (other methods)
* @param req 
*/
export function doParseRequest<T, K>(req: express.Request) {
    let raw = new HttpRequestModel<T, K>();
    raw.params = cast<T>(req.params);
    raw.data = cast<K>(req.method === "GET" ? req.query : req.body);
    return raw;
}

/**
* Send response to cliend
*/
export function doSend(res: express.Response, body: BaseResponse) {
    if (!res) {
        throw new Error(INVALID_RESPONSE_CHANNEL);
    }

    res.status(body.status_code)
        .send(body.toJson());
}