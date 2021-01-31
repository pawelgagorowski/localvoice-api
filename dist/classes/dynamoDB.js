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
const logger_1 = __importDefault(require("../config/logger"));
aws_sdk_1.default.config.update({ region: 'eu-central-1' });
const docClient = new aws_sdk_1.default.DynamoDB.DocumentClient();
class DynamoDB {
    static queryItems(params, listOfItems, errorMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield docClient.query(params).promise();
            if (helperFunctions_1.isAWSErrorMessage(data))
                throw errorResponse_1.default.createCustomErrorMessage(errorMessage);
            if (data.Items && data.Items.length > 0)
                listOfItems = listOfItems.concat(data.Items);
            if (data.LastEvaluatedKey) {
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                return yield DynamoDB.queryItems(params, listOfItems, errorMessage);
            }
            return listOfItems;
        });
    }
    static getItem(params, noItemErrorMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield docClient.get(params).promise();
            logger_1.default("info", data, "DynamoDB getItem");
            if (helperFunctions_1.isAWSErrorMessage(data))
                throw errorResponse_1.default.createCustomErrorMessage(noItemErrorMessage);
            if (!data.Item) {
                return "";
            }
            return data.Item;
        });
    }
    static deleteItem(params, errorMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield docClient.delete(params).promise();
            if (helperFunctions_1.isAWSErrorMessage(data))
                throw errorResponse_1.default.createCustomErrorMessage(errorMessage);
            return data;
        });
    }
    static putItem(params, errorMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield docClient.put(params).promise();
            if (helperFunctions_1.isAWSErrorMessage(data))
                throw errorResponse_1.default.createCustomErrorMessage(errorMessage);
            return data;
        });
    }
    static updateItem(params, errorMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield docClient.update(params).promise();
            if (helperFunctions_1.isAWSErrorMessage(data))
                throw errorResponse_1.default.createCustomErrorMessage(errorMessage);
            return data;
        });
    }
}
exports.default = DynamoDB;
