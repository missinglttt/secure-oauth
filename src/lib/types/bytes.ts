const HEX_CHARACTERS: string = '0123456789abcdef';

export function stringToByteArray(value: string) {
    let result = [];
    for (let i = 0; i < value.length; i += 2) {
        result.push(parseInt(value.substr(i, 2), 16));
    }

    return new Uint8Array(result);
}

export function arrayToByteArray(value: ArrayLike<number>) {
    return new Uint8Array(value);
}

export function concat(objects: Array<ArrayLike<number>>): Uint8Array {
    var arrays = [];
    var length = 0;
    for (var i = 0; i < objects.length; i++) {
        var object = arrayToByteArray(objects[i])
        arrays.push(object);
        length += object.length;
    }

    var result = new Uint8Array(length);
    var offset = 0;
    for (var i = 0; i < arrays.length; i++) {
        result.set(arrays[i], offset);
        offset += arrays[i].length;
    }

    return result;
}

export function bufferToHex(value: ArrayLike<number>) {
    let result = [];
    for (let i = 0; i < value.length; i++) {
        let v = value[i];
        result.push(HEX_CHARACTERS[(v & 0xf0) >> 4] + HEX_CHARACTERS[v & 0x0f]);
    }

    return '0x' + result.join('');
}