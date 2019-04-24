import { Point } from "./point";
import { ADDRESS_LENGTH } from "./enum";
import _ from "lodash";

export class Address extends Point {
    constructor(value: string | Uint8Array) {
        if (_.isString(value) && value.startsWith("0x")) {
            value = value.slice(2);
        }

        super(value, ADDRESS_LENGTH);
    }
}
