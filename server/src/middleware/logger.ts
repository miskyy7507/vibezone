import { Request, Response, NextFunction, RequestHandler } from "express";
import chalk from "chalk";

export const logger: RequestHandler = (request: Request, response: Response, next: NextFunction) => {
    let methodText = "";
    if (request.method === "GET") {
        methodText = chalk.bgGreenBright(request.method);
    } else if (request.method === "POST") {
        methodText = chalk.bgBlueBright(request.method);
    } else if (request.method === "DELETE") {
        methodText = chalk.bgRedBright(request.method);
    } else if (request.method === "PUT") {
        methodText = chalk.bgMagentaBright(request.method);
    } else {
        methodText = chalk.bgWhiteBright(request.method);
    }

    console.log(`[${new Date().toISOString()}] ${methodText} ${request.url}`);

    next();
};
