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
const response_1 = __importDefault(require("../../classes/response"));
const dynamoDB_1 = __importDefault(require("../../classes/dynamoDB"));
const logger_1 = __importDefault(require("../../config/logger"));
aws_sdk_1.default.config.update({ region: 'eu-central-1' });
const docClient = new aws_sdk_1.default.DynamoDB.DocumentClient();
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const generalErrorMessage = "there was an error while getting lesson";
    try {
        logger_1.default("info", event);
        const noItemErrorMessage = 'sorry but we could\'nt find that lesson in database';
        const missingParamsErrorMessage = 'there are some missing params while getting lesson';
        const successResponseMessage = "lesson was successfully retrieved";
        const { business: encodedBusiness, key: encodedKey } = helperFunctions_1.getQueryParams(event.queryParams, missingParamsErrorMessage, "business", "key");
        const business = helperFunctions_1.decodeString(encodedBusiness);
        const key = helperFunctions_1.decodeString(encodedKey);
        const params = {
            TableName: process.env.LESSONS_FOR_TESTING,
            Key: {
                business: business,
                name: key
            }
        };
        const lesson = yield dynamoDB_1.default.getItem(params, noItemErrorMessage);
        const response = response_1.default.createResponseMessage(successResponseMessage, lesson);
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
