'use strict';

import AWS                                       from "aws-sdk";
import { decodeString, getQueryParams }          from "../../utils/helperFunctions";
import { getSavedLessonRequestType,  
        getSavedLessonQueryParams }              from "../../models/types";
import CustomError                               from "../../classes/errorResponse";
import DynamoDB                                  from "../../classes/dynamoDB";
import Response                                  from "../../classes/response";
import logger                                    from "../../config/logger";

 const handler = async (event: getSavedLessonRequestType) => {
  const deleteItemErrorMessage = "Error while deleting item";
  const deleteItemSuccessMessage = "Item was deleted";

  try {
    logger("info", event, "event");
    const missingParamsErrorMessage = "there are some missing params while deleting lesson";
    const { business: encodedBusiness, key: encodedKey } = getQueryParams<getSavedLessonQueryParams>(event.queryParams, missingParamsErrorMessage, "business", "key");
    
    const business = decodeString(encodedBusiness);
    const key = decodeString(encodedKey);

    const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
      TableName: process.env.LESSONS_FOR_TESTING,
      Key: {
        business: business,
        name: key
      }
    }

    const result = await DynamoDB.deleteItem(params, deleteItemErrorMessage);
    const response = Response.createResponseMessage(deleteItemSuccessMessage, {});
    logger("info", response, "response");
    return response;
  } catch(error) {
    logger('error', error);

    const response = error.customErrorMessage ? CustomError.createCustomErrorResponse(404, error.customErrorMessage) : CustomError.createCustomErrorResponse(404, deleteItemErrorMessage);
    logger("error", response, "errorResponse");
    return response;
  }
}

export { handler };
