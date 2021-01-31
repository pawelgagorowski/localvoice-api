"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const utils = require('../utils/jwt');
exports.handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("event");
        console.log(event);
        const token = event.authorizationToken;
        const secretKey = process.env.SECRET_KEY;
        const decode = yield utils.verify(token, process.env.SECRET_KEY);
        return generatePolicy('user', 'Allow', event.methodArn);
    }
    catch (e) {
        return e;
    }
});
function generatePolicy(principalId, effect, resource) {
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
    console.log(JSON.stringify(authResponse, null, 2));
    return authResponse;
}
