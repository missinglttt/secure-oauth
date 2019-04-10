import { BaseResponse } from "../../../../lib/server";

export class OAuthRequestModel {
    service_pub_key: string;
    service_unique_id: string;
    client_pub_key: string;
}


export class BaseOAuthResponse<T> extends BaseResponse {
    success: boolean;
    data: T;
    toJson() {
        return this.data;
    }
}

export class AuthenticationResponse {
    service_name: string;
    service_directory: string;
    license: string;
}