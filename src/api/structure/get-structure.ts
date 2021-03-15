'use strict';

import AWS                                             from "aws-sdk";
import { UserHeaderType,
        StructureItemDatabaseType, StructureType }     from "../../models/types";
import { HeaderRequestInterface }                      from "../../models/interfaces";
import { getHeaders }                                  from "../../utils/helperFunctions";
import getNameOfBusiness                               from "../../utils/getNameOfBusiness";
import DynamoDB                                        from "../../classes/dynamoDB";
import CustomError                                     from "../../classes/errorResponse";
import Response                                        from "../../classes/response";
import logger                                          from "../../config/logger";

AWS.config.update({ region: 'eu-central-1' });

const handler = async (event: HeaderRequestInterface<UserHeaderType>) => {
  logger("error", event, "event");
  const generalErrorMessage = "there was an error while fetching structure";
  try {
    const missingBusinessHeader = "there was missing business header";
    const noItemInDatabase = "there was no structure for that user";
    const successResponse = "structure was successfully retrieved";
    const { ["x-user"]: user } = getHeaders<UserHeaderType>(event.headers, missingBusinessHeader, "x-user");
    const business = await getNameOfBusiness(user);

    const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
      TableName: process.env.STRUCTURE_TABLE,
      Key: {
        business: business,
      }
    }

    const data = await DynamoDB.getItem<StructureItemDatabaseType>(params, noItemInDatabase);
    const structure = (data as StructureItemDatabaseType).structure ? (data as StructureItemDatabaseType).structure : [];

    const response = Response.createResponseMessage<StructureType[]>(successResponse, structure);
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
