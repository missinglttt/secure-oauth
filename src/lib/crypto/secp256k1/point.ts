import { ec as EC, Signature, BasicSignature } from 'elliptic';
import { Hex } from '../../types/hex';

export class Point extends Hex {
    protected readonly _curve: EC;
    constructor(value?: string | Uint8Array, length?: number) {
        super(value, length);
        this._curve = new EC('secp256k1');
    }
}