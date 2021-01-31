"use strict";
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
const errorResponse_1 = __importDefault(require("./errorResponse"));
const helperFunctions_1 = require("../utils/helperFunctions");
aws_sdk_1.default.config.update({ region: 'eu-central-1' });
const s3 = new aws_sdk_1.default.S3();
class S3Client {
    static deleteObject(params, customErrorMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield s3.deleteObject(params).promise();
            if (helperFunctions_1.isAWSErrorMessage(data))
                throw errorResponse_1.default.createCustomErrorMessage(customErrorMessage);
        });
    }
    static createPresignedPost(params, customErrorMessage) {
        const data = s3.createPresignedPost(params);
        if (helperFunctions_1.isAWSErrorMessage(data))
            throw errorResponse_1.default.createCustomErrorMessage(customErrorMessage);
        return data;
    }
}
exports.default = S3Client;
