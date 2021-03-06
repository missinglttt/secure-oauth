import { PrivateKey } from "./private_key";
import { Address } from "./address";
import { randomBytes } from "crypto";
import _ from "lodash";
import { ECSignature } from "./signature";
import { Hex } from "../../types/hex";
import bip39 from 'bip39';
import { fromMnemonic } from "./wrapper";

export class ECKey {
    private _private: PrivateKey;
    private _address: Address;
    private _mnemonic: string;

    constructor(privKey: string = "") {
        if (!_.isEmpty(privKey)) {
            this.fromPrivateKey(privKey);
        } else {
            let mnemonic = bip39.entropyToMnemonic(randomBytes(16));
            this.fromMnemonic(mnemonic);
        }
    }

    protected fromPrivateKey(privKey: string) {
        this._private = new PrivateKey(privKey);
        this._address = new Address(this._private.toAddress());
    }

    protected fromMnemonic(mnemonic: string, passphrase?: string) {
        let node = fromMnemonic(mnemonic, passphrase);
        this._mnemonic = node.mnemonic;
        this._private = new PrivateKey(node.privateKey);
        this._address = new Address(this._private.toAddress());
    }

    getPrivateKey() {
        return this._private.toString();
    }

    getMnemonic() {
        return this._mnemonic;
    }

    toAddress() {
        return this._address.toString();
    }

    sign(message: string) {
        if (!this._private) {
            throw new Error("invalid_private_key");
        }

        return this._private.sign(message);
    }

    verify(message: string, signature: string, address: string) {
        let sig = new ECSignature().fromHex(new Hex(signature));
        return sig.verify(message, signature, address);
    }
}