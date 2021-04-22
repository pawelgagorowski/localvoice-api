'use strict';

// require('dotenv').config({path: __dirname + '/../.env'})
const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });

const docClient = new AWS.DynamoDB.DocumentClient();
const course = "english beginner";

const { getParams,
        getTransformedListOfUsers,
        getUser, fetchAllUsersFromGivenCourse }          = require("../../utils/helperFunctions");
const Month                                              = require("../../utils/month");
const Winners                                            = require("../../utils/winners");
const Courses                                            = require('../../utils/coursesInBusiness');
const CourseParticipants                                 = require('../../utils/courseParticipants');
// const winston                                            = require('../../config/winston');


exports.handler = async (event) => {
  try {
    const rowDataWithCoursesAndBusinesses = await Courses.getCoursesFromTable();
    const listOfCoursesWithCorespondingBusinesses = Courses.extractListOfCoursesWithCorespondingBusiness(rowDataWithCoursesAndBusinesses);
    const listOfCoursesWithParticipants = await CourseParticipants.getCourseParticipantsBasedOnListFromPreviousMonth(listOfCoursesWithCorespondingBusinesses);
    const listOfCoursesWithWinners = await Winners.getPreviousPreviousWinnersBasedOnList(listOfCoursesWithCorespondingBusinesses);
    const listOfConnectedCoursesAndParticipantsAndWinners = await Winners.connectCoursesAndWinners(listOfCoursesWithCorespondingBusinesses, listOfCoursesWithParticipants, listOfCoursesWithWinners)
    await Winners.putWinnersToTable(listOfConnectedCoursesAndParticipantsAndWinners);
  } catch(e) {
    console.log(e);
  }
}
