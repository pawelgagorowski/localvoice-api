'use strict';

import AWS                                       from "aws-sdk";
import { UserHeaderType }                        from "../../models/types";
import { HeaderRequestInterface }                from "../../models/interfaces";
import { getHeaders }                            from "../../utils/helperFunctions";
import CustomError                               from "../../classes/errorResponse";
import DynamoDB                                  from "../../classes/dynamoDB";
import Response                                  from "../../classes/response";
import logger                                    from "../../config/logger";

const handler = async (event: HeaderRequestInterface<UserHeaderType>) => {
  const generalErrorMessage = "there was an error while checkig business name";
  try {
    logger("info", event, "event");
    const missingBusinessHeaderErrorMessasge = "there is no business coresponding with the user while getting name of business";
    const noUserInHeaderErrorMessage = "there is no user in header while getting name of business";
    const successResponseMessage = "business name was successfully retrieved";
    const { ['X-user']: user } = getHeaders<UserHeaderType>(event.headers, noUserInHeaderErrorMessage, "X-user");

    const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
      TableName: process.env.BUSINESS_TABLE,
      Key: {
        email: user
      }
    }
    const business = await DynamoDB.getItem<string>(params, missingBusinessHeaderErrorMessasge);
    logger("info", business, "name of business");
    const response = Response.createResponseMessage<string>(successResponseMessage, business);
    return response;

  } catch(error) {
    logger('error', error);

    const response = error.customErrorMessage ? CustomError.createCustomErrorResponse(400, error.customErrorMessage) : CustomError.createCustomErrorResponse(400, generalErrorMessage);
    logger("error", response, "errorResponse");
    return response;
  }
}

export { handler };