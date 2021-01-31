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
const errorResponse_1 = __importDefault(require("../../classes/errorResponse"));
const dynamoDB_1 = __importDefault(require("../../classes/dynamoDB"));
const response_1 = __importDefault(require("../../classes/response"));
const params_1 = __importDefault(require("../../classes/params"));
const logger_1 = __importDefault(require("../../config/logger"));
aws_sdk_1.default.config.update({ region: 'eu-central-1' });
const docClient = new aws_sdk_1.default.DynamoDB.DocumentClient();
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const generalErrorMessage = "there was an error while adding lesson to the database before testing";
    try {
        const successMessageResponse = "lesson was successfully added to tesing environment";
        const updateItemErrorMessage = "there was an error while updating lesson in database";
        const queryItemsErrorMessage = "there was an error with quering challenges while adding lesson to testing environment";
        const putChallengesErrorMessage = "there was an error with adding challenges to database while adding lesson to testing environment";
        const updateParams = params_1.default.createParamsToUpdateTestingLessons(event.body);
        const updatedLesson = yield dynamoDB_1.default.updateItem(updateParams, updateItemErrorMessage);
        logger_1.default("info", updatedLesson, "updated lesson");
        const queryParams = params_1.default.createParamsToQueryAllChallenges(event.body);
        const lessonsWithChallenges = yield dynamoDB_1.default.queryItems(queryParams, [], queryItemsErrorMessage);
        const allChallenges = retrievingQuestionsFromLessons(lessonsWithChallenges);
        logger_1.default("info", allChallenges, "allChallenges");
        const putParams = params_1.default.createParamsToPutChallenges(allChallenges, event.body);
        yield dynamoDB_1.default.putItem(putParams, putChallengesErrorMessage);
        const response = response_1.default.createResponseMessage(successMessageResponse, {});
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
function retrievingQuestionsFromLessons(listOfLessons) {
    console.log("jesteśmy w retrievingQuestionsFromLessons");
    let array = [];
    listOfLessons.forEach((lesson) => {
        let arrayOfChallenges = lesson.todaysLesson.challengeForToday ? lesson.todaysLesson.challengeForToday : [];
        if (arrayOfChallenges && arrayOfChallenges.length > 0) {
            arrayOfChallenges.forEach((el) => {
                array.push(el);
            });
        }
    });
    return array;
}
