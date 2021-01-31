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
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const helperFunctions_1 = require("../../utils/helperFunctions");
const errorResponse_1 = __importDefault(require("../../classes/errorResponse"));
const dynamoDB_1 = __importDefault(require("../../classes/dynamoDB"));
const response_1 = __importDefault(require("../../classes/response"));
const logger_1 = __importDefault(require("../../config/logger"));
aws_sdk_1.default.config.update({ region: 'eu-central-1' });
const docClient = new aws_sdk_1.default.DynamoDB.DocumentClient();
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default("info", event, "event");
    const generalErrorMessage = "sorry but there was an error while adding lesson to the database";
    try {
        const postErrorMessage = "there was an error with adding new lessons to database while saving lesson";
        const SuccessResponseMessage = "lesson was successfully saved";
        const noUserErrorMessage = "there is no user in header while saving lesson";
        const { ['X-user']: user } = helperFunctions_1.getHeaders(event.headers, noUserErrorMessage, "X-user");
        const params = {
            TableName: process.env.LESSONS_FOR_TESTING,
            Item: {
                tester: user,
                course: event.body.course,
                business: event.body.business,
                category: event.body.category,
                translatedCategory: event.body.translatedCategory,
                lesson: event.body.lesson,
                translatedLesson: event.body.translatedLesson,
                name: event.body.key,
                todaysLesson: event.body.todaysLesson
            }
        };
        const updatedData = yield dynamoDB_1.default.putItem(params, postErrorMessage);
        const response = response_1.default.createResponseMessage(SuccessResponseMessage, {});
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
