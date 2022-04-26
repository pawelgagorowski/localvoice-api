'use strict';

import AWS                                       from "aws-sdk";
import { UserHeaderType, KeyBodyType, 
        versionOfTestType }                      from "../../models/types";
import { BodyAndHeaderRequestInterface }         from "../../models/interfaces";
import { getBodyProperty }                       from "../../utils/helperFunctions";
import CustomError                               from "../../classes/errorResponse";
import Response                                  from "../../classes/response";
import logger                                    from "../../config/logger";
import DynamoDB                                  from "../../classes/dynamoDB";

const handler = async (event: BodyAndHeaderRequestInterface<UserHeaderType, KeyBodyType>) => {
    console.log(event);
  const generalErrorMessage = "there was an error while adding production availability"; 
  try {
    const missingBodyPropertyErrorMessage = "there was some missing body properties while updating version of image";
    const updateErrorMessage = "there was an error while adding production availability to lesson";
    const successResponse = "production availability was successfully added to lesson";

    const { key } = getBodyProperty<KeyBodyType>(event.body, missingBodyPropertyErrorMessage, "key");
    const productionAvailability  = 'productionAvailability';

    const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: process.env.LESSONS_FOR_TESTING,
      ReturnValues: "UPDATED_NEW",
      ExpressionAttributeValues: {
        ":value": true
      },
      ExpressionAttributeNames: {
        "#pa": productionAvailability
      },
      UpdateExpression: "set #pa = :value",
      Key: {
        business: event.business,
        name: key
      }
    }
    // dodac walidację dla versionOfTest
    const data = await DynamoDB.updateItem(params, updateErrorMessage);
    const response = Response.createResponseMessage(successResponse);
    return response;
  } catch (error) {
    logger('error', error);

    const response = CustomError.createCustomErrorResponse(404, generalErrorMessage);
    logger("error", response, "errorResponse");
    return response;
  }
}

export { handler };