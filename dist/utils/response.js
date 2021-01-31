"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Response {
    static createResponseMessage(answer) {
        return {
            statusCode: 200,
            answer: answer
        };
    }
}
exports.default = Response;
