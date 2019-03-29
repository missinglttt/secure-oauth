/**
 * Handshake protocol use to start conversation between 2 instances
 * Start with "HELLO" message and then share public key with each other to establish secure channel 
 */
const EventEmitter = require("events");

class OAuth3 extends EventEmitter {
    constructor() {
        super();
    }

    /**
     * Someone says "hello"
     * @param {*} params 
     */
    onHelloReceived() {

    }
}