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
const response_1 = __importDefault(require("../../classes/response"));
const logger_1 = __importDefault(require("../../config/logger"));
const dynamoDB_1 = __importDefault(require("../../classes/dynamoDB"));
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const generalErrorMessage = "there was an error while updating image version";
    try {
        const missingBodyPropertyErrorMessage = "there was some missing body properties while update version of image";
        const updateErrorMessage = "there was an error with updating version of image while post image versioning";
        const successResponse = "version of image was successfully retrieved";
        const { business, key } = helperFunctions_1.getBodyProperty(event.body, missingBodyPropertyErrorMessage, "business", "key");
        const version = 'versionOfTest';
        const params = {
            TableName: process.env.LIST_OF_ALL_LESSONS_TABLE,
            ReturnValues: "UPDATED_NEW",
            ExpressionAttributeValues: {
                ":inc": 1,
                ":init": parseInt(process.env.INIT_VERSION, 10)
            },
            ExpressionAttributeNames: {
                "#c": version
            },
            UpdateExpression: "set #c = if_not_exists(#c, :init) + :inc",
            Key: {
                business: business,
                key: key
            }
        };
        // dodac walidację dla versionOfTest
        const data = yield dynamoDB_1.default.updateItem(params, updateErrorMessage);
        const versionOfTest = data.Attributes.versionOfTest;
        // const versionOfTest = getVersionOfTest(data.Attributes)
        const response = response_1.default.createResponseMessage(successResponse, { versionOfTest: versionOfTest });
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
