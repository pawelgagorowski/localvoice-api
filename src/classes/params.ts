import { LessonType }                                        from "../models/types";

export default class Params {

    static createParamsToUpdateTestingLessons(body: LessonType): AWS.DynamoDB.DocumentClient.UpdateItemInput {
        const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
            TableName: process.env.LIST_OF_ALL_LESSONS_TABLE,
            ReturnValues:"UPDATED_NEW",
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
        }
        return params;
    }

    static createParamsToQueryAllChallenges(body: LessonType): AWS.DynamoDB.DocumentClient.QueryInput {
        const queryParams: AWS.DynamoDB.DocumentClient.QueryInput = {
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
        }
        return queryParams;
    }

    static createParamsToPutChallenges(challenges: string[], body: LessonType): AWS.DynamoDB.DocumentClient.PutItemInput {
        const putParams: AWS.DynamoDB.DocumentClient.PutItemInput = {
            TableName: process.env.MONTHLY_CHALLENGE_TABLE,
            Item: {
              business: body.business,
              category: body.category,
              montlyChallenge: challenges
            }
        }
        return putParams;
    }
} 