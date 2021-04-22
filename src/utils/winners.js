// require('dotenv').config({path: __dirname + '/../../.env'})

const AWS                                         = require('aws-sdk');
// const winston                                     = require('../../config/winston');
const Month                                       = require("./month");

AWS.config.update({ region: 'eu-central-1' });

const docClient = new AWS.DynamoDB.DocumentClient();


class Winners {
  static async getPreviousWinners (business, course) {
    console.log("getPreviousWinners");

    const tableName = `${process.env.WINNERS_TABLE}`;
    const { index, month } = Month.getPreviousMonthAndIndex();
    const year = Winners.getExpectedYearBasedOnMonth(index, false);
    console.log("tableName", tableName);
    console.log(`${year}_${month}_${course}`);
    console.log("business", business);
    const params = {
      TableName: tableName,
      Key: {
        business: business,
        month: `${year}_${month}_${course}`
      }
    }
    const result = await docClient.get(params).promise();
    const listOfWinners = result.Item && result.Item.winners ? result.Item.winners : [];
    return listOfWinners;
  }


  static async getPreviousWinnersBasedOnList(listOfCoursesWithCorespondingBusinesses) {
    console.log("getPreviousWinnersbasedOnList");

    const task = listOfCoursesWithCorespondingBusinesses.map(async ({business, course}) => {
      const listOfWinners = await Winners.getPreviousWinners(business, course);
      const courseWithWinners = {};
      courseWithWinners.course = course;
      courseWithWinners.listOfWinners = listOfWinners;
      return courseWithWinners;
    })
    const listOfCoursesWithWinners = await Promise.all(task);
    return listOfCoursesWithWinners;
  }


  static async getPreviousPreviousWinnersBasedOnList(listOfCoursesWithCorespondingBusinesses) {
    console.log("getPreviousWinnersbasedOnList");

    const task = listOfCoursesWithCorespondingBusinesses.map(async ({business, course}) => {
      const listOfWinners = await Winners.getPreviousPreviousWinners(business, course);
      const courseWithWinners = {}
      courseWithWinners.course = course;
      courseWithWinners.listOfWinners = listOfWinners;
      return courseWithWinners;
    })
    const listOfCoursesWithWinners = await Promise.all(task);
    return listOfCoursesWithWinners;
  }


  static async getPreviousPreviousWinners (business, course) {
    console.log("getPreviousPreviousWinners");
    console.log("process.env.WINNERS_TABLE", process.env.WINNERS_TABLE)
    const tableName = `${process.env.WINNERS_TABLE}`;
    const { index, month } = Month.getPreviousPreviousMonthAndIndex();
    const year = Winners.getExpectedYearBasedOnMonth(index, true);
    console.log("tableName", tableName);
    const params = {
      TableName: tableName,
      Key: {
        business: business,
        month: `${year}_${month}_${course}`
      }
    }
    const result = await docClient.get(params).promise();
    const listOfWinners = result.Item && result.Item.winners ? result.Item.winners : [];
    return listOfWinners;
  }


  static getExpectedYearBasedOnMonth(index, isPreviousPrevious) {
    console.log("getExpectedYearBasedOnMonth", index, isPreviousPrevious);

    if(isPreviousPrevious) {
      if(index == 1 || index == 2) {
        return new Date().getFullYear() - 1;
      }
      return new Date().getFullYear()
    } else {
      if(index == 1) {
        return new Date().getFullYear() - 1;
      }
      return new Date().getFullYear()
    }
  }

  static async connectCoursesAndWinners(listOfCoursesWithCorespondingBusinesses, listOfCoursesWithParticipants, listOfCoursesWithWinners) {
    console.log("connectParticipantsWithCorrespondingWinners");

    const listOfConnectedCoursesAndWinners = [];
    let connectedCoursesAndWinnersFromOneCourse = [];
    let counter = 1;

    listOfCoursesWithCorespondingBusinesses.forEach(({ course, business }) => {
      listOfCoursesWithWinners.forEach((winners) => {

        if (winners.course === course) {
           listOfCoursesWithParticipants.forEach((participants) => {

            if(participants.course === course) {
              const listOfWinnersOfOneCourse = (winners.listOfWinners.length === 0) ? [] : winners.listOfWinners.values;
              const listOfUsersOfOneCourse = participants.courseParticipants.Items;
              const sortedListOfUsersOfOneCourse = listOfUsersOfOneCourse.sort(function (a,b) {
                return a.score - b.score
              })

              for(let userOfOneCourse of sortedListOfUsersOfOneCourse) {
                const isNotAgainWinner = listOfWinnersOfOneCourse.every(function (el) {
                  return userOfOneCourse._id != el
                })

                if(isNotAgainWinner) {
                  connectedCoursesAndWinnersFromOneCourse.push(userOfOneCourse._id)
                  counter += 1;
                  if(counter == 11) {
                    break;
                  }
                }
              }
              if(connectedCoursesAndWinnersFromOneCourse.length > 0) {
                const list = {};
                list.course = course;
                list.business = business;
                list.array = connectedCoursesAndWinnersFromOneCourse;
                listOfConnectedCoursesAndWinners.push(list)
                connectedCoursesAndWinnersFromOneCourse = [];
              }
            }
          })
        }
      })
    })
    return listOfConnectedCoursesAndWinners;
  }


  static async putWinnersToTable(listOfCourse) {
    console.log("putWinnersToTable");

    const task = listOfCourse.map(async ({course, business, array}) => {
      const tableName = `${process.env.WINNERS_TABLE}`;
      const { index, month } = Month.getPreviousMonthAndIndex();
      const year = Winners.getExpectedYearBasedOnMonth(index, false);

      const params = {
        TableName: tableName,
        Item: {
            business: business,
            month: `${year}_${month}_${course}`,
            winners: docClient.createSet(array)
          }
        }

      const data = await docClient.put(params).promise()
      return data;
    })
    const result = await Promise.all(task);
  }
}

module.exports = Winners;
