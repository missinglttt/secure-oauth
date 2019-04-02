import { BaseResponse } from "../../../../lib/server";

export class BaseOAuthResponse extends BaseResponse {
    success: boolean;
    toJson() {
        return {
            success: true
        }
    }
}

export class ShareKeyModel extends BaseOAuthResponse {
    pubKey: string;
    constructor(success: boolean, pubKey?: string) {
        super();
        this.success = success;
        if (this.success) {
            this.pubKey = pubKey || "";
        }
    }

    toJson() {
        return {
            success: this.success,
            pubKey: this.pubKey
        }
    }
}