function encodeBase64(data) {
    let encoded = new Buffer(data).toString('base64');
    return encoded;
}

function decodeBase64(hash) {
    let decoded = new Buffer(hash, 'base64')
        .toString('ascii');
    return decoded;
}

module.exports = {
    encodeBase64,
    decodeBase64
};