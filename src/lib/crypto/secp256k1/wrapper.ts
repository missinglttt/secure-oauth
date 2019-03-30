import { verifyMessage, computeAddress, Wordlist, HDNode, SigningKey, computePublicKey } from 'ethers/utils';
import { ec as EC } from 'elliptic';

export function verify(message: string, signature: string) {
    return verifyMessage(message, signature);
};

export function toAddress(privKey: string) {
    return computeAddress(privKey);
}

export function fromMnemonic(mnemonic: string, passphrase: string, locale?: Wordlist) {
    return HDNode.fromMnemonic(mnemonic, locale, passphrase);
}

export function getPublicKey(key: string) {
    return computePublicKey(key);
}

export function getCurves(name: string) {
    return new EC(name);
}