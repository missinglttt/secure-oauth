import {
    ECKey, ECSignature
} from '../../src/lib/crypto/secp256k1';
import _ from 'lodash';
import {
    expect,
    assert
} from 'chai';
import 'mocha';

describe('secp256k1', () => {
    it('should generate new random key', () => {
        try {
            let keyPair = new ECKey();
            let privateKey = keyPair.getPrivateKey();
            let address = keyPair.toAddress();

            expect(_.isEmpty(privateKey)).to.equal(false);
            expect(_.isEmpty(address)).to.equal(false);
        } catch (err) {
            assert.fail(null, null, err.message)
        }
    });

    it('should generate new key from private', () => {
        try {
            let keyPair = new ECKey("c0c7eac0f65f94b4fa287bcd9e34b08ba09e0312fbe091a123f0682a6ee75bb9");
            let privateKey = keyPair.getPrivateKey();
            let address = keyPair.toAddress();

            expect(_.isEmpty(privateKey)).to.equal(false);
            expect(_.isEmpty(address)).to.equal(false);
            expect(address === "0xd213391726356BE0d83F943bE727588aff3eb8B3").to.equal(true);
        } catch (err) {
            assert.fail(null, null, err.message)
        }
    });

    it('sign and verify message', () => {
        try {
            let keyPair = new ECKey("c0c7eac0f65f94b4fa287bcd9e34b08ba09e0312fbe091a123f0682a6ee75bb9");
            let signature = keyPair.sign("test 123456");
            let digest = signature.toSigString();

            let isValid = new ECSignature().verify("test 123456", digest, keyPair.toAddress());
            expect(isValid).to.equal(true);
        } catch (err) {
            assert.fail(null, null, err.message)
        }
    });
});