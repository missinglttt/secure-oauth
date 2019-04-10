export class DnsRecord {
    pubKey: string;
    name: string;
    endpoint: string;
}

export interface IDnsResolver {
    resolve(pubKey: string): Promise<DnsRecord>;
}

export class DnsResolver implements IDnsResolver {
    async resolve(pubKey: string) {
        let record = new DnsRecord();
        record.endpoint = "http://example.com";
        record.name = "Example Service";
        record.pubKey = pubKey;

        return record;
    }
}