import { Response } from 'request';

export class HttpResponseModel<T> {
    success: boolean = false;
    status: number = 0;
    statusMessage: string = "";
    data: T;
    error: string;

    constructor(error: Error, res: Response, body: string) {
        if (error) {
            this.error = error.message;
        }

        this.data = this.tryParse(body) as T;
        this.status = res.statusCode;
        this.statusMessage = res.statusMessage;
        this.success = res.statusCode < 400;
    }

    private tryParse(raw: string) {
        try {
            return JSON.parse(raw);
        } catch (err) {
            return null;
        }
    }
}