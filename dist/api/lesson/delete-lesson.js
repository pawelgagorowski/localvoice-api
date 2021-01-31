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
const helperFunctions_1 = require("../../utils/helperFunctions");
const errorResponse_1 = __importDefault(require("../../classes/errorResponse"));
const dynamoDB_1 = __importDefault(require("../../classes/dynamoDB"));
const response_1 = __importDefault(require("../../classes/response"));
const logger_1 = __importDefault(require("../../config/logger"));
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteItemErrorMessage = "Error while deleting item";
    const deleteItemSuccessMessage = "Item was deleted";
    try {
        logger_1.default("info", event, "event");
        const missingParamsErrorMessage = "there are some missing params while deleting lesson";
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
        const result = yield dynamoDB_1.default.deleteItem(params, deleteItemErrorMessage);
        const response = response_1.default.createResponseMessage(deleteItemSuccessMessage, {});
        logger_1.default("info", response, "response");
        return response;
    }
    catch (error) {
        logger_1.default('error', error);
        const response = error.customErrorMessage ? errorResponse_1.default.createCustomErrorResponse(404, error.customErrorMessage) : errorResponse_1.default.createCustomErrorResponse(404, deleteItemErrorMessage);
        logger_1.default("error", response, "errorResponse");
        return response;
    }
});
exports.handler = handler;
