const utils = require('../../utils/jwt');


exports.handler = async (event) => {
  console.log("hello from auth lambda!!");
  try {
    console.log("event")
    console.log(event)
    const token = event.authorizationToken;
    console.log("token", token)
    const secretKey = process.env.SECRET_KEY;
    console.log("secretKey", secretKey)
    const decode = await utils.verify(token, secretKey);
    return generatePolicy('user', 'Allow', event.methodArn);
  } catch(e) {
    console.log(e)
    return e
  }
}


function generatePolicy (principalId, effect, resource) {
    var authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17'; // default version
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke'; // default action
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    console.log(JSON.stringify(authResponse, null, 2))
    return authResponse;
}
