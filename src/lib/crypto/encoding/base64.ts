import { stringToByteArray } from "../../types/bytes";

export function decode(textData: string): string {
    return new Buffer(textData, 'base64').toString('ascii');
};

export function encode(data: string): string {
    return new Buffer(stringToByteArray(data)).toString('base64');
}