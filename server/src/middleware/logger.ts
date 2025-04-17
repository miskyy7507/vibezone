import chalk from "chalk";

import type { RequestHandler } from "express";

export const logger: RequestHandler = (request, response, next) => {
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
