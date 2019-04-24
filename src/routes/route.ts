import express from "express";
import { doSend, doParseRequest } from '../lib/server';
import { TestModel } from "../models/test.model";

const ROUTER = express.Router();

ROUTER.get("/test", (req, res, next) => {
    let params = doParseRequest<any, any>(req);
    doSend(res, new TestModel(params));
});

ROUTER.get("/error", (req, res, next) => {
    next(new Error("test_error"));
});

export function getRouter() {
    return ROUTER;
}