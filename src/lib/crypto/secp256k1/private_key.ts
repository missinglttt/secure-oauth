import { Point } from './point';
import { PRIVAKEY_LENGTH } from './enum';
import _ from 'lodash';
import { Keccak256 } from '../hash/keccak256';
import { stringToByteArray } from '../../types/bytes';
import { ECSignature } from './signature';
import { computeAddress } from 'ethers/utils';

export class PrivateKey extends Point {
    constructor(value: string | Uint8Array) {
        if (_.isString(value) && value.startsWith("0x")) {
            value = value.slice(2);
        }

        super(value, PRIVAKEY_LENGTH);
    }
    toAddress() {
        return computeAddress(this._value);
    }

    sign(message: string) {
        let pair = this._curve.keyFromPrivate(stringToByteArray(this._value));
        let hashed = Keccak256.hashMessage(message);
        let sig = pair.sign(stringToByteArray(hashed), {
            canonical: true
        });

        return new ECSignature().fromSig(sig);
    }
}