import { OAuthRequestModel } from "./oauth.model";

export interface IOAuthService {
    doHandshake(params: OAuthRequestModel): void;
}

class OAuthService implements IOAuthService {
    constructor() {

    }

    doHandshake(params: OAuthRequestModel) {

    }
}