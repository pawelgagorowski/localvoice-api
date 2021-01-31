import { ResponseType }                    from "../models/types";

export default class Response {
    static createResponseMessage<T>(answer: string, data?: T): ResponseType {
        if(!data) {
            const response = {
                statusCode: 200,
                answer
            }
            return response;
        }
        return {
            statusCode: 200,
            answer,
            body: JSON.stringify({
                data
            })
        }
    }
} 