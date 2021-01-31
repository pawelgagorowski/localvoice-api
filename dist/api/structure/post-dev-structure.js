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
const addingStructure_1 = require("../../utils/addingStructure");
const validateStructure_1 = require("../../utils/validateStructure");
const addingUniversalFields_1 = require("../../utils/addingUniversalFields");
const errorResponse_1 = __importDefault(require("../../classes/errorResponse"));
const response_1 = __importDefault(require("../../classes/response"));
const logger_1 = __importDefault(require("../../config/logger"));
aws_sdk_1.default.config.update({ region: 'eu-central-1' });
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default("info", event, "event");
    const generalErrorMessage = "there was an error while saving structure";
    try {
        const missingBodyPropertyErrorMessage = "there are some missing body property request";
        const missingBusinessHeaderErrorMessage = "there was business header missing while deleting little picture";
        const successResponseMessage = "Structure was successfully saved";
        const { courses, categories, lessons, env } = helperFunctions_1.getBodyProperty(event.body, missingBodyPropertyErrorMessage, "courses", "lessons", "categories", "env");
        const { ['X-business']: business } = helperFunctions_1.getHeaders(event.headers, missingBusinessHeaderErrorMessage, "X-business");
        const structure = new validateStructure_1.ValidateStructure(env);
        const commentsForCourses = structure.validateCourses(courses);
        const commentsForCategories = structure.validateCategories(categories);
        const commentsForLessons = structure.validateLessons(lessons);
        if (commentsForCourses.length > 0 || commentsForCategories.length > 0 || commentsForLessons.length > 0) {
            const comments = [...commentsForCourses, ...commentsForCategories, ...commentsForLessons].join(',');
            const response = response_1.default.createResponseMessage(comments, {});
        }
        // adding universal buttons
        // remember to have addChallengeButtons method always before addGoBackToCategoryButton method
        const universalFields = new addingUniversalFields_1.UniversalFields();
        universalFields.addSignInButton(categories);
        universalFields.addChallengeButtons(lessons);
        universalFields.addGoBackToCategoryButton(lessons);
        universalFields.addMonthlyChallengeButton(lessons);
        const removeRecords = new addingStructure_1.RemoveOldStructure(business, env);
        yield removeRecords.removeLessons();
        yield removeRecords.removeCategories();
        const newStructure = new addingStructure_1.PutNewStructure(business, env);
        yield newStructure.addCourse(courses);
        yield newStructure.addCategories(categories);
        yield newStructure.addLessons(lessons);
        yield newStructure.addCoursesToBusinessTable(courses);
        const response = response_1.default.createResponseMessage(successResponseMessage, {});
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
