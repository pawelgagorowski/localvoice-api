"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError extends Error {
    static createCustomErrorResponse(statusCode, errorMessage) {
        return {
            statusCode,
            answer: errorMessage
        };
    }
    static createCustomErrorMessage(customErrorMessage) {
        return {
            customErrorMessage
        };
    }
}
exports.default = CustomError;
