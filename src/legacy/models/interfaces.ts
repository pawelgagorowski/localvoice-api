import { requestEventType }                              from "./types";

export interface BodyAndHeaderRequestInterface<T, K> extends requestEventType {
    headers: K
    body: T
}

export interface HeaderRequestInterface<T> extends requestEventType {
    headers: T
}

export interface HeadersAndParamsRequestInterface<T, K> extends requestEventType {
    headers: T,
    queryParams: K
    multiValueQueryStringParameters: K
}

export interface ParamsRequestInterface<T> extends requestEventType {
    params: T
}

export interface BodyRequestParams<T> extends requestEventType {
    body: T
}
