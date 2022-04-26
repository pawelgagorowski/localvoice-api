
// require('dotenv').config({path: __dirname + '/../../.env'})

const AWS                                         = require('aws-sdk');
// const winston                                     = require('../../config/winston');
const { ResultsError }                            = require("../errors/customErrorClasses");

AWS.config.update({ region: 'eu-central-1' });

const docClient = new AWS.DynamoDB.DocumentClient();

const getParams = (event) => {
  console.log("getParams")
  console.log("event.queryParams.month", event.queryParams.month);
  console.log("event", event);
  const result = {};
  result.month = event.queryParams.month ? event.queryParams.month : getCurrentMonth();
  result.env = event.queryParams.env ? event.queryParams.env : "prod";
  if(!event.queryParams.course) throw new Error();
  else result.course = event.queryParams.course;
  if(!event.queryParams.business) throw new Error();
  else result.business = event.queryParams.business;
  if(!event.email) throw new Error();
  else result.email = event.email;
  console.log("all params", result);

  return result;
}

const getTransformedListOfUsers = (email, listOfUsersFromCertainCourse) => {
  console.log("getTransformedListOfUsers");
  let arrayOfListOfUsers = [];
  for(let i = 0; i < listOfUsersFromCertainCourse.length; i++) {
    const user = listOfUsersFromCertainCourse[i];
    console.log("user", user);
      const tempObjectForResults = {};
      // const currentUserEmail = user.name.slice(0, user.name.lastIndexOf("_"));
      const currentUserEmail = user.name;
      console.log("currentUserEmail", currentUserEmail)
      console.log("email", email);
      if (email == currentUserEmail) {
        tempObjectForResults.user = true;
      } else {
        tempObjectForResults.user = false;
      }
      tempObjectForResults._id = user._id;
      tempObjectForResults.picture = user.picture;
      tempObjectForResults.result = user.score;
      tempObjectForResults.given_name = user.given_name;
      arrayOfListOfUsers.push(tempObjectForResults);
    }
  return arrayOfListOfUsers;
}


const fetchAllUsersFromGivenCourse = async (month, env) => {
  console.log("fetchAllUsersFromGivenCourse");

  const params = {
    TableName: `${process.env.LOCALVOICE_PHRASE_TABLE}-${process.env.NODE_ENV}-result-for-${currentMonth}`
  }

  const data = await docClient.scan(params).promise();
  const users = data.Items;
  if(users.length == 0) throw new ResultsError(406);

  return users;
}

module.exports = {
  getParams,
  getTransformedListOfUsers,
  fetchAllUsersFromGivenCourse
}
