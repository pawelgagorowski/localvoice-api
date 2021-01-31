"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Response {
    static createResponseMessage(answer, data) {
        if (!data) {
            const response = {
                statusCode: 200,
                answer
            };
            return response;
        }
        return {
            statusCode: 200,
            answer,
            body: JSON.stringify({
                data
            })
        };
    }
}
exports.default = Response;
