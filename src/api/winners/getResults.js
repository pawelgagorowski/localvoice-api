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
    const { month, course, business, email, env } = getParams(event);
    const currentMonth = Month.getCurrentMonth();
    const listOfPreviousWinners = (month === currentMonth) ? await Winners.getPreviousWinners(event.business, course) : await Winners.getPreviousPreviousWinners(event.business, course);
    const listOfUsersFromCertainCourse = await CourseParticipants.getParticipantsFromGivenMonthAndCourse(month, course, event.business);
    response.listOfWinners = listOfPreviousWinners;
    response.results = getTransformedListOfUsers(email, listOfUsersFromCertainCourse);
    return response;

  } catch(e) {
    console.log(e)
    response.statusCode = e.statusCode ? e.statusCode : 404;
    return response;
  }
}
