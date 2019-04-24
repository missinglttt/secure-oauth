import * as winston from 'winston';
import { HashTableBase } from '../../lib';
import * as path from 'path';

export enum WINSTON_LOG_LEVEL {
    error,
    warn,
    info,
    verbose,
    debug,
    silly
}

export class BaseLogger extends HashTableBase<winston.Logger> {
    protected _logPath: string;
    constructor(logDir: string) {
        super();
        this._logPath = logDir;
    }

    protected createLogger(filename: string, level: WINSTON_LOG_LEVEL) {
        const rotationTransport = this.getRotationFormat(filename);
        return winston.createLogger({
            level: level.toString(),
            format: winston.format.json(),
            transports: [
                rotationTransport,
                new winston.transports.Console()
            ],
            exitOnError: false
        })
    }

    private getRotationFormat(filename: string) {
        return require('winston-daily-rotate-file')({
            level: 'debug',
            filename: path.join(this._logPath, filename + "_"),
            handleExceptions: true,
            datePattern: 'yyyy-MM-dd',
            json: true,
            maxsize: 5242880,
            colorize: false,
            humanReadableUnhandledException: true
        });
    }
}