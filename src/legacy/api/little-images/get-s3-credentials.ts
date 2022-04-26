'use strict';

import AWS from "aws-sdk";
import { UserHeaderType, GetImageCredentialsRequestParamsType } from "../../models/types";
import { HeadersAndParamsRequestInterface }      from "../../models/interfaces";
import { getQueryParams, getRandomFilename }     from "../../utils/helperFunctions";
import CustomError                               from "../../classes/errorResponse";
import S3Client                                  from "../../classes/s3";
import logger                                    from "../../config/logger";
import { AuthTokenClaimsvalid } from "../../../auth/validation";
import { response, ResponseStatusCode } from "../../../shared";

const handler = async (event: HeadersAndParamsRequestInterface<UserHeaderType, GetImageCredentialsRequestParamsType>) => {
  const generalErrorMessage = "there was an error while getting image versioning";

  try {
    logger("info", event, "event");

    AuthTokenClaimsvalid.parse(event.requestContext.authorizer.claims);
    const { business } = event.requestContext.authorizer.claims;
    
    const missingParamsErrorMessage = "there are some missing params while getting image credentials";
    const presignedPostErrorMessage = "there was an error while presigned post";

    const { type, target } = getQueryParams<GetImageCredentialsRequestParamsType>(event.multiValueQueryStringParameters, missingParamsErrorMessage, "type", "target");
    const randomString = getRandomFilename();
    
    const fileName = `${randomString}.${type}`;
    logger('info', `${business}/${target}/${fileName}`, 'key');

    const params: AWS.S3.PresignedPost.Params = {
  		Bucket: process.env.AWS_S3_BUCKET_PICTURES,
  		Fields: {
  			Key: `${business}/${target}/${fileName}`,
  		},
      Conditions: [
        ["starts-with", "$Content-Type", "image/"]
      ]
    }

    const credentials = S3Client.createPresignedPost(params, presignedPostErrorMessage);
    console.log("credentials", credentials)
    const fullPath = `${credentials.url}/${business}/${target}/${fileName}`;
    return response({ credentials, fullPath }, ResponseStatusCode.OK);
  } catch (error) {
    logger('error', error);

    const response = CustomError.createCustomErrorResponse(404, generalErrorMessage);
    logger("error", response, "errorResponse");
    return response;
  }
}

export { handler };
