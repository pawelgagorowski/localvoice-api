"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = (level, message, context) => {
    switch (process.env.NODE_ENV) {
        case "prod":
            if (level === "error")
                console.log(message, context);
            break;
        default:
            if (context)
                console.log(context, message);
            else
                console.log(message);
    }
};
exports.default = logger;
