import { ResponseType, 
         CustomErrorMessageType }                from "../models/types";
import Response from './response';

export default class CustomError extends Error {
    static createCustomErrorResponse(statusCode: number, errorMessage: string): ResponseType {
        let response = {
            statusCode,
            answer: errorMessage
        }
        
        return response
    }

    static createCustomErrorMessage(customErrorMessage: string) {
        throw new Error(customErrorMessage);
    }
}