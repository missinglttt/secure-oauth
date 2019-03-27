import { ec as EC, Signature, BasicSignature } from 'elliptic';
import * as _ from 'lodash';
import { randomBytes } from 'crypto';
import { Hex } from '../types/hex';
import { Keccak256 } from './keccak256';
import { encrypt, decrypt, ecc, codec, hash } from '../js/sjcl';

const PRIVAKEY_LENGTH = 64;
const PUBLICKEY_LENGTH = 67;
const ADDRESS_LENGTH = 40;

export class Point extends Hex {
    protected readonly _curve: EC;
    constructor(value?: string | Uint8Array, length?: number) {
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

    sign(message: Hex) {
        let pair = this._curve.keyFromPrivate(this._value);
        return pair.sign(message.toByteArray(), {
            canonical: true
        })
    }

    unserialize() {
        return new ecc.ecdsa.secretKey(
            ecc.curves.k256,
            ecc.curves.k256.field.fromBits(codec.hex.toBits(this._value))
        );
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

    public unserialize() {
        return new ecc.ecdsa.publicKey(ecc.curves.k256,
            codec.hex.toBits(this._value));
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

export class ECSignature extends Point {
    r: string;
    s: string;
    v: number;
    recoveryParam: number;

    constructor() {
        super()
    }

    public fromSig(signature: Signature) {
        this.recoveryParam = signature.recoveryParam;
        this.r = new Hex('0x' + signature.r.toString(16)).hexZeroPad(32);
        this.s = new Hex('0x' + signature.s.toString(16)).hexZeroPad(32);
        this.v = 27 + signature.recoveryParam;
    }

    public fromHex(signature: Hex) {
        let bytes = signature.toByteArray();
        if (bytes.length !== 65) {
            throw new Error('Invalid_Signature');
        }

        this.r = new Hex(bytes.slice(0, 32)).toString();
        this.s = new Hex(bytes.slice(32, 64)).toString();

        this.v = bytes[64];
        if (this.v !== 27 && this.v !== 28) {
            this.v = 27 + (this.v % 2);
        }

        this.recoveryParam = this.v - 27;
        return this;
    }

    private concat(objects: Array<string>): Uint8Array {
        let arrays = [];
        let length = 0;
        for (let i = 0; i < objects.length; i++) {
            let object = new Hex(objects[i]).toByteArray();
            arrays.push(object);
            length += object.length;
        }

        let result = new Uint8Array(length);
        let offset = 0;
        for (let i = 0; i < arrays.length; i++) {
            result.set(arrays[i], offset);
            offset += arrays[i].length;
        }

        return result;
    }

    public toSigString(): string {
        let final = this.concat([
            this.r,
            this.s,
            (this.recoveryParam ? '0x1c' : '0x1b')
        ]);
        return final.toString();
    }

    public verify(digest: Hex) {
        let rs = { r: new Hex(this.r).toByteArray(), s: new Hex(this.s).toByteArray() };
        let pub = '0x' + this._curve.recoverPubKey(digest.toByteArray(), rs, this.recoveryParam).encode('hex', false);
        let pubKey = "0x" + this._curve.keyFromPublic(new Hex(pub).toByteArray()).getPublic(false, 'hex');
    }

    private recoverAddress(pubKey: Hex) {

    }

    private recoverPubkey(digest: Hex) {
        let rs = { r: new Hex(this.r).toByteArray(), s: new Hex(this.s).toByteArray() };
        return '0x' + this._curve.recoverPubKey(digest.toByteArray(), rs, this.recoveryParam).encode('hex', false);
    }
}

export class ECKey {
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

    sign(message: string) {
        if (!this._private) {
            throw new Error("invalid_private_key");
        }

        let digest = new Hex(message);
        let signature = this._private.sign(digest);
        return new ECSignature().fromSig(signature);
    }

    verify(message: string, signature: string) {
        let sig = new ECSignature().fromHex(new Hex(signature));
        return sig.verify(new Hex(message));
    }

    encrypt(message: string, pubKey: string) {
        let pub = new PublicKey(pubKey).unserialize();
        return encrypt(pubKey, message);
    }

    decrypt(message: string, privKey: string) {
        return decrypt(privKey, message) as string;
    }
}