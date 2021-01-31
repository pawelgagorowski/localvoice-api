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
    const generalErrorMessage = "there was an error while checkig business name";
    try {
        logger_1.default("info", event, "event");
        const missingBusinessHeaderErrorMessasge = "there is no business coresponding with the user while getting name of business";
        const noUserInHeaderErrorMessage = "there is no user in header while getting name of business";
        const successResponseMessage = "business name was successfully retrieved";
        const noBusinessFound = "there was no business coresponding with the user. Contact to admin";
        const { ['X-user']: user } = helperFunctions_1.getHeaders(event.headers, noUserInHeaderErrorMessage, "X-user");
        const params = {
            TableName: process.env.BUSINESS_TABLE,
            Key: {
                email: user
            }
        };
        const business = yield dynamoDB_1.default.getItem(params, missingBusinessHeaderErrorMessasge);
        logger_1.default("info", business, "name of business");
        let response = {};
        if (!business)
            response = response_1.default.createResponseMessage(noBusinessFound, {});
        else
            response = response_1.default.createResponseMessage(successResponseMessage, { business: business });
        return response;
    }
    catch (error) {
        logger_1.default('error', error);
        const response = error.customErrorMessage ? errorResponse_1.default.createCustomErrorResponse(400, error.customErrorMessage) : errorResponse_1.default.createCustomErrorResponse(400, generalErrorMessage);
        logger_1.default("error", response, "errorResponse");
        return response;
    }
});
exports.handler = handler;
