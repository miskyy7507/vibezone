import { Types } from "mongoose";

import type { RequestHandler } from "express";

export function validateObjectId(...idParams: string[]) {
    const cb: RequestHandler = (request, response, next) => {
        const ids: (string | undefined)[] = [];
        for (const param of idParams) {
            ids.push(request.params[param]);
        }

        if (
            ids.some(
                (id) => typeof id !== "string" || !Types.ObjectId.isValid(id)
            )
        ) {
            return response
                .status(400)
                .json({ error: "Malformed id" });
        }

        next();
        return;
    };

    return cb;
}
