import { Point } from "./point";
import { Signature } from "elliptic";
import { Hex } from "../../types/hex";
import { stringToByteArray } from "../../types/bytes";
import { Keccak256 } from "../hash/keccak256";
import { PublicKey } from "./public_key";

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

    public verifyWithPubKey(message: string, signature: string, pubKey: string): boolean {
        this.fromHex(new Hex(signature));
        let rs = { r: stringToByteArray(this.r), s: stringToByteArray(this.s) };
        let messagePubKey = '0x' + this._curve.recoverPubKey(stringToByteArray(Keccak256.hashMessage(message)), rs, this.recoveryParam).encode('hex', false);
        return messagePubKey === pubKey;
    }

    public verifyWithAddress(message: string, signature: string, address: string): boolean {
        this.fromHex(new Hex(signature));
        let rs = { r: stringToByteArray(this.r), s: stringToByteArray(this.s) };
        let messagePubKey = '0x' + this._curve.recoverPubKey(stringToByteArray(Keccak256.hashMessage(message)), rs, this.recoveryParam).encode('hex', false);
        return new PublicKey(messagePubKey).getAddress().toString() === address;
    }
}