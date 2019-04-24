import { Point } from './point';
import { PRIVAKEY_LENGTH } from './enum';
import _ from 'lodash';
import { Keccak256 } from '../hash/keccak256';
import { stringToByteArray } from '../../types/bytes';
import { ECSignature } from './signature';
import { toAddress, getPublicKey } from './wrapper';
import { Hex } from '../../types/hex';

export class PrivateKey extends Point {
    constructor(value: string | Uint8Array) {
        if (_.isString(value) && value.startsWith("0x")) {
            value = value.slice(2);
        }

        super(value, PRIVAKEY_LENGTH);
    }

    toAddress() {
        return toAddress(this._value);
    }

    toSharedKey(theirPubKey: string) {
        let key = this.curves().keyFromPrivate(stringToByteArray(this._value));
        let pubKey = this.curves().keyFromPublic(stringToByteArray(getPublicKey(theirPubKey)));
        return new Hex('0x' + key.derive(pubKey.getPublic()).toString(16)).hexZeroPad(32);
    }

    sign(message: string) {
        let pair = this.curves().keyFromPrivate(stringToByteArray(this._value));
        let hashed = Keccak256.hashMessage(message);
        let sig = pair.sign(stringToByteArray(hashed), {
            canonical: true
        });

        return new ECSignature().fromSig(sig);
    }
}