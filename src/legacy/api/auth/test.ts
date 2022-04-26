import { isVerifiedToken, generatePolicy } from '../../utils/authHelperFunctions';
import logger from '../../config/logger';

exports.handler = async (event: any) => {
  try {
    console.log('event', event);
    const token = event.authorizationToken.split(' ')[1];
    const result = await isVerifiedToken(token);

    if (!result) return new Error('Unauthorized');

    return generatePolicy('myUser', 'Allow', event.methodArn);
    // else return generatePolicy('Unauthenticated user', 'Deny', event.methodArn);
  } catch (error) {
    logger('error', error);
    throw new Error('Unauthorized');
  }
};
