import { requestEventType, 
        ResponseType }                              from "./types";

export interface BodyAndHeaderRequestInterface<T, K> extends requestEventType {
    body: T
    headers: K
}

export interface HeaderRequestInterface<T> extends requestEventType {
    headers: T
}

export interface HeadersAndParamsRequestInterface<T, K> extends requestEventType {
    headers: T,
    queryParams: K 
}

export interface ParamsRequestInterface<T> extends requestEventType {
    params: T
}

export interface BodyRequestParams<T> extends requestEventType {
    body: T
}