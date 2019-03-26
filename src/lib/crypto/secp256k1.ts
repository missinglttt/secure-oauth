import { Wallet } from 'ethers';
import { ec as EC } from 'elliptic';
import * as _ from 'lodash';
import { randomBytes } from 'crypto';
import { Hex } from '../types/hex';
import { Keccak256 } from './keccak256';
const sjcl = require("./sjcl");
const ecc = require("./sjcl").ecc;

const PRIVAKEY_LENGTH = 64;
const PUBLICKEY_LENGTH = 67;
const ADDRESS_LENGTH = 40;

export class Point extends Hex {
    protected readonly _curve: EC;
    constructor(value: string | Uint8Array, length: number) {
        super(value, length);
        this._curve = new EC('secp256k1');
    }
}

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
}

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

export class Address extends Point {
    constructor(value: string | Uint8Array) {
        if (_.isString(value) && value.startsWith("0x")) {
            value = value.slice(2);
        }

        super(value, ADDRESS_LENGTH);
    }
}

export class KeyPair {
    private _private: PrivateKey;
    private _public: PublicKey;
    private _address: Address;

    constructor(privKey: string = "", pubKey: string = "") {
        if (!_.isEmpty(privKey)) {
            this.fromPrivateKey(privKey);
        } else if (!_.isEmpty(pubKey)) {
            this.fromPublicKey(pubKey);
        } else {
            this.fromPrivateKey(randomBytes(PRIVAKEY_LENGTH).toString("hex"));
        }
    }

    protected fromPrivateKey(privKey: string) {
        this._private = new PrivateKey(privKey);
        this._public = this._private.getPublicKey();
        this._address = this._public.getAddress();
    }

    protected fromPublicKey(pubKey: string) {
        this._private = null;
        this._public = new PublicKey(pubKey);
        this._address = this._public.getAddress();
    }

    getPrivateKey() {
        return this._private.toString();
    }

    getPublicKey() {
        return this._public.toString();
    }

    toAddress() {
        return this._address.toString();
    }
}

export class Secp256k1 {
    private _curve = new EC('secp256k1');
    private _keyPair = new KeyPair();

    constructor(privKey: string) {

    }

    doRandom() {

    }

    generateKeyPair() {
        let pair = ecc.ecdsa.generateKeys(ecc.curves.k256);
        let sec = pair.sec.serialize();
        let pub = pair.pub.serialize();
        return new KeyPair(sec["exponent"], pub["point"]);
    }

    restore(privKey: string) {

    }

    restorePubkeyOnly() {

    }

    unserializePublicKey(pubKey: string) {
        const publicKey = ecc.ecdsa.publicKey;
        let pub = new publicKey(
            sjcl.ecc.curves.k256,
            sjcl.codec.hex.toBits(pubKey)
        );

        return pub;
    }

    unserializePrivKey(privKey: string) {
        let priv = new sjcl.ecc.ecdsa.secretKey(
            sjcl.ecc.curves.k256,
            sjcl.ecc.curves.k256.field.fromBits(sjcl.codec.hex.toBits(privKey))
        );

        return priv;
    }

    encrypt(message: string, pubKey: string) {
        return sjcl.encrypt(pubKey, message) as string;
    }

    decrypt(message: string, privKey: string) {
        return sjcl.decrypt(privKey, message) as string;
    }

    sign(message: string, privKey: string) {
        let hash = sjcl.hash.sha256.hash(message);
        let priv = this.unserializePrivKey(privKey);
        return sjcl.codec.hex.fromBits(priv.sign(hash)) as string;
    }

    verify(message: string, pubKey: string, signature: string) {
        let hash = sjcl.hash.sha256.hash(message);
        let pub = this.unserializePublicKey(pubKey);
        return pub.verify(hash, sjcl.codec.hex.toBits(signature)) as boolean;
    }
}