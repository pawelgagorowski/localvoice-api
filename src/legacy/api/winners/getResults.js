'use strict';

const { getParams,
        getTransformedListOfUsers,
        getUser, fetchAllUsersFromGivenCourse }          = require("../../utils/winnersHelperFunctions");
const Month                                              = require("../../utils/month");
const Winners                                            = require("../../utils/winners");
const CourseParticipants                                 = require("../../utils/courseParticipants");
// const winston                                            = require('../../config/winston');

exports.handler = async (event) => { 
  console.log("event", event);
  const response = {};

  try {
    const { month, course, business, email } = getParams(event);
    console.log("month", month)
    console.log("course", course)
    console.log("business", business)
    console.log("email", email);
    const currentMonth = Month.getCurrentMonth();
    const listOfPreviousWinners = (month === currentMonth) ? await Winners.getPreviousWinners(business, course) : await Winners.getPreviousPreviousWinners(business, course);
    const listOfUsersFromCertainCourse = await CourseParticipants.getParticipantsFromGivenMonthAndCourse(month, course, business);
    response.listOfWinners = listOfPreviousWinners;
    response.results = getTransformedListOfUsers(email, listOfUsersFromCertainCourse);
    return response;

  } catch(e) {
    console.log(e)
    response.statusCode = e.statusCode ? e.statusCode : 404;
    return response;
  }
}
