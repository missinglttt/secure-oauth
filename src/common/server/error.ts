import * as MESSAGES from './error_messages';

export class BaseError {
    message: string;
}

export class NotFoundError extends BaseError {
    constructor() {
        super();
        this.message = MESSAGES.NOT_FOUND_MESSAGE;
    }
}

export class InternalServerError extends BaseError {
    protected alternativeMessage: string = MESSAGES.INTERNAL_ERROR_MESSAGE
    constructor(message: string = "", alt: boolean = false) {
        super();
        this.message = alt ? MESSAGES.INTERNAL_ERROR_MESSAGE : message;
    }
}