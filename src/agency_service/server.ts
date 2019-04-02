import { BaseServer } from '../lib/server';
import { Request, Response, NextFunction } from 'express';
import { IOAuthService } from './services';
import { OAuthRequestModel } from './services/oauth';
import { IDenpendencyProvider } from '../lib';

export class AgencyServer extends BaseServer {
    private _dp: IDenpendencyProvider;

    constructor(provider: IDenpendencyProvider) {
        super();
        this._dp = provider;
    }

    route() {
        this.post("/access", this.onAccess.bind(this));
        this.post("/oauth", this.onOAuth.bind(this));
    };

    run(port: number) {
        this.listen(port);
    }

    async onAccess(req: Request, res: Response, next: NextFunction) {
        try {
            let request = this.doCast<any, OAuthRequestModel>(req);
            let response = await this._dp.instanceOf<IOAuthService>("IOAuthService")
                .shareKey(request.data);
            this.doSend(res, response);
        } catch (err) {
            next(err);
        }
    }

    async onOAuth(req: Request, res: Response, next: NextFunction) {
        try {
            let request = this.doCast<any, OAuthRequestModel>(req);
            let response = await this._dp.instanceOf<IOAuthService>("IOAuthService")
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