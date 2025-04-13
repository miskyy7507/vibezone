import { RequestHandler } from "express";

export const auth: RequestHandler = (request, response, next) => {
    if (!request.session.profileId) {
        return response.status(401).json({ error: "Unauthorized" });
    } else {
        next();
    }
}
