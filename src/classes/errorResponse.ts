import { ResponseType, 
         CustomErrorMessageType }                from "../models/types";

export default class CustomError extends Error {
    static createCustomErrorResponse(statusCode: number, errorMessage: string): ResponseType {
        let response = {
            statusCode,
            answer: errorMessage
        }
        
        return response
    }
    static createCustomErrorMessage(customErrorMessage: string): CustomErrorMessageType {
        return {
            customErrorMessage
        }
    }
}