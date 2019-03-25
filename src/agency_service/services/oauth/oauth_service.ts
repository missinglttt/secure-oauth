import { OAuthRequestModel } from "./oauth.model";

export class BaseResponse {
    success: boolean = true;
}

export interface IOAuthService {
    doHandshake(params: OAuthRequestModel): Promise<BaseResponse>;
}

export class OAuthService implements IOAuthService {
    constructor() {

    }

    async doHandshake(params: OAuthRequestModel) {
        return new BaseResponse();
    }
}