import User                                      from "../../controllers/user";                   
import { isVerifiedToken, getInfoFromToken, 
        generatePolicy, isInfoType }             from "../../utils/authHelperFunctions"
import logger                                    from "../../config/logger";

exports.handler = async (event: any) => {
    try {
        const token = event.authorizationToken.split(' ')[1];
        const email = getInfoFromToken(token);
        if(!email) return new Error("Unauthorized");
        const result = await isVerifiedToken(token);
        if(!result) return new Error("Unauthorized");
        const businessInfo = await User.findBusinessByEmail(email);
        if(isInfoType(businessInfo)) return generatePolicy(businessInfo.userId, 'Allow', event.methodArn, { business: businessInfo.business, email: email });
        else return generatePolicy('Unauthenticated user', 'Deny', event.methodArn);
    } catch(error) {
        logger("error", error);
        throw new Error("Unauthorized");
    }
}

