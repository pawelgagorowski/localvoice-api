import CustomError                          from "../classes/errorResponse";
import { LessonType }                       from "../models/types";


export default class LessonValidation {

    static validateLesson(lesson: LessonType): string[] {
        const messages: string[] = [];
        let message;

        if(!lesson.course) {
            message = `fill in name of course field`
            messages.push(message);
        }

        if(!lesson.category)  {
            message = `fill in name of category field`
            messages.push(message);
        }

        if(!lesson.lesson) {
            message = `fill in name of lesson field`
            messages.push(message);
        }
        // wywalić to !!!
        if(!lesson.key) {
            message = `fill in key field`
            messages.push(message);
        }

        if(!lesson.translatedCategory) {
            message = `fill in key name of category field`
            messages.push(message);
        }

        if(!lesson.translatedLesson) {
            message = `fill in key name of lesson field`
            messages.push(message);
        }

        if(!lesson.todaysLesson) {
            message = `fill in at least two example to say`
            messages.push(message);
        } else {
            if(lesson.todaysLesson.challengeForToday && lesson.todaysLesson.challengeForToday.length < 4) {
                message = `fill in at least two example to say`
                messages.push(message);
            }
            if(lesson.todaysLesson.chat && lesson.todaysLesson.translate && lesson.todaysLesson.translate.length === lesson.todaysLesson.chat.length) {
                lesson.todaysLesson.translate.forEach((el) => {
                    if(el == '') {
                        message = `fill in all open chat fields`;
                        messages.push(message);
                    }
                })

                lesson.todaysLesson.chat.forEach((el) => {
                    if(el == '') {
                        message = `fill in all open chat fields`;
                        messages.push(message);
                    }
                })
                
                if(!lesson.todaysLesson.chatDescription) {
                    message = `fill in chat description field`;
                    messages.push(message);
                }
                if(!lesson.todaysLesson.translatedChatDescription) {
                    message = `fill in chat description field`;
                    messages.push(message);
                }

                if(!lesson.todaysLesson.translatedChatDescription) {
                    message = `fill in chat description field`;
                    messages.push(message);
                }

            } else {
                message = `fill in all open chat fields`;
                messages.push(message);
            }
        }
        const uniqMessages = [...new Set(messages)];
        return uniqMessages
    }
}