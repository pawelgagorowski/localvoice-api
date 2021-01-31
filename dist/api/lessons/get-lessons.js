'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorResponse_1 = __importDefault(require("../../classes/errorResponse"));
const dynamoDB_1 = __importDefault(require("../../classes/dynamoDB"));
const response_1 = __importDefault(require("../../classes/response"));
const logger_1 = __importDefault(require("../../config/logger"));
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default("info", event);
    let listOfLessons = [];
    const generalErrorMessage = "there was an error with adding lesson to database while getting lessons";
    const successResponseMessage = "list of lessons was successfully retrieved";
    try {
        const params = {
            TableName: process.env.LESSONS_FOR_TESTING,
            IndexName: "tester-index",
            KeyConditionExpression: "#tester = :tester",
            ExpressionAttributeValues: {
                ":tester": event.tester
            },
            ExpressionAttributeNames: {
                "#tester": "tester",
                "#course": "course",
                "#category": "category",
                "#lesson": "lesson"
            },
            Select: "SPECIFIC_ATTRIBUTES",
            ProjectionExpression: "#category, #lesson, #course"
        };
        const finaleListOfLessons = yield dynamoDB_1.default.queryItems(params, listOfLessons, generalErrorMessage);
        const response = response_1.default.createResponseMessage(successResponseMessage, finaleListOfLessons);
        logger_1.default("info", response, "response");
        return response;
    }
    catch (error) {
        logger_1.default('error', error);
        const response = error.customErrorMessage ? errorResponse_1.default.createCustomErrorResponse(404, error.customErrorMessage) : errorResponse_1.default.createCustomErrorResponse(404, generalErrorMessage);
        logger_1.default("error", response, "errorResponse");
        return response;
    }
});
exports.handler = handler;
