import * as _ from 'lodash';
import { Keccak256 } from '../hash/keccak256';
import { Point } from './point';
import { PUBLICKEY_LENGTH } from './enum';
import { Address } from './address';

export class PublicKey extends Point {
    constructor(value: string | Uint8Array) {
        if (_.isString(value) && value.startsWith("0x")) {
            value = value.slice(2);
        }

        super(value, PUBLICKEY_LENGTH);
    }

    getAddress() {
        let hash = Keccak256.fromHex(this);
        return new Address(this.toAddressString(hash.toString()));
    }

    private toAddressString(hash: string) {
        if (hash.match(/^(0x)?[0-9a-fA-F]{40}$/)) {
            throw new Error("Invalid_Address")
        }

        if (hash.substring(0, 2) !== '0x') {
            hash = '0x' + hash;
        }

        let checksum = this.checksum(hash);
        if (hash.match(/([A-F].*[a-f])|([a-f].*[A-F])/) && checksum !== hash) {
            throw new Error("Bad_checksum");
        }

        return checksum;
    }

    private checksum(address: string) {
        address = address.toLowerCase();
        let chars = address.substring(2).split('');

        let hashed = new Uint8Array(40);
        for (let i = 0; i < 40; i++) {
            hashed[i] = chars[i].charCodeAt(0);
        }

        hashed = Keccak256.fromBytes(hashed).toByteArray();

        for (var i = 0; i < 40; i += 2) {
            if ((hashed[i >> 1] >> 4) >= 8) {
                chars[i] = chars[i].toUpperCase();
            }

            if ((hashed[i >> 1] & 0x0f) >= 8) {
                chars[i + 1] = chars[i + 1].toUpperCase();
            }
        }

        return '0x' + chars.join('');
    }
}