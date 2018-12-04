/**
 * TEST: secp256k1 asymmetric cryptography
 */
const secp256k1 = require("../src/lib/crypto/secp256k1");
let keyPair = secp256k1.generateKeyPair();
console.log(keyPair);