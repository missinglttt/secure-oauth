import { DependencyProvider } from '../lib';
import { IOAuthService, OAuthService } from './services/oauth';

export class AgencyServiceProvider {
    static createProvider() {
        let provider = new DependencyProvider();
        provider.register<IOAuthService>("IOAuthService", new OAuthService());

        return provider;
    }
}