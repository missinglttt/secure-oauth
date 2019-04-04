import { BaseDataModel } from "../db/base_model";

export class NonSchemaModel extends BaseDataModel {
    constructor() {
        super({}, "non_schema_model", {
            strict: false
        });
    }
}