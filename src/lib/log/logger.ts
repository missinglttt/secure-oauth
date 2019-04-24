import { BaseLogger, WINSTON_LOG_LEVEL } from './base_logger';
import * as mkdirp from 'mkdirp';
import * as fs from 'fs';

export class Logger extends BaseLogger {
    constructor(logDir: string) {
        super(logDir);
        if (!fs.existsSync(logDir)) {
            mkdirp.sync(logDir);
        }
    }

    protected getLogger(type: string, level: WINSTON_LOG_LEVEL = WINSTON_LOG_LEVEL.error) {
        if (this.hasKey(type)) {
            return this.get(type);
        } else {
            let logger = this.createLogger(type, level);
            this.put(type, logger);
            return logger;
        }
    }

    writeLog(tag: string, message: string, type: WINSTON_LOG_LEVEL = WINSTON_LOG_LEVEL.error) {
        let logger = this.getLogger(tag, type);
        logger.log(type.toString(), message);
    }
}