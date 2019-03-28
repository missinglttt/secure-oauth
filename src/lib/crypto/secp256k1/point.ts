import { ec as EC } from 'elliptic';
import { Hex } from '../../types/hex';

export class Point extends Hex {
    protected readonly _curve: EC;
    constructor(value?: string | Uint8Array, length?: number) {
        super(value || "0x0", length);
        this._curve = new EC('secp256k1');
    }
}