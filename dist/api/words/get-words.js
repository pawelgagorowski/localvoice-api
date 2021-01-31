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
//
// Route: GET /words
//
const aws_sdk_1 = __importDefault(require("aws-sdk"));
aws_sdk_1.default.config.update({ region: 'eu-central-1' });
const docClient = new aws_sdk_1.default.DynamoDB.DocumentClient();
const tableName = process.env.WORDS_TABLE;
exports.handler = () => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        TableName: tableName
    };
    try {
        const myDoc = yield docClient.scan(params).promise();
        return myDoc;
    }
    catch (e) {
        console.log(e);
    }
});
