import { Router, RequestHandler, Request, Response, ErrorRequestHandler, application, Application } from 'express';
import { json } from 'body-parser';
import { EventEmitter } from 'events';
import { NotFoundError, InternalServerError } from './error';
import { INVALID_RESPONSE_CHANNEL } from './error_messages';
import { HttpRequestModel } from '.';

export class BaseServer extends EventEmitter {
    protected _router: Router = Router();
    protected _server: Application = application;
    protected _debug: boolean = true;

    constructor() {
        super();
        this.defaut();
    }

    private defaut() {
        this._server.use(json());
        this._server.use(this._router);
        this._server.use(this.notFound);
        this._server.use(this.internalServerError);
    }

    /**
     * Handle "404" by default
     * @param req 
     * @param res 
     */
    private notFound(req: Request, res: Response) {
        res.status(404).send(new NotFoundError());
        this.emit("404", req.url);
    }

    /**
     * Handle "500" by default
     * @param req 
     * @param res 
     */
    private internalServerError(error: Error, req: Request, res: Response) {
        res.status(500).send(new InternalServerError(error.message, this._debug));
        this.emit("500", req.url);
    }

    /**
     * Do listen on specific port
     * @param req 
     * @param res 
     */
    protected listen(port: number) {
        this._server.listen(port);
        this.emit("startup", this._server);
    }

    /**
     * Configure middleware for router
     * @param fn 
     */
    middleware(fn: RequestHandler) {
        this._router.use(fn);
    }

    /**
     * All methods routing
     * @param routePath 
     * @param fn 
     */
    all(routePath: string, fn: RequestHandler) {
        this._router.use(routePath, fn);
    }

    /**
     * POST methods routing
     * @param routePath 
     * @param fn 
     */
    post(routePath: string, fn: RequestHandler) {
        this._router.post(routePath, fn);
    }

    /**
     * GET methods routing
     * @param routePath 
     * @param fn 
     */
    get(routePath: string, fn: RequestHandler) {
        this._router.get(routePath, fn);
    }

    /**
     * PUT methods routing
     * @param routePath 
     * @param fn 
     */
    put(routePath: string, fn: RequestHandler) {
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
    protected doParseRequest<T, K>(req: Request) {
        let raw = new HttpRequestModel<T, K>();
        raw.params = this.cast<T>(req.params);
        raw.data = this.cast<K>(req.method === "GET" ? req.query : req.body);
        return raw;
    }

    /**
     * Send response to cliend
     */
    doSend<T>(res: Response, status: number, body: T) {
        if (!res) {
            throw new Error(INVALID_RESPONSE_CHANNEL);
        }

        res.status(status)
            .send(body);
    }
}