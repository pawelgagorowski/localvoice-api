import jwt from 'jsonwebtoken';
import { AuthContext } from "../models/types";
import { UserInfo, BusinessInfo } from "../models/types";

async function isVerifiedToken (token: string) {
    try {
        // const clientSecret = process.env.AUTH0_CLIENT_SECRET;
        const clientSecret = 'dupa';
        jwt.verify(token, clientSecret);
        return true;
    } catch (error) {
       return false;
    }
 }
  
 const getInfoFromToken = (token: string) => {
     console.log("token", token);
    const decode = jwt.decode(token, {complete: true});
    if(!decode) return null;
    const email = decode.payload.email;
    return email;
 }
  
 const generatePolicy = (principalId: string, effect: string, resource: string, context?: AuthContext ) => {
     console.log("generatePolicy");
    const authResponse = {
        principalId: principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Effect: effect,
                    Action: 'execute-api:Invoke',
                    Resource: resource
                }
            ]
  
        },
        context: context
    }
    return authResponse;
 }

 const isUserInfo = (userInfo: UserInfo | boolean): userInfo is UserInfo => {
    return (userInfo as UserInfo).business !== undefined;
 }

 const isBusinessInfo = (userInfo: BusinessInfo | boolean): userInfo is UserInfo => {
    return (userInfo as BusinessInfo).business !== undefined;
 }


 export { isVerifiedToken, 
          getInfoFromToken, 
          generatePolicy,
          isUserInfo,
          isBusinessInfo }