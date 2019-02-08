/**
 * TEST: secp256k1 asymmetric cryptography
 */
const Secp256k1 = require("../src/lib/crypto/secp256k1");
const secp256k1 = new Secp256k1();
let keyPair = secp256k1.generateKeyPair();
console.log(keyPair);

let encrypted = secp256k1.encrypt("Hello World", keyPair.public);
console.log(encrypted);

let message = secp256k1.decrypt(encrypted, keyPair.public);
console.log(message);

let signature = secp256k1.sign(message, keyPair.private);
console.log(signature);

let isVerified = secp256k1.verify(message, keyPair.public, signature);