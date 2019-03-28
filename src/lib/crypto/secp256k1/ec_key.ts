import { PrivateKey } from "./private_key";
import { PublicKey } from "./public_key";
import { Address } from "./address";
import { PRIVAKEY_LENGTH } from "./enum";
import { randomBytes } from "crypto";
import _ from "lodash";
import { ECSignature } from "./signature";
import { Hex } from "../../types/hex";

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

    verify(message: string, signature: string, address: string) {
        let sig = new ECSignature().fromHex(new Hex(signature));
        return sig.verifyWithAddress(message, signature, address);
    }
}