/**
 * Handshake protocol use to start conversation between 2 instances
 * Start with "HELLO" message and then share public key with each other to establish secure channel 
 */
const EventEmitter = require("events");

class HandShakeProtocol extends EventEmitter {
    constructor() {

    }

    /**
     * Someone says "hello"
     * @param {*} params 
     */
    onHelloReceived(params) {

    }
}