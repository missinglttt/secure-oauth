import * as _ from 'lodash';

export class Hex {
    protected _value: string;
    private readonly _hexCharacters: string = '0123456789abcdef';

    constructor(value: string | ArrayLike<number>, length?: number) {
        if (_.isString(value)) {
            this._value = this.assert(value, length);
        } else {
            this._value = this.toHex(value, length);
        }
    }

    protected assert(value: string, length?: number): string {
        let match = value.match(/^(0x)?[0-9a-fA-F]*$/);
        if (!match) {
            throw new Error('invalid_hexidecimal_string');
        }

        if (match[1] !== '0x') {
            return '0x' + value;
        }

        if (length && value.length !== 2 + 2 * length) {
            throw new Error('invalid_length');
        }

        return value;
    }

    public toByteArray(): Uint8Array {
        let value = this._value.substring(2);
        if (value.length % 2) { value = '0' + value; }

        let result = [];
        for (var i = 0; i < value.length; i += 2) {
            result.push(parseInt(value.substr(i, 2), 16));
        }

        return new Uint8Array(result);
    }

    public toString() {
        return this._value;
    }

    protected toHex(value: ArrayLike<number>, length?: number) {
        let result = [];
        for (let i = 0; i < value.length; i++) {
            let v = value[i];
            result.push(this._hexCharacters[(v & 0xf0) >> 4] + this._hexCharacters[v & 0x0f]);
        }

        let raw = '0x' + result.join('');
        return this.assert(raw, length);
    }

    public hexZeroPad(length: number): string {
        let final = this._value;
        while (final.length < 2 * length + 2) {
            final = '0x0' + final.substring(2);
        }
        return final;
    }

    public hexStripZeros(): string {
        let final = this._value;
        while (final.length > 3 && final.substring(0, 3) === '0x0') {
            final = '0x' + final.substring(3);
        }

        return final;
    }
}