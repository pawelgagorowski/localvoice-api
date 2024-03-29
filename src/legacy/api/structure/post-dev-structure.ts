'use strict';

import AWS                                              from "aws-sdk";
import { StructureToTestBodyRequest,
        UserHeaderType }                                from "../../models/types";
import { BodyAndHeaderRequestInterface }                from "../../models/interfaces";
import { getBodyProperty }                              from "../../utils/helperFunctions";
import { RemoveOldStructure, PutNewStructure }          from '../../utils/addingStructure';
import { ValidateStructure }                            from '../../utils/validateStructure';
import { UniversalFields }                              from '../../utils/addingUniversalFields';
import CustomError                                      from "../../classes/errorResponse";
import Response                                         from "../../classes/response";
import logger                                           from "../../config/logger";

AWS.config.update({ region: 'eu-central-1' });

const handler = async (event: BodyAndHeaderRequestInterface<StructureToTestBodyRequest, UserHeaderType>) => {
  logger("info", event, "event");
  const generalErrorMessage = "there was an error while saving structure";
  try {
    const missingBodyPropertyErrorMessage = "there are some missing body property request";
    const successResponseMessage = "structure was successfully send to testing environment";
    const { courses, categories, lessons, env } = getBodyProperty<StructureToTestBodyRequest>(event.body, missingBodyPropertyErrorMessage, "courses", "lessons", "categories", "env");

    const structure = new ValidateStructure(env);
    const commentsForCourses = structure.validateCourses(courses);
    const commentsForCategories = structure.validateCategories(categories);
    const commentsForLessons = structure.validateLessons(lessons);


    if(commentsForCourses.length > 0 || commentsForCategories.length > 0 || commentsForLessons.length > 0) {
      const comments = [...commentsForCourses, ...commentsForCategories, ...commentsForLessons].join(',');
      const response = Response.createResponseMessage(comments, {});
    }

    // adding universal buttons
    // remember to have addChallengeButtons method always before addGoBackToCategoryButton method
    const universalFields = new UniversalFields();
    universalFields.addSignInButton(categories);
    universalFields.addChallengeButtons(lessons);
    universalFields.addGoBackToCategoryButton(lessons);
    universalFields.addIntelligentReplaysButton(lessons);
    universalFields.addMonthlyChallengeButton(lessons);

    const removeRecords = new RemoveOldStructure(event.business, env);
    await removeRecords.removeLessons();
    await removeRecords.removeCategories();

    const newStructure = new PutNewStructure(event.business, env);
    await newStructure.addCourse(courses, env);
    await newStructure.addCategories(categories, env);
    await newStructure.addLessons(lessons, env);
    await newStructure.addCoursesToBusinessTable(courses, env);

    const response = Response.createResponseMessage(successResponseMessage, {});
    logger("info", response, "response");
    return response;
  } catch(error) {
    logger('error', error);

    const response = CustomError.createCustomErrorResponse(404, generalErrorMessage);
    logger("error", response, "errorResponse");
    return response;
  }
}

export { handler };
