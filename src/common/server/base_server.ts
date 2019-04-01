import express from "express";
import * as bodyParser from 'body-parser';
import { EventEmitter } from 'events';
import { NotFoundError, InternalServerError } from './error';
import { INVALID_RESPONSE_CHANNEL } from './error_messages';
import { HttpRequestModel } from '.';
import { BaseResponse } from "./base_response_model";

export class BaseServer extends EventEmitter {
    protected _router: express.Router = express.Router();
    protected _server: express.Express = express();
    protected _debug: boolean = false;

    constructor(debug: boolean = false) {
        super();
        this._debug = debug;
        this.defaut();
    }

    private defaut() {
        this._server.use(bodyParser.json());
        this._server.use(this._router);
        this._server.use(this.notFound.bind(this));

        let context = this;
        //@ts-ignore
        this._server.use((err, req, res, next) => {
            res.status(500).send(new InternalServerError(err.message, context._debug));
            context.emit("500", req.url);
        });
    }

    /**
     * Handle "404" by default
     * @param req 
     * @param res 
     */
    protected notFound(req: express.Request, res: express.Response) {
        res.status(404).send(new NotFoundError());
        this.emit("404", req.url);
    }

    /**
     * Do listen on specific port
     * @param req 
     * @param res 
     */
    protected listen(port: number) {
        this._server.listen(port);
        this.emit("startup", port);
    }

    /**
     * Configure middleware for router
     * @param fn 
     */
    middleware(fn: express.RequestHandler) {
        this._router.use(fn);
    }

    /**
     * All methods routing
     * @param routePath 
     * @param fn 
     */
    all(routePath: string, fn: express.RequestHandler) {
        this._router.use(routePath, fn);
    }

    /**
     * POST methods routing
     * @param routePath 
     * @param fn 
     */
    post(routePath: string, fn: express.RequestHandler) {
        this._router.post(routePath, fn);
    }

    /**
     * GET methods routing
     * @param routePath 
     * @param fn 
     */
    get(routePath: string, fn: express.RequestHandler) {
        this._router.get(routePath, fn);
    }

    /**
     * PUT methods routing
     * @param routePath 
     * @param fn 
     */
    put(routePath: string, fn: express.RequestHandler) {
        this._router.put(routePath, fn);
    }

    /**
     * Cast to specific datatype
     */
    private cast<T>(data: any) {
        return data as T;
    }

    /**
     * Parse request from client and cast to specific data type
     * @type T Type of request parameter
     * @type K: Type of request query (GET) or body (other methods)
     * @param req 
     */
    protected doParseRequest<T, K>(req: express.Request) {
        let raw = new HttpRequestModel<T, K>();
        raw.params = this.cast<T>(req.params);
        raw.data = this.cast<K>(req.method === "GET" ? req.query : req.body);
        return raw;
    }

    /**
     * Send response to cliend
     */
    doSend(res: express.Response, body: BaseResponse) {
        if (!res) {
            throw new Error(INVALID_RESPONSE_CHANNEL);
        }

        res.status(body.status_code)
            .send(body.toJson());
    }
}