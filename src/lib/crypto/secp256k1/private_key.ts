import { Point } from './point';
import { Hex } from '../../types/hex';
import { PRIVAKEY_LENGTH } from './enum';
import { PublicKey } from './public_key';
import _ from 'lodash';

export class PrivateKey extends Point {
    constructor(value: string | Uint8Array) {
        if (_.isString(value) && value.startsWith("0x")) {
            value = value.slice(2);
        }

        super(value, PRIVAKEY_LENGTH);
    }

    getPublicKey(compressed: boolean = false): PublicKey {
        let pair = this._curve.keyFromPrivate(this._value);
        return new PublicKey(pair.getPublic(compressed, 'hex'));
    }

    sign(message: Hex) {
        let pair = this._curve.keyFromPrivate(this._value);
        return pair.sign(message.toByteArray(), {
            canonical: true
        })
    }
}