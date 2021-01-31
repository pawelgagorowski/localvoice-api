"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Params {
    static createParamsToUpdateTestingLessons(body) {
        const params = {
            TableName: process.env.LIST_OF_ALL_LESSONS_TABLE,
            ReturnValues: "UPDATED_NEW",
            ExpressionAttributeValues: {
                ":course": body.course,
                ":lesson": body.lesson,
                ":translatedLesson": body.translatedLesson,
                ":category": body.category,
                ":translatedCategory": body.translatedCategory,
                ":todaysLesson": body.todaysLesson,
                ":categoryKey": `${body.course}_${body.category}`
            },
            ExpressionAttributeNames: {
                "#course": 'course',
                "#lesson": 'lesson',
                "#translatedLesson": 'translatedLesson',
                "#category": "category",
                "#translatedCategory": 'translatedCategory',
                "#todaysLesson": 'todaysLesson',
                "#categoryKey": 'categoryKey'
            },
            UpdateExpression: "set #course = :course, #lesson = :lesson, #translatedLesson = :translatedLesson, #category = :category, #translatedCategory = :translatedCategory,  #todaysLesson = :todaysLesson, #categoryKey = :categoryKey",
            Key: {
                "business": body.business,
                "key": body.key
            }
        };
        return params;
    }
    static createParamsToQueryAllChallenges(body) {
        const queryParams = {
            TableName: process.env.LIST_OF_ALL_LESSONS_TABLE,
            IndexName: "category-index",
            KeyConditionExpression: "#categoryKey = :categoryKey AND #business = :business",
            ExpressionAttributeValues: {
                ":categoryKey": `${body.course}_${body.category}`,
                ":business": body.business
            },
            ExpressionAttributeNames: {
                "#categoryKey": "categoryKey",
                "#business": "business"
            }
        };
        return queryParams;
    }
    static createParamsToPutChallenges(challenges, body) {
        const putParams = {
            TableName: process.env.MONTHLY_CHALLENGE_TABLE,
            Item: {
                business: body.business,
                category: body.category,
                montlyChallenge: challenges
            }
        };
        return putParams;
    }
}
exports.default = Params;
