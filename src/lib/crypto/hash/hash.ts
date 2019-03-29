import hash from 'hash.js';

export function ripemd160(data: Uint8Array): string {
    return '0x' + (hash.ripemd160().update(data).digest('hex'));
}

export function sha256(data: Uint8Array): string {
    return '0x' + (hash.sha256().update(data).digest('hex'));
}

export function sha512(data: Uint8Array): string {
    return '0x' + (hash.sha512().update(data).digest('hex'));
}