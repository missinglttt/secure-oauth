/**
 * @type T Type of request parameter
 * @type K: Type of request query (GET) or body (other methods)
 */
export class HttpRequestModel<T, K> {
    params: T;
    data: K;
}