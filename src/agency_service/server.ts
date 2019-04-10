import { BaseServer } from '../lib/server';
import { Request, Response, NextFunction, Router } from 'express';
import { OAuthRequestModel, OAuthService } from './services/oauth';

export class AgencyServer extends BaseServer {
    private readonly _oauthService = new OAuthService();

    constructor() {
        super();
    }

    route() {
        this.post("/authenticate", this.onAuthenticate.bind(this));
    };

    run(port: number) {
        this.listen(port);
    }

    async onAuthenticate(req: Request, res: Response, next: NextFunction) {
        try {
            let request = this.doCast<any, OAuthRequestModel>(req);
            let response = await this._oauthService
                .authenticate(request.data);

            this.doSend(res, response);
        } catch (err) {
            next(err);
        }
    }

    private doCast<T, K>(req: Request) {
        return this.doParseRequest<T, K>(req);
    }
}