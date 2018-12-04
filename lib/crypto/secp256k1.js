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

function generateKeys() {

}

module.exports = {
    generateKeyPair
}