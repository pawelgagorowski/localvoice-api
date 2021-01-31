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
const s3_1 = __importDefault(require("../../classes/s3"));
const response_1 = __importDefault(require("../../classes/response"));
const logger_1 = __importDefault(require("../../config/logger"));
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const generalErrorMessage = "there was an error while getting image versioning";
    try {
        logger_1.default("info", event, "event");
        const missingParamsErrorMessage = "there are some missing params while getting image credentials";
        const missingBusinessHeaderErrorMessasge = "there is no business header while getting image credentials";
        const presignedPostErrorMessage = "there was an error while presigned post";
        const successResponseMessage = "credential was successfully retrieved";
        const { type, target } = helperFunctions_1.getQueryParams(event.queryParams, missingParamsErrorMessage, "type", "target");
        const { ['X-business']: business } = helperFunctions_1.getHeaders(event.headers, missingBusinessHeaderErrorMessasge, "X-business");
        const randomString = helperFunctions_1.getRandomFilename();
        const fileName = `${randomString}.${type}`;
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_PICTURES,
            Fields: {
                Key: `${target}/${business}/${fileName}`,
            },
            Conditions: [
                ["starts-with", "$Content-Type", "image/"]
            ]
        };
        const credentials = s3_1.default.createPresignedPost(params, presignedPostErrorMessage);
        const fullPath = `${credentials.url}/${target}/${business}/${fileName}`;
        const response = response_1.default.createResponseMessage(successResponseMessage, { credentials, fullPath });
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
