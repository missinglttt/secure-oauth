import { OAuthRequestModel, AuthenticationResponse } from "./models/oauth.model";
import { BaseOAuthResponse } from "./models/oauth.model";
import { DnsResolver } from "./dns_query";
import { AgencyServiceProvider, ProviderKeys } from '../../provider';

export interface IOAuthService {
    authenticate(params: OAuthRequestModel): Promise<BaseOAuthResponse<AuthenticationResponse>>;
}

export class OAuthService implements IOAuthService {
    private _dnsResolver: DnsResolver;
    constructor() {
        this._dnsResolver = AgencyServiceProvider.instanceOf(ProviderKeys.DnsResolver);
    }

    async authenticate(params: OAuthRequestModel) {
        let dnsRecord = await this._dnsResolver.resolve(params.service_pub_key);
        let result = new BaseOAuthResponse<AuthenticationResponse>();

        result.data = {
            service_name: dnsRecord.name,
            service_directory: dnsRecord.endpoint,
            license: "contract_address"
        };

        result.message = "OK";
        return result;
    }
}