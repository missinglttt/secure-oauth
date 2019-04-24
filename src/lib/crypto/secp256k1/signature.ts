import { Point } from "./point";
import { Signature } from "elliptic";
import { Hex } from "../../types/hex";
import { concat, bufferToHex } from "../../types/bytes";
import { verify } from "./wrapper";

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
        return this;
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

    public toSigString(): string {
        let final = concat([
            new Hex(this.r).toByteArray(),
            new Hex(this.s).toByteArray(),
            new Hex((this.recoveryParam ? '0x1c' : '0x1b')).toByteArray()
        ]);

        return bufferToHex(final);
    }

    public verify(message: string, signature: string, address: string): boolean {
        return verify(message, signature) === address;
    }
}