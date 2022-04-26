import { ResponseType }                    from "../models/types";

export default class Response {
    static createResponseMessage<T>(answer: string, data?: T): ResponseType {
        if(!data) {
            const response = {
                statusCode: 200,
                answer,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                  }
            }
            return response;
        }
        return {
            statusCode: 200,
            answer,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
              },
            body: JSON.stringify({
                data
            })
        }
    }
}
