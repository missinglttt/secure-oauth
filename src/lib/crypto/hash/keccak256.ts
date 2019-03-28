import { Hex } from "../../types/hex";
import sha3 from 'js-sha3';
import { toUtf8Bytes } from '../encoding/utf8';
import { concat } from '../../types/bytes';

export class Keccak256 {
    static fromHex(message: Hex): Hex {
        return new Hex('0x' + sha3.keccak_256(message.toByteArray()));
    }

    static fromBytes(bytes: Uint8Array): Hex {
        return new Hex('0x' + sha3.keccak_256(bytes));
    }

    static fromString(message: string): Hex {
        return new Hex('0x' + sha3.keccak_256(new Hex(message).toByteArray()));
    }

    static hashMessage(message: string): string {
        return Keccak256.fromBytes(concat([
            toUtf8Bytes('\x19Ethereum Signed Message:\n'),
            toUtf8Bytes(String(message.length)),
            toUtf8Bytes(message)
        ])).toString();
    }
}