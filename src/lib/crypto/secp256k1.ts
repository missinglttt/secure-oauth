const sjcl = require("./sjcl");
const ecc = require("./sjcl").ecc;

export class KeyPair {
    private: string;
    public: string;

    constructor(privKey: string, pubKey: string) {

    }
}

export class Secp256k1 {
    generateKeyPair() {
        let pair = ecc.ecdsa.generateKeys(ecc.curves.k256);
        let sec = pair.sec.serialize();
        let pub = pair.pub.serialize();
        return new KeyPair(sec["exponent"], pub["point"]);
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
        return sjcl.encrypt(pubKey, message);
    }

    decrypt(message: string, privKey: string) {
        return sjcl.decrypt(privKey, message);
    }

    sign(message: string, privKey: string) {
        let hash = sjcl.hash.sha256.hash(message);
        let priv = this.unserializePrivKey(privKey);
        return sjcl.codec.hex.fromBits(priv.sign(hash));
    }

    verify(message: string, pubKey: string, signature: string) {
        let hash = sjcl.hash.sha256.hash(message);
        let pub = this.unserializePublicKey(pubKey);
        return pub.verify(hash, sjcl.codec.hex.toBits(signature));
    }
}