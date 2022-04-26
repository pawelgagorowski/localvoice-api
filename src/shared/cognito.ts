import AWS from 'aws-sdk';
import { requestEventType } from '../models/types';
import { UserAttributes, CognitoUser, AttributeType, Attributes } from './types';

const cognito = new AWS.CognitoIdentityServiceProvider({
    apiVersion: "2016-04-18"
});

export async function checkCognito(event: requestEventType) {
    let attributes: Attributes;
  
    if(!event.isOffline) attributes = { ['custom:business']: 'localvoice', email:  'pawelgagorowski026@gmail.com'}
    else attributes = await getUserAttributes(event.cognitoAuthenticationProvider, ['custom:business', 'email'])
    if (!attributes || !attributes['custom:business'] || !attributes.email) return new Error('user no registered');

    const business = attributes['custom:business'];
    const email = attributes.email;
    return { business, email }
  
  }

export function getIndexCognitoUserAttributes<K extends Record<string, unknown>>(
   arrayOfAttributesData: AttributeType[]
  ): { [key in keyof K]: string } {
    return arrayOfAttributesData.reduce((acc, key) => {
        if(key.Value) acc[key.Name as keyof K] = key.Value;
      return acc;
    }, {} as { [key in keyof K]: string });
  }

export async function getUserAttributes(cognitoAuthenticationProvider: string, attributes: UserAttributes[]): Promise<{ [P in UserAttributes]?: string } | null> {
    const userCognito = await getCognitoUser(cognitoAuthenticationProvider);
    
    if(!userCognito?.UserAttributes) return null;
    const indexCognitoUserAttributes = getIndexCognitoUserAttributes(userCognito.UserAttributes);

    return attributes.reduce((acc, attribute) => {
        acc[attribute]  = indexCognitoUserAttributes[attribute];
        return acc;
    }, {} as { [P in UserAttributes]?: string })
}

export async function getCognitoUser(cognitoAuthenticationProvider: string): Promise<CognitoUser | null> {
    const userPoolIdRegex = /[^[/]+(?=,)/g;
    const userNameRegex = /[a-z,A-Z,0-9,-]+(?![^:]*:)/g;
    const cognitoInfo = getCognitoInfo(userPoolIdRegex, userNameRegex, cognitoAuthenticationProvider);

    if(cognitoInfo === null) return null;
    const { userPoolId, userName } = cognitoInfo;
    const user = await fetchCognitoUser(userPoolId, userName);

    return user;
}

export async function fetchCognitoUser(userPoolId: string, userName: string): Promise<CognitoUser | null> {
    const params = {
        UserPoolId: userPoolId,
        Username: userName
    };

    try {
        const user = await cognito.adminGetUser(params).promise();
        return user;
    } catch (err) {
        console.log("ERROR in getCustomUserAttributes....: ", err);
        return null;
    }
}
export function getCognitoInfo(userPoolIdRegex: RegExp, userNameRegex: RegExp, cognitoAuthenticationProvider: string ): { userPoolId: string, userName: string } | null {
    const userPoolIdMatch = userPoolIdRegex.exec(cognitoAuthenticationProvider);
    const userNameMatch = userNameRegex.exec(cognitoAuthenticationProvider);

    if (userPoolIdMatch === null || userNameMatch === null) return null; 
    const userPoolId = userPoolIdMatch[0].toString();
    const userName = userNameMatch[0].toString();

    return { userPoolId, userName }
}