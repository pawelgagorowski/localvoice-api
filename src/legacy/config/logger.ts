 import { loggerLevelType }                       from "../models/types";
 
 const logger = (level: loggerLevelType, message: unknown, context?: string | '') => {
    switch(process.env.NODE_ENV) {
      case "prod":
        console.log(message, context)
        break;
      default:
        if(context) console.log(context, message)
        else console.log(message)
    }
  }
  
  export default logger;
  