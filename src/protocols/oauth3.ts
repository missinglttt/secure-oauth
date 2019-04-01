/**
 * Handshake protocol use to start conversation between 2 instances
 * Start with "HELLO" message and then share public key with each other to establish secure channel 
 */
import { EventEmitter } from 'events';
import { ECKey } from '../lib/crypto/secp256k1';

export class OAuth3 extends EventEmitter {
    constructor() {
        super();
    }

    createKey(privKey?: string) {
        return new ECKey(privKey);
    }
}