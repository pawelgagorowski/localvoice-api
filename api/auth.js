const utils = require('../utils/jwt')


exports.handler = async (event) => {
  try {
    console.log("event")
    console.log(event)
    const token = event.authorizationToken;
    const secretKey = process.env.SECRET_KEY;
    const decode = await utils.verify(token, process.env.SECRET_KEY);
    return generatePolicy('user', 'Allow', event.methodArn);
  } catch(e) {
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
