import { BaseServer } from '../common/server';
import { Request, Response, NextFunction } from 'express';
import { IOAuthService } from './services';
import { OAuthRequestModel } from './services/oauth';

export class AgencyServer extends BaseServer {
    private _oauthService: IOAuthService;

    constructor(oauthService: IOAuthService) {
        super();
        this._oauthService = oauthService;
    }

    route() {
        this.post("/oauth", this.onOAuth.bind(this));
    };

    run(port: number) {
        this.listen(port);
    }

    async onOAuth(req: Request, res: Response, next: NextFunction) {
        try {
            let request = this.doCast<any, OAuthRequestModel>(req);
            let response = await this._oauthService.doHandshake(request.data);
            this.doSend(res, 200, response);
        } catch (err) {
            next(err);
        }
    }

    private doCast<T, K>(req: Request) {
        return this.doParseRequest<T, K>(req);
    }
}