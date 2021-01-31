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
const dynamoDB_1 = __importDefault(require("../classes/dynamoDB"));
aws_sdk_1.default.config.update({ region: 'eu-central-1' });
require('dotenv').config({ path: __dirname + '/../../.env' });
class RemoveOldStructure {
    constructor(business, env) {
        this.business = business;
        this.env = env;
        this.business = business;
        this.env = env;
        this.queryItemsInRemovingCategoryErrorMessage = "there was an error with quering database during removing categories";
        this.deleteItemErrorMessage = "there was an error with deleting item in database during removing categories";
        this.queryItemsInRemovingLessonErrorMessage = "there was an error with quering database during removing lessons";
        this.deleteItemInRemovingLessonErrorMessage = "there was an error with deleting item in database during removing lessons";
    }
    // remove all certain business records from list of categories in one course table
    // we do it to put new ones
    removeCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("removeCategories table", process.env.CATEGORIES_TABLE);
            const paramsForListOfCategoriesInOneCourseQuery = {
                TableName: process.env.CATEGORIES_TABLE,
                KeyConditionExpression: "business = :business",
                ExpressionAttributeValues: {
                    ":business": this.business
                }
            };
            const queryForListOfCategories = yield dynamoDB_1.default.queryItems(paramsForListOfCategoriesInOneCourseQuery, [], this.queryItemsInRemovingCategoryErrorMessage);
            const deletingListOfCategoriesInOneCourseRecordsProcess = queryForListOfCategories.map((item) => __awaiter(this, void 0, void 0, function* () {
                const paramsForDeletingListOfCategoriesInOneCourse = {
                    TableName: process.env.CATEGORIES_TABLE,
                    Key: {
                        business: item.business,
                        name: item.name
                    }
                };
                const data = yield dynamoDB_1.default.deleteItem(paramsForDeletingListOfCategoriesInOneCourse, this.deleteItemErrorMessage);
            }));
            yield Promise.all(deletingListOfCategoriesInOneCourseRecordsProcess);
        });
    }
    removeLessons() {
        return __awaiter(this, void 0, void 0, function* () {
            // remove all certain business records from list of lessons in one category table
            // we do it to put new ones
            const paramsForListOfLessonsInOneCategoryQuery = {
                TableName: process.env.LIST_OF_LESSONS_FOR_SPECIFIC_CATEGORY_TABLE,
                KeyConditionExpression: "business = :business",
                ExpressionAttributeValues: {
                    ":business": this.business
                }
            };
            const queryForListOfLessonsInOneCategory = yield dynamoDB_1.default.queryItems(paramsForListOfLessonsInOneCategoryQuery, [], this.queryItemsInRemovingLessonErrorMessage);
            const deletingListOfLessonsRecordsProcess = queryForListOfLessonsInOneCategory.map((item) => __awaiter(this, void 0, void 0, function* () {
                const paramsForDeletingListOfLessonsInOneCategory = {
                    TableName: process.env.LIST_OF_LESSONS_FOR_SPECIFIC_CATEGORY_TABLE,
                    Key: {
                        business: item.business,
                        key: item.key
                    }
                };
                const data = yield dynamoDB_1.default.deleteItem(paramsForDeletingListOfLessonsInOneCategory, this.deleteItemInRemovingLessonErrorMessage);
            }));
            yield Promise.all(deletingListOfLessonsRecordsProcess);
        });
    }
}
exports.RemoveOldStructure = RemoveOldStructure;
class PutNewStructure {
    constructor(business, env) {
        this.business = business;
        this.env = env;
        this.business = business;
        this.env = env;
        this.putItemToCoursesTableErrorMessage = "there was an error while putting course to ListOfCourses table in PutNewStructure";
        this.putItemToBusinessTableErrorMessage = "there was an error while putting course name to CoursesInBusiness table in PutNewStructure";
        this.putItemToListOfCategoriesTableErrorMessage = "there was an error while putting categories to ListOfCategories table in PutNewStructure";
        this.putItemToListOfLessonsOfSpecificCategoryErrorMessage = "there was an error while putting lesson to ListOfLessons in PutNewStructure";
    }
    // adding courses
    addCourse(courses) {
        return __awaiter(this, void 0, void 0, function* () {
            const paramsForCourse = {
                TableName: process.env.COURSES_TABLE,
                Item: {
                    business: this.business,
                    list: courses.list
                }
            };
            const dataForCourse = yield dynamoDB_1.default.putItem(paramsForCourse, this.putItemToCoursesTableErrorMessage);
        });
    }
    addCoursesToBusinessTable(courses) {
        return __awaiter(this, void 0, void 0, function* () {
            const listOfCourses = [];
            courses.list.forEach((course) => {
                listOfCourses.push(course.title);
            });
            const params = {
                TableName: process.env.COURSES_IN_BUSINESS_TABLE,
                Item: {
                    business: this.business,
                    listOfCourses: listOfCourses
                }
            };
            const result = yield dynamoDB_1.default.putItem(params, this.putItemToBusinessTableErrorMessage);
        });
    }
    // adding categories
    addCategories(categories) {
        return __awaiter(this, void 0, void 0, function* () {
            const processForCategories = categories.map((course) => __awaiter(this, void 0, void 0, function* () {
                const paramsForCategoriesTable = {
                    TableName: process.env.CATEGORIES_TABLE,
                    Item: {
                        business: this.business,
                        name: course.name,
                        list: course.list
                    }
                };
                const data = yield dynamoDB_1.default.putItem(paramsForCategoriesTable, this.putItemToListOfCategoriesTableErrorMessage);
            }));
            yield Promise.all(processForCategories);
        });
    }
    // adding lessons
    addLessons(lessons) {
        return __awaiter(this, void 0, void 0, function* () {
            let key;
            const processForLessons = lessons.map((course) => __awaiter(this, void 0, void 0, function* () {
                course.forEach((category) => __awaiter(this, void 0, void 0, function* () {
                    key = `${category.course}_${category.name}`.toLowerCase();
                    const paramsForLessonsTable = {
                        TableName: process.env.LIST_OF_LESSONS_FOR_SPECIFIC_CATEGORY_TABLE,
                        Item: {
                            business: this.business,
                            key: key,
                            list: category.list,
                            translatedCategoryName: category.translatedCategoryName
                        }
                    };
                    const data = yield dynamoDB_1.default.putItem(paramsForLessonsTable, this.putItemToListOfLessonsOfSpecificCategoryErrorMessage);
                }));
            }));
            yield Promise.all(processForLessons);
        });
    }
}
exports.PutNewStructure = PutNewStructure;
