export abstract class BaseResponse {
    status_code: number = 200;
    status_name: string = "OK";
    message: string;

    abstract toJson(): any;
}

