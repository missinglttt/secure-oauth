const encoding = require("./encoding");
const uuid = require("uuid/v4");
const secp256k1 = require("./secp256k1");

class Cryptography {
    constructor {
        this.Encoding = {
            Base64: {
                encode: Encoding.encodeBase64,
                decode: Encoding.decodeBase64
            }
        };
        this.Generator = {
            UUID: uuid,
            KeyPair: secp256k1.generateKeyPair
        }
    }
}

module.exports = Cryptography;