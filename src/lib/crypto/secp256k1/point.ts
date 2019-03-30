import { Hex } from '../../types/hex';
import { getCurves } from './wrapper';

export class Point extends Hex {
    constructor(value?: string | Uint8Array, length?: number) {
        super(value || "0x0", length);
    }

    protected curves() {
        return getCurves('secp256k1');
    }
}