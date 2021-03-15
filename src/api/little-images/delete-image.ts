'use strict';

import AWS                                      from "aws-sdk";
import { DeleteLittleImageRequestParamsType, 
         UserHeaderType }                       from "../../models/types";
import { HeadersAndParamsRequestInterface }     from "../../models/interfaces";
import { getQueryParams, getHeaders }           from "../../utils/helperFunctions";
import getNameOfBusiness                        from "../../utils/getNameOfBusiness";
import S3Client                                 from "../../classes/s3";
import CustomError                              from "../../classes/errorResponse";
import Response                                 from "../../classes/response";
import logger                                   from "../../config/logger";

const handler = async (event: HeadersAndParamsRequestInterface<UserHeaderType, DeleteLittleImageRequestParamsType>) => {
  logger("info", event, "event");
  const generalErrorMessage = "there was an error while deleting picture";
  
  try {
    const missingParamsErrorMessage = "there are some params missing while deleting little picture";
    const missingUserHeaderErrorMessage = "there was business header missing while deleting little picture";
    const deleteObjectErrorMessage = "there was an error while deleting little picture from database";
    const successResponseMessage = "picture was successfully deleted";

    const { filename: fileName, target } = getQueryParams<DeleteLittleImageRequestParamsType>(event.queryParams, missingParamsErrorMessage, "filename", "target"); 
    const { ['x-user']: user } = getHeaders<UserHeaderType>(event.headers, missingUserHeaderErrorMessage, "x-user"); 
    const business = await getNameOfBusiness(user);
    const key = `${target}/${business}/${fileName}`;

    const params: AWS.S3.DeleteObjectRequest = {
      Bucket: process.env.AWS_S3_BUCKET_PICTURES,
      Key: key
    }
    await S3Client.deleteObject(params, deleteObjectErrorMessage);
    const response = Response.createResponseMessage(successResponseMessage);
    logger("info", response, "response");
    return response;
  } catch (error) {
    logger('error', error);

    const response = error.customErrorMessage ? CustomError.createCustomErrorResponse(404, error.customErrorMessage) : CustomError.createCustomErrorResponse(404, generalErrorMessage);
    logger("error", response, "errorResponse");
    return response;
  }
}

export { handler };
