'use strict';

//
// Route: POST /dev/structure
//

const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });
const docClient = new AWS.DynamoDB.DocumentClient();
const tableForCourseStructure = `${process.env.COURSES_TABLE}`;
const tableForCategoriesStructure = `${process.env.CATEGORIES_TABLE}`;
const tableForLessonsStructure = `${process.env.LIST_OF_LESSONS_FOR_SPECIFIC_CATEGORY_TABLE}`;

const { RemoveOldStructure, PutNewStructure } = require('../utils/addingStructure');
const { ValidateStructure } = require('../utils/validateStructure');
const { UniversalFields } = require('../utils/addingUniversalFields');

exports.handler = async (event) => {
  try {
    console.log("event", JSON.stringify(event, null, 2))
    const result = {}
    const business = event.body.business;
    const courses = event.body.courses;
    const categories = event.body.categories;
    const lessons = event.body.lessons;
    const env = event.body.env;
    // console.log("courses", JSON.stringify(courses, null, 2))
    console.log("categories", JSON.stringify(categories, null, 2))
    // console.log("lessons", JSON.stringify(lessons, null, 2))
    if(!business) {
      result.answer = "Wystąpił błąd podczas identyfikacji. Skontaktuj się z administratorem";
      throw result;
    }
    if(!env) {
      result.answer = "Wystąpił błąd podczas identyfikacji środowiska. Skontaktuj się z administratorem";
      throw result;
    }

    const structure = new ValidateStructure(env);
    const commentsForCourses = structure.validateCourses(courses);
    const commentsForCategories = structure.validateCategories(categories);
    const commentsForLessons = structure.validateLessons(lessons);


    if(commentsForCourses.length > 0 || commentsForCategories.length > 0 || commentsForLessons.length > 0) {
      const finaleComments = {}
      finaleComments.answer = [...commentsForCourses, ...commentsForCategories, ...commentsForLessons];
      return finaleComments;
    }

    // adding universal buttons
    // remember to have addChallengeButtons method always before addGoBackToCategoryButton method
    const universalFields = new UniversalFields();
    universalFields.addSignInButton(categories);
    universalFields.addChallengeButtons(lessons);
    universalFields.addGoBackToCategoryButton(lessons);
    universalFields.addMonthlyChallengeButton(lessons);

    const removeRecords = new RemoveOldStructure(business, env);
    await removeRecords.removeLessons();
    await removeRecords.removeCategories();

    const newStructure = new PutNewStructure(business, env);
    await newStructure.addCourse(courses);
    await newStructure.addCategories(categories);
    await newStructure.addLessons(lessons);

    result.answer = "Dane zostały zapisane";
    return result;
  } catch(e) {
    console.log(e);
    const fail = {};
    fail.answer = e.answer ? e.answer : "Wystapił błąd podczas przesyłania danych. Lekcji nie można jeszcze testować"
    return fail;
  }
}
