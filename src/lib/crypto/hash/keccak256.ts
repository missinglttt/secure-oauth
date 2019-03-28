import { Hex } from "../../types/hex";
import sha3 from 'js-sha3';
import { toUtf8Bytes } from '../encoding/utf8';
import { concat, stringToByteArray } from '../../types/bytes';

export class Keccak256 {
    static fromHex(message: Hex): string {
        return sha3.keccak_256(message.toByteArray());
    }

    static fromBytes(bytes: Uint8Array): string {
        return sha3.keccak_256(bytes);
    }

    static fromString(message: string): string {
        return sha3.keccak_256(stringToByteArray(message));
    }

    static hashMessage(message: string): string {
        return Keccak256.fromBytes(concat([
            toUtf8Bytes('\x19Ethereum Signed Message:\n'),
            toUtf8Bytes(String(message.length)),
            toUtf8Bytes(message)
        ])).toString();
    }
}