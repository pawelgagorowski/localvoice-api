'use strict';

import AWS from "aws-sdk";
import { DeleteLittleImageRequestParamsType, UserHeaderType }   from "../../models/types";
import { HeadersAndParamsRequestInterface } from "../../models/interfaces";
import { getQueryParams } from "../../utils/helperFunctions";
import S3Client from "../../classes/s3";
import CustomError from "../../classes/errorResponse";
import { AuthTokenClaimsvalid } from "../../../auth/validation";
import { response, ResponseStatusCode } from "../../../shared";
import logger  from "../../config/logger";

const handler = async (event: HeadersAndParamsRequestInterface<UserHeaderType, DeleteLittleImageRequestParamsType>) => {
  logger("info", event, "event");
  const generalErrorMessage = "there was an error while deleting picture";
  
  try {
    AuthTokenClaimsvalid.parse(event.requestContext.authorizer.claims);
    const { business } = event.requestContext.authorizer.claims;

    const missingParamsErrorMessage = "there are some params missing while deleting little picture";
    const deleteObjectErrorMessage = "there was an error while deleting little picture from database";
    const successResponseMessage = "picture was successfully deleted";

    const { filename, target } = getQueryParams<DeleteLittleImageRequestParamsType>(event.multiValueQueryStringParameters, missingParamsErrorMessage, "filename", "target");
    const key = `${business}/${target}/${filename}`;
    logger('info', key, 'key');

    const params: AWS.S3.DeleteObjectRequest = {
      Bucket: process.env.AWS_S3_BUCKET_PICTURES,
      Key: key
    }
    await S3Client.deleteObject(params, deleteObjectErrorMessage);
    return response(successResponseMessage , ResponseStatusCode.OK);
  } catch (error) {
    logger('error', error);

    const response = CustomError.createCustomErrorResponse(404, generalErrorMessage);
    logger("error", response, "errorResponse");
    return response;
  }
}

export { handler };
