'use strict';

import AWS from "aws-sdk";
import { v4 as uuidv4 } from 'uuid';
import { listOfLessonsType } from "../../models/types";
import { HeaderRequestInterface } from "../../models/interfaces";
import { UserHeaderType } from "../../models/types";
import CustomError from "../../classes/errorResponse";
import DynamoDB from "../../classes/dynamoDB";
import { response, ResponseStatusCode } from '../../../shared';
import { AuthTokenClaimsvalid } from "../../../auth/validation";
import logger from "../../config/logger";

const handler = async (event: HeaderRequestInterface<UserHeaderType>) => {
  logger("info", event)

  AuthTokenClaimsvalid.parse(event.requestContext.authorizer.claims);
  const { email } = event.requestContext.authorizer.claims;

  const listOfLessons: listOfLessonsType[] = [];
  const generalErrorMessage = "there was an error with adding lesson to database while getting lessons";
  try {
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: process.env.LESSONS_FOR_TESTING,
      IndexName: "tester-index",
      KeyConditionExpression: "#tester = :tester",
      ExpressionAttributeValues: {
        ":tester": email
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

    const finaleListOfLessons = await DynamoDB.queryItems<listOfLessonsType>(params, listOfLessons, generalErrorMessage);
    const list = finaleListOfLessons.map((it) => ({
      id: uuidv4(),
      course: it.course,
      category: it.category,
      lesson: it.lesson
    }))
    console.log("list", list)
    return response(list, ResponseStatusCode.OK);
  } catch(error) {
    logger('error', error);

    const response = CustomError.createCustomErrorResponse(404, generalErrorMessage);
    logger("error", response, "errorResponse");
    return response;
  }
}

export { handler };
