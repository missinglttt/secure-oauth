import { OAuthRequestModel } from "./models/oauth.model";
import { OAuth3 } from '../../../protocols/oauth3';
import { BaseOAuthResponse, ShareKeyModel } from "./models/oauth_response.model";

export interface IOAuthService {
    authenticate(params: OAuthRequestModel): Promise<BaseOAuthResponse>;
    shareKey(params: OAuthRequestModel): Promise<ShareKeyModel>;
}

export class OAuthService implements IOAuthService {
    private _oauth = new OAuth3();
    constructor() {

    }

    async shareKey() {
        let key = this._oauth.createKey();
        let res = new ShareKeyModel(true, key.toAddress());
        return res;
    }

    async authenticate(params: OAuthRequestModel) {
        return new BaseOAuthResponse();
    }
}