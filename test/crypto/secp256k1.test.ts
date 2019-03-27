import { Signer } from 'ethers';
import { expect } from 'chai';
import 'mocha';
import { KeyPair, verifyMessage, computeAddress } from 'ethers/utils/secp256k1';
import { hashMessage } from 'ethers/utils/hash';
import { encrypt, decrypt, ecc, codec } from '../../src/lib/js/sjcl';

describe('secp256k1', () => {
    it('should generate new key pair', () => {
        const keyPair = new KeyPair("0xc0c7eac0f65f94b4fa287bcd9e34b08ba09e0312fbe091a123f0682a6ee75bb9");
        const address = computeAddress(keyPair.publicKey);

        let hashed = hashMessage("test message 1234");
        let sig = keyPair.sign(hashed);
        expect(sig !== null).to.equal(true);
        let unencrypted = verifyMessage("test message 1234", sig);
        expect(address === unencrypted).to.equal(true);

        let encrypted = encrypt(keyPair.publicKey, "test message 1234");
        let key = new ecc.ecdsa.secretKey(
            ecc.curves.k256,
            ecc.curves.k256.field.fromBits(codec.hex.toBits(keyPair.privateKey))
        );

        //@ts-ignore
        let pub = ecc.curves.k256.G.mult(key);
        let pubKey = new ecc.ecdsa.publicKey(ecc.curves.k256, pub);

        //@ts-ignore
        let raw = decrypt(key.serialize().exponent, encrypted);

        expect(raw === "test message 1234").to.equal(true);
    });
});