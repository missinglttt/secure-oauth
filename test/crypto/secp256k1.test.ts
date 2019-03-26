import { Secp256k1 } from '../../src/lib/crypto';
import { expect } from 'chai';
import 'mocha';

describe('secp256k1', () => {
    it('should generate new key pair', () => {
        const ecc = new Secp256k1();
        let keyPair = ecc.generateKeyPair();

        expect(keyPair !== null).to.equal(true);
        expect(typeof (keyPair.getPrivateKey()) === "string").to.equal(true);
        expect(typeof (keyPair.getPublicKey()) === "string").to.equal(true);
        expect(typeof (keyPair.toAddress()) === "string").to.equal(true);

        console.log(keyPair.getPrivateKey());
        console.log(keyPair.getPublicKey());
        console.log(keyPair.toAddress());
    });
});