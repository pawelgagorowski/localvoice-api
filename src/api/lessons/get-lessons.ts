'use strict';

import AWS                                      from "aws-sdk";
import { listOfLessonsArrayType }               from "../../models/types";
import { HeaderRequestInterface }               from "../../models/interfaces";
import { UserHeaderType }                       from "../../models/types";
import CustomError                              from "../../classes/errorResponse";
import DynamoDB                                 from "../../classes/dynamoDB";
import Response                                 from "../../classes/response";
import logger                                   from "../../config/logger"; 

const handler = async (event: HeaderRequestInterface<UserHeaderType>) => {
  logger("info", event)

  let listOfLessons: listOfLessonsArrayType[] = [];
  const generalErrorMessage = "there was an error with adding lesson to database while getting lessons";
  const successResponseMessage = "list of lessons was successfully retrieved";
  try {
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: process.env.LESSONS_FOR_TESTING,
      IndexName: "tester-index",
      KeyConditionExpression: "#tester = :tester",
      ExpressionAttributeValues: {
        ":tester": event.email
      },
      ExpressionAttributeNames: {
        "#tester": "tester",
        "#course": "course",
        "#category": "category",
        "#lesson": "lesson"
      },
      Select: "SPECIFIC_ATTRIBUTES",
      ProjectionExpression: "#category, #lesson, #course"
    }

    const finaleListOfLessons = await DynamoDB.queryItems<listOfLessonsArrayType>(params, listOfLessons, generalErrorMessage);
    const response = Response.createResponseMessage(successResponseMessage, finaleListOfLessons)
    logger("info", response, "response");
    return response;
  } catch(error) {
    logger('error', error);

    const response = error.customErrorMessage ? CustomError.createCustomErrorResponse(404, error.customErrorMessage) : CustomError.createCustomErrorResponse(404, generalErrorMessage);
    logger("error", response, "errorResponse");
    return response;
  }
}

export { handler };
