"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError extends Error {
    static createCustomErrorResponse(statusCode, errorMessage) {
        let response = {
            statusCode,
            answer: errorMessage
        };
        return response;
    }
    static createCustomErrorMessage(customErrorMessage) {
        return {
            customErrorMessage
        };
    }
}
exports.default = CustomError;
