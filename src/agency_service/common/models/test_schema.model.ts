import { BaseDataModel } from "../db/base_model";

const SCHEMA = {
    from: String,
    to: String,
    source: String,
    target: String,
    sourceAmount: Number,
    targetAmount: Number,
    success: Boolean,
    error: String,
    signature: String,
    identifier: String,
    ref: String,
    senderAddress: String,
    recipientAddress: String,
    txId: String,
    status: String
}

export class TestSchemaModel extends BaseDataModel {
    constructor() {
        super(SCHEMA, "schema_model");
    }
}