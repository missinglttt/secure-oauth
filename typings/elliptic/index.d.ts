declare module "elliptic" {
    import { BN } from "bn.js";
    export type BasicSignature = {
        r: Uint8Array;
        s: Uint8Array;
    };

    export type Signature = {
        r: BN,
        s: BN,
        recoveryParam: number
    }

    interface Point {
        add(point: Point): Point;
        encodeCompressed(enc: string): string
    }

    interface KeyPair {
        sign(message: Uint8Array, options: { canonical?: boolean }): Signature;
        getPublic(compressed: boolean, encoding?: string): string;
        getPublic(): BN;
        getPrivate(encoding?: string): string;
        encode(encoding: string, compressed: boolean): string;
        derive(publicKey: BN): BN;
        pub: Point;
        priv: BN;
    }

    export class ec {
        constructor(curveName: string);

        n: BN;

        keyFromPublic(publicKey: string | Uint8Array): KeyPair;
        keyFromPrivate(privateKey: string | Uint8Array): KeyPair;
        recoverPubKey(data: Uint8Array, signature: BasicSignature, recoveryParam: number): KeyPair;
    }
}