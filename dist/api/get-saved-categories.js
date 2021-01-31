'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//
// Route: GET /category/saved
//
const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });
const docClient = new AWS.DynamoDB.DocumentClient();
const table = process.env.STRUCTURE_TABLE;
exports.handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const business = event.queryParams.business;
        const courses = event.queryParams.course.split(',');
        console.log(courses);
        const categories = [];
        const process = courses.map((course) => __awaiter(void 0, void 0, void 0, function* () {
            const params = {
                TableName: table,
                Key: {
                    business: business,
                    name: course
                }
            };
            const data = yield docClient.get(params).promise();
            console.log("data", data);
            console.log(data.Item.list);
            const result = data.Item && data.Item.list ? data.Item.list : [];
            console.log("result", result);
            console.log("length", result.length);
            if (result.length > 0) {
                categories.push(result);
            }
        }));
        yield Promise.all(process);
        return categories;
    }
    catch (e) {
        console.log(e);
        return false;
    }
});
