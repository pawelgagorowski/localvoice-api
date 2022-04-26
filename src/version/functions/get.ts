
import { ZodError } from 'zod';
import { JsonPackageAdapter } from '../adapters';
import { getVersion } from "../domain";
import { APIGatewayProxyEvent, ErrorMessage, errorResponse, LambdaResponse, response, ResponseStatusCode } from '../../shared';
import { AuthTokenClaimsvalid } from '../../auth/validation';

export const handler = async (event: APIGatewayProxyEvent): Promise<LambdaResponse> => {
    try {
        AuthTokenClaimsvalid.parse(event.requestContext.authorizer.claims);

        const version = getVersion(JsonPackageAdapter)
        if(!version) return errorResponse(ErrorMessage.ERROR_OCCURED, ResponseStatusCode.NOT_FOUND);

        return response(version, ResponseStatusCode.OK);
    } catch(error) {
        if(error instanceof ZodError) {
            const message = error.issues[0].message;
            return errorResponse(message, ResponseStatusCode.NOT_FOUND);
        }
        return errorResponse(ErrorMessage.ERROR_OCCURED, ResponseStatusCode.NOT_FOUND);
    }
};
  