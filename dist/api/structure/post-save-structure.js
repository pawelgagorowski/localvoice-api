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
const dynamoDB_1 = __importDefault(require("../../classes/dynamoDB"));
const errorResponse_1 = __importDefault(require("../../classes/errorResponse"));
const response_1 = __importDefault(require("../../classes/response"));
const logger_1 = __importDefault(require("../../config/logger"));
aws_sdk_1.default.config.update({ region: 'eu-central-1' });
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default("info", event, "event");
    const generalErrorMessage = "there was an error while saving structure";
    try {
        const missingBusinessHeader = "there was missing business header";
        const noDataToSave = "there was no data to save";
        const dataBaseErrorMessage = "there was an error trying to save structure in database";
        const successResponse = "structure was successfully saved";
        const { ["X-business"]: business } = helperFunctions_1.getHeaders(event.headers, missingBusinessHeader, "X-business");
        const { structure } = helperFunctions_1.getBodyProperty(event.body, noDataToSave, "structure");
        const params = {
            TableName: process.env.STRUCTURE_TABLE,
            Item: {
                business: business,
                structure: structure
            }
        };
        const data = yield dynamoDB_1.default.putItem(params, dataBaseErrorMessage);
        logger_1.default("info", data, "updated structure");
        const response = response_1.default.createResponseMessage(successResponse, {});
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
