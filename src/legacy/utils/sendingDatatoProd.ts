import { LessonType, S3PathToCopyObject }            from "../models/types";

export const declarePathToS3Objects = (lesson: LessonType, business: string): S3PathToCopyObject => {
    let s3PathToCopyObject = {} as S3PathToCopyObject;
    s3PathToCopyObject.copySource = `${business}/generated-pictures-lesson/test/${lesson.course}/${lesson.category}/${lesson.lesson}`;
    s3PathToCopyObject.targetSource = `${business}/generated-pictures-lesson/production/${lesson.course}/${lesson.category}/${lesson.lesson}`;
    return s3PathToCopyObject;
}