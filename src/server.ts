import * as bodyParser from 'body-parser';
import { InternalServerError, NotFoundError } from './errors/error';
import { EventEmitter } from 'events';
import express from 'express';
import { getRouter } from './routes/route';

export class Server extends EventEmitter {
    private _server = express();

    constructor(private _debug: boolean = true) {
        super();
        this.default();
    }

    private default() {
        this._server.use(bodyParser.json());
        this._server.use(getRouter());
        this.notFound();
        this.internalError();
    }

    private notFound() {
        let context = this;
        this._server.use((req, res, next) => {
            res.status(404).send(new NotFoundError());
            context.emit("404", req.url);
        })
    }

    private internalError() {
        let context = this;
        //@ts-ignore
        this._server.use((err, req, res, next) => {
            res.status(500).send(new InternalServerError(err.message, !context._debug));
            context.emit("500", req.url, err);
        });
    }

    listen(port: number) {
        this._server.listen(port);
    }
}