import tweetnacl from 'tweetnacl';
import { toUtf8Bytes, toUtf8String } from '../encoding/utf8';
import { Hex } from '../../types/hex';
import { bufferToHex } from '../../types/bytes';

export function encrypt(data: string, theirPublicKey: Hex, mySecretKey: Hex) {
    let nonce = tweetnacl.randomBytes(tweetnacl.box.nonceLength)
    let encryptor = tweetnacl.box(toUtf8Bytes(data),
        nonce,
        theirPublicKey.toByteArray(),
        mySecretKey.toByteArray())

    return {
        data: toUtf8String(new Hex(encryptor)),
        nonce: toUtf8String(new Hex(nonce))
    }
}

export function decrypt(data: Hex, nonce: Hex, theirPublicKey: Hex, mySecretKey: Hex) {
    let decryptor = tweetnacl.box.open(data.toByteArray(),
        nonce.toByteArray(),
        theirPublicKey.toByteArray(),
        mySecretKey.toByteArray())

    if (!decryptor) {
        throw new Error('invalid_decryptor');
    }

    return toUtf8String(new Hex(decryptor));
}

export function sign(data: string, mySecretKey: Hex) {
    let buffer = tweetnacl.sign.detached(toUtf8Bytes(data),
        mySecretKey.toByteArray())

    return bufferToHex(buffer)
}

export function verify(data: string, signature: Hex, theirPublicKey: Hex) {
    return tweetnacl.sign.detached.verify(toUtf8Bytes(data),
        signature.toByteArray(),
        theirPublicKey.toByteArray())
}