const sjcl = require("./sjcl");
const ecc = require("./sjcl").ecc;

function generateKeyPair() {
    let pair = ecc.ecdsa.generateKeys(sjcl.ecc.curves.k256);
    let sec = pair.sec.serialize();
    let pub = pair.pub.serialize();

    return {
        "private": sec["exponent"],
        "public": pub["point"]
    }
}

function unserializePublicKey(pubKey) {
    let pub = new sjcl.ecc.ecdsa.publicKey(
        sjcl.ecc.curves.k256,
        sjcl.codec.hex.toBits(pubKey)
    );

    return pub;
}

function unserializePrivKey(privKey) {
    let priv = new sjcl.ecc.ecdsa.secretKey(
        sjcl.ecc.curves.k256,
        sjcl.ecc.curves.k256.field.fromBits(sjcl.codec.hex.toBits(privKey))
    );

    return priv;
}

function encrypt(message, pubKey) {
    return sjcl.encrypt(pubKey, message);
}

function decrypt(message, privKey) {
    return sjcl.decrypt(privKey, message);
}

function sign(message, privKey) {
    let hash = sjcl.hash.sha256.hash(message);
    let priv = this.unserializePrivKey(privKey);
    return sjcl.codec.hex.fromBits(priv.sign(hash));
}

function verify(message, pubKey, signature) {
    let hash = sjcl.hash.sha256.hash(message);
    let pub = this.unserializePublicKey(pubKey);
    return pub.verify(hash, sjcl.codec.hex.toBits(signature));
}

module.exports = {
    generateKeyPair,
    encrypt,
    decrypt,
    sign,
    verify
};