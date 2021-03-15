// require('dotenv').config();
// const AWS = require('aws-sdk');
// AWS.config.update({ region: 'eu-central-1' });
// const docClient = new AWS.DynamoDB.DocumentClient();

// 'use strict';
//
// const AWS = require('aws-sdk');
// AWS.config.update({ region: 'eu-central-1' });
//
// const docClient = new AWS.DynamoDB.DocumentClient();
// const tableName = `results_for_october_test`;
//
//   const params = {
//     TableName: tableName
//   }
//
//   const myDoc = docClient.scan(params).promise();
//   return myDoc.then(function (data) {
//     console.log("Udało się");
//     let myArray = [];
//     console.log(data);
//     const items = data.Items;
//     for(let i = 0; i < items.length; i++) {
//       const item = items[i];
//         let tempObjectForResults = {};
//         if (true) {
//           tempObjectForResults.user = true
//         } else {
//           tempObjectForResults.user = false;
//         }
//         tempObjectForResults.name = item.name
//         let score = item.score
//         tempObjectForResults.result = score;
//         let given_name = item.given_name
//         tempObjectForResults.given_name = given_name;
//         myArray.push(tempObjectForResults);
//       }
//       console.log("udało się")
//       console.log(myArray)
//       return myArray
//     }).catch(function (e) {
//         console.log("Nie udało się")
//     })
//
//
//   function getCurrentMonth() {
//     const month_array = ["january", "february", "march", "april", "mai", "juni", "juli", "august", 'september', 'october', 'november', 'december']
//     const d = new Date();
//     const n = d.getMonth();
//
//     return month_array[n]
// }



// const array = ["Paweł", "Ola", "Damian", "Marcin"];
//
// const obj = {
//   title: "Go back to categories",
//   description: "Powrót do kategorii",
//   image: "https://english-project.s3.eu-central-1.amazonaws.com/icons/go-back.png",
//   alt: "sign to go back"
// }
//
// array.splice(0,0, obj)


// {
//   "_id": "78af6eaf81f81b1d92227eba1f7b33d2",
//   "business": "localvoice",
//   "name": "pawelgagorowski026@gmail.com",
//   "picture": "https://lh3.googleusercontent.com/a-/AOh14GjgWvjfwmwlWf8f-DCdDVDrTaev5F4dTiA0HUEu"
// }


// class MyError extends Error {
//   constructor(message) {
//     super();
//     this.statusCode = message;
//   }
// }

// class MyError2  {
//   constructor(message) {
//     this.statusCode = message;
//   }
// }

// async function getUser () {
//   console.log("getUser");

//   const params = {
//     TableName: "localvoice-tables-test-UsersTable-116T187VWVSZB",
//     Key: {
//       business: "localvoice",
//       name: "pawelgagorowski026@gmail.com"
//     }
//   }
//   const data = await docClient.get(params).promise();
//   if(!data.Item) throw new MyError2(404);
//   console.log("data", data);
//   console.log("jesteśmy za if");
//   return data;
// }


// async function mainF() {
//   try {
//     await getUser()
//   } catch(e) {
//     console.log(e.statusCode)
//   }
// }

// mainF();

// const obj = {
//   "mama": "Jadwiga",
//   "tata": "Andrzej",
//   "ciocia": "Danka",
//   "wujek": "marek"
// }

// function myF<T>(object: any, ...params: string[]): T {
//   let dupa = {} as any;
//   params.forEach((el) => {
//     if(object[el]) dupa[el] = object[el]
//   })
//   console.log(dupa)
//   return dupa;
// }

// export const isError = <T>(toBeDetermined: T | AWS.AWSError): toBeDetermined is AWS.AWSError => {
//   if((toBeDetermined as AWS.AWSError).message) {
//     return true;
//   }
//   return false;
// }

// myF(obj, "mama", 'tata', "ciocia")




// get-saved-lessons:
//     handler: dist/api/lessons/get-lessons.handler
//     description: GET /lessons
//     events:
//       - http:
//           path: lessons/{name}
//           method: get
//           integration: lambda
//           authorizer:
//             name: authorization-lambda
//             identitySource: method.request.header.Authorization
//             resultTtlInSeconds: 3600
//           cors:
//             origin: '*'
//             headers: ${self:custom.allowedHeaders}
//           request:
//             template:
//               application/json: >
//                 #set($inputRoot = $input.path('$'))
//                 {
//                 "tester": "$input.params('name')"
//                 }

