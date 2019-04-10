import { DependencyProvider } from '../lib';
import { DnsResolver } from './services/oauth/dns_query';

export enum ProviderKeys {
    DnsResolver
}

const PROVIDER: DependencyProvider = new DependencyProvider();
PROVIDER.register<DnsResolver>(ProviderKeys.DnsResolver.toString(), new DnsResolver());

export class AgencyServiceProvider {
    static instanceOf<T>(key: ProviderKeys): T {
        return PROVIDER.instanceOf(key.toString()) as T;
    }
}

