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
const s3_1 = __importDefault(require("../../classes/s3"));
const errorResponse_1 = __importDefault(require("../../classes/errorResponse"));
const response_1 = __importDefault(require("../../classes/response"));
const logger_1 = __importDefault(require("../../config/logger"));
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default("info", event, "event");
    const generalErrorMessage = "there was an error while deleting picture";
    try {
        const missingParamsErrorMessage = "there are some params missing while deleting little picture";
        const missingBusinessHeaderErrorMessage = "there was business header missing while deleting little picture";
        const deleteObjectErrorMessage = "there was an error while deleting little picture from database";
        const successResponseMessage = "picture was successfully deleted";
        const { filename: fileName, target } = helperFunctions_1.getQueryParams(event.queryParams, missingParamsErrorMessage, "filename", "target");
        const { ['X-business']: business } = helperFunctions_1.getHeaders(event.headers, missingBusinessHeaderErrorMessage, "X-business");
        const key = `${target}/${business}/${fileName}`;
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_PICTURES,
            Key: key
        };
        yield s3_1.default.deleteObject(params, deleteObjectErrorMessage);
        const response = response_1.default.createResponseMessage(successResponseMessage);
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
