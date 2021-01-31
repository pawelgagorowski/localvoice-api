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
const paramsForECS_1 = require("../../utils/paramsForECS");
const errorResponse_1 = __importDefault(require("../../classes/errorResponse"));
const response_1 = __importDefault(require("../../classes/response"));
const logger_1 = __importDefault(require("../../config/logger"));
aws_sdk_1.default.config.update({ region: 'eu-central-1' });
const ECS = new aws_sdk_1.default.ECS();
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const generalErrorMessage = "there was an error while trying to generate pictures";
    try {
        logger_1.default("info", event, "event");
        const missingBodyProperties = "there was some missing body properties";
        const successResponse = "currently photos are generated";
        const { business, course, category, lesson, version } = helperFunctions_1.getBodyProperty(event.body, missingBodyProperties, "business", "course", "category", "lesson", "version");
        const ecsProperties = {};
        ecsProperties.business = business;
        ecsProperties.course = course;
        ecsProperties.category = category;
        ecsProperties.lesson = lesson;
        ecsProperties.version = version;
        const params = paramsForECS_1.buildParamsForECS(ecsProperties);
        ECS.runTask(params).promise();
        const response = response_1.default.createResponseMessage(successResponse);
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
