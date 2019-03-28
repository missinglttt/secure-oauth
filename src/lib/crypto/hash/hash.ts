import { Hex } from "../../types/hex";
import hash from 'hash.js';

export class Hash {
    static ripemd160(data: Hex): string {
        return '0x' + (hash.ripemd160().update(data.toByteArray()).digest('hex'));
    }

    static sha256(data: Hex): string {
        return '0x' + (hash.sha256().update(data.toByteArray()).digest('hex'));
    }

    static sha512(data: Hex): string {
        return '0x' + (hash.sha512().update(data.toByteArray()).digest('hex'));
    }
}