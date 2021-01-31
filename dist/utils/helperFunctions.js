'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorResponse_1 = __importDefault(require("../classes/errorResponse"));
exports.decodeString = (string) => {
    return decodeURIComponent(string).replace(/@singlequotemark@/g, "'");
};
exports.getRandomFilename = () => require("crypto").randomBytes(16).toString("hex");
exports.isAWSErrorMessage = (toBeDetermined) => {
    if (toBeDetermined.message) {
        return true;
    }
    return false;
};
exports.getQueryParams = (paramsFromRequest, missingParamsErrorMessage, ...queryParams) => {
    let result = {};
    queryParams.forEach(el => {
        if (paramsFromRequest[el] != undefined)
            result[el] = paramsFromRequest[el];
        else
            throw errorResponse_1.default.createCustomErrorMessage(missingParamsErrorMessage);
    });
    return result;
};
exports.getHeaders = (headersFromEvent, missingHeaderErrorMessage, ...headers) => {
    let result = {};
    headers.forEach(el => {
        if (headersFromEvent[el])
            result[el] = headersFromEvent[el];
        else
            throw errorResponse_1.default.createCustomErrorMessage(missingHeaderErrorMessage);
    });
    return result;
};
exports.getBodyProperty = (body, missingBodyPropertyErrorMessage, ...properties) => {
    let result = {};
    properties.forEach(el => {
        if (body[el])
            result[el] = body[el];
        else
            throw errorResponse_1.default.createCustomErrorMessage(missingBodyPropertyErrorMessage);
    });
    return result;
};
exports.getAttributeFromUpdatedData = (allAttributes, missingAttributeErrorMessage, ...attributes) => {
    let result = {};
    attributes.forEach(el => {
        if (allAttributes[el])
            result[el] = allAttributes[el];
        else
            throw errorResponse_1.default.createCustomErrorMessage(missingAttributeErrorMessage);
    });
    return result;
};
