import { encrypt as _encrypt, decrypt as _decrypt } from 'sjcl';

export function encrypt(data: string, password: string): string {
    return JSON.stringify(_encrypt(password, data));
}

export function decrypt(digest: string, password: string): string {
    return _decrypt(password, digest);
}