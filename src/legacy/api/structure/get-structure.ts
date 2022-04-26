'use strict';

import AWS from "aws-sdk";
import { UserHeaderType, StructureItemDatabaseType } from "../../models/types";
import { HeaderRequestInterface } from "../../models/interfaces";
import DynamoDB from "../../classes/dynamoDB";
import CustomError from "../../classes/errorResponse";
import logger from "../../config/logger";
import { AuthTokenClaimsvalid } from "../../../auth/validation";
import { response, ResponseStatusCode } from "../../../shared";

AWS.config.update({ region: 'eu-central-1' });

const handler = async (event: HeaderRequestInterface<UserHeaderType>) => {
  logger("error", event, "event");
  const generalErrorMessage = "there was an error while fetching structure";
  try {

    AuthTokenClaimsvalid.parse(event.requestContext.authorizer.claims);
    const { business } = event.requestContext.authorizer.claims;

    const noItemInDatabase = "there was no structure for that user";
    const successResponse = "structure was successfully retrieved";

    const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
      TableName: process.env.STRUCTURE_TABLE,
      Key: {
        business,
      }
    }

    const data = await DynamoDB.getItem<StructureItemDatabaseType>(params, noItemInDatabase);
    const structure = (data as StructureItemDatabaseType).structure ? (data as StructureItemDatabaseType).structure : [];
    logger("info", structure, "structures");

    return response(structure, ResponseStatusCode.OK);
  } catch(error) {
    logger('error', error);

    const response = CustomError.createCustomErrorResponse(404, generalErrorMessage);
    logger("error", response, "errorResponse");
    return response;
  }
}

export { handler };
