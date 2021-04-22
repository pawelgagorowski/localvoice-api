'use strict';

import AWS                                       from "aws-sdk";
import { UserHeaderType,
          GetImageCredentialsRequestParamsType, 
          GetImageCredentialsResponse }          from "../../models/types";
import { HeadersAndParamsRequestInterface }      from "../../models/interfaces";
import { getQueryParams, getRandomFilename }     from "../../utils/helperFunctions";
import CustomError                               from "../../classes/errorResponse";
import S3Client                                  from "../../classes/s3";
import Response                                  from "../../classes/response";
import logger                                    from "../../config/logger";

const handler = async (event: HeadersAndParamsRequestInterface<UserHeaderType, GetImageCredentialsRequestParamsType>) => {
  const generalErrorMessage = "there was an error while getting image versioning";

  try {
    logger("info", event, "event");
    const missingParamsErrorMessage = "there are some missing params while getting image credentials";
    const presignedPostErrorMessage = "there was an error while presigned post";
    const successResponseMessage = "credential was successfully retrieved";

    const { type, target } = getQueryParams<GetImageCredentialsRequestParamsType>(event.queryParams, missingParamsErrorMessage, "type", "target");
    const randomString = getRandomFilename();
    
    const fileName = `${randomString}.${type}`;
    logger('info', `${event.business}/${target}/${fileName}`, 'key');

    const params: AWS.S3.PresignedPost.Params = {
  		Bucket: process.env.AWS_S3_BUCKET_PICTURES,
  		Fields: {
  			Key: `${event.business}/${target}/${fileName}`,
  		},
      Conditions: [
        ["starts-with", "$Content-Type", "image/"]
      ]
    }

    const credentials = S3Client.createPresignedPost(params, presignedPostErrorMessage);
    const fullPath = `${credentials.url}/${event.business}/${target}/${fileName}`;
    const response = Response.createResponseMessage<GetImageCredentialsResponse>(successResponseMessage, { credentials, fullPath });
    return response;
  } catch (error) {
    logger('error', error);

    const response = error.customErrorMessage ? CustomError.createCustomErrorResponse(404, error.customErrorMessage) : CustomError.createCustomErrorResponse(404, generalErrorMessage);
    logger("error", response, "errorResponse");
    return response;
  }
}

export { handler };
