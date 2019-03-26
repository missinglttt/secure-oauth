import { Hex } from "../types/hex";

const sha3 = require('js-sha3');

export class Keccak256 {
    static fromHex(message: Hex): Hex {
        return new Hex('0x' + sha3.keccak_256(message.toByteArray()));
    }

    static fromBytes(bytes: Uint8Array): Hex {
        return new Hex('0x' + sha3.keccak_256(bytes));
    }

    static fromString(message: string): Hex {
        return new Hex('0x' + sha3.keccak_256(new Hex(message).toByteArray()));
    }
}